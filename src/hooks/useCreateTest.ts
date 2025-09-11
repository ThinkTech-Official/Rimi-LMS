import { useState } from "react";
import axios from "axios";
import { API_BASE } from "../utils/ulrs";

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
        `${API_BASE}/courses/${courseId}/tests`,
        dto
      );
      return response.data;
    } catch (err: any) {
      console.log('error from test creation failed',err)
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTest, loading, error };
};
