import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import type { RegisterInput } from '../types/auth.types';

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: RegisterInput) => registerApi(input),
    onSuccess: async (data) => {
      await setSession(data.user, data.accessToken, data.refreshToken);
    },
  });
}
