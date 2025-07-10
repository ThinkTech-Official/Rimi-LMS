import React, { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useFetchTests, type TestEntry } from "../hooks/useFetchTests";
import { useDeleteTest } from "../hooks/useDeleteTest";
import { useTranslation } from "react-i18next";
import Spinner from "./Spinner";
import useNotification from "../hooks/useNotification";
import { set } from "react-hook-form";
import { useAdminFetchCourse } from "../hooks/useAdminFetchCourse";
import { API_BASE } from "../utils/ulrs";
import { useAdminUpdateCourseBasic } from "../hooks/useAdminUpdateCourseBasic";
import { useAdminDeleteCourse } from "../hooks/useAdminDeleteCourse";
import { formatTime } from "../hooks/useFetchCourses";
import { CiFileOn } from "react-icons/ci";
import { MdCancel } from "react-icons/md";

const EditCourse: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const testsPerPage = 5;
  const { NotificationComponent, triggerNotification } = useNotification();

  const {
    tests = [],
    total,
    loading,
    error,
  } = useFetchTests(courseId!, currentPage, testsPerPage);

  const {
    deleteTest,
    loading: deleting,
    error: deleteError,
  } = useDeleteTest(courseId!);

  const {
    basicCourse,
    loading: basicInfoLoad,
    error: basicInfoError,
    refetch: refetchBasic,
  } = useAdminFetchCourse(courseId!);

  const {
    updateBasic,
    loading: updating,
    error: updateError,
  } = useAdminUpdateCourseBasic(Number(courseId!));

  const {
    deleteCourse,
    loading: deletingCourse,
    error: deleteCourseError,
  } = useAdminDeleteCourse(Number(courseId!));

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // local copy to sync front-end after delete
  const [localTests, setLocalTests] = useState<TestEntry[]>([]);
  useEffect(() => {
    setLocalTests(tests);
  }, [tests]);

  const [modalTestId, setModalTestId] = useState<number | null>(null);

  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [basicForm, setBasicForm] = useState({
    name: "",
    description: "",
    duration: "",
    thumbnail: "",
    videoUrl: "",
  });

  useEffect(() => {
    if (!basicCourse) return;
    setBasicForm({
      name: basicCourse.name,
      description: basicCourse.description,
      duration: basicCourse.duration?.toString() ?? "",
      thumbnail: basicCourse.thumbnail ?? "",
      videoUrl: basicCourse.videoUrl ?? "",
    });
  }, [basicCourse]);

  const handleBasicChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBasicForm((f) => ({ ...f, [name]: value }));
  };

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBasic(basicForm, thumbnailFile, videoFile);
      // re-fetch
      refetchBasic();

      setIsBasicModalOpen(false);
      triggerNotification({
        type: "success",
        message: "Course updated",
        duration: 3000,
      });
    } catch {
      triggerNotification({
        type: "error",
        message: updateError ?? "Update failed",
        duration: 3000,
      });
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filtered = localTests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(total / testsPerPage));
  const startIndex = (currentPage - 1) * testsPerPage;
  const paginatedTests = filtered.slice(startIndex, startIndex + testsPerPage);

  const handleCreateTest = () => {
    navigate(`/admin/edit-course/${courseId}/create-test`);
  };

  const handleDeleteClick = (id: number) => {
    setModalTestId(id);
  };

  const handleConfirmDelete = async () => {
    if (modalTestId === null) return;
    try {
      await deleteTest(modalTestId);
      setLocalTests((prev) => prev.filter((t) => t.id !== modalTestId));
      setModalTestId(null);
      triggerNotification({
        type: "success",
        message: "Test deleted",
        duration: 3000,
      });
    } catch {
      // error shown in modal
      triggerNotification({
        type: "error",
        message: "Failed to delete test",
        duration: 3000,
      });
    } finally {
      setModalTestId(null);
    }
  };

  const handleCancelDelete = () => {
    setModalTestId(null);
  };

  const handleTestEdit = (testId: number) => {
    navigate(`/admin/edit-course/${courseId}/edit-test/${testId}`);
  };

  // When user picks a new thumbnail
  const handleThumbnailFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setThumbnailFile(file);
  };

  // When user picks a new video, load metadata to get duration
  const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);

    // create a temporary video element to get its duration
    const url = URL.createObjectURL(file);
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.src = url;
    vid.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const secs = Math.floor(vid.duration);
      // write back into your form state
      setBasicForm((f) => ({ ...f, duration: secs.toString() }));
    };
  };

  return (
    <section className="space-y-6 p-2 md:p-4 lg:p-8">
      {basicInfoLoad ? (
        <Spinner className="mx-auto" />
      ) : basicInfoError ? (
        <p className="text-red-500">{basicInfoError}</p>
      ) : (
        basicCourse && (
          <div className="bg-white shadow-md p-6 relative mb-6 flex flex-col gap-5">
            <h3 className="text-xl font-semibold mb-4 text-text-dark">Course Details</h3>
            <button
              onClick={() => setIsBasicModalOpen(true)}
              className="absolute top-4 right-4 text-text-light-2 hover:text-text-dark  transition delay-100 cursor-pointer"
            >
              <TbEdit className="w-6 h-6" title="Edit Course"/>
            </button>

            <div className="flex flex-col md:flex-row gap-5">
              <img
                src={`${API_BASE}/uploads/courses/${basicCourse.thumbnail}`}
                alt="Thumbnail"
                className="w-80 aspect-video object-cover"
              />
              <div className="flex flex-col justify-center gap-2">
                <p className="flex flex-col">
                  <span className="font-medium text-lg">Name:</span> <span className="text-text-light-2 max-w-lg">{basicCourse.name}</span>
                </p>
                <p className="flex flex-col">
                  <span className="font-medium text-lg">Duration:</span>{" "}
                  <span className="text-text-light-2">{basicCourse.duration != null
                    ? `${formatTime(basicCourse.duration)}`
                    : "—"}</span>
                </p>
                <p>
                  {basicCourse.videoUrl ? (
                    <a
                      rel="noopener noreferrer"
                      className="text-primary hover:underline underline-offset-2 text-lg font-medium"
                      href={`${API_BASE}/uploads/courses/${basicCourse.videoUrl}`}
                      target="_blank"
                    >
                      View Video
                    </a>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>
            <div className="text-text-light">{basicCourse.description}</div>
          </div>
        )
      )}

      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Attached Tests</h2>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center border border-[#DBDADE] w-[230px] sm:w-[330px] relative">
            <input
              type="text"
              placeholder={t("Search by name")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="relative px-2 sm:px-4 py-1 sm:py-3 w-[200px] sm:w-[330px] focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="px-1 sm:px-3 cursor-pointer absolute right-0">
              <BiSearch className="text-[#6F6B7D]" />
            </button>
          </div>
          <button
            onClick={handleCreateTest}
            className="inline-block text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150 w-fit"
          >
            Create New Test
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading ? (
        <div className="fixed top-1/2 left-1/2">
          <Spinner className="w-10 h-10" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : paginatedTests.length > 0 ? (
        <>
          {/* table */}
          <div className="w-full overflow-x-auto custom-scrollbar pb-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary text-white text-[16px] 2xl:text-xl text-center text-nowrap">
                <tr>
                  <th className="px-2 py-3 font-medium">Test Name</th>
                  <th className="px-2 py-3 font-medium">Questions</th>
                  <th className="px-2 py-3 font-medium">Start Point</th>
                  <th className="px-2 py-3 font-medium">Duration</th>
                  <th className="px-2 py-3 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody
                className="bg-white text-[#808080] text-sm 2xl:text-xl text-center"
                style={{ border: "1px solid #AAA9A9" }}
              >
                {filtered.map((test: TestEntry) => (
                  <tr key={test.id}>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{
                        borderWidth: "0px 1px 1px 0px",
                        borderStyle: "solid",
                        borderColor: "#AAA9A9",
                      }}
                    >
                      {test.name}
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{
                        borderWidth: "0px 1px 1px 0px",
                        borderStyle: "solid",
                        borderColor: "#AAA9A9",
                      }}
                    >
                      {test.questionCount}
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{
                        borderWidth: "0px 1px 1px 0px",
                        borderStyle: "solid",
                        borderColor: "#AAA9A9",
                      }}
                    >
                      {test.startTime}
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
                      className="px-2 py-4 text-center whitespace-nowrap"
                      style={{
                        borderWidth: "0px 1px 1px 0px",
                        borderStyle: "solid",
                        borderColor: "#AAA9A9",
                      }}
                    >
                      <div className="flex gap-1.5 justify-center">
                        <button
                          onClick={() => handleDeleteClick(test.id)}
                          className="text-primary hover:underline font-medium cursor-pointer"
                        >
                          <RiDeleteBinLine className="w-5 h-5 cursor-pointer text-red-400" />
                        </button>
                        <button
                          onClick={() => handleTestEdit(test.id)}
                          className="text-primary hover:underline font-medium cursor-pointer"
                        >
                          <TbEdit className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>No tests attached to this course yet.</p>
      )}

      {/* Delete course button  */}
      <div className="flex justify-end"><button
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={deletingCourse}
        className="px-4 py-2 sm:py-3 bg-red-600 text-white hover:bg-red-500 transition delay-100 cursor-pointer"
      >
        Delete Course
      </button></div>

      {/* Delete Confirmation Modal FOR TEST */}
      {modalTestId !== null && (
        <div className="fixed inset-0 bg-black/10  flex items-center justify-center z-50">
          <div className="bg-white shadow-lg p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p className="mt-4">Are you sure you want to delete this test?</p>
            {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Basic COurse Info Editing MOdal  */}

      {isBasicModalOpen && (
        <div className="fixed inset-0 h-screen bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white m-3 shadow-md p-3 sm:p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4 text-text-dark">Edit Course Details</h3>
            <form onSubmit={handleBasicSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={basicForm.name}
                  onChange={handleBasicChange}
                  className="px-4 py-2 sm:py-3 w-full border border-inputBorder focus:border-0 focus:outline-none focus:ring focus:ring-primary"
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={basicForm.description}
                  onChange={handleBasicChange}
                  rows={3}
                  className="px-4 py-2 sm:py-3 w-full border border-inputBorder focus:border-0 focus:outline-none focus:ring focus:ring-primary"
                />
              </div>
              {/* Thumbnail */}
           <div className="flex flex-col md:col-span-2">
            <label className="block text-sm font-medium mb-1">
             Thumbnail
            </label>
          
            {!thumbnailFile ? (
              <div className="flex flex-col items-start space-y-2">
                <label className="inline-block capitalize px-4 py-2 bg-primary text-white cursor-pointer hover:bg-indigo-700 text-sm">
                  Choose Thumbnail
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="flex space-x-1 items-center">
               <CiFileOn className="w-5 h-5" />
              <span> {thumbnailFile.name}</span>
              <MdCancel title="Remove File" className="cursor-pointer" onClick={() => setThumbnailFile(null)} />
              </div>
            )}
          </div>

              {/* Video */}
              <div className="flex flex-col md:col-span-2">
            <label className="block text-sm font-medium mb-1">
             Video
            </label>
          
            {!videoFile ? (
              <div className="flex flex-col items-start space-y-2">
                <label className="inline-block capitalize px-4 py-2 bg-primary text-white cursor-pointer hover:bg-indigo-700 text-sm">
                  Choose Video
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="flex space-x-1 items-center">
               <CiFileOn className="w-5 h-5" />
              <span className="max-w-[350px]"> {videoFile.name}</span>
              <MdCancel title="Remove Video" className="cursor-pointer" onClick={() => setVideoFile(null)} />
              </div>
            )}
          </div>


              {/* Duration (auto) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration (sec)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={basicForm.duration}
                  readOnly
                  className="px-4 py-2 sm:py-3 w-full border border-inputBorder focus:border-0 focus:outline-none focus:ring focus:ring-primary read-only:cursor-not-allowed"
                />
              </div>
              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBasicModalOpen(false)}
                  className="px-4 py-2 sm:py-3 border border-inputBorder cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 sm:py-3 bg-primary text-white hover:bg-indigo-700 transition delay-100 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* course Deletion moodal  */}

      {isDeleteModalOpen && (
        <div className="fixed h-screen inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg m-4 p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Warning!</h3>
            <p className="mb-4 text-gray-800">
              Deleting this course will permanently remove:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
              <li>All course materials (documents & thumbnail)</li>
              <li>The course video file</li>
              <li>All tests and their questions</li>
              <li>All certificates and test results</li>
            </ul>
            {deleteCourseError && (
              <p className="text-red-500 mb-2">{deleteCourseError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-inputBorder text-text-light-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteCourse();
                    setIsDeleteModalOpen(false);
                    triggerNotification({
                      type: "success",
                      message: "Course deleted",
                      duration: 3000,
                    });
                    navigate("/admin/all-courses");
                  } catch {
                    triggerNotification({
                      type: "error",
                      message: deleteCourseError ?? "Delete failed!",
                      duration: 3000,
                    });
                  }
                }}
                disabled={deletingCourse}
                className="px-4 py-2 bg-red-600 text-white cursor-pointer hover:bg-red-700 transition duration-100 disabled:opacity-50"
              >
                {deletingCourse ? "Deleting…" : "Yes, delete course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditCourse;

// Rough code section

{
  /* Table */
}
{
  /* <div className="w-full overflow-x-auto custom-scrollbar pb-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary text-white text-[16px] 2xl:text-xl text-center">
                <tr>
                  <th className="px-2 py-3 font-medium">Test Name</th>
                  <th className="px-2 py-3 font-medium"># Questions</th>
                  <th className="px-2 py-3 font-medium">Duration</th>
                  <th className="px-2 py-3 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody
                className="bg-white text-[#808080] text-sm 2xl:text-xl text-center"
                style={{ border: '1px solid #AAA9A9' }}
              >
                {paginatedTests.map((test) => (
                  <tr key={test.id}>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{ border: '0 1px 1px 0 solid #AAA9A9' }}
                    >
                      {test.name}
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{ border: '0 1px 1px 0 solid #AAA9A9' }}
                    >
                      {test.questionCount}
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{ border: '0 1px 1px 0 solid #AAA9A9' }}
                    >
                      {test.duration}
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap text-center"
                      style={{ border: '0 1px 1px 0 solid #AAA9A9' }}
                    >
                      <div className="flex gap-1.5 justify-center">
                        <button
                          onClick={() => handleDeleteClick(test.id)}
                          className="text-primary hover:underline font-medium"
                        >
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
          </div> */
}

{
  /* Pagination */
}
{
  /* <div className="flex items-center justify-center p-4 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-2 cursor-pointer ${
                  num === currentPage ? 'bg-primary text-white' : 'bg-[#F1F0F2] text-[#808080]'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div> */
}
