import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from '../utils/token-service';

export const RequireAuth: React.FC = () => {
  const location = useLocation();
  const token = getAccessToken();

  if (!token)
    return <Navigate to="/auth/login" state={{ from: location }} replace />; // Read from state to redirect to correct wanted page after login

  return <Outlet />;
};
