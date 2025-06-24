import React, { useState, type ChangeEvent } from "react";
import { BiSearch } from "react-icons/bi";
import { GoClock } from "react-icons/go";

interface Course {
  id: number;
  title: string;
  duration: string;
  questions: number;
  imageUrl: string;
  category: string;
  description?: string;
}

export const initialCategories = [
  "Health Insurance",
  "Life Insurance",
  "Vehicle Insurance",
];

export const sampleCourses: Course[] = [
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
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Category Handelling State

  const [showAddCategoryModal, setShowAddCategoryModal] =
    useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  //

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Category adding method
  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (!categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
      setSelectedCategory(trimmed);
    }
    setNewCategory("");
    setShowAddCategoryModal(false);
  };

  //

  const filteredCourses = sampleCourses.filter(
    (course) =>
      course.category === selectedCategory &&
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="px-2 sm:px-4 py-8">
        {/* Page Title & Breadcrumb */}

        <h1 className="text-lg 2xl:text-2xl font-bold text-[#1B1B1B] mb-3 sm:mb-6">
          All Courses
        </h1>

        {/* Search & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4 w-fit">
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
            className="inline-block text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
            onClick={onCreateCourse}
          >
            Create Course
          </button>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-[#E9E9E9] mb-6">
          <ul className="flex space-x-3 sm:space-x-8 items-center overflow-x-auto custom-scrollbar2 pb-2 sm:pb-0">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`pb-2 cursor-pointer font-medium text-nowrap text-sm sm:text-base 2xl:text-xl ${
                  selectedCategory === cat
                    ? "text-primary border-b-2 border-primary"
                    : "text-[#6F6B7D]"
                }`}
              >
                {cat}
              </li>
            ))}
            <li
              onClick={() => setShowAddCategoryModal(true)}
              className="cursor-pointer border-2 border-primary px-3 py-1 text-sm sm:text-base text-nowrap text-primary hover:bg-primary hover:text-white transition-colors delay-100"
            >
              Add Category
            </li>
          </ul>
        </div>

        <div></div>

        {/* Courses Grid */}
        <div className="flex items-center justify-center sm:justify-start w-full">
          <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start sm:items-start">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-[2px] overflow-hidden w-[80vw] max-w-[300px] sm:w-[200px] 2xl:w-[250px]"
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
                      <span>{course.questions} Questions</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Category Modal */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 bg-primary/10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category Name"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 rounded bg-primary text-white hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCourses;
