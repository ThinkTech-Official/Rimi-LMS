import { useState, useCallback } from 'react';
import adminApi from '../utils/adminApi';
import { API_BASE } from '../utils/ulrs';

export interface CreateAdminUserDto {
  name: string;
  email: string;
  password: string;
}

export function useCreateAdminUser() {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<Error | null>(null);
  const [success, setSuccess]   = useState(false);

  const createUser = useCallback(async (data: CreateAdminUserDto) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await adminApi.post(`${API_BASE}/admin/auth/create-adminuser`, data);
      setSuccess(true);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createUser, loading, error, success };
}