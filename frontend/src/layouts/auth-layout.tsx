import { Outlet } from 'react-router-dom';

export const AuthLayout = () => (
  <main className="flex flex-col min-h-screen items-center justify-center py-10 px-6">
    <Outlet />
  </main>
);
