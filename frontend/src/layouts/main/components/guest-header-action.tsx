import { Link, buttonVariants } from '@heroui/react';
import { LogIn, UserPlus } from 'lucide-react';

export const GuestHeaderAction = () => {
  return (
    <>
      <Link
        href="/auth/register"
        className={buttonVariants({ variant: 'tertiary', isIconOnly: true })}
      >
        <UserPlus />
      </Link>
      <Link href="/auth/login" className={buttonVariants()}>
        <LogIn />
        Log in
      </Link>
    </>
  );
};
