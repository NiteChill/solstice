import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../utils/token-service';
import { api } from '../api/axios';
import { useAuth } from '../hooks/use-auth';

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const PersistLogin: React.FC = () => {
  const { fetchUser, user } = useAuth();
  const needsRefresh = !getAccessToken() && !!getRefreshToken();

  const [isLoading, setIsLoading] = useState<boolean>(
    needsRefresh || (!user && !!getAccessToken()),
  );

  useEffect(() => {
    const verifyRefreshToken = async (): Promise<void> => {
      try {
        if (needsRefresh) {
          const currentRefreshToken = getRefreshToken();
          const response = await api.post<RefreshTokenResponse>(
            '/auth/refresh',
            {
              refreshToken: currentRefreshToken,
            },
          );

          setTokens({
            access: response.data.accessToken,
            refresh: response.data.refreshToken,
          });
        }

        await fetchUser();
      } catch (error) {
        console.error('Failed to persist login:', error);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    if (needsRefresh) verifyRefreshToken();
  }, [needsRefresh, user, fetchUser]);

  if (isLoading)
    return <div className="full-screen-spinner">Loading session...</div>;

  return <Outlet />;
};
