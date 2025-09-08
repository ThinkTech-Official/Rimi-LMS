import { useState } from 'react';
import adminApi from '../utils/adminApi';
import { AxiosError } from 'axios';

interface UploadDocumentsResponse {
  success: boolean;
  message: string;
  uploadedCount: number;
  data: any;
}

export const useUploadDocuments = (courseId: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadDocuments = async (files: File[]): Promise<UploadDocumentsResponse> => {
    if (files.length === 0) {
      throw new Error('No files provided');
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      
      // Append all files under the 'documents' field name
      files.forEach(file => {
        formData.append('documents', file);
      });

      const response = await adminApi.post(`/courses/${courseId}/documents`, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      const data: UploadDocumentsResponse = response.data;
      setProgress(100);
      
      return data;
    } catch (err) {
      let errorMessage = 'Upload failed';
      
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
    uploadDocuments,
    loading,
    error,
    progress,
  };
};