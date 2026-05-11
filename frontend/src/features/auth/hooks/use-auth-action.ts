import { useAuth } from './use-auth';

export const useAuthAction = () => {
  const { user, setIsAuthModalOpen } = useAuth();

  const withAuth = <T extends unknown[], R>(action: (...args: T) => R) => {
    return (...args: T): R | void => {
      if (!user) {
        setIsAuthModalOpen(true);
        return;
      }
      return action(...args);
    };
  };
  return withAuth;
};
