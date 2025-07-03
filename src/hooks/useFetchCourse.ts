import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Question } from '../components/client/Quiz';

// --- Raw DTO from backend ---
export interface CourseDTO {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  categoryId: number;
  tests?: Array<{
    id: number;
    name: string;
    duration: number;
    startTime: number;
    courseId: number;
    createdAt: string;
    updatedAt: string;
  }>;
  documents?: Array<{
    id: number;
    fileName: string;
    courseId: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

// --- Shapes your UI expects ---
export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface Test {
  id: number;
  testName: string;
  duration: string;
  startTime: number;
  passingMarks: number;
  isCleared: boolean;
  questions: Question[];
}

export interface MappedCourse {
  id: number;
  title: string;
  description: string;
  duration: number;
  imageUrl: string;
  videoUrl: string;
  tests: Test[];
  studyMaterials: StudyMaterial[];
}

/**
 * Fetch a single course and map to UI shape.
 *
 * @param courseId string | undefined
 * @returns { course, loading, error }
 */
export function useFetchCourse(courseId?: string) {
  const [course, setCourse] = useState<MappedCourse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    setError(null);

    axios
      .get<CourseDTO>(`http://localhost:3000/courses/${courseId}`)
      .then((res: any) => {
        const raw = res.data;

        console.log('from hook for fetcheh single course', raw)

        // Safely handle missing arrays
        const rawTests = raw.tests ?? [];
        const rawDocs = raw.documents ?? [];

        // Map raw tests to UI Test[]
        const mappedTests: Test[] = rawTests.map((t: any) => ({
          id: t.id,
          testName: t.name,
          duration: String(t.duration),
          startTime: t.startTime,
          passingMarks: 0,           // placeholder until API provides
          isCleared: false,           // initial UI state
          questions: [],              // fetch later via useFetchTest
        }));

        // Map raw documents to StudyMaterial[]
        const mappedMaterials: StudyMaterial[] = rawDocs.map((d: any) => ({
          id: d.id.toString(),
          title: d.fileName,
          description: '',           // no description field yet
          url: `http://localhost:3000/uploads/courses/${d.fileName}`,
        }));

        // Set the mapped course
        setCourse({
          id: raw.id,
          title: raw.name,
          description: raw.description,
          duration: raw.duration,
          imageUrl: `http://localhost:3000/uploads/courses/${raw.thumbnail}`,
          videoUrl: `http://localhost:3000/uploads/courses/${raw.videoUrl}`,
          tests: mappedTests,
          studyMaterials: mappedMaterials,
        });
      })
      .catch((err: any) => {
        console.error('useFetchCourse error:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseId]);

  return { course, loading, error };
}