// src/hooks/useSubmitTest.ts
import { useState } from 'react';

export interface SubmitPayload {
  score: number;    // 0–100
  passed: boolean;
}

const API_BASE = 'http://localhost:3000';

export function useSubmitTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function submit(
    courseId: number,
    testId:   number,
    payload:  SubmitPayload,
  ) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/courses/${courseId}/tests/${testId}/submit`,
        {
          method:      'POST',
          credentials: 'include',
          headers:     { 'Content-Type': 'application/json' },
          body:        JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Submission failed');
      }
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}
