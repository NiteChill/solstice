import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import type { UseFormSetError } from 'react-hook-form';
import { useAuth } from './use-auth';
import type { LoginRequest } from '../../../types/auth';
import { toast } from '@heroui/react';
import { applyServerErrors } from '../../../utils/form-utils';

export const useLogin = (setError: UseFormSetError<LoginRequest>) => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      await login(data);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.danger('Invalid credentials. Please try again');
          return;
        }

        if (error.response?.status === 400 && error.response.data?.errors) {
          applyServerErrors(error.response.data.errors, setError);
          return;
        }

        toast.danger('Server connection failed.');
      } else toast.danger('An unexpected error occurred');
    },
  });
};
