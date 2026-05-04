import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { App } from './app';
import { PersistLogin } from './features/auth/components/persist-login';
import { RequireAuth } from './features/auth/components/require-auth';
import { AuthLayout } from './layouts/auth-layout';
import { LoginPage } from './pages/auth/login-page';
import { RequireGuest } from './features/auth/components/require-guest';
import { RegisterPage } from './pages/auth/register-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <PersistLogin />,
        children: [
          // Public
          {
            element: <RequireGuest />,
            children: [
              {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="login" replace />,
                  },
                  {
                    path: 'login',
                    element: <LoginPage />,
                  },
                  {
                    path: 'register',
                    element: <RegisterPage />,
                  },
                ],
              },
            ],
          },

          // Protected

          {
            element: <RequireAuth />,
            children: [
              { path: 'dashboard', element: 'dashboard' },

              {
                path: 'settings',
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="profile" replace />,
                  },
                  { path: 'profile', element: 'profile' },
                  { path: 'security', element: 'security' },
                  { path: 'sessions', element: 'sessions' },
                ],
              },
            ],
          },
          { path: '*', element: 'not found' },
        ],
      },
    ],
  },
]);
