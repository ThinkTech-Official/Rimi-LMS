// src/hooks/useFetchCourseProgress.ts
import { useState, useEffect } from 'react'
import api from '../utils/api'    

export interface CourseProgress {
  totalTests:      number
  passedTests:     number
  percentComplete: number
  tests: {
    id:        number
    name:      string
    duration:  number
    startTime: number
    isCleared: boolean
  }[]
}

const API_BASE = 'http://localhost:3000';

export const useFetchCourseProgress = (courseId: number) => {
  const [progress, setProgress] = useState<CourseProgress | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  console.log('from use fetch course progress hook cpurse id is', courseId)

  useEffect(() => {
    if (courseId == null) return

    let cancelled = false
    const fetchProgress = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data } = await api.get<CourseProgress>(
          `${API_BASE}/courses/${courseId}/progress`
        )
        if (!cancelled) {
          setProgress(data)
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(
            e.response?.data?.message
              ?? e.message
              ?? 'Error fetching course progress'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchProgress()

    return () => {
      cancelled = true
    }
  }, [courseId])

  return { progress, loading, error }
}
