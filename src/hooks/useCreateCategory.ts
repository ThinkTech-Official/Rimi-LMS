import { useState } from "react";
import axios from "axios";
import { API_BASE } from "../utils/ulrs";

/**
 * Creates a new category on the backend
 */
export const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post<{ id: number; name: string }>(
        `${API_BASE}/categories`,
        { name }
      );
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading, error, setError };
};
