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
      register: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('should render Outlet immediately if token and user already exist', () => {
    vi.spyOn(tokenService, 'getAccessToken').mockReturnValue('valid-access');

    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user: {
        id: '1',
        displayName: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        role: 'USER',
      },
      setUser: mockSetUser,
      login: vi.fn(),
      register: vi.fn(),
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
    vi.spyOn(tokenService, 'hasSessionCookie').mockReturnValue(true);

    const mockUser = {
      id: '1',
      displayName: 'Test User',
      username: 'testuser',
      email: 'test@test.com',
      role: 'USER',
    };
    (api.post as any).mockResolvedValueOnce({
      data: {
        accessToken: 'new-access',
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
      expect(api.post).toHaveBeenCalledWith(
        '/auth/refresh',
        {},
        { withCredentials: true },
      );
      expect(tokenService.setTokens).toHaveBeenCalledWith({
        access: 'new-access',
      });
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  it('should clear tokens if the refresh call fails', async () => {
    vi.spyOn(tokenService, 'getAccessToken').mockReturnValue(null);
    vi.spyOn(tokenService, 'hasSessionCookie').mockReturnValue(true);

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
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(tokenService.clearTokens).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should render Outlet immediately if no session cookie is present', () => {
    vi.spyOn(tokenService, 'getAccessToken').mockReturnValue(null);
    vi.spyOn(tokenService, 'hasSessionCookie').mockReturnValue(false);

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
    expect(api.post).not.toHaveBeenCalled();
  });
});
