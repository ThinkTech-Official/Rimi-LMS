import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import adminApi from "../utils/adminApi";
import { API_BASE } from "../utils/ulrs";

export interface Admin {
  id: number;
  name: string;
  email: string;
}

interface AdminContextType {
  admin: Admin | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({
  admin: null,
  loading: true,
  error: null,
  reload: async () => {},
});

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminApi.post<Admin>(
        `${API_BASE}/admin/auth/profile`
      );
      setAdmin(data);
    } catch (err: any) {
      setAdmin(null);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AdminContext.Provider
      value={{ admin, loading, error, reload: loadProfile }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
