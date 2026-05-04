import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from './require-auth';
import * as useAuthHook from '../hooks/use-auth';

vi.mock('../hooks/use-auth');

describe('RequireAuth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Outlet (Protected Content) if user exists', () => {
    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user: {
        id: '1',
        displayName: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        role: 'USER',
      },
      setUser: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route
              path="/protected"
              element={<div data-testid="protected-content">Secret</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should redirect to /auth/login if user is null', () => {
    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user: null,
      setUser: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/protected" element={<div>Secret</div>} />
          </Route>
          <Route
            path="/auth/login"
            element={<div data-testid="login-page">Login Please</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
