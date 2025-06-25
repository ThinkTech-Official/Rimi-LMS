import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { BiSearch } from "react-icons/bi";
import { MdUpload } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

interface TestEntry {
  id: number;
  testName: string;
  courseId: string;
  questions: number;
  duration: string;
  videoThumbnail: string;
}

const attachedTestsSample: TestEntry[] = [
  {
    id: 1,
    testName: "Course 1",
    courseId: "ABC123",
    questions: 32,
    duration: "20 min",
    videoThumbnail: "https://placehold.co/38x38",
  },
  {
    id: 2,
    testName: "Course 2",
    courseId: "DEF456",
    questions: 45,
    duration: "45 min",
    videoThumbnail: "https://placehold.co/38x38",
  },
  {
    id: 3,
    testName: "Course 3",
    courseId: "GHI789",
    questions: 28,
    duration: "30 min",
    videoThumbnail: "https://placehold.co/38x38",
  },
  {
    id: 4,
    testName: "Course 4",
    courseId: "JKL012",
    questions: 50,
    duration: "60 min",
    videoThumbnail: "https://placehold.co/38x38",
  },
  {
    id: 5,
    testName: "Course 5",
    courseId: "MNO345",
    questions: 35,
    duration: "25 min",
    videoThumbnail: "https://placehold.co/38x38",
  },
];
interface CreateCourseProps {
  onCreateTest: () => void;
}
const CreateCourse: React.FC<CreateCourseProps> = ({ onCreateTest }) => {
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState<FileList | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [testSearch, setTestSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) =>
    setVideos(e.target.files);
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setThumbnail(e.target.files[0]);
  };
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTestSearch(e.target.value);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    //  submit course data
    console.log({ name, description, videos, thumbnail });
  };

  const filteredTests = attachedTestsSample.filter((test) =>
    test.testName.toLowerCase().includes(testSearch.toLowerCase())
  );

  const handleNavigate = (id: string) => {
    navigate(`/admin/edit-course/${id}`)
  }

  return (
    <div className="min-h-screen flex bg-white">
      <main className="flex-1 px-2 sm:px-8 pt-4 pb-10 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Course Information */}
          <section className="space-y-5">
            <h2 className="text-lg 2xl:text-2xl font-bold text-text-dark mb-3 sm:mb-6">
              Basic Course Information
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-text-light-2 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Course Name"
                  className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-text-light-2 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Course Description Here."
                  rows={4}
                  className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Add Video */}
                <div className="flex flex-col">
                  <label className="text-sm text-text-light-2 mb-1">
                    Add Video
                  </label>
                  <label className="flex items-center justify-center h-32 border border-inputBorder cursor-pointer hover:border-primary">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={handleVideoChange}
                    />
                    <span className="text-[#59BDE2] flex items-center gap-4">
                      <img src="VideoUpload.svg" alt="" />
                      Select File to Upload
                    </span>
                  </label>
                  <p className="text-xs text-text-light-2 mt-2">
                    Select multiple videos from your local storage * Max. upto
                    5Gb per video
                  </p>
                </div>
                {/* Add Thumbnail */}
                <div className="flex flex-col">
                  <label className="text-sm text-text-light-2 mb-1">
                    Add Thumbnail Image
                  </label>
                  <label className="flex items-center justify-center h-32 border border-inputBorder cursor-pointer hover:border-primary">
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={handleThumbnailChange}
                    />
                    <span className="text-[#59BDE2] flex items-center gap-2">
                      <MdUpload className="text-[#59BDE2] w-7 h-7" />
                      Upload Thumbnail Image
                    </span>
                  </label>
                  <p className="text-xs text-text-light-2 mt-2">
                    Recommended Image Size: 800px x 600px, PNG or JPEG file
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Attached Tests Section */}
          <section className="space-y-6">
            {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Attached Tests
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center border border-[#DBDADE] w-[230px] sm:w-[330px]">
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="px-2 sm:px-4 py-1 sm:py-3 w-[200px] sm:w-[330px] focus:outline-none"
                  />
                  <button className="px-1 sm:px-3 cursor-pointer">
                    <BiSearch className="text-[#6F6B7D]" />
                  </button>
                </div>
                <button
                  className="inline-block text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150 w-fit"
                  onClick={onCreateTest}
                >
                  Create New Test
                </button>
              </div>
            </div> */}

            {/* Tests Table */}
            {/* <div className="w-full overflow-x-auto custom-scrollbar pb-2">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary text-white text-[16px] 2xl:text-xl text-center">
                  <tr>
                    <th className="px-2 py-3 font-medium">Test Name</th>
                    <th className="px-2 py-3 font-medium">Course ID</th>
                    <th className="px-2 py-3 font-medium">No. of Questions</th>
                    <th className="px-2 py-3 font-medium">Duration</th>
                    <th className="px-2 py-3 font-medium">Video</th>
                    <th className="px-2 py-3 text-center font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="bg-white text-[#808080] text-sm 2xl:text-xl text-center"
                  style={{ border: "1px solid #AAA9A9" }}
                >
                  {filteredTests.map((test) => (
                    <tr key={test.id}>
                      <td
                        className="px-2 py-4 whitespace-nowrap"
                        style={{
                          borderWidth: "0px 1px 1px 0px",
                          borderStyle: "solid",
                          borderColor: "#AAA9A9",
                        }}
                      >
                        {test.testName}
                      </td>
                      <td
                        className="px-2 py-4 whitespace-nowrap"
                        style={{
                          borderWidth: "0px 1px 1px 0px",
                          borderStyle: "solid",
                          borderColor: "#AAA9A9",
                        }}
                      >
                        {test.courseId}
                      </td>
                      <td
                        className="px-2 py-4 whitespace-nowrap"
                        style={{
                          borderWidth: "0px 1px 1px 0px",
                          borderStyle: "solid",
                          borderColor: "#AAA9A9",
                        }}
                      >
                        {test.questions}
                      </td>
                      <td
                        className="px-2 py-4 whitespace-nowrap"
                        style={{
                          borderWidth: "0px 1px 1px 0px",
                          borderStyle: "solid",
                          borderColor: "#AAA9A9",
                        }}
                      >
                        {test.duration}
                      </td>
                      <td
                        className="py-2 whitespace-nowrap bg-[#9BD3F8] flex items-center justify-center w-full"
                        style={{
                          borderWidth: "0px 1px 1px 0px",
                          borderStyle: "solid",
                          borderColor: "#AAA9A9",
                        }}
                      >
                        <img
                          src="courseImage.png"
                          alt="thumb"
                          className="w-9 h-9 object-cover"
                        />
                      </td>
                      <td
                        className="px-2 py-4 whitespace-nowrap text-center"
                        style={{
                          borderWidth: "0px 1px 1px 0px",
                          borderStyle: "solid",
                          borderColor: "#AAA9A9",
                        }}
                      >
                        <div className="flex gap-1.5 justify-center">
                          <button className="text-primary hover:underline font-medium">
                            <RiDeleteBinLine className="w-5 h-5" />
                          </button>
                          <button className="text-primary hover:underline font-medium">
                            <TbEdit className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}

            {/* Pagination */}
            {/* <div className="flex items-center justify-center p-4 space-x-2">
              <button
                disabled
                className="px-3 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
                title="Previous"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-2 cursor-pointer ${
                    currentPage === num
                      ? "bg-primary text-white"
                      : "bg-[#F1F0F2] text-[#808080]"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                className="px-3 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
                title="Next"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div> */}
          </section>

          {/* Save Button */}
          <div>
            <button
              // type="submit"
              onClick={()=> handleNavigate('1651651')}
              className="inline-block text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
            >
              Save Course
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateCourse;
