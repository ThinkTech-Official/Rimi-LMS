import { useState, useCallback } from 'react';
import api from '../utils/api';


const API_BASE = 'http://localhost:3000';

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // hit the Nest controller
      await api.post(`${API_BASE}/client/auth/logout`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { logout, loading, error };
}