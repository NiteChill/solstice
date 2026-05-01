import { renderHook, act, waitFor } from '@testing-library/react';
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

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  it('should throw an error if used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider',
    );

    consoleSpy.mockRestore();
  });

  it('should successfully login, save tokens, and fetch user', async () => {
    const mockTokens = {
      data: { accessToken: 'access-123', refreshToken: 'refresh-456' },
    };
    const mockUser = { data: { id: '1', email: 'test@test.com' } };

    (api.post as any).mockResolvedValueOnce(mockTokens);
    (api.get as any).mockResolvedValueOnce(mockUser);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: 'test@test.com',
        password: 'password',
      });
    });

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.com',
      password: 'password',
    });
    expect(tokenService.setTokens).toHaveBeenCalledWith({
      access: 'access-123',
      refresh: 'refresh-456',
    });
    expect(api.get).toHaveBeenCalledWith('/auth/me');

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser.data);
    });
  });

  it('should clear tokens and redirect on logout', () => {
    (api.post as any).mockResolvedValueOnce({ data: {} });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(tokenService.clearTokens).toHaveBeenCalled();
    expect(window.location.href).toBe('/auth/login');
  });
});
