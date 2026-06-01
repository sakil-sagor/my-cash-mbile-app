import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { endpoints } from './endpoints';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/services/storage/token-manager';
import type { ApiErrorResponse, ApiSuccessResponse, RefreshResponseDto } from '@/types/api.types';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean; _skipAuth?: boolean };

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null): void {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await apiClient.post<ApiSuccessResponse<RefreshResponseDto>>(
    endpoints.auth.refresh,
    { refreshToken },
    { _skipAuth: true },
  );

  const { accessToken, refreshToken: newRefreshToken } = response.data.data;
  await setTokens({ accessToken, refreshToken: newRefreshToken });
  return accessToken;
}

export function setupInterceptors(onUnauthorized: () => void): void {
  apiClient.interceptors.request.use(async (config) => {
    if (config._skipAuth) {
      delete config.headers.Authorization;
      return config;
    }

    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as RetryConfig | undefined;

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.url === endpoints.auth.refresh
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await clearTokens();
        onUnauthorized();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
