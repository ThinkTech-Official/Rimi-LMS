import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import adminApi from '../utils/adminApi';
import { API_BASE } from '../utils/ulrs';

export interface Certificate {
  id: string;
  courseName: string;
  issueDate: string;
  imageUrl: string;
}

export interface Course {
  id: number;
  title: string;
  duration: string;
  questions: number;
  imageUrl: string;
  category: string;
  progress: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface CLientProfileData {
  user: User;
  enrolledCourses: Course[];
  certificates: Certificate[];
}

export function useAdminClientProfile() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CLientProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await adminApi.get<CLientProfileData>(`${API_BASE}/admin/users/${id}/profile`);

        console.log('from useAdmin CLient Profile ',res.data )
        setData(res.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  return { data, loading, error };
}
