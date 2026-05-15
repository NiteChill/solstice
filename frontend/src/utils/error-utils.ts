import { isAxiosError } from 'axios';
import { toast } from '@heroui/react';

/**
 * Displays a generic fallback toast for unexpected 4xx client errors.
 * (5xx and network errors are handled globally by the Axios interceptor).
 */
export const handleFallbackError = (error: unknown) => {
  if (isAxiosError(error) && error.response) {
    if (error.response.status >= 400 && error.response.status < 500) {
      toast.danger('An unexpected error occurred. Please try again.');
    }
  }
};
