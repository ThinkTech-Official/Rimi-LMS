import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Question } from '../components/client/Quiz';

// --- Raw DTO from backend ---
interface RawTestDTO {
  id: number;
  name: string;
  duration: number;
  startTime: number;
  courseId: number;
  createdAt: string;
  updatedAt: string;
  questions: Array<{
    id: number;
    question: string;
    createdAt: string;
    updatedAt: string;
    options: Array<{
      id: number;
      text: string;
      isCorrect: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
}

//  Shape UI expects 
export interface TestWithQuestions {
  id: number;
  courseId: number;
  testName: string;
  duration: string;        // UI expects string
  startTime: number;
  questions: Question[];
  passingMarks: number;
}

/**
 * Fetch a single test (with questions) and map to UI shape.
 *
 * @param courseId string | undefined
 * @param testId number | string | undefined
 * @returns { test, loading, error }
 */
export function useFetchTestClient(
  courseId?: string,
  testId?: number | string
) {
  const [test, setTest] = useState<TestWithQuestions | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId || !testId) return;
    setLoading(true);
    setError(null);

    axios
      .get<RawTestDTO>(
        `http://localhost:3000/courses/${courseId}/tests/${testId}`
      )
      .then((res: any) => {
        const raw = res.data;

        console.log('from use fetch test clients' , raw)

        const mappedQuestions: Question[] = raw.questions.map((q: any) => ({
          id: q.id.toString(),
          question: q.text,
          options: q.options.map((o: any) => o.text),
          correctIndex: q.options.findIndex((o: any) => o.isCorrect),
        }));

        setTest({
          id: raw.id,
          courseId: raw.courseId,
          testName: raw.name,
          duration: raw.duration.toString(),
          startTime: raw.startTime,
          questions: mappedQuestions,
          passingMarks: raw.passingMarks
        });
      })
      .catch((err: any) => {
        console.error('useFetchTest error:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseId, testId]);

  return { test, loading, error };
}