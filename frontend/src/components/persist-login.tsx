import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../utils/token-service';
import { api } from '../api/axios';

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const PersistLogin: React.FC = () => {
  const needsRefresh = !getAccessToken() && !!getRefreshToken();

  const [isLoading, setIsLoading] = useState<boolean>(needsRefresh);

  useEffect(() => {
    const verifyRefreshToken = async (): Promise<void> => {
      try {
        const currentRefreshToken = getRefreshToken();
        const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
          refreshToken: currentRefreshToken,
        });

        setTokens({
          access: response.data.accessToken,
          refresh: response.data.refreshToken,
        });
      } catch (error) {
        console.error('Failed to persist login:', error);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    if (needsRefresh) verifyRefreshToken();
  }, [needsRefresh]);

  if (isLoading)
    return <div className="full-screen-spinner">Loading session...</div>;

  return <Outlet />;
};
