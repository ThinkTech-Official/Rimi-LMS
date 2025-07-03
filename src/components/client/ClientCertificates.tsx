import { useState } from "react";
import { sampleCourses } from "../AllCourses";
import { useTranslation } from "react-i18next";

const tabs = ["completed courses", "certificates"];

const ClientCertificates = () => {
  const [active, setActive] = useState(tabs[0]);
  const {t} = useTranslation()
  return (
    <div className="p-2 sm:p-8">
      {/* tabs */}
      <div className="border-b border-[#E9E9E9] mb-6">
        <ul className="flex space-x-3 sm:space-x-8 items-center overflow-x-auto custom-scrollbar2 pb-2 sm:pb-0">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setActive(tab)}
              className={`pb-2 cursor-pointer font-medium capitalize text-nowrap text-sm sm:text-base 2xl:text-xl ${
                active === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-[#6F6B7D]"
              }`}
            >
              {t(tab)}
            </li>
          ))}
        </ul>
      </div>

      {/* content */}

      {/* completed courses */}

      {active === "Completed Courses" && (
        <div className="grid gap-5 w-fit grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center justify-center sm:justify-start sm:items-start">
          {sampleCourses.map((course) => (
            <div
              key={course.id}
              className="w-full max-w-[400px]  flex flex-col bg-[#F6F6F6] p-3 sm:p-5 gap-2"
            >
              <h1 className="text-text-dark text-lg font-semibold">
                {course.title}
              </h1>
              <p className="text-text-light text-sm">{course.description}</p>
              <div className="w-full flex flex-col">
                <p className="text-text-dark text-sm text-end">Completed</p>
                <div className=" w-full bg-primary h-2.5"></div>
              </div>
              <button className="text-base font-semibold w-full py-2 px-3 border border-primary text-primary hover:text-white hover:bg-primary mt-3 cursor-pointer transition-all delay-100">
                Get Certificate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientCertificates;
