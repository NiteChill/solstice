import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../features/auth/contexts/auth-context';
import { useAuth } from '../features/auth/hooks/use-auth';
import { api } from '../api/axios';
import * as tokenService from '../utils/token-service';
import React from 'react';

vi.mock('../api/axios');
vi.mock('../utils/token-service');

describe('AuthContext & useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error if used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider',
    );

    consoleSpy.mockRestore();
  });

  it('should successfully login, save tokens, and set user from response', async () => {
    const mockUser = {
      id: '1',
      displayName: 'Test User',
      username: 'testuser',
      email: 'test@test.com',
      role: 'USER',
    };
    const mockResponse = {
      data: {
        accessToken: 'access-123',
        user: mockUser,
      },
    };

    (api.post as any).mockResolvedValueOnce(mockResponse);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        username: 'test@test.com',
        password: 'password',
      });
    });

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      username: 'test@test.com',
      password: 'password',
    });
    expect(tokenService.setTokens).toHaveBeenCalledWith({
      access: 'access-123',
    });
    expect(result.current.user).toEqual(mockUser);
  });

  it('should send refresh token, clear tokens, and reset user on logout', () => {
    (api.post as any).mockResolvedValueOnce({ data: {} });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(api.post).toHaveBeenCalledWith(
      '/auth/logout',
      {},
      { withCredentials: true },
    );
    expect(tokenService.clearTokens).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });
});
