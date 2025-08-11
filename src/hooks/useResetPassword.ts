import { useState, useCallback } from "react";
import api from "../utils/api";
import { API_BASE } from "../utils/ulrs";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = useCallback(async (newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`${API_BASE}/client/auth/reset-password`, {
        password: newPassword,
      });
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { resetPassword, loading, error };
}
