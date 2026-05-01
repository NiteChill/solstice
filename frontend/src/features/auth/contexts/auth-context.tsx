import React, {
  createContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { api } from '../../../api/axios';
import { setTokens, clearTokens } from '../../../utils/token-service';

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: Record<string, any>) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get<User>('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      setUser(null);
    }
  }, []);

  const login = async (credentials: Record<string, any>): Promise<void> => {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, refreshToken } = response.data;

    setTokens({ access: accessToken, refresh: refreshToken });

    await fetchUser();
  };

  // Handle Logout
  const logout = (): void => {
    api.post('/auth/logout').catch(console.error);

    clearTokens();
    setUser(null);
    window.location.href = '/auth/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
