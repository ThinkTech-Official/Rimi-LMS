import { useState } from 'react';
import api from '../utils/api';
import { API_BASE } from '../utils/ulrs';

type Language = 'en' | 'fr';

interface UseUpdateLanguageReturn {
  updateLanguage: (language: Language) => Promise<any>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Hook to update the authenticated user's language preference
 * Automatically saves to database and updates UI
 */
export const useUpdateLanguage = (): UseUpdateLanguageReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateLanguage = async (language: Language) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.patch(`${API_BASE}/client/auth/language`, { language });
      setSuccess(true);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update language';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateLanguage, loading, error, success };
};