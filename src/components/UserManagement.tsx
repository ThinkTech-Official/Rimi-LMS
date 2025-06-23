import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useState } from "react";
import { BiSearch } from "react-icons/bi";
import UserProfile from "./UserProfile";

export interface User {
  id: number;
  name: string;
  email: string;
  course: string;
  progress: string;
  certificateIssued: boolean;
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: "Liam Carter",
    email: "liam.carter@email.com",
    course: "Course 1",
    progress: "100%",
    certificateIssued: true,
  },
  {
    id: 2,
    name: "Emma Johnson",
    email: "emma.56@email.com",
    course: "Course 2",
    progress: "75%",
    certificateIssued: false,
  },
  {
    id: 3,
    name: "Noah Williams",
    email: "noah.78@email.com",
    course: "Course 3",
    progress: "90%",
    certificateIssued: false,
  },
];

export const UserManagement: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "certified">("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = sampleUsers.filter((u) => {
    const matchesFilter =
      filter === "all" || (filter === "certified" && u.certificateIssued);
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const handleBackToUsers = useCallback(() => {
    setSelectedUser(null);
  }, []);

  if (selectedUser) {
    return (
      <UserProfile
        user={selectedUser}
        onBack={handleBackToUsers}
        breadcrumbTrail={["User Management", "View Profile"]}
      />
    );
  }

  return (
    <div className="relative bg-white overflow-hidden min-h-screen">
      <div className="px-2 sm:px-6 py-4">
        <h2 className="text-primary text-sm font-medium mb-3">
          &gt; Users Management{" "}
        </h2>
        <h1 className="text-lg 2xl:text-2xl font-bold text-text-dark mb-3 sm:mb-6">
          Users
        </h1>
        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-start md:justify-between space-x-4 mb-6">
          <div className="flex gap-2 items-center">
            {" "}
            <span className="text-[#4B465C] opacity-80">Show</span>
            <div className="bg-[#EDEDED] px-2 sm:px-4 py-1 sm:py-3">
              <label className="inline-flex items-center mr-4 text-[#4B465C] opacity-80">
                <input
                  type="radio"
                  name="filter"
                  value="all"
                  checked={filter === "all"}
                  onChange={() => setFilter("all")}
                  className="form-radio text-indigo-800 cursor-pointer"
                />
                <span className="ml-2">All Users</span>
              </label>
              <label className="inline-flex items-center text-[#4B465C] opacity-80">
                <input
                  type="radio"
                  name="filter"
                  value="certified"
                  checked={filter === "certified"}
                  onChange={() => setFilter("certified")}
                  className="form-radio text-indigo-800 cursor-pointer"
                />
                <span className="ml-2">Certified Users</span>
              </label>
            </div>
          </div>
          <div className="flex items-center border border-[#DBDADE] w-[244px] md:w-[330px] ml-12 md:ml-0">
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-2 sm:px-4 py-1 sm:py-3 w-[200px] sm:w-[330px] focus:outline-none"
            />
            <button className="px-1 sm:px-3 cursor-pointer">
              <BiSearch className="text-[#6F6B7D]" />
            </button>
          </div>
        </div>
        {/* Users Table */}
        <div className="w-full overflow-x-auto custom-scrollbar pb-2">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary text-white text-base 2xl:text-xl">
              <tr>
                <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                  Name
                </th>
                <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                  Email
                </th>
                <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                  Course
                </th>
                <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                  Progress
                </th>
                <th className="px-2 sm:px-6 py-1 sm:py-3 text-center font-medium text-nowrap">
                  Certificate Issued
                </th>
                <th className="px-2 sm:px-6 py-1 sm:py-3 text-center font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white" style={{ border: "1px solid #AAA9A9" }}>
              {filteredUsers.map((user) => (
                <tr
                  key={user.email}
                  className="text-[#808080] text-sm 2xl:text-xl"
                >
                  <td
                    className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap"
                    style={{
                      borderWidth: "0px 1px 1px 0px",
                      borderStyle: "solid",
                      borderColor: "#AAA9A9",
                    }}
                  >
                    {" "}
                    {user.name}
                  </td>
                  <td
                    className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap"
                    style={{
                      borderWidth: "0px 1px 1px 0px",
                      borderStyle: "solid",
                      borderColor: "#AAA9A9",
                    }}
                  >
                    {" "}
                    {user.email}
                  </td>
                  <td
                    className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap"
                    style={{
                      borderWidth: "0px 1px 1px 0px",
                      borderStyle: "solid",
                      borderColor: "#AAA9A9",
                    }}
                  >
                    {" "}
                    {user.course}
                  </td>
                  <td
                    className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap"
                    style={{
                      borderWidth: "0px 1px 1px 0px",
                      borderStyle: "solid",
                      borderColor: "#AAA9A9",
                    }}
                  >
                    {" "}
                    {user.progress}
                  </td>
                  <td
                    className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center"
                    style={{
                      borderWidth: "0px 1px 1px 0px",
                      borderStyle: "solid",
                      borderColor: "#AAA9A9",
                    }}
                  >
                    {" "}
                    {user.certificateIssued ? "Yes" : "No"}
                  </td>
                  <td
                    className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap"
                    style={{
                      borderWidth: "0px 1px 1px 0px",
                      borderStyle: "solid",
                      borderColor: "#AAA9A9",
                    }}
                  >
                    {" "}
                    <button
                      className="text-primary hover:underline hover:underline-offset-2 cursor-pointer font-medium px-4 text-center w-full"
                      onClick={() => setSelectedUser(user)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-center p-4 space-x-2">
          <button
            disabled
            className="px-3 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
            title="Previous"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-2 cursor-pointer ${
                currentPage === num
                  ? "bg-primary text-white"
                  : "bg-[#F1F0F2] text-[#808080]"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            className="px-3 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
            title="Next"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
