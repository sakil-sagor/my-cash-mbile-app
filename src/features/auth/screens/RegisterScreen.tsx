import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AuthForm } from '../components/AuthForm';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useRegister } from '../hooks/useRegister';
import { parseApiError } from '@/utils/error.util';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const registerMutation = useRegister();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Start managing your cash with My Cash</Text>

      <AuthForm
        mode="register"
        loading={registerMutation.isPending}
        errorMessage={
          registerMutation.isError ? parseApiError(registerMutation.error) : undefined
        }
        onSubmit={(values) =>
          registerMutation.mutate({
            email: values.email,
            password: values.password,
            name: values.name,
          })
        }
      />

      <GoogleSignInButton />

      <Text style={styles.footer}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Sign in
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
