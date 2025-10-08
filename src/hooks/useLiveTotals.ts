import { useState, useEffect } from "react";
import adminApi from "../utils/adminApi";
import { API_BASE } from "../utils/ulrs";

export interface LiveTotals {
  totalUsers: number;
  createdCourses: number;
  testsCreated: number;
  issuedCertificates: number;
}

export function useLiveTotals() {
  const [totals, setTotals] = useState<LiveTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    adminApi
      .get<LiveTotals>(`${API_BASE}/admin/dashboard/live`)
      .then((res) => {
        if (mounted) {
          setTotals(res.data);
        }
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
  }, []);

  return { totals, loading, error };
}
