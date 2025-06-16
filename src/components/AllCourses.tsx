import React, { useState, type ChangeEvent } from 'react';

interface Course {
  id: number;
  title: string;
  duration: string;
  questions: number;
  imageUrl: string;
  category: string;
}

const categories = ['Health Insurance', 'Life Insurance', 'Vehicle Insurance'];

const sampleCourses: Course[] = [
  {
    id: 1,
    title: 'RIMI Insurance Video 1',
    duration: '1hr 20min',
    questions: 30,
    imageUrl: 'https://placehold.co/400x200?text=Course+Image',
    category: 'Health Insurance',
  },
  {
    id: 2,
    title: 'RIMI Life Plan Basics',
    duration: '2hr 05min',
    questions: 20,
    imageUrl: 'https://placehold.co/400x200?text=Course+Image',
    category: 'Life Insurance',
  },
  {
    id: 3,
    title: 'Vehicle Coverage Essentials',
    duration: '1hr 45min',
    questions: 25,
    imageUrl: 'https://placehold.co/400x200?text=Course+Image',
    category: 'Vehicle Insurance',
  },
  
];

const AllCourses: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = sampleCourses.filter(
    (course) =>
      course.category === selectedCategory &&
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title & Breadcrumb */}
        <nav className="text-sm text-indigo-600 mb-2">
          &gt; All Courses
        </nav>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Courses</h1>

        {/* Search & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center border border-gray-300 rounded">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 w-full focus:outline-none"
            />
            <button className="px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16l4-4-4-4m4 4H2"
                />
              </svg>
            </button>
          </div>
          <button className="px-5 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700">
            Create Course
          </button>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <ul className="flex space-x-8">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`pb-2 cursor-pointer font-medium text-sm ${
                  selectedCategory === cat
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500'
                }`}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <div className="h-40 bg-blue-200 relative">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">
                  {course.title}
                </h2>
                <div className="flex items-center text-gray-500 text-xs space-x-4">
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                    </svg>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{course.questions} Questions</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCourses;