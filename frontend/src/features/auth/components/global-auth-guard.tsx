import { useLocation, Navigate, matchPath } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import type { ReactNode } from 'react';
import {
  GUEST_ONLY_ROUTES,
  PROTECTED_HASHES,
  PROTECTED_ROUTES,
} from '../../../router';

interface GlobalAuthGuardProps {
  children: ReactNode;
}

export const GlobalAuthGuard = ({ children }: GlobalAuthGuardProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const isProtectedPath = PROTECTED_ROUTES.some((route) =>
    matchPath({ path: route }, location.pathname),
  );

  const isProtectedHash = PROTECTED_HASHES.some((hash) =>
    location.hash.startsWith(hash),
  );

  const isProtected = isProtectedPath || isProtectedHash;

  const isGuestRoute = GUEST_ONLY_ROUTES.some((route) =>
    matchPath({ path: route }, location.pathname),
  );

  if (isProtected && !user) {
    const fullReturnUrl = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate to="/auth/login" state={{ from: fullReturnUrl }} replace />
    );
  }

  if (isGuestRoute && user) {
    const fromUrl = location.state?.from ?? '/home';
    return <Navigate to={fromUrl} replace />;
  }

  return children;
};
