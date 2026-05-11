import { buttonVariants, Link } from '@heroui/react';
import { Outlet } from 'react-router-dom';
import { Logo } from '../../components/logo';

export const AuthLayout = () => (
  <main className="flex flex-col min-h-screen items-center justify-center py-10 px-6 w-full">
    <Link
      href="/home"
      className={buttonVariants({
        variant: 'ghost',
        size: 'lg',
        className: 'fixed left-1 top-3 gap-2',
      })}
    >
      <Logo className="size-6 m-0" />
      Solstice
    </Link>
    <Outlet />
  </main>
);
