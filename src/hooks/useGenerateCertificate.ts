import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export interface CertRecord {
  id:         number
  certNumber: string
  createdAt:  string
  course: {
    id:   number
    name: string
  }
}

const API_BASE = 'http://localhost:3000';

export type GenerateStatus = 'generating' | 'error' | 'done'

interface UseGenerateCertificateParams {
  courseId:      string
  recipientName: string
  courseTitle:   string
  certRef:       React.RefObject<HTMLElement | null>
}

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

  // ─── Effect A: Create/fetch the DB row ───────────────────────────
  useEffect(() => {
    let cancelled = false
    api.post<CertRecord>(`${API_BASE}/courses/${courseId}/certificate`)
      .then(res => {
        if (!cancelled) setCertData(res.data)
      })
      .catch(err => {
        console.error('Certificate fetch/create error:', err)
        if (!cancelled) setStatus('error')
      })
    return () => { cancelled = true }
  }, [courseId])

  // ─── Effect B: Once we have certData *and* the element is in the DOM ─
  useEffect(() => {
    if (!certData) return         // haven’t fetched yet
    if (!certRef.current) return   // DOM node not mounted yet

    let cancelled = false
    ;(async () => {
      try {
        // Wait until the browser has painted your hidden component
        await new Promise(requestAnimationFrame)

        // 1) Snapshot to canvas
        const canvas = await html2canvas(certRef.current!)
        const img    = canvas.toDataURL('image/png')
        const pdf    = new jsPDF({
          orientation: 'landscape',
          unit:        'px',
          format:      [canvas.width, canvas.height],
        })
        pdf.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height)
        const blob = pdf.output('blob')

        // 2) Upload the PDF
        const form = new FormData()
        form.append('file', blob, `${certData.certNumber}.pdf`)
        await api.post(
          `${API_BASE}/courses/${courseId}/certificate/${certData.id}/upload`,
          form
        )
        if (cancelled) return

        // 3) Done!
        setStatus('done')
        navigate('/client/certificates')
      } catch (err) {
        console.error('Certificate generation error:', err)
        if (!cancelled) setStatus('error')
      }
    })()

    return () => { cancelled = true }
  }, [certData, certRef, navigate, courseId])

  return { status, certData }
}