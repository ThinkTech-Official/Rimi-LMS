import React, { useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Certificate from '../components/Certificate'
import { useGenerateCertificate } from '../hooks/useGenerateCertificate'

interface LocationState {
  courseTitle:   string
  recipientName: string
}

export const GenerateCertificatePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const location     = useLocation()
  const state        = location.state as LocationState
  const certRef      = useRef<HTMLDivElement>(null)

  // Kick off generation on mount
  const { status, certData } = useGenerateCertificate({
    courseId:      courseId!,       
    recipientName: state.recipientName,
    courseTitle:   state.courseTitle,
    certRef,
  })

  if (status === 'error') {
    return (
      <div className="p-8 text-red-500">
        Failed to generate certificate.
      </div>
    )
  }

  return (
    <div className="p-8">
      <p>Generating certificate…</p>

      {/* Hidden Certificate for html2canvas */}
      <div
        ref={certRef}
        style={{ position: 'absolute', left: -10000, top: 0 }}
      >
        <Certificate
          recipientName={state.recipientName}
          courseTitle={state.courseTitle}
          date={new Date(certData!.createdAt).toLocaleDateString()}
          certNumber={certData!.certNumber}
        />
      </div>
    </div>
  )
}