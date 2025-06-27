import { useState, useEffect } from 'react';
import axios from 'axios';

export interface OptionDto {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface QuestionDto {
  id: number;
  text: string;
  options: OptionDto[];
}

export interface TestDetail {
  id: number;
  name: string;
  duration: number;    // in minutes
  startTime: number;   // minute offset in video
  questions: QuestionDto[];
}

const API_BASE = 'http://localhost:3000';

/**
 * Fetches a single test's details (including questions and options).
 */
export const useFetchTest = (
  courseId: string,
  testId: string
) => {
  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !testId) return;
    setLoading(true);
    axios
      .get<TestDetail>(
        `${API_BASE}/courses/${courseId}/tests/${testId}`
      )
      .then((res) => setTest(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId, testId]);

  return { test, loading, error };
};