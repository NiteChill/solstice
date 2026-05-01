import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './App';
import { PersistLogin } from './features/auth/components/persist-login';
import { RequireAuth } from './features/auth/components/require-auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: 'login',
          },
          {
            path: 'register',
            element: 'register',
          },
        ],
      },

      // Protected
      {
        element: <PersistLogin />,
        children: [
          {
            element: <RequireAuth />,
            children: [
              { path: 'dashboard', element: 'dashboard' },

              {
                path: 'settings',
                element: 'sidebar',
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
        ],
      },
      { path: '*', element: 'not found' },
    ],
  },
]);
