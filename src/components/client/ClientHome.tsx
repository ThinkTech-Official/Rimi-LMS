import { useEffect, useState, type ChangeEvent } from "react";
import { useFetchCategories } from "../../hooks/useFetchCategories";
import { BiSearch } from "react-icons/bi";
import { useFetchCoursesClient } from "../../hooks/useFetchCoursesClient";
import ClientCourseCard from "./ClientCourseCard";
import Spinner from "../loaders/Spinner";
import FetchingError from "../FetchingError";

const ClientHome = () => {
  // Fetching categories
  const {
    categories,
    loading: catLoading,
    error: catError,
    // refetch: reloadCategories,
  } = useFetchCategories();
  const {
    courses,
    loading: courseLoading,
    error: courseError,
  } = useFetchCoursesClient();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState<string>("");

  const allCategory = { id: 0, name: "All" };
  const allCategories = [allCategory, ...categories];

  // First time category loading leads to default first one
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

  // Safe filtering if courses empty or selectedCategory unset, result is empty array
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
        <p>Loading...</p>
      </div>
    );
  if (catError || courseError) return <FetchingError />;

  return (
    <main className="flex-1 p-2 sm:p-8 sm:pr-0 overflow-auto space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 capitalize">
        all Courses
      </h1>

      {/* Search & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4 w-fit">
        <div className="flex items-center border border-[#DBDADE] w-[230px] sm:w-[330px] relative">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="relative px-2 sm:px-4 py-1 sm:py-3 w-[200px] sm:w-[330px] focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button className="px-1 sm:px-3 cursor-pointer absolute right-0">
            <BiSearch className="text-[#6F6B7D]" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-[#E9E9E9] mb-6">
        <ul className="flex space-x-3 sm:space-x-8 items-center overflow-x-auto custom-scrollbar2 pb-2 sm:pb-0">
          {allCategories.map((cat) => (
            <li
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`pb-2 cursor-pointer capitalize font-medium text-nowrap text-sm sm:text-base 2xl:text-xl ${
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
                <div key={course.id}>
                  <ClientCourseCard
                    courseId={course.id}
                    imageUrl={course.imageUrl}
                    title={course.title}
                    duration={course.duration}
                    description={course.description}
                  />
                </div>
              ))
            ) : selectedCategoryId === 0 && searchTerm.trim() ? (
              <p className="text-center text-gray-500 italic">
                Course with the name "{searchTerm}" not found.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
};

export default ClientHome;
