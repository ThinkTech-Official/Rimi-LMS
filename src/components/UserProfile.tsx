
import React, { useState, type FC } from 'react'

export interface Certificate {
  id: string
  courseName: string
  issueDate: string
  imageUrl: string
}

export interface Course {
  id: string
  title: string
  thumbnailUrl: string
}

export interface User {
  name: string
  email: string
  password: string
  avatarUrl?: string
}

export interface UserProfileProps {
  user: User
  enrolledCourses: Course[]
  certificates: Certificate[]
}

const UserProfile: FC<UserProfileProps> = ({
  user,
  enrolledCourses,
  certificates,
}) => {
  const [activeTab, setActiveTab] = useState<'enrolled' | 'certificates'>(
    'certificates'
  )

  return (
    <div className="flex min-h-screen bg-white">
      {/* -- Sidebar would go here  */}
      <div className="flex-1">
        {/* -- Top nav / header */}
        <header className="h-16 px-8 flex items-center border-b border-gray-200">
          {/*  */}
        </header>

        <main className="p-8">
          {/* Breadcrumbs */}
          <nav className="text-indigo-600 text-sm mb-6">
            <a href="/users-management" className="hover:underline">
              Users Management
            </a>{' '}
            &gt;{' '}
            <span className="font-medium">View Profile</span>
          </nav>

          {/* Profile Info */}
          <div className="flex items-start space-x-8 mb-8">
            <img
              src={user.avatarUrl ?? '/placeholder-avatar.png'}
              alt="Avatar"
              className="w-20 h-20 rounded-md object-cover bg-gray-100"
            />
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-base">
                <span className="font-semibold">Name:</span>
                <span className="text-gray-500">{user.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-base">
                <span className="font-semibold">Email:</span>
                <span className="text-gray-500">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-base">
                <span className="font-semibold">Password:</span>
                <span className="text-gray-500">{user.password}</span>
                <button className="text-indigo-600 underline text-sm">
                  Reset password
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6 flex space-x-8">
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`pb-2 ${
                activeTab === 'enrolled'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              Enrolled courses
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`pb-2 ${
                activeTab === 'certificates'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              Certificates
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'enrolled' && (
            <div className="grid grid-cols-4 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="border border-gray-200 p-4">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h3 className="mt-4 text-base font-semibold">
                    {course.title}
                  </h3>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="grid grid-cols-4 gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="border border-gray-200 p-4">
                  <img
                    src={cert.imageUrl}
                    alt={`Certificate for ${cert.courseName}`}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h3 className="mt-4 text-base font-semibold">
                    {cert.courseName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">
                      Issued Date:
                    </span>{' '}
                    {cert.issueDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default UserProfile
