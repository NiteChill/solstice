import { useMutation } from '@tanstack/react-query';
import { toast } from '@heroui/react';
import { api } from '../../../api/axios';
import { useAuth } from '../../auth/hooks/use-auth';
import type { UserResponse } from '../../../types/auth';
import { handleFallbackError } from '../../../utils/error-utils';

export const useDeleteAvatar = () => {
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete('/users/me/avatar');
      return response.data;
    },
    onMutate: () => {
      const toastId = toast('Removing avatar...', { isLoading: true });
      return { toastId };
    },
    onSuccess: (data: UserResponse, _, context) => {
      setUser(data);
      if (context?.toastId) toast.close(context.toastId);
      toast.success('Avatar removed successfully.');
    },
    onError: (error, _, context) => {
      if (context?.toastId) toast.close(context.toastId);
      handleFallbackError(error);
    },
  });
};
