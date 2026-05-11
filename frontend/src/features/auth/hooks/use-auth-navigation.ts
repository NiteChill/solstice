import { useNavigate } from 'react-router-dom';
import { useAuthAction } from './use-auth-action';
import type { Key } from 'react';

export const useAuthNavigation = () => {
  const withAuth = useAuthAction();
  const navigate = useNavigate();

  const protectedNavigate = withAuth((path: string) => {
    navigate(path);
  });

  const handleSelectionChange = (key: Key) => {
    const keyString = key.toString();
    if (keyString === '/home') return navigate(keyString);
    protectedNavigate(keyString);
  };

  return { protectedNavigate, handleSelectionChange };
};
