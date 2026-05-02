import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Link,
  Spinner,
  TextField,
  toast,
} from '@heroui/react';
import { Logo } from '../../components/logo';
import { useAuth } from '../../features/auth/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { isAxiosError } from 'axios';
import type { LoginRequest } from '../../types/auth';
import { validateEmail, validatePassword } from '../../utils/validators';

export const LoginPage = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginRequest>();
  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      toast.clear();
    } catch (error) {
      const is401 = isAxiosError(error) && error.response?.status === 401;
      toast.danger(
        is401
          ? 'Invalid email or password. Please try again'
          : 'Something went wrong connecting to the server',
      );
    }
  };
  return (
    <Form
      className="flex flex-col w-full max-w-84 gap-2 items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Logo className="mb-1.5 size-12" />
      <h1 className="text-2xl text-center mb-3.5">Log in to Solstice</h1>
      <TextField isRequired fullWidth validate={validateEmail} type="email">
        <Label>Email</Label>
        <Input {...register('email')} placeholder="john@example.com" />
        <FieldError />
      </TextField>
      <TextField
        isRequired
        fullWidth
        validate={validatePassword}
        type="password"
      >
        <Label>Password</Label>
        <Input {...register('password')} placeholder="Enter your password" />
        <Description>
          Must be at least 8 characters with 1 uppercase and 1 number
        </Description>
        <FieldError />
      </TextField>
      <Button type="submit" fullWidth isPending={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner color="current" size="sm" />
            Logging in...
          </>
        ) : (
          'Log In'
        )}
      </Button>
      <p className="text-sm text-muted text-center">
        New to Solstice ?{' '}
        <Link href="/auth/register">
          Create an account <Link.Icon />
        </Link>
      </p>
    </Form>
  );
};
