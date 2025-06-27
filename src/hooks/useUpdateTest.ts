import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export interface CreateOptionDto { text: string; isCorrect: boolean; }
export interface CreateQuestionDto { text: string; options: CreateOptionDto[]; }
export interface UpdateTestDto {
  name: string;
  duration: number;
  startTime: number;
  questions: CreateQuestionDto[];
}

/**
 * Update a test by replacing its fields and questions
 */
export const useUpdateTest = (courseId: string, testId: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateTest = async (dto: UpdateTestDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(
        `${API_BASE}/courses/${courseId}/tests/${testId}`,
        dto
      );
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateTest, loading, error };
};
