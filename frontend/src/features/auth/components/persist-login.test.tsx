import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PersistLogin } from './persist-login';
import { api } from '../../../api/axios';
import * as tokenService from '../../../utils/token-service';
import * as useAuthHook from '../hooks/use-auth';

vi.mock('../../../api/axios');
vi.mock('../../../utils/token-service');
vi.mock('../hooks/use-auth');

describe('PersistLogin Component', () => {
  const mockSetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user: null,
      setUser: mockSetUser,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('should render Outlet immediately if token and user already exist', () => {
    vi.spyOn(tokenService, 'getAccessToken').mockReturnValue('valid-access');
    vi.spyOn(tokenService, 'getRefreshToken').mockReturnValue('valid-refresh');

    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user: { id: '1', email: 'test@test.com', role: 'USER' },
      setUser: mockSetUser,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path="/" element={<div data-testid="child">Loaded</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText(/Loading session/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should call /refresh and set user from response if missing access token but has refresh token', async () => {
    vi.spyOn(tokenService, 'getAccessToken').mockReturnValue(null);
    vi.spyOn(tokenService, 'getRefreshToken').mockReturnValue('valid-refresh');

    const mockUser = { id: '1', email: 'test@test.com', role: 'USER' };
    (api.post as any).mockResolvedValueOnce({
      data: {
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
        user: mockUser,
      },
    });

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path="/" element={<div data-testid="child">Loaded</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading session/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'valid-refresh',
      });
      expect(tokenService.setTokens).toHaveBeenCalledWith({
        access: 'new-access',
        refresh: 'new-refresh',
      });
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  it('should clear tokens if the refresh call fails', async () => {
    vi.spyOn(tokenService, 'getAccessToken').mockReturnValue(null);
    vi.spyOn(tokenService, 'getRefreshToken').mockReturnValue('bad-refresh');

    (api.post as any).mockRejectedValueOnce(new Error('Refresh failed'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path="/" element={<div data-testid="child">Loaded</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(tokenService.clearTokens).toHaveBeenCalled();
      expect(mockSetUser).not.toHaveBeenCalled();
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
