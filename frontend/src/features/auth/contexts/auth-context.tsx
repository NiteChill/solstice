import React, {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { api } from '../../../api/axios';
import {
  setTokens,
  clearTokens,
  getRefreshToken,
} from '../../../utils/token-service';
import type {
  UserResponse,
  LoginRequest,
  AuthenticationResponse,
} from '../../../types/auth';

export interface AuthContextType {
  user: UserResponse | null;
  setUser: Dispatch<SetStateAction<UserResponse | null>>;
  login: (credentials: LoginRequest) => Promise<void>;
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
    const { accessToken, refreshToken, user } = response.data;

    setTokens({ access: accessToken, refresh: refreshToken });

    setUser(user);
  };

  const logout = (): void => {
    const rt = getRefreshToken();
    if (rt) api.post('/auth/logout', { refreshToken: rt }).catch(console.error);

    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
