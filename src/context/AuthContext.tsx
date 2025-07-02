import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

interface User { id: number; email: string; username: string; /*…*/ }
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Bootstrap ==>  fetch current user on app launch
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const { user } = await res.json();
          setUser(user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',              //  send/receive cookies
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    // on success, server has set cookies; now fetch user
    const profile = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    const { user } = await profile.json();
    setUser(user);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};