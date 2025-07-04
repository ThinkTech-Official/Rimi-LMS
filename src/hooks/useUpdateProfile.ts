import { useState, useCallback } from 'react';
import api from '../utils/api';
import type { UserProfile } from './useProfile';




const API_BASE = 'http://localhost:3000';

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put<UserProfile>(`${API_BASE}/client/auth/profile`, data);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateProfile, loading, error };
}