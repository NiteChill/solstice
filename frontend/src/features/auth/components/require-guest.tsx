import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

export const RequireGuest = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const from = location.state?.from?.pathname || '/settings'; // Replace redirect later
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
};
