import React, { type FC, useRef, useState } from 'react'
import Sidebar from './Sidebar'

interface StudyMaterial {
  id: string
  title: string
  description: string
  url: string
}

const studyMaterials: StudyMaterial[] = [
  {
    id: '1',
    title: 'RIMI Insurance Video 1',
    description:
      'Discover the essentials of Rimi Health Insurance with our in-depth courses tailored to empower your understanding of health coverage.',
    url: '/materials/insurance-video-1.pdf',
  },
  {
    id: '2',
    title: 'Policy Deep Dive',
    description: 'A detailed PDF on policy terms, claims processes, and more.',
    url: '/materials/policy-deep-dive.pdf',
  },
  {
    id: '3',
    title: 'Claims Checklist',
    description: 'Step-by-step checklist to follow when filing a claim.',
    url: '/materials/claims-checklist.pdf',
  },
]

type View = 'home' | 'certificates' | 'play'

const CoursePlay: FC = () => {
  const [active, setActive] = useState<View>('play')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showFull, setShowFull] = useState(false)

  const toggleDescription = () => setShowFull((f) => !f)
  const description =
    'Discover the essentials of Rimi Health Insurance with our in-depth courses tailored to empower your understanding of health coverage. Explore various topics, from policy details to claims processes, and equip yourself with the knowledge to make informed decisions about your health. Join us on this enlightening journey.'

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Breadcrumbs */}
        <div className="text-indigo-600 text-sm mb-4">
          Health Insurance &gt; <span className="font-medium">RIMI Video 1</span>
        </div>

        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 bg-white shadow-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          ← Back
        </button>

        {/* Video player */}
        <div className="mt-6 bg-black rounded overflow-hidden relative">
          <video
            ref={videoRef}
            controls
            className="w-full aspect-video bg-black"
            poster="/video-poster.jpg"
            src="/videos/insurance-video-1.mp4"
          />
        </div>

        {/* Title & description */}
        <h1 className="mt-6 text-2xl font-semibold text-gray-900">RIMI Insurance Video 1</h1>
        <p className="mt-2 text-gray-600">
          {showFull ? description : description.slice(0, 120) + '…'}
          <button
            onClick={toggleDescription}
            className="ml-2 text-indigo-600 font-medium hover:underline"
          >
            {showFull ? 'less' : 'more'}
          </button>
        </p>

        {/* Study materials */}
        <h2 className="mt-8 text-xl font-semibold text-gray-900">Study materials</h2>
        <ul className="mt-4 space-y-3">
          {studyMaterials.map((mat) => (
            <li
              key={mat.id}
              className="bg-neutral-100 p-4 flex items-center justify-between rounded"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                  📄
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium">{mat.title}</h3>
                  <p className="text-gray-600 text-sm">{mat.description}</p>
                </div>
              </div>
              <a
                href={mat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700"
              >
                Open
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default CoursePlay