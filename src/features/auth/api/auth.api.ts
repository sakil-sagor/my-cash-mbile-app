import { apiClient } from '@/services/api/client';
import { endpoints } from '@/services/api/endpoints';
import type { ApiSuccessResponse, AuthResponseDto } from '@/types/api.types';
import type { LoginInput, RegisterInput } from '../types/auth.types';

export async function loginApi(input: LoginInput): Promise<AuthResponseDto> {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponseDto>>(
    endpoints.auth.login,
    input,
  );
  return response.data.data;
}

export async function registerApi(input: RegisterInput): Promise<AuthResponseDto> {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponseDto>>(
    endpoints.auth.register,
    input,
  );
  return response.data.data;
}
