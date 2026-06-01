import { StyleSheet, Text, View } from 'react-native';
import { useForm, Controller, type Control, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from '../types/auth.schemas';

interface LoginFormProps {
  mode: 'login';
  loading?: boolean;
  errorMessage?: string;
  onSubmit: (values: LoginFormValues) => void;
}

interface RegisterFormProps {
  mode: 'register';
  loading?: boolean;
  errorMessage?: string;
  onSubmit: (values: RegisterFormValues) => void;
}

type AuthFormProps = LoginFormProps | RegisterFormProps;

export function AuthForm(props: AuthFormProps) {
  if (props.mode === 'login') {
    return <LoginForm {...props} />;
  }
  return <RegisterForm {...props} />;
}

function LoginForm({ loading, errorMessage, onSubmit }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <LoginFormFields
      control={control}
      errors={errors}
      loading={loading}
      errorMessage={errorMessage}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}

function RegisterForm({ loading, errorMessage, onSubmit }: RegisterFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  return (
    <RegisterFormFields
      control={control}
      errors={errors}
      loading={loading}
      errorMessage={errorMessage}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}

interface LoginFormFieldsProps {
  loading?: boolean;
  errorMessage?: string;
  onSubmit: () => void;
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
}

function LoginFormFields({
  loading,
  errorMessage,
  onSubmit,
  control,
  errors,
}: LoginFormFieldsProps) {
  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoComplete="email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            placeholder="Enter password"
            secureTextEntry
            autoComplete="password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
          />
        )}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Button title="Sign In" loading={loading} onPress={onSubmit} />
    </View>
  );
}

interface RegisterFormFieldsProps {
  loading?: boolean;
  errorMessage?: string;
  onSubmit: () => void;
  control: Control<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
}

function RegisterFormFields({
  loading,
  errorMessage,
  onSubmit,
  control,
  errors,
}: RegisterFormFieldsProps) {
  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Name"
            placeholder="Your name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoComplete="email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            placeholder="Enter password"
            secureTextEntry
            autoComplete="new-password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
          />
        )}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Button title="Create Account" loading={loading} onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  error: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
  },
});
