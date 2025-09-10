import { useState } from "react";
import adminApi from "../utils/adminApi";
import { API_BASE } from "../utils/ulrs";

export interface SignInDto {
  email: string;
  password: string;
}

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const login = async (dto: SignInDto) => {
    setLoading(true);
    setError(null);
    try {
      // POST /api/admin/auth/login
      const response = await adminApi.post(`${API_BASE}/admin/auth/login`, dto);
      console.log(response);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
