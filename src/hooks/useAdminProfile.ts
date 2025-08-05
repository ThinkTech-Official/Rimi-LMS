import { useState, useEffect } from 'react';
import adminApi from '../utils/adminApi';
import { API_BASE } from '../utils/ulrs';

export interface AdminProfile {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export function useAdminProfile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await adminApi.post<AdminProfile>(`${API_BASE}/admin/auth/profile`);
        setProfile(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { profile, loading, error };
}