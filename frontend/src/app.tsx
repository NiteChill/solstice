import { useNavigate, useHref, Outlet } from 'react-router-dom';
import { RouterProvider, Toast } from '@heroui/react';
import { GlobalAuthGuard } from './features/auth/components/global-auth-guard';
import { PersistLogin } from './features/auth/components/persist-login';

export const App = () => {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <PersistLogin>
        <GlobalAuthGuard>
          <Outlet />
          <Toast.Provider />
        </GlobalAuthGuard>
      </PersistLogin>
    </RouterProvider>
  );
};
