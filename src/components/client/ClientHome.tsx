
import { useState } from "react";
import { Link } from "react-router-dom";
import { initialCategories, sampleCourses } from "../AllCourses";
import { GoClock } from "react-icons/go";

const ClientHome = () => {
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );
  const [showFullDescription, setShowFullDescription] = useState(false);
   const progress = 40;
  const steps = ["Test 1", "Test 2", "Test 3", "Test 4"];
  const currentStep = 1;
  const getTruncatedText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredCourses = sampleCourses.filter(
    (course) => course.category === selectedCategory
  );

  console.log(filteredCourses);

  return (
    <main className="flex-1 p-2 sm:p-8 sm:pr-0 overflow-auto space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>

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
        </ul>
      </div>
      {/* courses */}
      <div className="flex flex-wrap gap-5 items-center justify-center sm:justify-start sm:items-start">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="w-[95%] sm:w-[320px] xl:w-[380px] flex flex-col gap-2 p-4 justify-center items-centr md:justify-start"
            style={{
              boxShadow: "0px 4px 6.7px 0px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(235, 235, 235, 1)",
            }}
          >
            <div className="relative bg-blue-200 rounded-sm overflow-hidden h-60">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="absolute inset-0 m-auto h-40 w-40 mix-blend-multiply"
              />
              <div className="absolute h-1 bg-red-500 w-10 bottom-0 left-0" style={{ width: `${progress}%` }}></div>
              <div className="absolute top-2 right-2 flex items-center text-[#6F6B7D] text-xs 2xl:text-base space-x-3 bg-white px-2.5 py-2 rounded-full">
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
            <h2 className="text-lg font-semibold text-gray-900">
              {course.title}
            </h2>
            <div>
              <p className="text-gray-600 text-sm pr-2">
                {showFullDescription
                  ? course.description
                  : course.description
                  ? getTruncatedText(course.description, 20)
                  : ""}
              </p>

              {course.description &&
                course.description.split(" ").length > 20 && (
                  <button
                    className="text-primary text-xs mt-1 underline underline-offset-2 inline cursor-pointer"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? "See less" : "See more"}
                  </button>
                )}
            </div>

            <button className="inline-block mt-2 text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150">
              Start Course
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ClientHome;
