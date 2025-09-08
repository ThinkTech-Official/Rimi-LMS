import { useState } from "react";
import adminApi from "../utils/adminApi";
import { API_BASE } from "../utils/ulrs";

export function useAdminResetPasswordOfClient(userId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Updated to match the new backend endpoint
      await adminApi.post(`${API_BASE}/admin/auth/reset-client-password`, { 
        clientUserId: userId,
        newPassword 
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error, success };
}