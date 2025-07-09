import { useState } from 'react'
import adminApi from '../utils/adminApi'
import { API_BASE } from '../utils/ulrs'

/**
 * Hook for deleting a course by ID.
 * @param courseId the course to delete
 */
export function useAdminDeleteCourse(courseId: number) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  /** Call this to delete the course */
  async function deleteCourse() {
    setLoading(true)
    setError(null)
    try {
      await adminApi.delete(`${API_BASE}/courses/${courseId}`)
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteCourse, loading, error }
}