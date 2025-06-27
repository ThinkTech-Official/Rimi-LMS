import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { BiSearch } from "react-icons/bi";
import { MdUpload } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import { useCreateCourse } from "../hooks/useCreateCourse";

interface TestEntry {
  id: number;
  testName: string;
  courseId: string;
  questions: number;
  duration: string;
  videoThumbnail: string;
}


interface CreateCourseProps {
  onCreateTest: () => void;
}
const CreateCourse: React.FC<CreateCourseProps> = ({ onCreateTest }) => {
  const navigate = useNavigate()

  const { createCourse, progress, loading, error } = useCreateCourse()


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  // const [testSearch, setTestSearch] = useState("");
  // const [searchTerm, setSearchTerm] = useState<string>("");
  // const [currentPage, setCurrentPage] = useState(1);

 const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files?.[0]) {
    setVideo(e.target.files[0])
  }
}

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setThumbnail(e.target.files[0]);
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (thumbnail){
      formData.append('thumbnail', thumbnail);
    } 
    if (video) {
  formData.append('video', video)
}

    try {
      const savedCourse = await createCourse(formData);
      navigate(`/admin/edit-course/${savedCourse.id}`);
    } catch {
      // error handled in hook
    }
  };

  

  // const handleNavigate = (id: string) => {
  //   navigate(`/admin/edit-course/${id}`)
  // }

  return (
    <div className="min-h-screen flex bg-white">
      <main className="flex-1 px-2 sm:px-8 pt-4 pb-10 overflow-auto">
        <form className="space-y-4" onSubmit={handleSubmit}>
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
                      // className="hidden"
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

          

          {/* Save Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="inline-block text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
            >
              {loading ? `Saving...${progress}%` : 'Save Course'}
            </button>
          </div>

          {/* Upload progress and Errors  */}

          {loading && <progress className=" w-full mt-2 " value={progress} max={100} />}
          {error && <p className=" text-red-500 mt-2"> {error}</p>}


        </form>
      </main>
    </div>
  );
};

export default CreateCourse;
