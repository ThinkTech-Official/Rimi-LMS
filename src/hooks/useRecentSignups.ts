import { useState, useEffect } from "react";
import adminApi from "../utils/adminApi";
import { API_BASE } from "../utils/ulrs";

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export function useRecentSignups(page: number = 1, limit: number = 10) {
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    adminApi
      .get<{ recentUsers: RecentUser[]; totalCount: number }>(
        `${API_BASE}/admin/dashboard/recent-signups?limit=${limit}&page=${page}`
      )
      .then((res) => {
        if (!mounted) return;
        console.log("from recent sign ups ", res.data);
        setUsers(res.data.recentUsers);
        setTotalCount(res.data.totalCount);
      })
      .catch((err) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [page, limit]);

  return { users, totalCount, loading, error };
}
