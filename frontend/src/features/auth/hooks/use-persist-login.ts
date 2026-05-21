import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api/axios';
import { clearTokens, setTokens } from '../../../utils/token-service';
import { useAuth } from './use-auth';
import type { AuthenticationResponse } from '../../../types/auth';

export const usePersistLogin = (needsRefresh: boolean) => {
  const { setUser } = useAuth();

  return useQuery({
    queryKey: ['persist-login'],
    queryFn: async () => {
      try {
        const response = await api.post<AuthenticationResponse>(
          '/auth/refresh',
          {},
          { withCredentials: true },
        );

        setTokens({
          access: response.data.accessToken,
        });
        setUser(response.data.user);

        return response.data;
      } catch (error) {
        console.error('Failed to persist login:', error);
        clearTokens();
        throw error;
      }
    },
    enabled: needsRefresh,
    retry: false,
  });
};
