import { useState } from "react";
import adminApi from "../utils/adminApi";

export function useAdminResetPasswordOfClient(userId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      //  PUT /admin/users/:id/reset-password
      await adminApi.put(`/users/${userId}/reset-password`, { password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error, success };
}
