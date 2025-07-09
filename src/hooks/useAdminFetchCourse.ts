import { useState, useEffect } from 'react'
import adminApi from '../utils/adminApi'
import { API_BASE } from '../utils/ulrs'

/**
 * Shape of the basic course payload returned by /courses/:id/basic
 */
export interface BasicCourse {
  id: number
  name: string
  description: string
  thumbnail: string | null
  videoUrl: string | null
  duration: number | null
}

/**
 * Hook to fetch only basic course details for admin
 * @param courseId the ID of the course to fetch
 */
export function useAdminFetchCourse(courseId: string | null) {
  const [basicCourse, setBasicCourse] = useState<BasicCourse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (courseId === null) return
    setLoading(true)
    setError(null)

    adminApi
      .get<BasicCourse>(`${API_BASE}/courses/${courseId}/basic`)
      .then(res => {
        console.log('from basic course details...',res.data)
        setBasicCourse(res.data)
      })
      .catch(err => {
        setError(
          err.response?.data?.message ?? err.message ?? 'Failed to fetch course basic details'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [courseId])

  return { basicCourse, loading, error }
}
