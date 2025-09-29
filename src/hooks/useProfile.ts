import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { API_BASE } from "../utils/ulrs";

export interface UserProfile {
  id: number;
  email: string;
  name?: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<UserProfile>(
        `${API_BASE}/client/auth/profile`
      );
      setProfile(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}
