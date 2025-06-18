import React, { useState, type ChangeEvent } from "react";
import { BiSearch } from "react-icons/bi";
import { FaAngleRight } from "react-icons/fa6";
import { GoClock } from "react-icons/go";

interface Course {
  id: number;
  title: string;
  duration: string;
  questions: number;
  imageUrl: string;
  category: string;
}

const categories = ["Health Insurance", "Life Insurance", "Vehicle Insurance"];

const sampleCourses: Course[] = [
  {
    id: 1,
    title: "RIMI Insurance Video 1",
    duration: "1hr 20min",
    questions: 30,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Health Insurance",
  },
  {
    id: 2,
    title: "RIMI Life Plan Basics",
    duration: "2hr 05min",
    questions: 20,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Life Insurance",
  },
  {
    id: 3,
    title: "Vehicle Coverage Essentials",
    duration: "1hr 45min",
    questions: 25,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Vehicle Insurance",
  },
];

const AllCourses: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = sampleCourses.filter(
    (course) =>
      course.category === selectedCategory &&
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl px-2 sm:px-4 py-8">
        {/* Page Title & Breadcrumb */}
        <nav className="text-sm 2xl:text-base text-primary font-medium mb-3 smmb-6 flex items-center gap-1">
          <FaAngleRight /> All Courses
        </nav>
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
          <button className="inline-block text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150">
            Create Course
          </button>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-[#E9E9E9] mb-6">
          <ul className="flex space-x-3 sm:space-x-8">
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
          </ul>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-[2px] overflow-hidden w-[200px] 2xl:w-[250px]"
            >
              <div className="relative">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="object-cover rounded-b-[2px] w-full h-32 2xl:h-40"
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
    </div>
  );
};

export default AllCourses;
