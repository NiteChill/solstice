import { useMutation } from '@tanstack/react-query';
import { toast } from '@heroui/react';
import { api } from '../../../api/axios';
import { useAuth } from '../../auth/hooks/use-auth';
import type { UserResponse } from '../../../types/auth';
import { handleFallbackError } from '../../../utils/error-utils';

export const useUploadAvatar = () => {
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (blob: Blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'avatar.webp');

      const response = await api.put('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data: UserResponse) => {
      setUser(data);
      toast.success('Avatar uploaded successfully.');
    },
    onError: (error) => {
      handleFallbackError(error);
    },
  });
};
