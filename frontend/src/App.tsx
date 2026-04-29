import { useNavigate, useHref, Outlet } from 'react-router-dom';
import { RouterProvider } from '@heroui/react';
import { ThemeSwitcher } from './components/theme-switcher';

export const App = () => {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <Outlet />
      <ThemeSwitcher />
    </RouterProvider>
  );
};
