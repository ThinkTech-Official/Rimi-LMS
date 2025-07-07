import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../utils/adminApi';
import { API_BASE } from '../utils/ulrs';

export interface SignInDto {
  email: string;
  password: string;
}



export const useAdminAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const navigate               = useNavigate();

  const login = async (dto: SignInDto) => {
    setLoading(true);
    setError(null);
    try {
      // POST /api/admin/auth/login
      await adminApi.post(`${API_BASE}/admin/auth/login`, dto);
      // on success, cookies are set httpOnly by the server
      // redirect to admin dashboard (adjust path as needed)
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};