import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { BiSearch } from "react-icons/bi";
import { MdUpload } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import { useCreateCourse } from "../hooks/useCreateCourse";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useTranslation } from "react-i18next";

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [documents, setDocuments] = useState<FileList | null>(null)

  // Duration
  const [duration, setDuration] = useState<number | null>(null) 



  // const [testSearch, setTestSearch] = useState("");
  // const [searchTerm, setSearchTerm] = useState<string>("");
  // const [currentPage, setCurrentPage] = useState(1);

  // Category Selection
  // const [selectedCategory , setSelectedCategory] = useState<string>("")
  const [addingCat, setAddingCat] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();

  // useEffect(() => {
  //   if(categories.length && !selectedCategory) {
  //     setSelectedCategory(categories[0])
  //   }
  // }, [categories])

  useEffect(() => {
    if (categories.length && selectedCategoryId === undefined) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

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
  const file = e.target.files?.[0] ?? null
  setVideo(file)
  setDuration(null)

  if(file) {
    const url = URL.createObjectURL(file);
    const vid = document.createElement("video")
    vid.preload = 'metadata'
    vid.src = url
    vid.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      setDuration(Math.floor(vid.duration))  // in seconds
    }
  }
}

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setThumbnail(e.target.files[0]);
  };

  const handleDocsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setDocuments(e.target.files);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    // formData.append("categoryId", selectedCategory)
    if (selectedCategoryId !== undefined) {
      formData.append("categoryId", String(selectedCategoryId));
    } else {
      alert("no category selected");
      return;
    }
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    if (video) {
    formData.append('video', video)
    formData.append("duration",String(duration))
    }
    if (documents) {
      Array.from(documents).forEach((file) =>
        formData.append("documents", file)
      );
    }

    console.log([...formData.entries()]);

    try {
      const savedCourse = await createCourse(formData);
      navigate(`/admin/edit-course/${savedCourse.id}`);
    } catch {
      // error handled in hook or somethink like that ... figure it out
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("enter course name")}
                  className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-text-light-2 mb-1 capitalize">
                  {t("description")}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("enter course description")}
                  rows={4}
                  className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              {/* category dropdown & add */}
              <div className="flex flex-col">
                <label>{t("category")}</label>
                {catLoading ? (
                  <p>Loading categories...</p>
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
                  <div className="flex space-x-2 items-center">
                    <select
                      value={selectedCategoryId ?? ""}
                      onChange={(e) =>
                        setSelectedCategoryId(Number(e.target.value))
                      }
                      className="border px-3 py-2 focus:ring-primary cursor-pointer"
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
                    </select>
                    <button
                      type="button"
                      onClick={() => setAddingCat(!addingCat)}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      + {t("add")}
                    </button>
                  </div>
                )}
                {addingCat && (
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
                )}
                {catCreateError && (
                  <p className="text-red-500">{catCreateError}</p>
                )}
              </div>

              {/* file uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col md:col-span-2">
                  <label>
                    {t("documents")} ({t("optional")})
                  </label>
                  <input type="file" multiple onChange={handleDocsChange} />
                </div>
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
                      <img src="VideoUpload.svg" alt="" />
                      {video ? video.name : "Select File to Upload"}

                    </span>
                  </label>
                  {duration !== null && (
              <p className="text-xs text-text-light-2 mt-2">
                Video length: {Math.floor(duration / 60)}min{" "}
                {duration % 60}s
              </p>
            )}
                  <p className="text-xs text-text-light-2 mt-2">
                    Select single videos from your local storage * Max. upto
                    5Gb per video
                  </p>
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
                      {t("upload thumbnail image")}
                    </span>
                  </label>
                  <p className="text-xs text-text-light-2 mt-2">
                    {t(
                      "Recommended Image Size: 800px x 600px, PNG or JPEG file"
                    )}
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
              className="inline-block capitalize text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
            >
              {loading ? `Saving...${progress}%` : t("save course")}
            </button>
          </div>

          {/* Upload progress and Errors  */}

          {loading && (
            <progress className=" w-full mt-2 " value={progress} max={100} />
          )}
          {error && <p className=" text-red-500 mt-2"> {error}</p>}
        </form>
      </main>
    </div>
  );
};

export default CreateCourse;
