import { useState, useCallback } from "react";
import api from "../utils/api";
import { API_BASE } from "../utils/ulrs";

interface Credentials {
  name: string;
  email: string;
  agentCode: string;
  password: string;
  confirmPassword: string;
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback(async (formData: Credentials) => {
    console.log("formData", formData);
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`${API_BASE}/client/auth/signup`, {
        formData
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { signup, loading, error };
}
