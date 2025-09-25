import React, { useState, useEffect, type ChangeEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { useFetchTests, type TestEntry } from "../hooks/useFetchTests";
import { useDeleteTest } from "../hooks/useDeleteTest";
import { useTranslation } from "react-i18next";
import Spinner from "./loaders/Spinner";
import useNotification from "../hooks/useNotification";
import { useAdminFetchCourse } from "../hooks/useAdminFetchCourse";
import { API_BASE } from "../utils/ulrs";
import { useAdminUpdateCourseBasic } from "../hooks/useAdminUpdateCourseBasic";
import { useAdminDeleteCourse } from "../hooks/useAdminDeleteCourse";
import { formatTime } from "../hooks/useFetchCourses";
import { CiFileOn } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import FetchingError from "./FetchingError";
import { useToggleCoursePublish } from "../hooks/useToggleCoursePublish";
import { FaExternalLinkAlt } from "react-icons/fa";

import { useUploadDocuments } from "../hooks/useUploadDocuments";
import { useDeleteDocument } from "../hooks/useDeleteDocument";
import FileTypeIcon from "./loaders/FileTypeIcon";
import { RxCross2 } from "react-icons/rx";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { RenderPageNumbers } from "./RenderPageNumbers";
import { AdminFileDownload, AdminImage, AdminVideoLink } from "../utils/AdminFileComponents";

const testHeaders = [
  "Test Name",
  "Questions",
  "Start Time",
  "Duration",
  "Actions",
];

const DeleteCourseInfo = [
  "All course materials (documents & thumbnail)",
  "The course video file",
  "All tests and their questions",
  "All certificates and test results",
];

//sample document names
const Documents = [
  "Document 1",
  "Document 2",
  "Document 3",
  "Document 4",
  "Document 5",
];

const EditCourse: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const testsPerPage = 5;
  const { NotificationComponent, triggerNotification } = useNotification();
  const [isCoursePublished, setIsCoursePublished] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  );
  const location = useLocation();
  const state = location.state;
  useEffect(() => {
    if (state?.type && state?.message) {
      triggerNotification({
        type: state.type,
        message: state.message,
        duration: 3000,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [state, triggerNotification, navigate, location.pathname]);

  const {
    tests = [],
    total,
    loading,
    error,
    refetch: refetchTests,
  } = useFetchTests(courseId!, currentPage, testsPerPage);
  const limit = 5;
  const totalPages = Math.ceil(total / limit);

  const { togglePublish } = useToggleCoursePublish(Number(courseId!));

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
    progress,
  } = useAdminUpdateCourseBasic(Number(courseId!));

  const {
    deleteCourse,
    loading: deletingCourse,
    error: deleteCourseError,
  } = useAdminDeleteCourse(Number(courseId!));

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteDocumentModalOpen, setIsDeleteDocumentModalOpen] =
    useState(false);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // documents fields
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [localDocuments, setLocalDocuments] = useState<any[]>([]);

  // documents hook
  const {
    uploadDocuments,
    loading: uploading,
    error: uploadError,
    progress: uploadProgress,
  } = useUploadDocuments(Number(courseId!));
  const {
    deleteDocument,
    loading: deletingDoc,
    error: deleteDocError,
  } = useDeleteDocument();

  // File selection handler
  const handleFileSelection = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Add file type validation
      const allowedTypes = [
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".ppt",
        ".pptx",
        ".pdf",
        ".txt",
        ".rtf",
        ".odt",
        ".ods",
        ".odp",
        ".md",
        ".csv",
      ];

      const invalidFiles = newFiles.filter((file) => {
        const extension = file.name
          .toLowerCase()
          .substring(file.name.lastIndexOf("."));
        return !allowedTypes.includes(extension);
      });

      if (invalidFiles.length > 0) {
        // invalid files
        console.log(
          `unsuported file types selected only allowed files type is ${allowedTypes}`
        );
        triggerNotification({
          type: "error",
          message: `Unsuported file type(s)`,
          duration: 3000,
        });
        return;
      }

      setSelectedFiles(newFiles);
    }
  };

  // Remove selected file
  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload documents handler
  const handleUploadDocuments = async () => {
    if (selectedFiles.length === 0) {
      triggerNotification({
        type: "error",
        message: "Please select files to upload",
        duration: 3000,
      });
      return;
    }

    try {
      const result = await uploadDocuments(selectedFiles);

      // Refresh the course data to get updated documents
      await refetchBasic();

      setIsUploadModalOpen(false);
      setSelectedFiles([]);

      triggerNotification({
        type: "success",
        message: result.message,
        duration: 3000,
      });
    } catch (error) {
      triggerNotification({
        type: "error",
        message: uploadError || "Failed to upload documents",
        duration: 3000,
      });
    }
  };

  // Delete document handler
  const handleDeleteDocument = async (documentId: number, fileName: string) => {
    setDocumentToDelete({ id: documentId, name: fileName });
  };

  // Confirm delete document
  const handleConfirmDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      await deleteDocument(documentToDelete.id);

      // Instead of updating localDocuments, refresh the course data
      await refetchBasic();

      setDocumentToDelete(null);

      triggerNotification({
        type: "success",
        message: "Document deleted successfully",
        duration: 3000,
      });
    } catch (error) {
      triggerNotification({
        type: "error",
        message: deleteDocError || "Failed to delete document",
        duration: 3000,
      });
    }
  };

  // local copy to sync front-end after delete
  const [localTests, setLocalTests] = useState<TestEntry[]>([]);
  useEffect(() => {
    setLocalTests(tests);
  }, [tests]);

  const [modalTestId, setModalTestId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"Description" | "Documents">(
    "Description"
  );
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
    setIsCoursePublished(basicCourse.liveStatus ?? false);
  }, [basicCourse]);
  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) error = "Name is required";
      else if (value.length < 6) error = "Name must be at least 6 characters";
      else if (value.length > 100)
        error = "Name must be less than 100 characters";
    }

    if (name === "description") {
      if (!value.trim()) error = "Description is required";
      else if (value.length < 10)
        error = "Description must be at least 10 characters";
      else if (value.length > 1000)
        error = "Description must be less than 1000 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };
  const handleBasicChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBasicForm((f) => ({ ...f, [name]: value }));
    validateField(name, value);
  };

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name and description
    validateField("name", basicForm.name);
    validateField("description", basicForm.description);
    if (errors.name || errors.description) return;
    try {
      await updateBasic(basicForm, thumbnailFile, videoFile);
      // re-fetch
      refetchBasic();

      setIsBasicModalOpen(false);
      setThumbnailFile(null);
      setVideoFile(null);
      triggerNotification({
        type: "success",
        message: t("Course updated"),
        duration: 3000,
      });
    } catch {
      triggerNotification({
        type: "error",
        message: updateError ?? t("Update failed"),
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

  const handleCreateTest = () => {
    navigate(`/admin/edit-course/${courseId}/create-test`, {
      state: { courseDuration: basicCourse?.duration },
    });
  };

  const handleDeleteClick = (id: number) => {
    setModalTestId(id);
  };

  const handleConfirmDelete = async () => {
    if (modalTestId === null) return;
    try {
      await deleteTest(modalTestId);
      // setLocalTests((prev) => prev.filter((t) => t.id !== modalTestId));
      // setModalTestId(null);
      await refetchTests();
      triggerNotification({
        type: "success",
        message: t("Test deleted"),
        duration: 3000,
      });
    } catch {
      triggerNotification({
        type: "error",
        message: t("Failed to delete test"),
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
    navigate(`/admin/edit-course/${courseId}/edit-test/${testId}`, {
      state: { courseDuration: basicCourse?.duration },
    });
  };

  // When user picks a new thumbnail
  const handleThumbnailFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const fileName = file.name.toLowerCase();
      const allowedExtensions = [".png", ".jpg", ".jpeg"];
      const hasValidExtension = allowedExtensions.some((ext) =>
        fileName.endsWith(ext)
      );

      if (!hasValidExtension) {
        // Clear the input
        e.target.value = "";
        triggerNotification({
          type: "error",
          message: t("Only PNG and JPEG image files are allowed"),
          duration: 3000,
        });
        return;
      }
      setThumbnailFile(file);
    }
  };

  // When user picks a new video, load metadata to get duration
  const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validVideoTypes = [
      // Common web formats
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/mkv",
      "video/m4v",
      "video/3gp",
      "video/3g2",
      // iOS specific formats
      "video/quicktime",
      // Additional formats
      "video/x-msvideo", // .avi
      "video/x-ms-wmv", // .wmv
      "video/x-flv", // .flv
      "video/x-matroska", // .mkv
    ];
    if (!validVideoTypes.includes(file.type)) {
      triggerNotification({
        type: "error",
        message: "Please select a valid video file",
        duration: 3000,
      });
      return;
    }
    setVideoFile(file);

    // create a temporary video element to get its duration
    const url = URL.createObjectURL(file);
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.src = url;
    vid.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const secs = Math.floor(vid.duration);

      setBasicForm((f) => ({ ...f, duration: secs.toString() }));
    };
  };

  const handleCoursePublish = async () => {
    const desired = !isCoursePublished;

    // 1) Optimistically flip it in the UI
    // setIsCoursePublished(desired);

    try {
      // 2) Push it to the server
      const updated = await togglePublish(desired);

      // 3) **Confirm** with whatever the server actually saved
      console.log(updated);
      if (updated.id) {
        setIsCoursePublished(updated.liveStatus);
        triggerNotification({
          type: "success",
          message: `Course ${updated.liveStatus ? "published" : "unpublished"}`,
        });
      }
    } catch {
      // 4) On error, revert the toggle
      setIsCoursePublished((prev) => !prev);
      triggerNotification({
        type: "error",
        message: `Failed to ${desired ? "publish" : "unpublish"} course`,
      });
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await deleteCourse();
      setIsDeleteModalOpen(false);
      navigate("/admin/all-courses", {
        state: {
          type: "success",
          message: t("Course deleted"),
        },
      });
    } catch {
      triggerNotification({
        type: "error",
        message: deleteCourseError ?? t("Failed to delete course"),
        duration: 3000,
      });
    }
  };

  if (error || basicInfoError) {
    return <FetchingError />;
  }

  return (
    <section className="space-y-6 p-2 md:p-4 lg:p-8">
      {/* Breadcrumbs */}
      <button
        onClick={() => navigate("/admin/all-courses")}
        className="underline capitalize underline-offset-2 cursor-pointer text-sm text-primary font-medium"
        title={t("all Courses")}
      >
        &lt; {t("all Courses")}
      </button>
      <div className="w-full flex justify-end gap-2 items-center">
        <span className="text-primary">
          {t(isCoursePublished ? "Published" : "Unpublished")}
        </span>

        <div
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
            isCoursePublished ? "bg-green-800" : "bg-red-500"
          }  rounded-full relative cursor-pointer`}
          onClick={handleCoursePublish}
        >
          <span
            className={`
          inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200
          ${isCoursePublished ? "translate-x-5" : "translate-x-0"}
        `}
          ></span>
        </div>
      </div>

      {basicInfoLoad ? (
        <Spinner className="mx-auto" />
      ) : basicInfoError ? (
        <p className="text-red-500">{basicInfoError}</p>
      ) : (
        basicCourse && (
          <div className="bg-white shadow-md p-3 sm:p-6 relative mb-6 flex flex-col gap-5">
            <h3 className="text-xl font-semibold mb-4 text-text-dark">
              {t("Course Details")}
            </h3>
            <button
              onClick={() => setIsBasicModalOpen(true)}
              className="absolute top-4 right-4 text-text-light-2 hover:text-text-dark  transition delay-100 cursor-pointer"
            >
              <TbEdit className="w-6 h-6" title="Edit Course" />
            </button>

            <div className="flex flex-col md:flex-row gap-5">
              {/* <img
                // src={`${API_BASE}/uploads/courses/${basicCourse.thumbnail}`}
                // src={`${API_BASE}/files/thumbnail/course/${basicCourse.id}`}
                src={`${API_BASE}/files/thumbnail/course/${basicCourse.id}?v=${basicCourse.thumbnail}`}
                alt="Thumbnail"
                className="w-88 aspect-video h-56"
              /> */}
              <AdminImage
                courseId={basicCourse.id}
                className="w-88 aspect-video h-56"
                alt="Thumbnail"
              />
              <div className="flex flex-col justify-center gap-2">
                <p className="flex flex-col">
                  <span className="font-medium text-lg capitalize">
                    {t("name")}:
                  </span>{" "}
                  <span className="text-text-light-2 max-w-lg">
                    {basicCourse.name}
                  </span>
                </p>
                <p className="flex flex-col">
                  <span className="font-medium text-lg">{t("Duration")}:</span>{" "}
                  <span className="text-text-light-2">
                    {basicCourse.duration != null
                      ? `${formatTime(basicCourse.duration)}`
                      : "—"}
                  </span>
                </p>
                <p>
                  {basicCourse.videoUrl ? (
                    <a
                      rel="noopener noreferrer"
                      className="text-primary hover:underline underline-offset-2 text-lg font-medium"
                      // href={`${API_BASE}/uploads/courses/${basicCourse.videoUrl}`}
                       href={`${API_BASE}/files/admin/video/course/${basicCourse.id}`}
                      target="_blank"
                    >
                      {t("View Video")}
                    </a>

                    // <AdminVideoLink courseId={basicCourse.id}>
                    //   {t("View Video")}
                    // </AdminVideoLink>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>
            <div className="border-b border-inputBorder mb-6">
              <ul className="flex space-x-4">
                <li
                  onClick={() => setActiveTab("Description")}
                  className={`pb-2 cursor-pointer ${
                    activeTab === "Description"
                      ? "border-b-2 text-primary"
                      : "text-gray-500"
                  }`}
                >
                  {t("Description")}
                </li>
                <li
                  onClick={() => setActiveTab("Documents")}
                  className={`pb-2 cursor-pointer ${
                    activeTab === "Documents"
                      ? "border-b-2 text-primary"
                      : "text-gray-500"
                  }`}
                >
                  {t("Documents")}
                </li>
              </ul>
            </div>
            {activeTab == "Description" && (
              <p className="text-text-light-2">{basicCourse.description}</p>
            )}
            {/* ================================================================ */}

            {activeTab == "Documents" && (
              <div className="space-y-2">
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 bg-primary text-white hover:bg-indigo-700 transition delay-100 cursor-pointer"
                  >
                    {t("Upload Documents")}
                  </button>
                </div>
                {basicCourse.documents?.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {/* <FaFilePdf className="w-6 h-6 fill-[#EF5350]" /> */}
                    <FileTypeIcon fileName={doc.fileName} className="w-6 h-6" />
                    <div className="flex justify-between items-center gap-2 w-full">
                      <span className="text-text-light">{doc.fileName}</span>
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          onClick={() =>
                            handleDeleteDocument(doc.id, doc.fileName)
                          }
                          className="text-primary hover:underline font-medium cursor-pointer"
                          disabled={deletingDoc}
                        >
                          <RiDeleteBinLine
                            className={`w-5 h-5 cursor-pointer ${
                              deletingDoc ? "text-gray-400" : "text-red-400"
                            }`}
                          />
                        </button>
                        {/* <a
                          // href={`${API_BASE}/uploads/courses/${doc.fileName}`}
                          href={`${API_BASE}/files/document/${doc.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaExternalLinkAlt className="w-4 h-4 fill-primary cursor-pointer" />
                        </a> */}

                        <AdminFileDownload
                          fileId={doc.id}
                          fileName={doc.fileName}
                          type="document"
                        >
                          <FaExternalLinkAlt className="w-4 h-4 fill-primary cursor-pointer" />
                        </AdminFileDownload>
                      </div>
                    </div>
                  </div>
                ))}
                {basicCourse.documents?.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    {t("No documents uploaded yet")}.
                  </p>
                )}
              </div>
            )}

            {isUploadModalOpen && (
              <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
                <div className="bg-white shadow-lg p-6 w-[90%] max-w-md">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("Upload Documents")}
                  </h3>

                  <div className="space-y-4 w-full">
                    <div className="w-full">
                      <label
                        htmlFor="fileUpload"
                        className="px-2 sm:px-4 py-3 w-full block focus:outline-none ring-1 ring-primary cursor-pointer"
                      >
                        {t("Choose Files")}
                      </label>
                      <input
                        type="file"
                        id="fileUpload"
                        multiple
                        onChange={handleFileSelection}
                        className="w-full px-3 py-2 border border-inputBorder focus:outline-none focus:ring focus:ring-primary hidden"
                      />
                      <p className="text-sm text-text-light-2 mt-2">
                        Supported formats: .doc, .docx, .xls, .xlsx, .ppt,
                        .pptx, .pdf, .txt, .rtf, .odt, .ods, .odp, .md, .csv
                      </p>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          {t("Selected Files")}:
                        </p>
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm truncate">
                              {file.name}
                            </span>
                            <button
                              onClick={() => removeSelectedFile(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <MdCancel className="w-5 h-5 cursor-pointer" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {uploading && (
                      <div className="space-y-2">
                        <p className="text-sm">
                          {t("Uploading")}... {uploadProgress}%
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {uploadError && (
                      <p className="text-red-500 text-sm">{uploadError}</p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        setIsUploadModalOpen(false);
                        setSelectedFiles([]);
                      }}
                      className="px-4 py-2 border border-inputBorder cursor-pointer"
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      onClick={handleUploadDocuments}
                      disabled={uploading || selectedFiles.length === 0}
                      className="px-4 py-2 bg-primary text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                    >
                      {uploading ? t("Uploading") + "..." : t("Upload")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Document Confirmation Modal */}
            {documentToDelete && (
              <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
                <div className="bg-white shadow-lg p-6 w-[90%] max-w-md">
                  <h3 className="text-lg font-semibold">
                    {t("Confirm Delete")}
                  </h3>
                  <p className="mt-4">
                    {t("Are you sure you want to delete")} "
                    {documentToDelete.name}"?
                  </p>
                  {deleteDocError && (
                    <p className="text-red-500 mt-2">{deleteDocError}</p>
                  )}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => setDocumentToDelete(null)}
                      className="px-4 py-2 border border-inputBorder cursor-pointer"
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      onClick={handleConfirmDeleteDocument}
                      disabled={deletingDoc}
                      className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                    >
                      {deletingDoc ? `${t("Deleting")}…` : t("Delete")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
          </div>
        )
      )}

      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          {t("Attached Tests")}
        </h2>
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
            {searchTerm && (
              <RxCross2
                className="h-5 w-5 text-text-light cursor-pointer right-8 absolute"
                onClick={() => setSearchTerm("")}
              />
            )}
          </div>
          <button
            onClick={handleCreateTest}
            className="inline-block capitalize text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150 w-fit"
          >
            {t("create new test")}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center w-full">
          <Spinner className="w-6 h-6" /> <p>Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="w-full overflow-x-auto custom-scrollbar pb-2">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary text-white text-[16px] 2xl:text-xl text-center text-nowrap">
              <tr>
                {testHeaders.map((header, index) => (
                  <th className="px-2 py-3 font-medium" key={index}>
                    {t(header)}
                  </th>
                ))}
                {/* <th className="px-2 py-3 text-center font-medium">
                  Publish Test
                </th> */}
              </tr>
            </thead>
            <tbody
              className="bg-white text-[#808080] text-sm 2xl:text-xl text-center"
              style={{ border: "1px solid #AAA9A9" }}
            >
              {tests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center">
                    {t("No tests created yet.")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 italic text-text-light text-center"
                  >
                    {t("Test with the name")} "{searchTerm}" {t("not found")}.
                  </td>
                </tr>
              ) : (
                tests.map((test: TestEntry) => (
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
                      {test.startTime} sec
                    </td>
                    <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{
                        borderWidth: "0px 1px 1px 0px",
                        borderStyle: "solid",
                        borderColor: "#AAA9A9",
                      }}
                    >
                      {test.duration} sec
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
                    {/* <td
                      className="px-2 py-4 whitespace-nowrap"
                      style={{
                        borderWidth: "0px 1px 1px 0px",
                        borderStyle: "solid",
                        borderColor: "#AAA9A9",
                      }}
                    >
                      <div className="flex justify-center">
                        <div className="w-12 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                          <span
                            className={`absolute top-0 left-0 w-5 h-5 rounded-full transition-transform duration-300 ${
                              isTestPublished
                                ? "bg-primary translate-x-7"
                                : "bg-gray-500 translate-x-0"
                            }`}
                          ></span>
                        </div>
                      </div>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* pagination */}
      {tests.length > 0 && (
        <div
          className="flex items-center justify-center p-4 space-x-2"
          role="pagination"
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-2 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
            title="Previous"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <RenderPageNumbers
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            page={currentPage}
          />
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-2 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
            title="Next"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      {/* Delete course button  */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={deletingCourse}
          className="px-4 py-2 sm:py-3 bg-red-600 text-white hover:bg-red-500 transition delay-100 cursor-pointer"
        >
          {t("Delete Course")}
        </button>
      </div>
      {/* Delete Confirmation Modal FOR DOCUMENT */}
      {/* {isDeleteDocumentModalOpen && (
        <div className="fixed inset-0 bg-black/10  flex items-center justify-center z-50">
          <div className="bg-white shadow-lg p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold">{t("Confirm Delete")}</h3>
            <p className="mt-4">
              {t("Are you sure you want to delete this document?")}
            </p>
            {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleDeleteDocument}
                className="px-4 py-2 border border-inputBorder cursor-pointer"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? `${t("Deleting")}…` : t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )} */}
      {/* Delete Confirmation Modal FOR TEST */}
      {modalTestId !== null && (
        <div className="fixed inset-0 bg-black/10  flex items-center justify-center z-50">
          <div className="bg-white shadow-lg p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold">{t("Confirm Delete")}</h3>
            <p className="mt-4">
              {t("Are you sure you want to delete this test?")}
            </p>
            {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-inputBorder cursor-pointer"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? `${t("Deleting")}…` : t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Basic COurse Info Editing MOdal  */}

      {isBasicModalOpen && (
        <div className="fixed inset-0 h-screen bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white m-3 shadow-md p-3 sm:p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4 text-text-dark">
              Edit Course Details
            </h3>
            <form onSubmit={handleBasicSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("name")}
                </label>
                <div className="flex flex-col">
                  <input
                    name="name"
                    value={basicForm.name}
                    onChange={handleBasicChange}
                    className="px-4 py-2 sm:py-3 w-full border border-inputBorder focus:border-0 focus:outline-none focus:ring focus:ring-primary"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <div className="flex flex-col">
                  <textarea
                    name="description"
                    value={basicForm.description}
                    onChange={handleBasicChange}
                    rows={3}
                    className="px-4 py-2 sm:py-3 w-full border border-inputBorder focus:border-0 focus:outline-none focus:ring focus:ring-primary"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                  <p className="text-sm text-text-light">
                    {basicForm.description.length}/1000
                  </p>
                </div>
              </div>
              {/* Thumbnail */}
              <div className="flex flex-col md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  {t("Thumbnail")}
                </label>

                {!thumbnailFile ? (
                  <div className="flex flex-col items-start space-y-2">
                    <label className="inline-block capitalize px-4 py-2 bg-primary text-white cursor-pointer hover:bg-indigo-700 text-sm">
                      {t("Choose Thumbnail")}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex gap-4 items-center">
                    <CiFileOn className="w-4 h-4 shrink-0" />
                    <span className="truncate" title={thumbnailFile.name}>
                      {" "}
                      {thumbnailFile.name}
                    </span>
                    <MdCancel
                      title="Remove File"
                      className="cursor-pointer w-4 h-4 shrink-0"
                      onClick={() => setThumbnailFile(null)}
                    />
                  </div>
                )}
              </div>

              {/* Video */}
              <div className="flex flex-col md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  {t("Video")}
                </label>

                {!videoFile ? (
                  <div className="flex flex-col items-start space-y-2">
                    <label className="inline-block capitalize px-4 py-2 bg-primary text-white cursor-pointer hover:bg-indigo-700 text-sm">
                      {t("Choose Video")}
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
                    <MdCancel
                      title="Remove Video"
                      className="cursor-pointer"
                      onClick={() => setVideoFile(null)}
                    />
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
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 sm:py-3 bg-primary text-white hover:bg-indigo-700 transition delay-100 cursor-pointer"
                >
                  {updating ? `${t("Updating")}...` : `${t("Update")}`}
                </button>
              </div>

              {updating && (
                <>
                  <span>
                    {t("Updating")}... {progress}%
                  </span>
                  <div className="w-full h-2 mt-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* course Deletion moodal  */}

      {isDeleteModalOpen && (
        <div className="fixed h-screen inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg m-4 p-4 sm:p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              {t("Warning")}!
            </h3>
            <p className="mb-4 text-gray-800">
              {t("Deleting this course will permanently remove")}:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
              {DeleteCourseInfo.map((info, index) => (
                <li key={index}>{t(String(info))}</li>
              ))}
            </ul>
            {deleteCourseError && (
              <p className="text-red-500 mb-2">{deleteCourseError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-inputBorder text-text-light-2 cursor-pointer"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleDeleteCourse}
                disabled={deletingCourse}
                className="px-4 py-2 bg-red-600 text-white cursor-pointer hover:bg-red-700 transition duration-100 disabled:opacity-50"
              >
                {deletingCourse ? `${t("Deleting")}…` : t("Yes, delete course")}
              </button>
            </div>
          </div>
        </div>
      )}
      {NotificationComponent}
    </section>
  );
};

export default EditCourse;
