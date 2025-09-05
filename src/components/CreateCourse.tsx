import React, { useEffect, useState, type ChangeEvent } from "react";
import { BiPlus } from "react-icons/bi";
import { MdCancel, MdUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { useCreateCourse } from "../hooks/useCreateCourse";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import Spinner from "./loaders/Spinner";
import { FaAngleDown } from "react-icons/fa6";
import { CiFileOn } from "react-icons/ci";
import useNotification from "../hooks/useNotification";

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

const CreateCourse: React.FC<CreateCourseProps> = () => {
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
    setError: setCatCreateError,
  } = useCreateCategory();

  // Duration
  const [duration, setDuration] = useState<number | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
    setError,
    clearErrors,
  } = useForm<CreateCourseDto>({
    defaultValues: {
      name: "",
      description: "",
      video: null,
      thumbnail: null,
      documents: [],
      category: "",
    },
  });

  const [addingCat, setAddingCat] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const { triggerNotification, NotificationComponent } = useNotification();
  const [categoryLimitError, setCategoryLimitError] = useState<string | null>(null);

  // Watch form values
  const watchedVideo = watch("video");
  const watchedThumbnail = watch("thumbnail");
  const watchedDocuments = watch("documents");

  useEffect(() => {
    if (!categories.length) {
      setSelectedCategoryId(undefined);
    }
  }, [categories]);

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    const catLength = newCategory.length;
    
    if (catLength > 50) {
      setCategoryLimitError("Category name must be less than 50 characters");
      return;
    }
    if (catLength < 4) {
      setCategoryLimitError("Category name must be at least 4 characters");
      return;
    }

    try {
      const newCat = await createCategory(trimmed);
      triggerNotification({
        type: "success",
        message: t("Category created"),
        duration: 3000,
      });
      setNewCategory("");
      setAddingCat(false);
      reloadCategories();
      setSelectedCategoryId(newCat.id);
      setValue("category", newCat.id.toString());
      clearErrors("category");
    } catch (error) {
      triggerNotification({
        type: "error",
        message: t("Failed to create category"),
        duration: 3000,
      });
    }
  };

  // handle video change with meta data
  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue("video", file);
    if (file) {
      clearErrors("video");
    }
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

  // const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setValue("thumbnail", e.target.files[0]);
  //     clearErrors("thumbnail");
  //   }
  // };


//   const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
//   if (e.target.files && e.target.files[0]) {
//     const file = e.target.files[0];
    
//     // Validate file size 
//     const maxSizeInMB = 10; // 10MB limit
//     if (file.size > maxSizeInMB * 1024 * 1024) {
//       setError("thumbnail", {
//         type: "manual",
//         message: `File size must be less than ${maxSizeInMB}MB`
//       });
//       return;
//     }

//     // Validate image dimensions 
//     const img = new Image();
//     const objectUrl = URL.createObjectURL(file);
    
//     img.onload = () => {
//       URL.revokeObjectURL(objectUrl);
      
//       // Optional: Set maximum dimensions if needed
//       const maxWidth = 1200;
//       const maxHeight = 1200;
      
//       if (img.width > maxWidth || img.height > maxHeight) {
//         setError("thumbnail", {
//           type: "manual",
//           message: `Image dimensions must be less than ${maxWidth}x${maxHeight}px`
//         });
//         return;
//       }
      
//       // If validation passes, set the file
//       setValue("thumbnail", file);
//       clearErrors("thumbnail");
//     };
    
//     img.onerror = () => {
//       URL.revokeObjectURL(objectUrl);
//       setError("thumbnail", {
//         type: "manual",
//         message: "Invalid image file"
//       });
//     };
    
//     img.src = objectUrl;
//   }
// };


const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    
    // Get file extension
    const fileName = file.name.toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    // Validate file type by both MIME type and extension
    const allowedMimeTypes = ['image/png', 'image/jpeg'];
    const hasValidMimeType = allowedMimeTypes.includes(file.type);
    
    // Check both extension and MIME type for better security
    if (!hasValidExtension || !hasValidMimeType) {
      // Clear the input
      e.target.value = '';
      setError("thumbnail", {
        type: "manual",
        message: "Only PNG and JPEG image files are allowed"
      });
      return;
    }
    
    // Validate file size 
    const maxSizeInMB = 10;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      e.target.value = '';
      setError("thumbnail", {
        type: "manual",
        message: `File size must be less than ${maxSizeInMB}MB`
      });
      return;
    }

    // Validate that it's actually an image by trying to load it
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      // Set maximum dimensions if needed
      const maxWidth = 1200;
      const maxHeight = 1200;
      
      if (img.width > maxWidth || img.height > maxHeight) {
        setError("thumbnail", {
          type: "manual",
          message: `Image dimensions must be less than ${maxWidth}x${maxWidth}px. Current: ${img.width}x${img.height}px`
        });
        return;
      }
      
      // If all validation passes, set the file
      setValue("thumbnail", file);
      clearErrors("thumbnail");
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Clear the input
      e.target.value = '';
      setError("thumbnail", {
        type: "manual",
        message: "Selected file is not a valid image"
      });
    };
    
    img.src = objectUrl;
  }
};


  const handleDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const currentDocs = watchedDocuments || [];
      setValue("documents", [...currentDocs, ...newFiles]);
    }
  };

  const handleRemoveDoc = (index: number) => {
    const currentDocs = watchedDocuments || [];
    setValue("documents", currentDocs.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateCourseDto) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);

    if (selectedCategoryId !== undefined) {
      formData.append("categoryId", String(selectedCategoryId));
    } else {
      return;
    }

    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    if (data.video) {
      formData.append("video", data.video);
      if (duration !== null) {
        formData.append("duration", String(duration));
      }
    }

    data.documents.forEach((file) => {
      formData.append("documents", file);
    });

    console.log([...formData.entries()]);

    try {
      const savedCourse = await createCourse(formData);
      navigate(`/admin/edit-course/${savedCourse.id}`, {
        state: {
          type: "success",
          message: "Course created successfully",
        },
      });
    } catch {
      triggerNotification({
        type: "error",
        message: t("Failed to create course"),
      });
    }
  };

  useEffect(() => {
    {
      error &&
        triggerNotification({
          type: "error",
          message: t("Failed to create course"),
        });
    }
  }, [error]);

  const handleAddCategoryCancel = () => {
    setAddingCat(false);
    setNewCategory("");
    setCatCreateError("");
  };

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
                  {...register("name", {
                    setValueAs: (value) => value.trim(),
                    required: "Name is required",
                    minLength: {
                      value: 6,
                      message: "Name must be at least 6 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Name must be less than 100 characters",
                    },
                  })}
                  placeholder={t("enter course name")}
                  className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {t(String(errors.name.message))}
                  </p>
                )}
                <p className="text-sm text-text-light">
                  {watch("name")?.length || 0}/100
                </p>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm text-text-light-2 mb-1 capitalize">
                  {t("description")}
                </label>
                <textarea
                  {...register("description", {
                    setValueAs: (value) => value.trim(),
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                    maxLength: {
                      value: 1000,
                      message: "Description must be less than 1000 characters",
                    },
                  })}
                  placeholder={t("enter course description")}
                  rows={4}
                  className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {t(String(errors.description.message))}
                  </p>
                )}
                <p className="text-sm text-text-light">
                  {watch("description")?.length || 0}/1000
                </p>
              </div>

              {/* category dropdown & add */}
              <div className="flex flex-col">
                <label>{t("category")}</label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Please select a category" }}
                  render={({ field }) => (
                    <>
                      {catLoading ? (
                        <div className="w-[200px] text-center">
                          <Spinner className="w-5 h-5" />
                        </div>
                      ) : catError ? (
                        <p className="text-red-500">Load error: {catError}</p>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                          <div className="relative w-[250px]">
                            <button
                              type="button"
                              className="w-full border border-inputBorder px-3 py-2 focus:border-0 focus:ring-1 focus:ring-primary capitalize flex items-center justify-between text-left text-text-light cursor-pointer"
                              onClick={() => setIsCategoryOpen((prev) => !prev)}
                            >
                              <span className="capitalize truncate" title={`${selectedCategoryId
                                  ? categories.find(
                                      (cat) => cat.id === selectedCategoryId
                                    )?.name
                                  : "Select Category"}`}>
                                {selectedCategoryId
                                  ? categories.find(
                                      (cat) => cat.id === selectedCategoryId
                                    )?.name
                                  : "Select Category"}
                              </span>
                              <FaAngleDown
                                className={`ml-2 cusor-pointer transition-transform ${
                                  isCategoryOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {isCategoryOpen && (
                              <div className="absolute mt-[2px] top-full left-0 w-full bg-white border border-inputBorder shadow-md z-10 max-h-60 overflow-y-auto custom-scrollbar3 pr-[2px]">
                                {categories.map((cat) => (
                                  <div
                                    key={cat.id}
                                    title={cat.name}
                                    className={`px-4 py-2 hover:bg-gray-200 text-text-light cursor-pointer capitalize truncate ${
                                      selectedCategoryId === cat.id
                                        ? "bg-primary text-white hover:bg-gray-200 hover:text-text-light"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      setSelectedCategoryId(cat.id);
                                      setIsCategoryOpen(false);
                                      field.onChange(cat.id.toString());
                                      clearErrors("category");
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
                            <BiPlus className="inline-block mr-1" />
                            {t("add category")}
                          </button>

                          {addingCat && (
                            <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
                              <div className="bg-white p-6 shadow-lg w-[90vw] sm:w-100 space-y-3">
                                <h2 className="text-lg font-semibold">
                                  {t("add new category")}
                                </h2>
                                <div className="flex flex-col">
                                  <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder={` ${t("category")} ${t("name")}`}
                                    className="w-full border border-inputBorder px-2 py-1 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                  <p className="text-red-500 text-sm mt-1">
                                    {categoryLimitError}
                                  </p>
                                </div>

                                <div className="flex justify-end space-x-2 mt-2">
                                  <button
                                    onClick={handleAddCategoryCancel}
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
                                  <p className="text-red-500 mt-2 text-center">
                                    {catCreateError}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{t(String(errors.category.message))}</p>
                )}
              </div>

              {/* file uploads */}
              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 font-medium text-sm text-text-light-2">
                  {t("documents")} ({t("optional")})
                </label>

                {!watchedDocuments || watchedDocuments.length === 0 ? (
                  <div className="flex flex-col items-start space-y-2">
                    <p className="text-sm text-gray-500">
                      {t("No files added")}
                    </p>
                    <label className="inline-block capitalize px-4 py-2 bg-primary text-white cursor-pointer hover:bg-indigo-700 text-sm">
                      {t("choose file")}
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
                      {watchedDocuments.map((doc, index) => (
                        <ul key={index} className="flex gap-1 items-center">
                          <CiFileOn /> {doc.name} (
                          {(doc.size / 1024).toFixed(1)} KB){" "}
                          <MdCancel
                            title="Remove File"
                            className="cursor-pointer"
                            onClick={() => handleRemoveDoc(index)}
                          />
                        </ul>
                      ))}
                    </ul>
                    <label className="inline-block px-4 py-2 bg-primary text-white first-letter:capitalize cursor-pointer hover:bg-indigo-700 text-sm">
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
                  <label className="text-sm text-text-light-2 mb-1 capitalize">
                    {t("add video")}
                  </label>
                  <Controller
                    name="video"
                    control={control}
                    rules={{ required: "Please select a video" }}
                    render={({ field }) => (
                      <label className="flex items-center justify-center h-32 border border-inputBorder cursor-pointer hover:border-primary">
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoChange}
                        />
                        <span className="text-[#59BDE2] flex items-center gap-4 p-4">
                          <img src="/VideoUpload.svg" alt="" />
                          {watchedVideo ? watchedVideo.name : t("select file to upload")}
                        </span>
                      </label>
                    )}
                  />
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
                  {errors.video && (
                    <p className="text-red-500 text-sm mt-1">{t(String(errors.video.message))}</p>
                  )}
                </div>
                
                {/* Add Thumbnail */}
                <div className="flex flex-col">
                  <label className="text-sm text-text-light-2 mb-1 capitalize">
                    {t("add thumbnail image")}
                  </label>
                  <Controller
                    name="thumbnail"
                    control={control}
                    rules={{ required: "Please select a thumbnail image" }}
                    render={({ field }) => (
                      <label className="flex items-center justify-center h-32 border border-inputBorder cursor-pointer hover:border-primary">
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                          className="hidden"
                          onChange={handleThumbnailChange}
                        />
                        <span className="text-[#59BDE2] flex items-center gap-2">
                          <MdUpload className="text-[#59BDE2] w-7 h-7" />
                          {watchedThumbnail ? watchedThumbnail.name : t("Please select PNG or JPEG file")}
                        </span>
                      </label>
                    )}
                  />
                  <p className="text-xs text-text-light-2 mt-2">
                    {t(
                      "Recommended Image Size: 800px x 600px, PNG or JPEG file only"
                    )}
                  </p>
                  {errors.thumbnail && (
                    <p className="text-red-500 text-sm mt-1">
                      {t(String(errors.thumbnail.message))}
                    </p>
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
            <div className="w-full h-2 mt-2 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </form>
      </main>
      {NotificationComponent}
    </div>
  );
};

export default CreateCourse;