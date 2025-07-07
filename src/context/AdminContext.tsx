// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   type ReactNode,
// } from 'react';
// import adminApi from '../utils/adminApi';
// import type { SignInDto } from '../hooks/useAdminAuth';
// import { useNavigate } from 'react-router-dom';
// import { API_BASE } from '../utils/ulrs';

// export interface Admin {
//   id: number;
//   name: string;
//   email: string;
  
// }

// interface AdminContextType {
//   admin: Admin | null;
//   loading: boolean;
//   error: string | null;
//   login: (dto: SignInDto) => Promise<void>;
//   logout: () => Promise<void>;
//   reload: () => Promise<void>;
// }

// const AdminContext = createContext<AdminContextType | undefined>(undefined);

// export const AdminProvider = ({ children }: { children: ReactNode }) => {
//   const [admin, setAdmin]       = useState<Admin | null>(null);
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState<string | null>(null);
//   const navigate                = useNavigate();

//   // fetch profile
//   const loadProfile = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await adminApi.get<Admin>('/auth/me');
//       setAdmin(data);
//     } catch (err: any) {
//       setAdmin(null);
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

  
//   const login = async (dto: SignInDto) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await adminApi.post(`${API_BASE}/admin/auth/login`, dto);
//       await loadProfile();
//       navigate('/admin/home');
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     await adminApi.post('/auth/logout');
//     setAdmin(null);
//     navigate('/adminlogin');
//   };

//   return (
//     <AdminContext.Provider
//       value={{ admin, loading, error, login, logout, reload: loadProfile }}
//     >
//       {children}
//     </AdminContext.Provider>
//   );
// };

// export const useAdmin = (): AdminContextType => {
//   const ctx = useContext(AdminContext);
//   if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
//   return ctx;
// };





// =========================================================



import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import adminApi from '../utils/adminApi';
import { API_BASE } from '../utils/ulrs';

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
  const [admin,   setAdmin]   = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  
  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminApi.post<Admin>(`${API_BASE}/admin/auth/profile`);
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












