import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../../../utils/token-service';
import { api } from '../../../api/axios';
import { useAuth } from '../hooks/use-auth';
import type { AuthenticationResponse } from '../../../types/auth';

export const PersistLogin: React.FC = () => {
  const { setUser } = useAuth();
  const needsRefresh = !getAccessToken() && !!getRefreshToken();

  const [isLoading, setIsLoading] = useState<boolean>(needsRefresh);

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;

    const verifyRefreshToken = async (): Promise<void> => {
      try {
        if (needsRefresh) {
          const currentRefreshToken = getRefreshToken();
          const response = await api.post<AuthenticationResponse>(
            '/auth/refresh',
            {
              refreshToken: currentRefreshToken,
            },
          );

          setTokens({
            access: response.data.accessToken,
            refresh: response.data.refreshToken,
          });
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Failed to persist login:', error);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    if (needsRefresh) {
      effectRan.current = true;
      verifyRefreshToken();
    }
  }, [needsRefresh, setUser]);

  if (isLoading)
    return <div className="full-screen-spinner">Loading session...</div>;

  return <Outlet />;
};
