// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const baseUrl = 'http://localhost:3000'

// export interface Question { id: number; text: string;  }
// export interface TestEntry {
//   id: number;
//   name: string;
//   courseId: number;
//   duration: number;
//   startTime: number;
//   questions: Question[];
  
// }

// /**
//  * Fetches tests attached to a specific course from the backend.
//  * Assumes the endpoint GET /api/courses/:courseId/tests returns TestEntry[]
//  */
// export const useFetchTests = (courseId: string, page: Number, limit: number = 5) => {
//   const [tests, setTests] = useState<TestEntry[]>([]);
//   const [total, setTotal] =  useState<number>(0)
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!courseId) return;
//     setLoading(true);
//     axios
//       .get<{ data: TestEntry[]; total: number }>(`${baseUrl}/courses/${courseId}/tests`, { params: { page, limit } } )
//       .then((res) => {
//         console.log('from useFetch test ', res.data)
//         setTests(res.data.data);
//         setTotal(res.data.total);
//       })
//       .catch((err) => {
//         setError(err.message);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [courseId , page , limit ]);

//   return { tests,total, loading, error };
// };



import { useState, useEffect } from 'react';
import axios from 'axios';

export interface RawTestEntry {
  id: number;
  name: string;
  duration: number;
  startTime: number;
  courseId: number;
  questions: any[];
  createdAt: string;
  updatedAt: string;
}

export interface TestEntry {
  id: number;
  name: string;
  startTime: string;
  duration: string;      
  questionCount: number; 
  // courseId: string;
}

const API_BASE = 'http://localhost:3000';

export const useFetchTests = (
  courseId: string,
  page: number,
  limit: number = 5
) => {
  const [tests, setTests] = useState<TestEntry[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    axios
      .get<{ data: RawTestEntry[]; total: number }>(
        `${API_BASE}/courses/${courseId}/tests`,
        { params: { page, limit } }
      )
      .then((res) => {
        const normalized = res.data.data.map((t) => ({
          id: t.id,
          name: t.name,
          startTime: `${t.startTime} min`,
          duration: `${t.duration} min`,          
          questionCount: Array.isArray(t.questions) ? t.questions.length : 0,
        }));
        console.log('from useFetchTests ', res)
        setTests(normalized);
        setTotal(res.data.total);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId, page, limit]);

  return { tests, total, loading, error };
};