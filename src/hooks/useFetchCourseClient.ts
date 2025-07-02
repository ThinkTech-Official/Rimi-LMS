// import { useState, useEffect } from 'react';
// import axios, { type CancelTokenSource } from 'axios';

// /**
//  * Represents a single course test with user clearance info
//  */
// export interface TestClient {
//   id: number;
//   name: string;
//   duration: number;
//   startTime: number;
//   passingMarks: number;
//   quizQuestionNumber: number;
//   isCleared: boolean;
// }

// /**
//  * Represents a course document
//  */
// export interface DocumentClient {
//   id: number;
//   fileName: string;
//   url: string;
// }

// /**
//  * Represents the course payload for the client
//  */
// export interface CourseClient {
//   id: number;
//   name: string;
//   description: string;
//   thumbnail?: string;
//   videoUrl?: string;
//   duration?: number;
//   documents: DocumentClient[];
//   tests: TestClient[];
// }

// interface UseFetchCourseClientResult {
//   course: CourseClient | null;
//   loading: boolean;
//   error: string | null;
// }

// const API_BASE = 'http://localhost:3000';

// /**
//  * Hook to fetch a course with user-specific test clearance info
//  * Uses axios to include cookies (accessToken, refreshToken)
//  * @param courseId the ID of the course to fetch
//  */
// export function useFetchCourseClient(
//   courseId: string
// ): UseFetchCourseClientResult {
//   const [course, setCourse] = useState<CourseClient | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!courseId) return;
//     let cancelToken: CancelTokenSource = axios.CancelToken.source();

//     async function fetchCourse() {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get<CourseClient>(
//           `${API_BASE}/courses/${courseId}/client`,
//           {
//             withCredentials: true,             // send accessToken, refreshToken cookies
//             cancelToken: cancelToken.token,
//           }
//         );
//         console.log('from the use fetch course client',response)
//         setCourse(response.data);
       
//       } catch (err: any) {
//         if (axios.isCancel(err)) {
//           // request canceled
//         } else {
//           setError(err.response?.data?.message || err.message);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCourse();

//     return () => {
//       cancelToken.cancel('Operation canceled by the user.');
//     };
//   }, [courseId]);

//   return { course, loading, error };
// }



// =====================================



// import { useState, useEffect } from 'react';
// import axios, { type CancelTokenSource } from 'axios';

// /**
//  * Represents a single course test with user clearance info
//  */
// export interface TestClient {
//   id: number;
//   name: string;
//   duration: number;
//   startTime: number;
//   passingMarks: number;
//   quizQuestionNumber: number;
//   isCleared: boolean;
// }

// /**
//  * Represents a course document
//  */
// export interface DocumentClient {
//   id: number;
//   fileName: string;
//   url: string;
// }

// /**
//  * Represents the course payload for the client
//  */
// export interface CourseClient {
//   id: number;
//   name: string;
//   description: string;
//   thumbnail?: string;
//   videoUrl?: string;
//   duration?: number;
//   documents: DocumentClient[];
//   tests: TestClient[];
// }

// interface UseFetchCourseClientResult {
//   course: CourseClient | null;
//   loading: boolean;
//   error: string | null;
// //   refetch: any;
// }

// /**
//  * Hook to fetch a course with user-specific test clearance info
//  * Uses axios to include cookies (accessToken, refreshToken)
//  * Transforms raw file names into full URLs for video, thumbnail, and documents
//  * @param courseId the ID of the course to fetch
//  */
// export function useFetchCourseClient(
//   courseId: string
// ): UseFetchCourseClientResult {
//   const [course, setCourse] = useState<CourseClient | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

  
//   const API_BASE =  'http://localhost:3000';

//   useEffect(() => {
//     if (!courseId) return;
//     const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

//     async function fetchCourse() {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get<
//           CourseClient & { documents: { id: number; fileName: string }[] }
//         >(
//           `${API_BASE}/courses/${courseId}/client`,
//           {
//             withCredentials: true,
//             cancelToken: cancelTokenSource.token,
//           }
//         );
//         const raw = response.data as any;

//         console.log('from use fetch course client ', raw)

//         // Map video and thumbnail URL
//         const videoUrl = raw.videoUrl
//           ? `${API_BASE}/uploads/courses/${raw.videoUrl}`
//           : undefined;
//         const thumbnail = raw.thumbnail
//           ? `${API_BASE}/uploads/courses/${raw.thumbnail}`
//           : undefined;

//         // Map documents array
//         const documents: DocumentClient[] = raw.documents.map((d: any) => ({
//           id: d.id,
//           fileName: d.fileName,
//           url: `${API_BASE}/uploads/courses/${d.fileName}`,
//         }));

//         // Assemble final course object
//         setCourse({
//           id: raw.id,
//           name: raw.name,
//           description: raw.description,
//           thumbnail,
//           videoUrl,
//           duration: raw.duration,
//           documents,
//           tests: raw.tests,
//         });
//       } catch (err: any) {
//         if (!axios.isCancel(err)) {
//           setError(err.response?.data?.message || err.message);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCourse();
//     return () => cancelTokenSource.cancel('Operation canceled by user.');
//   }, [courseId]);

//   return { course, loading, error };
// }












// ======================================================









import { useState, useEffect, useCallback } from 'react';
import axios, { type CancelTokenSource } from 'axios';

/**
 * Represents a single course test with user clearance info
 */
export interface TestClient {
  id: number;
  name: string;
  duration: number;
  startTime: number;
  passingMarks: number;
  quizQuestionNumber: number;
  isCleared: boolean;
}

/**
 * Represents a course document
 */
export interface DocumentClient {
  id: number;
  fileName: string;
  url: string;
}

/**
 * Represents the course payload for the client
 */
export interface CourseClient {
  id: number;
  name: string;
  description: string;
  thumbnail?: string;
  videoUrl?: string;
  duration?: number;
  documents: DocumentClient[];
  tests: TestClient[];
}

interface UseFetchCourseClientResult {
  course: CourseClient | null;
  loading: boolean;
  error: string | null;
  refetch: any;
}

/**
 * Hook to fetch a course with user-specific test clearance info
 * Uses axios to include cookies (accessToken, refreshToken)
 * Transforms raw file names into full URLs for video, thumbnail, and documents
 * @param courseId the ID of the course to fetch
 */
export function useFetchCourseClient(
  courseId: string
): UseFetchCourseClientResult {
  const [course, setCourse] = useState<CourseClient | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = 'http://localhost:3000';

  // useCallback to ensure stable reference
  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
    try {
      const response = await axios.get<
        CourseClient & { documents: { id: number; fileName: string }[] }
      >(
        `${API_BASE}/courses/${courseId}/client`,
        {
          withCredentials: true,
          cancelToken: cancelTokenSource.token,
        }
      );
      const raw = response.data as any;

      // Map video and thumbnail URL
      const videoUrl = raw.videoUrl
        ? `${API_BASE}/uploads/courses/${raw.videoUrl}`
        : undefined;
      const thumbnail = raw.thumbnail
        ? `${API_BASE}/uploads/courses/${raw.thumbnail}`
        : undefined;

      // Map documents array
      const documents: DocumentClient[] = raw.documents.map((d: any) => ({
        id: d.id,
        fileName: d.fileName,
        url: `${API_BASE}/uploads/courses/${d.fileName}`,
      }));

      // Assemble final course object
      setCourse({
        id: raw.id,
        name: raw.name,
        description: raw.description,
        thumbnail,
        videoUrl,
        duration: raw.duration,
        documents,
        tests: raw.tests,
      });
    } catch (err: any) {
      if (!axios.isCancel(err)) {
        setError(err.response?.data?.message || err.message);
      }
    } finally {
      setLoading(false);
    }
    return () => cancelTokenSource.cancel('Operation canceled by user.');
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, loading, error, refetch: fetchCourse };
}
