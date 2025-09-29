import { useState } from "react";
import axios from "axios";
import { API_BASE } from "../utils/ulrs";

export interface CertificateData {
  id: number;
  certNumber: string;
  fileName?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  course: {
    name: string;
    thumbnail?: string;
  };
}

export function useAdminCertificateSearch() {
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchCertificate = async (certNumber: string) => {
    setLoading(true);
    setError(null);
    setCertificate(null);

    try {
      const res = await axios.get<CertificateData>(
        `${API_BASE}/certificate/verify/${certNumber}`
      );
      setCertificate(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("No such certificate found.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    certificate,
    loading,
    error,
    searchCertificate,
    setCertificate
  };
}
