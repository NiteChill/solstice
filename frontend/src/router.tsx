import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './app';
import { AuthLayout } from './layouts/auth/auth-layout';
import { LoginPage } from './pages/auth/login-page';
import { RegisterPage } from './pages/auth/register-page';
import { MainLayout } from './layouts/main/main-layout';
import { ProfilePage } from './pages/profile-page';

export const PROTECTED_ROUTES = [
  '/profile',
  '/profile/*',
  '/messages',
  '/messages/*',
  '/search',
  '/search/*',
];

export const PROTECTED_HASHES = ['#settings'];

export const GUEST_ONLY_ROUTES = ['/auth/login', '/auth/register'];

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
      {
        element: <MainLayout />,
        children: [
          { path: 'messages', element: 'Messages' },
          { path: 'search', element: 'Search' },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'home', element: 'Home' },
        ],
      },
      { path: '*', element: 'not found' },
    ],
  },
]);
