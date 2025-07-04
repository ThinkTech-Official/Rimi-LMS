import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface CertRecord {
  id:         number
  certNumber: string
  createdAt:  string
  course: {
    id:   number
    name: string
  }
}

export type GenerateStatus = 'generating' | 'error' | 'done'

interface UseGenerateCertificateParams {
  courseId:       string
  recipientName:  string
  courseTitle:    string
  certRef: React.RefObject<HTMLElement | null>;
}

const API_BASE = 'http://localhost:3000';

/**
 * Kicks off certificate creation & upload, then navigates away.
 * Returns the current status and the certificate record from the server.
 */
export function useGenerateCertificate({
  courseId,
  recipientName,
  courseTitle,
  certRef,
}: UseGenerateCertificateParams): {
    status: GenerateStatus
  certData: CertRecord | null
} {
  const navigate = useNavigate()
  const [status, setStatus]     = useState<GenerateStatus>('generating')
  const [certData, setCertData] = useState<CertRecord | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // create or fetch certificate record
        const { data } = await api.post<CertRecord>(
          `${API_BASE}/courses/${courseId}/certificate`
        )
        if (cancelled) return

        setCertData(data)

        // render HTML => canvas
        const canvas = await html2canvas(certRef.current!)
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height],
        })
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
        const blob = pdf.output('blob')

        // upload PDF
        const form = new FormData()
        form.append('file', blob, `${data.certNumber}.pdf`)
        await api.post(
          `${API_BASE}/courses/${courseId}/certificate/${data.id}/upload`,
          form
        )
        if (cancelled) return

        //  mark done and navigate to list page
        setStatus('done')
        navigate('/client/certificates')
      } catch (e) {
        console.error('Certificate generation error:', e)
        if (!cancelled) setStatus('error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [courseId, recipientName, courseTitle, certRef, navigate])

  return { status, certData }
}
