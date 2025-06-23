import { useState } from "react";
import AllCourses from "./AllCourses";
import CreateCourse from "./CreateCourse";
import CreateTest from "./CreateTest";

const Courses: React.FC = () => {
  type Breadcrumb = "courses" | "create-course" | "create-test";
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb>("courses");
  return (
    <div>
      <nav
        className="text-sm text-primary font-medium my-4 px-2 sm:px-8"
        aria-label="breadcrumb"
      >
        <ol className="flex items-center space-x-2">
          {breadcrumb !== "courses" && (
            <>
              <li>
                <button
                  onClick={() => setBreadcrumb("courses")}
                  className="underline underline-offset-2 cursor-pointer"
                  title="All Courses"
                >
                  Courses
                </button>
              </li>
              <li>&gt;</li>
            </>
          )}

          {breadcrumb === "create-course" && (
            <li className="text-primary">Create Course</li>
          )}

          {breadcrumb === "create-test" && (
            <>
              <li>
                <button
                  onClick={() => setBreadcrumb("create-course")}
                  className="underline underline-offset-2 cursor-pointer"
                  title="Create Course"
                >
                  Create Course
                </button>
              </li>
              <li>&gt;</li>
              <li className="text-primary">Create New Test</li>
            </>
          )}
        </ol>
      </nav>

      <main>
        {breadcrumb === "courses" && (
          <AllCourses onCreateCourse={() => setBreadcrumb("create-course")} />
        )}

        {breadcrumb === "create-course" && (
          <CreateCourse onCreateTest={() => setBreadcrumb("create-test")} />
        )}

        {breadcrumb === "create-test" && <CreateTest />}
      </main>
    </div>
  );
};

export default Courses;
