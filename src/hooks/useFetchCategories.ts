import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE } from "../utils/ulrs";

export interface Category {
  id: number;
  name: string;
}

/**
 * Fetches available course categories from backend
 */
export const useFetchCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(() => {
    setLoading(true);
    axios
      .get<Category[]>(`${API_BASE}/categories`)
      .then((res) => {
        setCategories(res.data);
      })

      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};
