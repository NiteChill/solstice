import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api/axios';
import { toast } from '@heroui/react';

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: number) => {
      await api.delete(`/auth/sessions/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Session revoked successfully !');
    },
    onError: () => {
      toast.danger('Failed to revoke session');
    },
  });
};
