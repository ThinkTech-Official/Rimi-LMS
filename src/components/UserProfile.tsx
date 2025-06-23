import { useState, type FC } from "react";
import { GoClock } from "react-icons/go";
import { ImUser } from "react-icons/im";

export interface Certificate {
  id: string;
  courseName: string;
  issueDate: string;
  imageUrl: string;
}

interface Course {
  id: number;
  title: string;
  duration: string;
  questions: number;
  imageUrl: string;
  category: string;
  progress: number;
}

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface UserProfileProps {
  user: User;
  // enrolledCourses: Course[]
  // certificates: Certificate[]
  onBack: () => void;
  breadcrumbTrail?: string[];
}
const enrolledCourses: Course[] = [
  {
    id: 1,
    title: "RIMI Insurance Video 1",
    duration: "1hr 20min",
    questions: 30,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Health Insurance",
    progress: 20,
  },
  {
    id: 2,
    title: "RIMI Life Plan Basics",
    duration: "2hr 05min",
    questions: 20,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Life Insurance",
    progress: 10,
  },
  {
    id: 3,
    title: "Vehicle Coverage Essentials",
    duration: "1hr 45min",
    questions: 25,
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
    category: "Vehicle Insurance",
    progress: 15,
  },
];

export const certificates: Certificate[] = [
  {
    id: "cert-001",
    courseName: "Insurance Fundamentals",
    issueDate: "2025-01-20",
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
  },
  {
    id: "cert-002",
    courseName: "Risk & Compliance Basics",
    issueDate: "2025-02-15",
    imageUrl: "https://placehold.co/400x200?text=Course+Image",
  },
  {
    id: "cert-003",
    courseName: "Client Servicing Excellence",
    issueDate: "2025-03-05",
    imageUrl: "/certificates/client-servicing.png",
  },
  {
    id: "cert-004",
    courseName: "Advanced Policy Structuring",
    issueDate: "2025-04-10",
    imageUrl: "/certificates/policy-structuring.png",
  },
];
const userTabs = ["Enrolled Courses", "Certificates"];

const UserProfile: FC<UserProfileProps> = ({
  user,
  onBack,
  breadcrumbTrail,
}) => {
  const [activeTab, setActiveTab] = useState<string>(userTabs[0]);
  const handleCategoryClick = (activeTab: string) => {
    setActiveTab(activeTab);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <main className="px-2 sm:px-6 py-4">
          {/* Breadcrumbs */}
          <nav className="text-sm text-primary font-medium mb-6">
            {breadcrumbTrail?.map((item, index) => (
              <span key={index}>
                &gt;{" "}
                {index === breadcrumbTrail.length - 1 ? (
                  <span className="font-medium">{item}</span>
                ) : (
                  <button
                    onClick={onBack}
                    className="underline underline-offset-2 cursor-pointer"
                  >
                    {item}
                  </button>
                )}{" "}
              </span>
            ))}
          </nav>

          {/* Profile Info */}
          <div className="flex items-start space-x-8 mb-8">
            <ImUser className="w-16 h-16 bg-gray-200 rounded-md" />
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-base">
                <span className="font-semibold text-black">Name:</span>
                <span className="text-black opacity-50">{user.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-base">
                <span className="font-semibold text-black">Email:</span>
                <span className="text-black opacity-50">{user.email}</span>
              </div>
              {/* <div className="flex items-center space-x-2 text-base">
                <span className="font-semibold">Password:</span>
                <span className="text-gray-500">{user.password}</span>
                <button className="text-indigo-600 underline text-sm">
                  Reset password
                </button>
              </div> */}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#E9E9E9] mb-6">
            <ul className="flex space-x-3 sm:space-x-8">
              {userTabs.map((cat) => (
                <li
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`pb-2 cursor-pointer font-medium text-nowrap text-sm sm:text-base 2xl:text-xl ${
                    activeTab === cat
                      ? "text-primary border-b-2 border-primary"
                      : "text-[#6F6B7D]"
                  }`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Tab content */}
          {activeTab === "Enrolled Courses" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-fit">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-[2px] overflow-hidden w-[220px] 2xl:w-[250px] p-2"
                  style={{ border: "1px solid #D9D9D9" }}
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
                    <div className="flex items-center text-[#6F6B7D] text-xs 2xl:text-base space-x-3">
                      <div className="flex items-center gap-1">
                        <GoClock />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <img src="Document.svg" alt="" />
                        <span>{course.questions} Questions</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs mt-3">
                      <p className="font-semibold text-primary">Completed</p>
                      <p className="text-[#1B1B1B]">{course.progress}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Certificates" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-fit">
              {certificates.map((course) => (
                <div
                  key={course.id}
                  className="rounded-[2px] overflow-hidden w-[220px] 2xl:w-[250px] p-2"
                  style={{ border: "1px solid #D9D9D9" }}
                >
                  <div className="relative">
                    <img
                      src={course.imageUrl}
                      alt={course.courseName}
                      className="object-cover rounded-b-[2px] w-full h-32 2xl:h-40"
                    />
                  </div>
                  <div className="p-2">
                    <h2 className="text-base 2xl:text-xl font-semibold text-[#1B1B1B]">
                      {course.courseName}
                    </h2>
                    <div className="flex items-center gap-1 text-base">
                      <p className="font-semibold text-[#1B1B1B]">
                        Issue Date:
                      </p>
                      <p className="text-[#808080]">{course.issueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
