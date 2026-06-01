import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { parseApiError } from '@/utils/error.util';

export function GoogleSignInButton() {
  const { signInWithGoogle, isConfigured, isReady, isPending, isError, error } =
    useGoogleLogin();
  const [localError, setLocalError] = useState<string | undefined>();

  const handlePress = async () => {
    setLocalError(undefined);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  };

  if (!isConfigured) {
    return null;
  }

  const errorMessage =
    localError ?? (isError && error ? parseApiError(error) : undefined);

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>

      <Button
        title="Continue with Google"
        variant="secondary"
        loading={isPending}
        disabled={!isReady}
        onPress={handlePress}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  error: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
  },
});
