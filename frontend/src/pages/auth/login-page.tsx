import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  Link,
  Spinner,
  TextField,
} from '@heroui/react';
import { Logo } from '../../components/logo';
import { useForm } from 'react-hook-form';
import type { LoginRequest } from '../../types/auth';
import { useLogin } from '../../features/auth/hooks/use-login';
import { validatePassword, validateUsername } from '../../utils/validators';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export const LoginPage = () => {
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();
  const { mutate, isPending } = useLogin(setError);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  return (
    <Form
      className="flex flex-col w-full max-w-84 gap-2 items-center"
      onSubmit={handleSubmit((data: LoginRequest) => mutate(data))}
    >
      <Logo className="mb-1.5 size-12" />
      <h1 className="text-2xl text-center mb-3.5">Log in to Solstice</h1>
      <TextField fullWidth type="text" isInvalid={!!errors.username}>
        <Label>Username or email</Label>
        <Input
          {...register('username', validateUsername())}
          placeholder="Enter your username or email"
        />
        <FieldError>{errors.username?.message}</FieldError>
      </TextField>
      <TextField
        fullWidth
        type={isVisible ? 'text' : 'password'}
        isInvalid={!!errors.password}
      >
        <Label>Password</Label>
        <InputGroup className="group">
          <InputGroup.Input
            {...register('password', validatePassword())}
            placeholder="Enter your password"
          />
          <InputGroup.Suffix className="pr-0.5 hidden group-hover:block group-focus-within:block">
            <Button
              isIconOnly
              aria-label={isVisible ? 'Hide password' : 'Show password'}
              size="sm"
              variant="ghost"
              onPress={() => setIsVisible(!isVisible)}
            >
              {isVisible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </InputGroup.Suffix>
        </InputGroup>
        <Description>
          Must be at least 8 characters with 1 uppercase and 1 number
        </Description>
        <FieldError>{errors.password?.message}</FieldError>
      </TextField>
      <Button type="submit" fullWidth isPending={isPending}>
        {isPending ? (
          <>
            <Spinner color="current" size="sm" />
            Logging in...
          </>
        ) : (
          'Log in'
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
