import { useState } from 'react';
import adminApi from '../utils/adminApi';
import { API_BASE } from '../utils/ulrs';

export function useUpdateAdminPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function updatePassword(currentPassword: string, newPassword: string) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await adminApi.post(`${API_BASE}/admin/auth/update-password`, {
        currentPassword,
        newPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return { updatePassword, loading, error, success };
}