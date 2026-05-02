import { useNavigate, useHref, Outlet } from 'react-router-dom';
import { RouterProvider, Toast } from '@heroui/react';
import { ThemeSwitcher } from './components/theme-switcher';

export const App = () => {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <Outlet />
      <ThemeSwitcher />
      <Toast.Provider />
    </RouterProvider>
  );
};
