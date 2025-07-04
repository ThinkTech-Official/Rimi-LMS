import React, { useEffect, useState, type ChangeEvent } from "react";
import { BiSearch } from "react-icons/bi";
import { GoClock } from "react-icons/go";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { useFetchCourses , type Course } from "../hooks/useFetchCourses";
import { Navigate, useNavigate } from "react-router-dom";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useTranslation } from "react-i18next";

// interface Course {
//   id: number;
//   title: string;
//   duration: string;
//   questions: number;
//   imageUrl: string;
//   category: string;
//   description?: string;
// }

export const initialCategories = [
  "Health Insurance",
  "Life Insurance",
  "Vehicle Insurance",
];

export const sampleCourses: any[] = [
  {
    id: 1,
    title: "RIMI Insurance Video 1",
    duration: "1hr 20min",
    questions: 30,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Health Insurance",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam non corrupti debitis pariatur optio consectetur nam cumque doloremque dicta in, quis voluptatem eius incidunt, officiis consequuntur, cum doloribus ut magnam!",
  },
  {
    id: 2,
    title: "RIMI Life Plan Basics",
    duration: "2hr 05min",
    questions: 20,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Life Insurance",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam non corrupti debitis pariatur optio consectetur nam cumque doloremque dicta in, quis voluptatem eius incidunt, officiis consequuntur, cum doloribus ut magnam!",
  },
  {
    id: 3,
    title: "Vehicle Coverage Essentials",
    duration: "1hr 45min",
    questions: 25,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Vehicle Insurance",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam non corrupti debitis pariatur optio consectetur nam cumque doloremque dicta in, quis voluptatem eius incidunt, officiis consequuntur, cum doloribus ut magnam!",
  },
  {
    id: 4,
    title: "Vehicle Coverage Essentials",
    duration: "1hr 45min",
    questions: 25,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Health Insurance",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam non corrupti debitis pariatur optio consectetur nam cumque doloremque dicta in, quis voluptatem eius incidunt, officiis consequuntur, cum doloribus ut magnam!",
  },
  {
    id: 5,
    title: "RIMI Insurance Video 1",
    duration: "1hr 20min",
    questions: 30,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Health Insurance",
  },
  {
    id: 6,
    title: "RIMI Insurance Video 1",
    duration: "1hr 20min",
    questions: 30,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Health Insurance",
  },
  {
    id: 7,
    title: "RIMI Insurance Video 1",
    duration: "1hr 20min",
    questions: 30,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Health Insurance",
  },
  {
    id: 8,
    title: "RIMI Insurance Video 1",
    duration: "1hr 20min",
    questions: 30,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Health Insurance",
  },
  {
    id: 9,
    title: "RIMI Insurance Video 1",
    duration: "1hr 20min",
    questions: 30,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Health Insurance",
  },
];

interface AllCoursesProps {
  onCreateCourse: () => void;
}

const AllCourses: React.FC<AllCoursesProps> = ({ onCreateCourse }) => {

  const navigate = useNavigate()
  const { t } = useTranslation();

  const { categories , loading: catLoading , error: catError , refetch: reloadCategories, } = useFetchCategories()
  const { createCategory , loading: creatingCat , error: catCreateError } = useCreateCategory()
  const { courses, loading: courseLoading , error: courseError } = useFetchCourses()

// which category is showing?
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Category Handelling State
  // add‐category UI

  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  //

  

 // when categories first load, default to the first one
  useEffect(() => {
    if (categories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

    const handleCategoryClick = (id: number) => {
    setSelectedCategoryId(id);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  

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
    navigate(`/admin/edit-course/${id}`)
  }

  //

  // const filteredCourses = courses.filter(
  //   (course) =>
  //     course.category === selectedCategory &&
  //     course.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

    // Safe filtering if courses empty or selectedCategory unset, result is empty array
    const filteredCourses = (courses || []).filter((c) => {
    const byCat =
      selectedCategoryId !== null ? c.categoryId === selectedCategoryId : true;
    const bySearch = c.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return byCat && bySearch;
  });


    // Render loading / errors
  //  if (catLoading || courseLoading) return <p>Loading…</p>;
  // if (catError)
  //   return <p className="text-red-500">Error loading categories: {catError}</p>;
  // if (courseError)
  //   return <p className="text-red-500">Error loading courses: {courseError}</p>;



  console.log('from all courses component',courses)


  return (
     <div className="min-h-screen bg-white px-2">
      <div className="px-2 sm:px-4 py-4">
        {/* Page Title & Breadcrumb */}

        <h1 className="text-lg 2xl:text-2xl font-bold text-[#1B1B1B] mb-3 sm:mb-6">
          {t("all Courses")}
        </h1>

        {/* Search & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4 w-fit">
          <div className="flex items-center border border-[#DBDADE] w-[230px] sm:w-[330px]">
            <input
              type="text"
              placeholder={t("Search by name")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-2 sm:px-4 py-1 sm:py-3 w-[200px] sm:w-[330px] focus:outline-none"
            />
            <button className="px-1 sm:px-3 cursor-pointer">
              <BiSearch className="text-[#6F6B7D]" />
            </button>
          </div>
          <button
            className="inline-block capitalize text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
            onClick={onCreateCourse}
          >
            {t("create course")}
          </button>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-[#E9E9E9] mb-6">
          <ul className="flex space-x-3 sm:space-x-8 items-center overflow-x-auto custom-scrollbar2 pb-2 sm:pb-0">
            {categories.map((cat: any) => (
              <li
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`pb-2 cursor-pointer font-medium text-nowrap text-sm sm:text-base 2xl:text-xl ${
                  selectedCategoryId === cat.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600"
                }`}
              >
                {cat.name}
              </li>
            ))}
              </ul>
             <button
              onClick={() => setShowAddCategoryModal(true)}
              className="cursor-pointer border-2 border-primary px-3 py-1 text-sm sm:text-base text-nowrap text-primary hover:bg-primary hover:text-white transition-colors delay-100"
            >
              {t("add category")}
            </button>
        </div>

        <div></div>

        {/* Courses Grid */}
        {catLoading || courseLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex items-center justify-center sm:justify-start w-full">
            <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start sm:items-start">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-[2px] overflow-hidden w-[80vw] max-w-[300px] sm:w-[200px] 2xl:w-[250px] cursor-pointer"
                  onClick={() => handleSelectCourse(course.id)}
                >
                  <div className="relative">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="object-cover rounded-b-[2px] w-full h-40 sm:h-32 2xl:h-40"
                    />
                  </div>
                  <div className="p-2">
                    <h2 className="text-base 2xl:text-xl font-semibold text-[#1B1B1B]">
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
              ))}
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
    </div>
  );
};

export default AllCourses;
