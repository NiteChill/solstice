import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api/axios';
import type { ResourceAvailabilityResponse } from '../../../types/profile';

interface UseCheckEmailAvailabilityArgs {
  email: string;
  enabled?: boolean;
}

export const useCheckEmailAvailability = ({
  email,
  enabled = true,
}: UseCheckEmailAvailabilityArgs) => {
  return useQuery({
    queryKey: ['email-availability', email],
    queryFn: async () => {
      const { data } = await api.get<ResourceAvailabilityResponse>(
        '/users/availability',
        { params: { email } },
      );
      return data.available;
    },
    retry: false,
    enabled: enabled && !!email,
    refetchInterval: 30000,
  });
};
