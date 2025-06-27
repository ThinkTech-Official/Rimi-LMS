import { useState } from 'react';
import axios from 'axios';

interface OptionDto {
  text: string;
  isCorrect: boolean;
}

interface QuestionDto {
  text: string;
  options: OptionDto[];
}

interface CreateTestDto {
  name: string;
  duration: number;
  startTime: number;
  questions: QuestionDto[];
}

const baseUrl = 'http://localhost:3000'

/**
 * Hook to create a new test for a given course.
 * POST courses/:courseId/tests
 */
export const useCreateTest = (courseId: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTest = async (dto: CreateTestDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${baseUrl}/courses/${courseId}/tests`,
        dto
      );
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTest, loading, error };
};