import { useState, useEffect } from 'react';
import adminApi from '../utils/adminApi';
import { API_BASE } from '../utils/ulrs';

export interface DashboardStats {
  date: string;
  dailySignups: number;
  dailyCertificatesIssued: number;
}



export function useDashboardStats() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    adminApi
      .get<DashboardStats>(`${API_BASE}/admin/dashboard`)
      .then(res => {
        console.log('from useDashboardStats ', res)
        if (mounted) setData(res.data);
      })
      .catch(err => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}