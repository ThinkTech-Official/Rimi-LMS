import { useState } from "react";
import adminApi from "../utils/adminApi";
import { API_BASE } from "../utils/ulrs";

/**
 * Hook to update basic course details (including thumbnail/video upload) for admin
 * @param courseId the ID of the course to update
 */
export function useAdminUpdateCourseBasic(courseId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Update basic course info: name, description, duration, optional thumbnail and video files
   */
  async function updateBasic(
    form: {
      name: string;
      description: string;
      duration: string;
    },
    thumbnailFile: File | null,
    videoFile: File | null
  ) {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("duration", form.duration);
      if (thumbnailFile) {
        fd.append("thumbnail", thumbnailFile);
      }
      if (videoFile) {
        fd.append("video", videoFile);
      }

      await adminApi.patch(`${API_BASE}/courses/${courseId}/basic`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err: any) {
      // prefer server message if available
      setError(
        err.response?.data?.message ?? err.message ?? "Failed to update course"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { updateBasic, loading, error };
}
