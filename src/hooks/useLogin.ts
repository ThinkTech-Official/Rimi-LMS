import { useState, useCallback } from "react";
import api from "../utils/api";
import { API_BASE } from "../utils/ulrs";

interface Credentials {
  email: string;
  password: string;
}

// Response now includes user object with language
interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name?: string;
    language: string; 
  };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async ({ email, password }: Credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`${API_BASE}/client/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}
