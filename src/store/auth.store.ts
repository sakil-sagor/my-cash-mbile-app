import { create } from 'zustand';
import { apiClient } from '@/services/api/client';
import { setupInterceptors } from '@/services/api/interceptors';
import { endpoints } from '@/services/api/endpoints';
import {
  clearTokens,
  getAccessToken,
  hasStoredTokens,
  setTokens,
} from '@/services/storage/token-manager';
import type { ApiSuccessResponse, UserProfileDto } from '@/types/api.types';
import type { AuthUser } from '@/features/auth/types/auth.types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean | null;
  isHydrating: boolean;
  hydrate: () => Promise<void>;
  setSession: (user: AuthUser, accessToken: string, refreshToken: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

let interceptorsInitialized = false;

function initInterceptors(get: () => AuthState): void {
  if (interceptorsInitialized) return;
  setupInterceptors(() => {
    void get().logout();
  });
  interceptorsInitialized = true;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: null,
  isHydrating: false,

  hydrate: async () => {
    set({ isHydrating: true });
    initInterceptors(get);

    try {
      const hasTokens = await hasStoredTokens();
      if (!hasTokens) {
        set({ user: null, isAuthenticated: false, isHydrating: false });
        return;
      }

      await get().fetchProfile();
      set({ isAuthenticated: true, isHydrating: false });
    } catch {
      await clearTokens();
      set({ user: null, isAuthenticated: false, isHydrating: false });
    }
  },

  setSession: async (user, accessToken, refreshToken) => {
    await setTokens({ accessToken, refreshToken });
    set({ user, isAuthenticated: true });
  },

  fetchProfile: async () => {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('No access token');
    }

    const response = await apiClient.get<ApiSuccessResponse<UserProfileDto>>(
      endpoints.users.me,
    );

    const profile = response.data.data;
    set({
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      },
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await clearTokens();
    set({ user: null, isAuthenticated: false });
  },
}));
