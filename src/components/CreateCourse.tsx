import React, { useState, type ChangeEvent, type FormEvent } from 'react';

interface TestEntry {
  id: number;
  testName: string;
  courseId: string;
  questions: number;
  duration: string;
  videoThumbnail: string;
}

const attachedTestsSample: TestEntry[] = [
  { id: 1, testName: 'Course 1', courseId: 'ABC123', questions: 32, duration: '20 min', videoThumbnail: 'https://placehold.co/38x38' },
  { id: 2, testName: 'Course 2', courseId: 'DEF456', questions: 45, duration: '45 min', videoThumbnail: 'https://placehold.co/38x38' },
  { id: 3, testName: 'Course 3', courseId: 'GHI789', questions: 28, duration: '30 min', videoThumbnail: 'https://placehold.co/38x38' },
  { id: 4, testName: 'Course 4', courseId: 'JKL012', questions: 50, duration: '60 min', videoThumbnail: 'https://placehold.co/38x38' },
  { id: 5, testName: 'Course 5', courseId: 'MNO345', questions: 35, duration: '25 min', videoThumbnail: 'https://placehold.co/38x38' },
];

const CreateCourse: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videos, setVideos] = useState<FileList | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [testSearch, setTestSearch] = useState('');

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => setVideos(e.target.files);
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setThumbnail(e.target.files[0]);
  };
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setTestSearch(e.target.value);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    //  submit course data
    console.log({ name, description, videos, thumbnail });
  };

  const filteredTests = attachedTestsSample.filter((test) =>
    test.testName.toLowerCase().includes(testSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-100 p-4">
        {/* Sidebar nav... */}
      </aside>
      
      <main className="flex-1 p-8 overflow-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-indigo-600 mb-4">
          &gt; All courses &gt; Create Course
        </nav>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Course Information */}
          <section className="space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Basic Course Information</h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Course1"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Course Description Here."
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Add Video */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">Add Video</label>
                  <label className="flex items-center justify-center h-32 border border-gray-300 rounded-md cursor-pointer hover:border-indigo-500">
                    <input type="file" accept="video/*" multiple className="hidden" onChange={handleVideoChange} />
                    <span className="text-blue-400 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10-5h3a1 1 0 011 1v4m0 0l-4-4m4 4l-4 4m-2-4h-4" />
                      </svg>
                      Select File to Upload
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Select multiple videos from your local storage * Max. upto 5Gb per video</p>
                </div>
                {/* Add Thumbnail */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">Add Thumbnail Image</label>
                  <label className="flex items-center justify-center h-32 border border-gray-300 rounded-md cursor-pointer hover:border-indigo-500">
                    <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleThumbnailChange} />
                    <span className="text-blue-400 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-6-4l-4-4m0 0l-4 4m4-4v12" />
                      </svg>
                      Upload Thumbnail Image
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Recommended Image Size: 800px x 600px, PNG or JPEG file</p>
                </div>
              </div>
            </div>
          </section>

          {/* Attached Tests Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Attached Tests</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={testSearch}
                    onChange={handleSearchChange}
                    className="px-4 py-2 focus:outline-none"
                  />
                  <button className="px-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l4-4-4-4m4 4H2" />
                    </svg>
                  </button>
                </div>
                <button className="px-4 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700">
                  Create New Test
                </button>
              </div>
            </div>

            {/* Tests Table */}
            <div className="overflow-auto border border-gray-200 rounded-md">
              <div className="bg-indigo-600 text-white flex">
                <div className="w-40 px-6 py-4 font-medium">Test name</div>
                <div className="w-40 px-6 py-4 font-medium">Course ID</div>
                <div className="w-44 px-6 py-4 font-medium">No. of questions</div>
                <div className="w-32 px-6 py-4 font-medium">Duration</div>
                <div className="w-24 px-6 py-4 font-medium">Video</div>
                <div className="w-24 px-6 py-4 font-medium">Action</div>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <div key={test.id} className="flex items-center">
                    <div className="w-40 px-6 py-4 text-gray-700">{test.testName}</div>
                    <div className="w-40 px-6 py-4 text-gray-700">{test.courseId}</div>
                    <div className="w-44 px-6 py-4 text-gray-700">{test.questions}</div>
                    <div className="w-32 px-6 py-4 text-gray-700">{test.duration}</div>
                    <div className="w-24 px-6 py-4">
                      <img src={test.videoThumbnail} alt="thumb" className="w-9 h-9 object-cover" />
                    </div>
                    <div className="w-24 px-6 py-4 flex justify-center">
                      <button className="text-indigo-600 hover:underline">
                        {/* edit/icon button */}
                        edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2 py-4">
              <button className="px-2 py-1 bg-gray-300 text-gray-600 rounded">Previous</button>
              {[1, 2, 3, 4, 5].map((num) => (
                <button key={num} className={`px-3 py-1 rounded ${num === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{num}</button>
              ))}
              <button className="px-2 py-1 bg-gray-300 text-gray-600 rounded">Next</button>
            </div>
          </section>

          {/* Save Button */}
          <div>
            <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Save Course
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateCourse;