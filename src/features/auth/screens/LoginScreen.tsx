import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AuthForm } from '../components/AuthForm';
import { useLogin } from '../hooks/useLogin';
import { parseApiError } from '@/utils/error.util';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const loginMutation = useLogin();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to your My Cash account</Text>

      <AuthForm
        mode="login"
        loading={loginMutation.isPending}
        errorMessage={
          loginMutation.isError ? parseApiError(loginMutation.error) : undefined
        }
        onSubmit={(values) => loginMutation.mutate(values)}
      />

      <Text style={styles.footer}>
        Don&apos;t have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Sign up
        </Text>
      </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  footer: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
