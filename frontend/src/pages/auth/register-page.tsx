import { useForm } from 'react-hook-form';
import type { RegisterRequest } from '../../types/auth';
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
import { useRegister } from '../../features/auth/hooks/use-register';
import {
  validateEmail,
  validatePassword,
  validateDisplayName,
} from '../../utils/validators';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const RegisterPage = () => {
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();
  const { mutate, isPending } = useRegister(setError);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  return (
    <Form
      className="flex flex-col w-full max-w-84 gap-2 items-center"
      onSubmit={handleSubmit((data: RegisterRequest) => mutate(data))}
    >
      <Logo className="mb-1.5 size-12" />
      <h1 className="text-2xl text-center mb-3.5">Create a Solstice account</h1>
      <TextField fullWidth type="text" isInvalid={!!errors.displayName}>
        <Label>Username</Label>
        <Input
          {...register('displayName', validateDisplayName())}
          placeholder="John Doe"
        />
        <FieldError>{errors.displayName?.message}</FieldError>
      </TextField>
      <TextField fullWidth type="email" isInvalid={!!errors.email}>
        <Label>Email</Label>
        <Input
          {...register('email', validateEmail())}
          placeholder="john@example.com"
        />
        <FieldError>{errors.email?.message}</FieldError>
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
            Signing up...
          </>
        ) : (
          'Sign up'
        )}
      </Button>
      <p className="text-sm text-muted text-center">
        Already have an account ?{' '}
        <Link href="/auth/login">
          Log in <Link.Icon />
        </Link>
      </p>
    </Form>
  );
};
