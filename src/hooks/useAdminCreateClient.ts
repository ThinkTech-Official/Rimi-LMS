import { useState } from 'react';
import adminApi from '../utils/adminApi';
import { API_BASE } from '../utils/ulrs';

export interface CreateClientUserDto {
  name: string;
  email: string;
  password: string;
}

export function useAdminCreateClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createClient = async (dto: CreateClientUserDto) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // POST /admin/clients
      await adminApi.post<CreateClientUserDto>(`${API_BASE}/admin/auth/create-client`, dto);
      console.log('user Created ')
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        err.message
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createClient, loading, error, success };
}