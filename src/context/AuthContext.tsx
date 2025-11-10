import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import api from "../utils/api";
import { API_BASE } from "../utils/ulrs";

export interface User {
  userId: number;
  email: string;
  name?: string;
  language: string; // 'en' | 'fr'
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<User>(`${API_BASE}/client/auth/profile`);
      setUser(res.data);

      if (res.data.language) {
        i18n.changeLanguage(res.data.language);
      }

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
