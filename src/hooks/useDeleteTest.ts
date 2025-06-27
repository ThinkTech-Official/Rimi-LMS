import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const useDeleteTest = (courseId: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTest = async (testId: number) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(
        `${API_BASE}/courses/${courseId}/tests/${testId}`
      );
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTest, loading, error };
};
