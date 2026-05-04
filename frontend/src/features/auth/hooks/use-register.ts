import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import type { UseFormSetError } from 'react-hook-form';
import type { RegisterRequest } from '../../../types/auth';
import { toast } from '@heroui/react';
import { applyServerErrors } from '../../../utils/form-utils';
import { useAuth } from './use-auth';

export const useRegister = (setError: UseFormSetError<RegisterRequest>) => {
  const { register } = useAuth();
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      await register(data);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 400 && error.response.data?.errors) {
          applyServerErrors(error.response.data.errors, setError);
          return;
        }

        if (error.response?.status === 409) {
          setError('email', {
            type: 'server',
            message: 'This email is already registered. Please log in',
          });
          return;
        }

        toast.danger('Server connection failed.');
      } else toast.danger('An unexpected error occurred');
    },
  });
};
