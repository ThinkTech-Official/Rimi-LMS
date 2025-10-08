import { useState, useEffect } from "react";
import adminApi from "../utils/adminApi";
import { API_BASE } from "../utils/ulrs";

export interface StatsItem {
  date: string;
  dailySignups: number;
  dailyCertificatesIssued: number;
}

export function useDashboardStatsCharts(targetDate?: string) {
  const [data, setData] = useState<StatsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);

      try {
        const params = targetDate ? { date: targetDate } : {};
        //  use your adminApi (handles cookies, refresh, etc)
        const response = await adminApi.get<StatsItem[]>(
          `${API_BASE}/admin/dashboard/range`,
          { params }
        );
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [targetDate]);

  return { data, loading, error };
}
