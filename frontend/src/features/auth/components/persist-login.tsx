import { getAccessToken, hasSessionCookie } from '../../../utils/token-service';
import { usePersistLogin } from '../hooks/use-persist-login';
import type { ReactNode } from 'react';

interface PersistLoginProps {
  children: ReactNode;
}

export const PersistLogin = ({ children }: PersistLoginProps) => {
  const needsRefresh = !getAccessToken() && hasSessionCookie();
  const { isLoading } = usePersistLogin(needsRefresh);

  if (needsRefresh && isLoading)
    return <div className="full-screen-spinner">Loading session...</div>;

  return children;
};
