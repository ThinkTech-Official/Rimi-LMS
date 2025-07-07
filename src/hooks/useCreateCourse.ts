
import { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../utils/ulrs';

export const useCreateCourse = () => {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  

  const createCourse = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/courses`, formData, {
        // headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCourse, progress, loading, error };
};