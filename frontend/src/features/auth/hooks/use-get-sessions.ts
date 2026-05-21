import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api/axios';
import type { SessionResponse } from '../../../types/auth';

export const useGetSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data } = await api.get<SessionResponse[]>('/auth/sessions');
      return data;
    },
    retry: false,
    refetchInterval: 30000,
  });
};
