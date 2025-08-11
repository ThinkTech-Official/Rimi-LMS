import { useState, useEffect } from "react";
import { API_BASE } from "../utils/ulrs";
import api from "../utils/api";

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

/**
 * Fetches all courses from backend
 */
export const useFetchCoursesClient = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<RawCourseEntry[]>(`${API_BASE}/courses/live`)
      .then((res) => {
        const normalized = res.data.map((c) => ({
          id: c.id,
          title: c.name,
          duration: String(Math.ceil(c.duration / 60)) + " Min", // `${Math.floor(c.duration/60)}hr ${c.duration%60}min`,
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
