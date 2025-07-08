import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { BiPlus, BiSearch } from "react-icons/bi";
import { MdCancel, MdUpload } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import { useCreateCourse } from "../hooks/useCreateCourse";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useTranslation } from "react-i18next";
import { set, useForm } from "react-hook-form";
import Spinner from "./Spinner";
import { FaAngleDown } from "react-icons/fa6";
import { CiFileOn } from "react-icons/ci";

interface TestEntry {
  id: number;
  testName: string;
  courseId: string;
  questions: number;
  duration: string;
  videoThumbnail: string;
}

export interface CreateCourseDto {
  name: string;
  description: string;
  video: File | null;
  thumbnail: File | null;
  documents: File[];
  duration: number | null;
  category: string;
}

interface CreateCourseProps {
  onCreateTest: () => void;
}
const CreateCourse: React.FC<CreateCourseProps> = ({ onCreateTest }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { createCourse, progress, loading, error } = useCreateCourse();
  const {
    categories,
    loading: catLoading,
    error: catError,
    refetch: reloadCategories,
  } = useFetchCategories();
  const {
    createCategory,
    loading: creatingCat,
    error: catCreateError,
  } = useCreateCategory();

  // Form Fields
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);

  // Duration
  const [duration, setDuration] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseDto>({ defaultValues: {
    name: "",
    description: "",
  },});
  

  // const [testSearch, setTestSearch] = useState("");
  // const [searchTerm, setSearchTerm] = useState<string>("");
  // const [currentPage, setCurrentPage] = useState(1);

  // Category Selection
  // const [selectedCategory , setSelectedCategory] = useState<string>("")
  const [addingCat, setAddingCat] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // useEffect(() => {
  //   if(categories.length && !selectedCategory) {
  //     setSelectedCategory(categories[0])
  //   }
  // }, [categories])

useEffect(() => {
  if (!categories.length) {
    setSelectedCategoryId(undefined);
  }
}, [categories]);


  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    try {
      const newCat = await createCategory(trimmed);
      setNewCategory("");
      setAddingCat(false);
      reloadCategories();
      setSelectedCategoryId(newCat.id);
    } catch (error) {
      // create a ... what ever  just do something   !!!
    }
  };

  // handle video change with meta data
  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    // if (e.target.files?.[0]) {
    //   setVideo(e.target.files[0])
    // }
    const file = e.target.files?.[0] ?? null;
    if(file) setVideoError(null);
    setVideo(file);
    setDuration(null);

    if (file) {
      const url = URL.createObjectURL(file);
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.src = url;
      vid.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        setDuration(Math.floor(vid.duration)); // in seconds
      };
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files){ setThumbnail(e.target.files[0])
      setThumbnailError(null);
    }
  };

const handleDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const newFiles = Array.from(e.target.files);
    setDocuments((prev) => [...prev, ...newFiles]);
  }
};

const handleRemoveDoc = (index: number) => {
  setDocuments((prev) => prev.filter((_, i) => i !== index));
};

  const onSubmit = async (data: CreateCourseDto) => {
  setVideoError(null);
  setThumbnailError(null);
  setCategoryError(null);

  if (!video) {
    setVideoError("Please select a video file");
  }

  if (!thumbnail) {
    setThumbnailError("Please select a thumbnail image");
  }

   if (selectedCategoryId === undefined) {
    setCategoryError("Please select a category");
  }

  if(videoError || thumbnailError || categoryError) return;
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);

  if (selectedCategoryId !== undefined) {
    formData.append("categoryId", String(selectedCategoryId));
  } else {
    return;
  }

  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }

  if (video) {
    formData.append("video", video);
    if (duration !== null) {
      formData.append("duration", String(duration));
    }
  }

  documents.forEach((file) => {
    formData.append("documents", file);
  });

  console.log([...formData.entries()]);

  try {
    const savedCourse = await createCourse(formData);
    navigate(`/admin/edit-course/${savedCourse.id}`);
  } catch {
    // Handle error gracefully
  }
};


  // const handleNavigate = (id: string) => {
  //   navigate(`/admin/edit-course/${id}`)
  // }

  return (
    <div className="min-h-screen flex bg-white">
      <main className="flex-1 px-2 sm:px-8 pt-4 pb-10 overflow-auto">
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          aria-label="Create Course Form"
        >
          {/* Basic Course Information */}
          <section className="space-y-5">
            <h2 className="text-lg 2xl:text-2xl capitalize font-bold text-text-dark mb-3 sm:mb-6">
              {t("basic course information")}
            </h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm text-text-light-2 mb-1 capitalize">
                  {t("name")}
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required", minLength: { value: 4, message: "Name must be at least 4 characters" } })}
                  placeholder={t("enter course name")}
                  className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-text-light-2 mb-1 capitalize">
                  {t("description")}
                </label>
                <textarea
                   {...register("description", { required: "Description is required" })}
                  placeholder={t("enter course description")}
                  rows={4}
                  className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* category dropdown & add */}
              <div className="flex flex-col">
                <label>{t("category")}</label>
                {catLoading ? (
                  <p className="w-[200px] text-center"><Spinner className="w-5 h-5"/></p>
                ) : catError ? (
                  <p className="text-red-500">Load error: {catError}</p>
                ) : (
                  // <div className="flex space-x-2 items-center">
                  //   <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                  //     className="border px-3 py-2 focus:ring-primary" required>
                  //     {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  //   </select>
                  //   <button type="button" onClick={() => setAddingCat(!addingCat)}
                  //     className="text-primary hover:underline">+ Add</button>
                  // </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    {/* <select
                      value={selectedCategoryId ?? ""}
                      onChange={(e) =>
                        setSelectedCategoryId(Number(e.target.value))
                      }
                      className="border border-inputBorder px-3 py-2 focus:border-0 focus:ring-1 focus:ring-primary cursor-pointer capitalize category-select"
                      required
                    >
                      <option value="" disabled>
                        -- Select category --
                      </option>
                      
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    
                    </select> */}
                    <div className="relative w-[220px]">
      <button
        type="button"
        className="w-full border border-inputBorder px-3 py-2 focus:border-0 focus:ring-1 focus:ring-primary capitalize flex items-center justify-between text-left text-text-light cursor-pointer"
        onClick={() => setIsCategoryOpen((prev) => !prev)}
      >
        <span className="capitalize">
          {selectedCategoryId ? categories.find((cat) => cat.id === selectedCategoryId)?.name : "Select Category"}
        </span>
        <FaAngleDown className={`ml-2 cusor-pointer transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
      </button>

      {isCategoryOpen && (
        <div className="absolute mt-[2px] top-full left-0 w-full bg-white border border-inputBorder shadow-md z-10 max-h-60 overflow-y-auto custom-scrollbar3 pr-[2px]">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`px-4 py-2 hover:bg-gray-200 text-text-light cursor-pointer capitalize ${selectedCategoryId === cat.id ? "bg-primary text-white hover:bg-gray-200 hover:text-text-light" : ""}`}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                setIsCategoryOpen(false);
                setCategoryError(null);
              }}
            >
              {cat.name}
            </div>
          ))}
        </div>
      )}
    </div>

                    
                        <button
                          type="button"
                          onClick={() => setAddingCat(!addingCat)}
                          className="text-primary hover:underline underline-offset-2 cursor-pointer uppercase items-center flex"
                        >
                          <BiPlus className="inline-block mr-1" />{t("add category")}
                        </button>
                    

                    {addingCat && (
                      <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
                        <div className="bg-white p-6 shadow-lg w-[90vw] sm:w-100 space-y-3">
                          <h2 className="text-lg font-semibold">
                            {t("add new category")}
                          </h2>
                          <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder={` ${t("category")} ${t("name")}`}
                            className="w-full border border-inputBorder px-2 py-1 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={() => setAddingCat(false)}
                              className="px-4 py-2 w-[110px] border border-inputBorder cursor-pointer"
                            >
                              {t("cancel")}
                            </button>
                            <button
                              className="px-4 py-2 w-[110px] bg-primary text-white disabled:opacity-70 cursor-pointer"
                              onClick={handleAddCategory}
                              disabled={creatingCat}
                            >
                              {creatingCat ? "Adding…" : t("add")}
                            </button>
                          </div>
                          {catCreateError && (
                            <p className="text-red-500 mt-2">
                              {catCreateError}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* {addingCat && (
                  <div className="mt-2 flex space-x-2">
                    <input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="border px-3 py-2 flex-1"
                      placeholder="New category"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-primary text-white disabled:opacity-50"
                      disabled={creatingCat}
                    >
                      {creatingCat ? "Adding…" : t("add")}
                    </button>
                  </div>
                )} */}
                {categoryError && (
                  <p className="text-red-500 text-sm mt-1">{categoryError}</p>
                )}
              </div>

              {/* file uploads */}
             <div className="flex flex-col md:col-span-2">
  <label className="mb-1 font-medium text-sm text-text-light-2">
    {t("documents")} ({t("optional")})
  </label>

  {!documents || documents.length === 0 ? (
    <div className="flex flex-col items-start space-y-2">
      <p className="text-sm text-gray-500">{t("No files added")}</p>
      <label className="inline-block capitalize px-4 py-2 bg-primary text-white cursor-pointer hover:bg-indigo-700 text-sm">
        {t("choose files")}
        <input
          type="file"
          multiple
          onChange={handleDocsChange}
          className="hidden"
        />
      </label>
    </div>
  ) : (
    <div className="space-y-2">
      <ul className="list-disc list-inside text-sm text-gray-700">
        {documents.map((doc, index) => (
          <ul key={index} className="flex gap-1 items-center">
         <CiFileOn />   {doc.name} ({(doc.size / 1024).toFixed(1)} KB) <MdCancel title="Remove File" className="cursor-pointer" onClick={() => handleRemoveDoc(index)} /> 
          </ul>
        ))}
      </ul>
      <label className="inline-block px-4 py-2 bg-primary text-white rounded cursor-pointer hover:bg-indigo-700 text-sm">
        {t("choose more files")}
        <input
          type="file"
          multiple
          onChange={handleDocsChange}
          className="hidden"
        />
      </label>
    </div>
  )}
</div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Add Video */}
                <div className="flex flex-col">
                  <label className="text-sm text-text-light-2 mb-1">
                    {t("add video")}
                  </label>
                  <label className="flex items-center justify-center h-32 border border-inputBorder cursor-pointer hover:border-primary">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoChange}
                    />
                    <span className="text-[#59BDE2] flex items-center gap-4">
                      <img src="/VideoUpload.svg" alt="" />
                      {video ? video.name : t("select file to upload")}
                    </span>
                  </label>
                  {duration !== null && (
                    <p className="text-xs text-text-light-2 mt-2">
                      Video length: {Math.floor(duration / 60)}min{" "}
                      {duration % 60}s
                    </p>
                  )}
                  <p className="text-xs text-text-light-2 mt-2">
                    {t(
                      "Select single video from your local storage * Max. upto 5Gb per video"
                    )}
                  </p>
                   {videoError && (
                  <p className="text-red-500 text-sm mt-1">{videoError}</p>
                )}
                </div>
                {/* Add Thumbnail */}
                <div className="flex flex-col">
                  <label className="text-sm text-text-light-2 mb-1">
                    {t("add thumbnail image")}
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
                      {thumbnail ? thumbnail.name : t("select file to upload")}
                    </span>
                  </label>
                  <p className="text-xs text-text-light-2 mt-2">
                    {t(
                      "Recommended Image Size: 800px x 600px, PNG or JPEG file"
                    )}
                  </p>
                  {thumbnailError && (
                  <p className="text-red-500 text-sm mt-1">{thumbnailError}</p>
                )}
                </div>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="inline-block capitalize text-sm sm:text-[16px] px-5 py-2 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
            >
              {loading ? `Saving...${progress}%` : t("save course")}
            </button>
          </div>

          {/* Upload progress and Errors  */}

          {loading && (
            <progress className=" w-full h-2 mt-2 " value={progress} max={100} />
          )}
          {error && <p className=" text-red-500 mt-2"> {error}</p>}
        </form>
      </main>
    </div>
  );
};

export default CreateCourse;
