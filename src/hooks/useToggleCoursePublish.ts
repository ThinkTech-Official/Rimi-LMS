import api from "../utils/api";
import { API_BASE } from "../utils/ulrs";

export const useToggleCoursePublish = (courseId: number) => {
  const togglePublish = async (liveStatus: boolean) => {
    // send JSON so NestJS’s default body parser handles it
    const res = await api.patch<{
      id: number;
      name: string;
      description: string;
      thumbnail: string | null;
      videoUrl: string | null;
      duration: number | null;
      liveStatus: boolean;
    }>(
      `${API_BASE}/courses/${courseId}/publish`,
      { live: liveStatus } //  plain JSON
    );
    console.log("from toggle course ", res.data);
    return res.data; //  return the updated course object
  };

  return { togglePublish };
};
