import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

export const RequireAuth: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user)
    return <Navigate to="/auth/login" state={{ from: location }} replace />; // Read from state to redirect to correct wanted page after login

  return <Outlet />;
};
