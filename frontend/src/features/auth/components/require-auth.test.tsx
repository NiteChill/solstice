import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from './require-auth';
import * as tokenService from '../../../utils/token-service';

vi.mock('../../../utils/token-service');

describe('RequireAuth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Outlet (Protected Content) if access token exists', () => {
    vi.spyOn(tokenService, 'getAccessToken').mockReturnValue('valid-token');

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

  it('should redirect to /auth/login if NO access token exists', () => {
    vi.spyOn(tokenService, 'getAccessToken').mockReturnValue(null);

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
