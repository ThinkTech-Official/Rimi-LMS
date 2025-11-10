import { useState } from 'react';
import api from '../utils/api';
import { API_BASE } from '../utils/ulrs';


interface ForgotPasswordData {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<ForgotPasswordResponse>(
        `${API_BASE}/client/auth/forgot-password`,
        data
      );

      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading, error };
};