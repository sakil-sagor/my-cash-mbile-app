import { useCallback, useEffect, useRef } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useMutation } from '@tanstack/react-query';
import { googleLoginApi } from '../api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { getGoogleClientConfig, isGoogleSignInConfigured } from '@/config/google';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin() {
  const setSession = useAuthStore((state) => state.setSession);
  const processedTokenRef = useRef<string | null>(null);
  const { webClientId, iosClientId, androidClientId } = getGoogleClientConfig();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: webClientId || undefined,
    iosClientId: iosClientId || undefined,
    androidClientId: androidClientId || undefined,
  });

  const mutation = useMutation({
    mutationFn: (idToken: string) => googleLoginApi(idToken),
    onSuccess: async (data) => {
      await setSession(data.user, data.accessToken, data.refreshToken);
    },
  });

  useEffect(() => {
    if (response?.type !== 'success') {
      return;
    }

    const idToken = response.params.id_token;
    if (!idToken || processedTokenRef.current === idToken) {
      return;
    }

    processedTokenRef.current = idToken;
    mutation.mutate(idToken);
  }, [response, mutation]);

  const signInWithGoogle = useCallback(async () => {
    if (!isGoogleSignInConfigured()) {
      throw new Error('Google Sign-In is not configured. Add client IDs to your .env file.');
    }
    if (!request) {
      throw new Error('Google Sign-In is not ready yet. Please try again.');
    }
    await promptAsync();
  }, [promptAsync, request]);

  return {
    signInWithGoogle,
    isConfigured: isGoogleSignInConfigured(),
    isReady: Boolean(request),
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
