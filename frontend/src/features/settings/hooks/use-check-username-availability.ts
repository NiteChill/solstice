import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api/axios';
import type { ResourceAvailabilityResponse } from '../../../types/profile';

interface UseCheckUsernameAvailabilityArgs {
  username: string;
  enabled?: boolean;
}

export const useCheckUsernameAvailability = ({
  username,
  enabled = true,
}: UseCheckUsernameAvailabilityArgs) => {
  return useQuery({
    queryKey: ['username-availability', username],
    queryFn: async () => {
      const { data } = await api.get<ResourceAvailabilityResponse>(
        '/users/availability',
        { params: { username } },
      );
      return data.available;
    },
    retry: false,
    enabled: enabled && !!username,
    refetchInterval: 30000,
  });
};
