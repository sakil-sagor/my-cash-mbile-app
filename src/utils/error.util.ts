import { isAxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api.types';

export function parseApiError(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const apiMessage = error.response?.data?.error?.message;
    if (apiMessage) return apiMessage;

    if (error.message === 'Network Error') {
      return 'Unable to reach the server. Check your connection and API URL.';
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
