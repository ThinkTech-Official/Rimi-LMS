import { useState } from 'react';
import api from '../utils/api';
import { API_BASE } from '../utils/ulrs';


interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

interface VerifyTokenResponse {
  valid: boolean;
  message?: string;
}

/**
 * Hook for verifying reset token validity
 */
export const useVerifyResetToken = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyToken = async (token: string): Promise<VerifyTokenResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<VerifyTokenResponse>(
        `${API_BASE}/client/auth/verify-reset-token`,
        {
          params: { token },
        }
      );

      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to verify token';
      setError(errorMessage);
      return { valid: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { verifyToken, loading, error };
};

/**
 * Hook for resetting password with token
 */
export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (data: ResetPasswordData): Promise<ResetPasswordResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<ResetPasswordResponse>(
        `${API_BASE}/client/auth/reset-password-with-token`,
        data
      );

      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error };
};