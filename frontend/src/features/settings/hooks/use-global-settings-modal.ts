import { useLocation } from 'react-use';
import { settingsRouter } from '../settings-router';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/use-auth';
import { useEffect } from 'react';

export const useGlobalSettingsModal = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const hash = location.hash ?? '';
  const isHashSettings = hash.startsWith('#settings');
  const isOpen = !!user && isHashSettings;
  const currentTabPath = isOpen ? hash.replace('#settings/', '') : null;

  useEffect(() => {
    if (!user && isHashSettings) navigate('/auth/login', { replace: true });
  }, [user, isHashSettings, navigate]);

  const activeRoute = settingsRouter.find(
    (route) => route.path === currentTabPath,
  );

  const Outlet = activeRoute
    ? activeRoute.component
    : settingsRouter[0].component;

  const activePath = activeRoute ? activeRoute.path : settingsRouter[0].path;

  const handleOpenChange = (open: boolean) => {
    if (!open)
      navigate(location.pathname ?? '/' + location.search, { replace: true });
  };

  return { isOpen, handleOpenChange, Outlet, activePath, navigate, user };
};
