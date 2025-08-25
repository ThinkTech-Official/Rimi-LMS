import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../utils/ulrs";

export interface RawCourseEntry {
  id: number;
  name: string;
  duration: number; // in minutes
  //   questionCount: number;
  thumbnail: string;
  categoryId: number;
  description?: string;
}

export interface Course {
  id: number;
  title: string;
  duration: string; // e.g. "1hr 20min"
  //   questions: number;
  imageUrl: string;
  categoryId: number;
  description?: string;
}

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}min ${seconds}sec`;
};

/**
 * Fetches all courses from backend
 */
export const useFetchCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get<RawCourseEntry[]>(`${API_BASE}/courses`)
      .then((res) => {
        const normalized = res.data.map((c) => ({
          id: c.id,
          title: c.name,
          duration: formatTime(c.duration), // `${Math.floor(c.duration/60)}hr ${c.duration%60}min`,
          //   questions: c.questionCount,
          imageUrl: `${API_BASE}/uploads/courses/${c.thumbnail}`,
          categoryId: c.categoryId ? c.categoryId : 0,
          description: c.description,
        }));
        console.log("from fetch all courses", res);
        setCourses(normalized);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, error };
};
