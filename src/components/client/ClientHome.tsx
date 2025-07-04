import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { initialCategories, sampleCourses } from "../AllCourses";
import { GoClock } from "react-icons/go";
import { useFetchCategories } from "../../hooks/useFetchCategories";
// import { useFetchCourses } from "../../hooks/useFetchCourses";
import { BiSearch } from "react-icons/bi";
import { useFetchCoursesClient } from "../../hooks/useFetchCoursesClient";
import { useFetchCourseProgress } from "../../hooks/useFetchCourseProgress";
import ClientCourseCard from "./ClientCourseCard";

const ClientHome = () => {
  const navigate = useNavigate();
  // const {t} = useTranslation()
  // const [categories, setCategories] = useState<string[]>(initialCategories);
  // const [selectedCategory, setSelectedCategory] = useState<string>(
  //   categories[0]
  // );


  // Fetching categories from backend
  const { categories , loading: catLoading, error: catError , refetch: reloadCategories} = useFetchCategories()
  const { courses , loading: courseLoading , error: courseError } = useFetchCoursesClient()
  




  // Selected Category 
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const [searchTerm, setSearchTerm] = useState<string>("")
  
  // First time category loading leads to default first one
  useEffect(() => {
    if(categories.length > 0 &&  selectedCategoryId === null) {
      setSelectedCategoryId(categories[0].id)
    }
  }, [categories, selectedCategoryId])

  const handleCategoryClick = (id: number) => {
    setSelectedCategoryId(id)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)

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
 

  // const filteredCourses = sampleCourses.filter(
  //   (course) => course.category === selectedCategory
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


  const handleStartCourse = (id: number) => {
    navigate(`/client/play/${id}`);
  };



     // Render loading / errors
  //  if (catLoading || courseLoading) return <p>Loading…</p>;
  // if (catError)
  //   return <p className="text-red-500">Error loading categories: {catError}</p>;
  // if (courseError)
  //   return <p className="text-red-500">Error loading courses: {courseError}</p>;



  return (
    <main className="flex-1 p-2 sm:p-8 sm:pr-0 overflow-auto space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 capitalize">all Courses</h1>

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
                
              </div>

      {/* Category Tabs */}
      <div className="border-b border-[#E9E9E9] mb-6">
        <ul className="flex space-x-3 sm:space-x-8 items-center overflow-x-auto custom-scrollbar2 pb-2 sm:pb-0">
          {categories.map((cat) => (
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
      </div>

  {/* Courses Grid */}
        {(catLoading || courseLoading) 
         ? 
      (
        <p>Loading...</p>
      )  
      :

     
      (
        <div className="flex flex-wrap gap-5 items-center justify-center sm:justify-start sm:items-start">
        {filteredCourses.map((course) => (
          <div key={course.id}>
            <ClientCourseCard 
          courseId={course.id}
          imageUrl={course.imageUrl} 
          title = {course.title}
          duration={course.duration}
          description = {course.description}

          />
          </div>
        ))}
      </div>
      )

}

    </main>
  );
};

export default ClientHome;
