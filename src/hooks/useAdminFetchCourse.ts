import { useState, useEffect, useCallback } from "react";
import adminApi from "../utils/adminApi";
import { API_BASE } from "../utils/ulrs";

/**
 * Shape of the basic course payload returned by /courses/:id/basic
 */
export interface BasicCourse {
  id: number;
  name: string;
  description: string;
  thumbnail: string | null;
  videoUrl: string | null;
  duration: number | null;
  liveStatus: boolean | null;
}

/**
 * Hook to fetch only basic course details for admin
 * @param courseId the ID of the course to fetch
 */
export function useAdminFetchCourse(courseId: string | null) {
  const [basicCourse, setBasicCourse] = useState<BasicCourse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReload] = useState(0);

  const fetchBasic = useCallback(() => {
    if (courseId === null) return;
    setLoading(true);
    setError(null);

    adminApi
      .get<BasicCourse>(`${API_BASE}/courses/${courseId}/basic`)
      .then((r) => {
        console.log(r.data);
        setBasicCourse(r.data);
      })
      .catch((err) =>
        setError(
          err.response?.data?.message ??
            err.message ??
            "Failed to fetch basic course details"
        )
      )
      .finally(() => setLoading(false));
  }, [courseId]);

  // run on mount, on courseId change, or when reloadTrigger bumps
  useEffect(() => {
    fetchBasic();
  }, [fetchBasic, reloadTrigger]);

  // caller can invoke this to force a refetch
  const refetch = () => setReload((x) => x + 1);

  return { basicCourse, loading, error, refetch };
}
