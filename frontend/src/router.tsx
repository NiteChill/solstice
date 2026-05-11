import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './app';
import { PersistLogin } from './features/auth/components/persist-login';
import { RequireAuth } from './features/auth/components/require-auth';
import { AuthLayout } from './layouts/auth/auth-layout';
import { LoginPage } from './pages/auth/login-page';
import { RequireGuest } from './features/auth/components/require-guest';
import { RegisterPage } from './pages/auth/register-page';
import { MainLayout } from './layouts/main/main-layout';
import { ProfilePage } from './pages/profile-page';

export const router = createBrowserRouter([
  {
    index: true,
    element: <Navigate to="home" replace />,
  },
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
            element: <MainLayout />,
            children: [
              {
                element: <RequireAuth />,
                children: [
                  { path: 'messages', element: 'Messages' },
                  { path: 'search', element: 'Search' },
                  { path: 'profile', element: <ProfilePage /> },
                ],
              },
              { path: 'home', element: 'Home' },
            ],
          },
          { path: '*', element: 'not found' },
        ],
      },
    ],
  },
]);
