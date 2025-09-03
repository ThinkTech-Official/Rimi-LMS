import React, { useEffect, useState, type ChangeEvent } from "react";
import { BiSearch } from "react-icons/bi";
import { GoClock } from "react-icons/go";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { useFetchCourses } from "../hooks/useFetchCourses";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useTranslation } from "react-i18next";
import Spinner from "./loaders/Spinner";
import useNotification from "../hooks/useNotification";
import FetchingError from "./FetchingError";
import { RxCross2 } from "react-icons/rx";

export const initialCategories = [
  "Health Insurance",
  "Life Insurance",
  "Vehicle Insurance",
];

interface AllCoursesProps {
  onCreateCourse: () => void;
}

const AllCourses: React.FC<AllCoursesProps> = ({ onCreateCourse }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
  const {
    courses,
    loading: courseLoading,
    error: courseError,
  } = useFetchCourses();

  // which category is showing?
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [showAddCategoryModal, setShowAddCategoryModal] =
    useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  const { NotificationComponent, triggerNotification } = useNotification();
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
  const allCategory = { id: 0, name: "All" };
  const allCategories = [allCategory, ...categories];

  // when categories first load, default to the first one
  useEffect(() => {
    if (categories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(0);
    }
  }, [categories, selectedCategoryId]);

  const handleCategoryClick = (id: number) => {
    setSelectedCategoryId(id);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      // Reset category to default if search is cleared
      if (categories.length > 0) {
        setSelectedCategoryId(0);
      }
      return;
    }

    // Search in all courses regardless of category
    const match = courses.find((c) =>
      c.title.toLowerCase().includes(value.toLowerCase())
    );

    if (match) {
      setSelectedCategoryId(0); // auto-select category
    }
  };

  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    await createCategory(name);
    setNewCategory("");
    setShowAddCategoryModal(false);
    await reloadCategories();
    // select the newly created category (it will be at the end of the array)
    const cat = categories.find((c) => c.name === name);
    if (cat) setSelectedCategoryId(cat.id);
  };

  const handleSelectCourse = (id: any) => {
    navigate(`/admin/edit-course/${id}`);
  };
  const filteredCourses = (() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    if (selectedCategoryId === 0) {
      // "All" tab
      return (courses || []).filter((c) =>
        c.title.toLowerCase().includes(normalizedSearch)
      );
    }

    if (!normalizedSearch) {
      // Normal category filtering
      return (courses || []).filter((c) => c.categoryId === selectedCategoryId);
    }

    // Search term exists in specific category
    return (courses || []).filter(
      (c) =>
        c.categoryId === selectedCategoryId &&
        c.title.toLowerCase().includes(normalizedSearch)
    );
  })();

  // Render loading / errors
  if (catLoading || courseLoading)
    return (
      <div className="flex flex-col justify-center items-center gap-3 fixed top-1/2 left-1/2">
        <Spinner className="w-10 h-10" />
        <p>{t("Loading...")}</p>
      </div>
    );
  if (catError || courseError) return <FetchingError />;
  return (
    <div className="min-h-screen bg-white px-2">
      <div className="sm:px-4 py-4">
        {/* Page Title & Breadcrumb */}

        <h1 className="text-lg 2xl:text-2xl font-bold text-[#1B1B1B] mb-3 sm:mb-6 first-letter:capitalize">
          {t("all Courses")}
        </h1>

        {/* Search & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4 w-fit">
          <div className="flex items-center border border-[#DBDADE] w-[230px] sm:w-[330px] relative">
            <input
              type="text"
              placeholder={t("Search by name")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="relative px-2 sm:px-4 py-1 sm:py-3 w-[200px] sm:w-[330px] focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="px-1 sm:px-3 cursor-pointer absolute right-0 flex gap-2 items-center">
              {searchTerm && (
                <RxCross2
                  className="h-5 w-5 text-text-light"
                  onClick={() => setSearchTerm("")}
                />
              )}
              <BiSearch className="text-[#6F6B7D]" />
            </button>
          </div>
          <button
            className="inline-block capitalize text-sm sm:text-[16px] px-5 py-2 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
            onClick={onCreateCourse}
          >
            {t("create course")}
          </button>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-[#E9E9E9] mb-6">
          <ul className="flex space-x-3 sm:space-x-8 items-center overflow-x-auto custom-scrollbar2 pb-2 sm:pb-0">
            {allCategories.map((cat: any) => (
              <li
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`pb-2 cursor-pointer font-medium text-nowrap capitalize text-base 2xl:text-xl ${
                  selectedCategoryId === cat.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600"
                }`}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>

        <div></div>

        {/* Courses Grid */}
        {catLoading || courseLoading ? (
          <div className="text-sm text-[#6F6B7D]">
            <Spinner className="w-6 h-6" />
          </div>
        ) : (
          <div className="flex items-center justify-center sm:justify-start w-full">
            <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start sm:items-start">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    title={course.title}
                    className="rounded-[2px] overflow-hidden w-[80vw] max-w-[300px] sm:w-[300px] 2xl:w-[380px] hover:transform hover:scale-105 transition-transform delay-75 cursor-pointer border border-inputBorder shadow-md"
                    onClick={() => handleSelectCourse(course.id)}
                  >
                    <div className="relative">
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="object-fill rounded-b-[2px] w-full h-40 sm:h-32 md:h-44"
                      />
                    </div>
                    <div className=" flex flex-col gap-2 p-2">
                      <h2 className="text-base 2xl:text-xl font-semibold text-[#1B1B1B] line-clamp-1 first-letter:capitalize">
                        {course.title}
                      </h2>
                      <div className="flex items-center text-[#6F6B7D] text-xs 2xl:text-base space-x-4">
                        <div className="flex items-center gap-1">
                          <GoClock />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <img src="Document.svg" alt="" />
                          {/* <span>{course.questions} Questions</span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : selectedCategoryId === 0 && searchTerm.trim() ? (
                <p className="text-center text-gray-500 italic">
                  {t("Course with the name")} "{searchTerm}" {t("not found")}
                </p>
              ) : null}
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
            <div className="bg-white p-6 shadow-lg w-[90vw] sm:w-100 space-y-3">
              <h2 className="text-lg font-semibold">{t("add new category")}</h2>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder={` ${t("category")} ${t("name")}`}
                className="w-full border border-inputBorder px-2 py-1 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 border cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  className="px-4 py-2 bg-primary text-white disabled:opacity-50 cursor-pointer"
                  onClick={handleAddCategory}
                  disabled={creatingCat}
                >
                  {creatingCat ? "Adding…" : t("add")}
                </button>
              </div>
              {catCreateError && (
                <p className="text-red-500 mt-2">{catCreateError}</p>
              )}
            </div>
          </div>
        )}
      </div>
      {NotificationComponent}
    </div>
  );
};

export default AllCourses;
