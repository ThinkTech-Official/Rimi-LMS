// import { useState } from 'react';
// import adminApi from '../utils/adminApi'

// interface ConflictingTest {
//   id: number;
//   name: string;
//   startTime: number;
// }

// interface TimeClashResponse {
//   hasClash: boolean;
//   conflictingTest: ConflictingTest | null;
// }

// export const useTimeClash = (courseId: string) => {
//   const [isChecking, setIsChecking] = useState(false);
//   const [timeClashError, setTimeClashError] = useState<string | null>(null);

//   const checkTimeClash = async (startTime: number): Promise<TimeClashResponse> => {
//     setIsChecking(true);
//     setTimeClashError(null);

//     try {
//       const response = await adminApi.get<TimeClashResponse>(
//         `/courses/${courseId}/tests/check-time-clash/${startTime}` // Remove /api since it's already in baseURL
//       );
      
//       return response.data;
//     } catch (error: any) {
//       console.error('Time clash check error:', error);
      
//       let errorMessage = 'Failed to check time clash';
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data?.error) {
//         errorMessage = error.response.data.error;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       setTimeClashError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setIsChecking(false);
//     }
//   };

//   const clearTimeClashError = () => {
//     setTimeClashError(null);
//   };

//   return {
//     checkTimeClash,
//     isChecking,
//     timeClashError,
//     clearTimeClashError,
//   };
// };