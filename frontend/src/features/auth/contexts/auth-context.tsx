import React, {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { api } from '../../../api/axios';
import { setTokens, clearTokens } from '../../../utils/token-service';
import type {
  UserResponse,
  LoginRequest,
  AuthenticationResponse,
  RegisterRequest,
} from '../../../types/auth';
import { toast } from '@heroui/react';
import { UserCheck, UserPlus } from 'lucide-react';

export interface AuthContextType {
  user: UserResponse | null;
  setUser: Dispatch<SetStateAction<UserResponse | null>>;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: Dispatch<SetStateAction<boolean>>;
  from: string | undefined;
  setFrom: Dispatch<SetStateAction<string | undefined>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [from, setFrom] = useState<string | undefined>(undefined);

  const login = async (credentials: LoginRequest): Promise<void> => {
    const response = await api.post<AuthenticationResponse>(
      '/auth/login',
      credentials,
    );
    const { accessToken, user } = response.data;

    setTokens({ access: accessToken });

    setUser(user);

    toast(`Welcome back ${user?.name} !`, {
      indicator: <UserCheck />,
    });
  };

  const register = async (credentials: RegisterRequest): Promise<void> => {
    const response = await api.post<AuthenticationResponse>(
      '/auth/register',
      credentials,
    );

    const { accessToken, user } = response.data;

    setTokens({ access: accessToken });

    setUser(user);

    toast(`Welcome to Solstice, ${user?.name} !`, {
      indicator: <UserPlus />,
    });
  };

  const logout = async (): Promise<void> => {
    const name = user!.name;

    const toastId = toast('Logging out...', { isLoading: true });

    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (_error) {
      console.error('Backend logout failed, proceeding with local logout');
    } finally {
      toast.close(toastId);
      clearTokens();
      setUser(null);
      setTimeout(() => {
        toast.success(`See you later, ${name} !`);
      }, 50);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        from,
        setFrom,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
