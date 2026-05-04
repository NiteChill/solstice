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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);

  const login = async (credentials: LoginRequest): Promise<void> => {
    const response = await api.post<AuthenticationResponse>(
      '/auth/login',
      credentials,
    );
    const { accessToken, user } = response.data;

    setTokens({ access: accessToken });

    setUser(user);

    toast(`Welcome back ${user?.displayName} !`, {
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

    toast(`Welcome to Solstice, ${user?.displayName} !`, {
      indicator: <UserPlus />,
    });
  };

  const logout = (): void => {
    api
      .post('/auth/logout', {}, { withCredentials: true })
      .catch(console.error);

    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
