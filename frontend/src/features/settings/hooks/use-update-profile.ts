import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import type { UseFormSetError } from 'react-hook-form';
import { toast } from '@heroui/react';
import { applyServerErrors } from '../../../utils/form-utils';
import { handleFallbackError } from '../../../utils/error-utils';
import type { UpdateProfileRequest } from '../../../types/settings';
import { api } from '../../../api/axios';
import { useAuth } from '../../auth/hooks/use-auth';
import type { UserResponse } from '../../../types/auth';

export const useUpdateProfile = (
  setError: UseFormSetError<UpdateProfileRequest>,
) => {
  const { setUser } = useAuth();
  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await api.patch('/users/me', data);
      return response.data;
    },
    onSuccess: (data: UserResponse) => {
      setUser(data);
      toast.success('Profile updated successfully.');
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 400 && error.response.data?.errors) {
          applyServerErrors(error.response.data.errors, setError);
          return;
        }

        if (error.response?.status === 409) {
          setError('username', {
            type: 'server',
            message: 'This username is already taken',
          });
          return;
        }
        handleFallbackError(error);
      }
    },
  });
};
