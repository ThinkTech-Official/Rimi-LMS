import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

interface User {
  id: number;
  email: string;
  username: string;
}

const API_BASE = 'http://localhost:3000';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`${API_BASE}/client/auth/profile`);
      setUser(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refreshUser: fetchUser };
}