import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import type { LoginInput } from '../types/auth.types';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => loginApi(input),
    onSuccess: async (data) => {
      await setSession(data.user, data.accessToken, data.refreshToken);
    },
  });
}
