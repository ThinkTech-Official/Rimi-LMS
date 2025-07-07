import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import api from '../utils/api';
import { API_BASE } from '../utils/ulrs';

export interface User {
  userId: number;
  email: string;
  name?: string;
  
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  reload: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<User>(`${API_BASE}/client/auth/profile`);
      setUser(res.data);
    } catch (err: any) {
      setUser(null);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        reload: loadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);