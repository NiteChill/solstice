import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GlobalAuthGuard } from './global-auth-guard';
import * as useAuthHook from '../hooks/use-auth';

vi.mock('../hooks/use-auth');

const MockChild = () => <div data-testid="child">Protected Content</div>;

const LocationDisplay = () => {
  const location = useLocation();
  return (
    <div data-testid="location-display">
      {location.pathname}
      {location.search}
      {location.hash}
      <div data-testid="location-state">{JSON.stringify(location.state)}</div>
    </div>
  );
};

describe('GlobalAuthGuard', () => {
  const mockSetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupAuth = (user: any) => {
    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user,
      setUser: mockSetUser,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    } as any);
  };

  const renderGuard = (initialRoute: string, state?: any) => {
    return render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: initialRoute.split('?')[0].split('#')[0],
            search: initialRoute.includes('?')
              ? '?' + initialRoute.split('?')[1].split('#')[0]
              : '',
            hash: initialRoute.includes('#')
              ? '#' + initialRoute.split('#')[1]
              : '',
            state,
          },
        ]}
      >
        <Routes>
          <Route
            path="*"
            element={
              <GlobalAuthGuard>
                <MockChild />
                <LocationDisplay />
              </GlobalAuthGuard>
            }
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('renders children normally for non-protected, non-guest routes without user', () => {
    setupAuth(null);
    renderGuard('/home');

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('location-display')).toHaveTextContent('/home');
  });

  it('redirects to /auth/login with from state if accessing a protected route without user', () => {
    setupAuth(null);
    renderGuard('/profile?tab=info');

    // Because we just render <GlobalAuthGuard> at path="*", the <Navigate> inside it
    // will change the router's current location to /auth/login.
    // However, since we don't have a specific route for /auth/login, it will just re-render
    // the catch-all "*" route again with the new location.
    // BUT wait, /auth/login is a guest route! So GlobalAuthGuard will see it's a guest route
    // and we have no user, so it renders children!
    expect(screen.getByTestId('location-display')).toHaveTextContent(
      '/auth/login',
    );
    expect(screen.getByTestId('location-state')).toHaveTextContent(
      '{"from":"/profile?tab=info"}',
    );
  });

  it('redirects to /auth/login with from state if accessing a protected hash without user', () => {
    setupAuth(null);
    renderGuard('/home#settings/account');

    expect(screen.getByTestId('location-display')).toHaveTextContent(
      '/auth/login',
    );
    expect(screen.getByTestId('location-state')).toHaveTextContent(
      '{"from":"/home#settings/account"}',
    );
  });

  it('redirects to /home if accessing a guest route with user and no state', () => {
    setupAuth({ id: '1', name: 'Test User' });
    renderGuard('/auth/login');

    expect(screen.getByTestId('location-display')).toHaveTextContent('/home');
  });

  it('redirects to state.from if accessing a guest route with user and from state', () => {
    setupAuth({ id: '1', name: 'Test User' });
    renderGuard('/auth/login', { from: '/profile?tab=settings' });

    expect(screen.getByTestId('location-display')).toHaveTextContent(
      '/profile?tab=settings',
    );
  });

  it('renders children normally for protected routes if user is present', () => {
    setupAuth({ id: '1', name: 'Test User' });
    renderGuard('/profile?tab=settings');

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('location-display')).toHaveTextContent(
      '/profile?tab=settings',
    );
  });

  it('renders children normally for guest routes if user is not present', () => {
    setupAuth(null);
    renderGuard('/auth/login');

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('location-display')).toHaveTextContent(
      '/auth/login',
    );
  });
});
