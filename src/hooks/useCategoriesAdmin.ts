import { useState, useEffect } from "react";
import adminApi from "../utils/adminApi";
import { API_BASE } from "../utils/ulrs";

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function useCategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get<Category[]>(`${API_BASE}/categories`);
      setCategories(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create
  const createCategory = async (name: string) => {
    setLoading(true);
    try {
      const res = await adminApi.post<Category>(`${API_BASE}/categories`, {
        name,
      });
      setCategories((prev) => [...prev, res.data]);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update
  const updateCategory = async (id: number, name: string) => {
    setLoading(true);
    try {
      const res = await adminApi.patch<Category>(
        `${API_BASE}/categories/${id}`,
        { name }
      );
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? res.data : cat))
      );
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const deleteCategory = async (id: number) => {
    setLoading(true);
    try {
      await adminApi.delete(`${API_BASE}/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    setError,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
