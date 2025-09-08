import { useState } from 'react';
import adminApi from '../utils/adminApi';
import { AxiosError } from 'axios';

interface DeleteDocumentResponse {
  success: boolean;
  deletedDocument: {
    id: number;
    fileName: string;
    courseId: number;
  };
  message: string;
}

export const useDeleteDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDocument = async (documentId: number): Promise<DeleteDocumentResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.delete(`/courses/documents/${documentId}`);
      const data: DeleteDocumentResponse = response.data;
      return data;
    } catch (err) {
      let errorMessage = 'Delete failed';
      
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteDocument,
    loading,
    error,
  };
};