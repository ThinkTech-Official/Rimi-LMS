import React, { useCallback, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LabelList,
} from "recharts";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import UserProfile, { type User } from "./UserProfile";

// Dummy stats
const stats = [
  { label: "Total Users", value: "15,672" },
  { label: "Created Courses", value: "25" },
  { label: "Tests Taken", value: "315" },
  { label: "Issued Certificates", value: "100" },
];

// Sample chart data
const lineChartData = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 600 },
  { name: "Mar", users: 800 },
  { name: "Apr", users: 500 },
  { name: "May", users: 950 },
  { name: "Jun", users: 800 },
  { name: "Jul", users: 1050 },
];

const barChartData = [
  { name: "Jan", certificates: 50 },
  { name: "Feb", certificates: 80 },
  { name: "Mar", certificates: 65 },
  { name: "Apr", certificates: 90 },
  { name: "May", certificates: 75 },
];

// Recent users
const recentUsers = [
  {
    name: "Liam Carter",
    email: "liam.carter@email.com",
    date: "Jan 10, 2023",
    certs: 1,
    password: "password123",
  },
  {
    name: "Emma Johnson",
    email: "emma.56@email.com",
    date: "Feb 15, 2023",
    certs: 2,
  },
  {
    name: "Noah Williams",
    email: "noah.78@email.com",
    date: "Mar 20, 2023",
    certs: 4,
  },
  {
    name: "Olivia Brown",
    email: "olivia.98@email.com",
    date: "Apr 25, 2023",
    certs: 1,
  },
  {
    name: "Ethan Davis",
    email: "ethan.davis@email.com",
    date: "May 30, 2023",
    certs: 3,
  },
  {
    name: "Ava Wilson",
    email: "ava.wilson@email.com",
    date: "Jun 05, 2023",
    certs: 5,
  },
  {
    name: "Lucas Taylor",
    email: "lucas.taylor@email.com",
    date: "Jul 12, 2023",
    certs: 2,
  },
  {
    name: "Mason Clark",
    email: "mason.@email.com",
    date: "Aug 18, 2023",
    certs: 6,
  },
  {
    name: "Isabella Lewis",
    email: "isabella.@email.com",
    date: "Sep 22, 2023",
    certs: 1,
  },
  {
    name: "Sophia Walker",
    email: "sophia.@email.com",
    date: "Oct 28, 2023",
    certs: 3,
  },
  {
    name: "Mia Hall",
    email: "mia.hall@email.com",
    date: "Nov 03, 2023",
    certs: 4,
  },
];

const AdminHome: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const handleBackHome = useCallback(() => {
    setSelectedUser(null);
  }, []);
  if (selectedUser) {
    return (
      <UserProfile
        user={selectedUser}
        onBack={handleBackHome}
        breadcrumbTrail={["Home", "View Profile"]}
      />
    );
  }
  return (
      <div className="flex-1 flex flex-col">
        {/* Dashboard */}
        <main
          className={`px-2 py-4 sm:p-6 xl:p-8 overflow-auto space-y-8 flex flex-col justify-center items-center `}
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-8 w-full">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-2 sm:p-6 sm:h-24"
                style={{
                  boxShadow: "0px 4px 6.7px 0px rgba(0, 0, 0, 0.04)",
                  border: "1px solid rgba(235, 235, 235, 1)",
                }}
              >
                <div className="text-lg 2xl:text-2xl leading-6 font-bold text-[#232323]">
                  {stat.value}
                </div>
                <div className="text-sm 2xl:text-lg leading-[20px] text-[#6F6B7D] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 2xl:gap-20 pt-4 w-full">
            <div className="flex flex-col gap-5 2xl:gap-8 flex-1">
              <h5 className="text-lg 2xl:text-2xl leading-[20px] 2xl:leading-1.5 font-bold text-[#1B1B1B] text-center lg:text-left">
                Daily Active Users
              </h5>
              <div className="bg-white py-4 2xl:px-2 h-96 2xl:h-[400px] w-full border border-[#DDDDDD]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineChartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="0"
                      vertical={false}
                      stroke="#DBEAFE"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={8}
                      tick={{
                        fill: "#94A3B8",
                        fontSize:
                          window.innerWidth < 640
                            ? 14
                            : window.innerWidth < 1600
                            ? 16
                            : 20,
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                      tick={{
                        fill: "#94A3B8",
                        fontSize:
                          window.innerWidth < 640
                            ? 14
                            : window.innerWidth < 1600
                            ? 16
                            : 20,
                      }}
                    />
                    <Tooltip labelClassName="text-[#1B1B1B] text-[16px]" />
                    <Line
                      type="linear"
                      dataKey="users"
                      stroke="#2B00B7"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col gap-5 2xl:gap-8 flex-1">
              <h5 className="text-lg 2xl:text-2xl leading-[20px] 2xl:leading-1.5 font-bold text-[#1B1B1B] text-center lg:text-left">
                Monthly Enrollments by Course
              </h5>
              <div className="bg-white py-4 2xl:px-2 h-96 2xl:h-[400px] w-full border border-[#DDDDDD]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      stroke="#94A3B8"
                      tick={{
                        fill: "#94A3B8",
                        fontSize:
                          window.innerWidth < 640
                            ? 14
                            : window.innerWidth < 1600
                            ? 16
                            : 20,
                      }}
                      tickMargin={8}
                    />
                    <YAxis
                      tickMargin={10}
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#94A3B8",
                        fontSize:
                          window.innerWidth < 640
                            ? 14
                            : window.innerWidth < 1600
                            ? 16
                            : 20,
                      }}
                    />
                    <Bar
                      dataKey="certificates"
                      fill="#7367F029"
                      radius={[6, 6, 0, 0]}
                      barSize={28}
                      activeBar={false}
                      onMouseOver={(_, index, e) => {
                        const target = e.target as SVGElement;
                        target.setAttribute("fill", "#2B00B7");
                      }}
                      onMouseOut={(_, index, e) => {
                        const target = e.target as SVGElement;
                        target.setAttribute("fill", "#7367F029");
                      }}
                      style={{ transition: "fill 0.1s ease 0.1s" }}
                    >
                      <LabelList
                        dataKey="certificates"
                        position="top"
                        offset={10}
                        style={{
                          fill: "#4B465C",
                          fontSize:
                            window.innerWidth < 640
                              ? 14
                              : window.innerWidth < 1024
                              ? 16
                              : 20,
                          fontWeight: 500,
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Users Table */}
          <div className={`bg-white w-full`}>
            <div className="py-5 2xl:py-8">
              <h2 className="text-lg 2xl:text-2xl leading-[20px] 2xl:leading-1.5 font-bold text-[#1B1B1B] text-center sm:text-left">
                Recently Signed up Users
              </h2>
            </div>
            <div className="w-full overflow-x-auto custom-scrollbar pb-2">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary text-white text-[16px] 2xl:text-xl">
                  <tr>
                    <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                      Client Name
                    </th>
                    <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                      Email
                    </th>
                    <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                      Date
                    </th>
                    <th className="px-2 xl:px-0 py-1 sm:py-3 text-center font-medium text-nowrap">
                      Number of Certificates
                    </th>
                    <th className="py-1 sm:py-3 text-center font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="bg-white"
                  style={{ border: "1px solid #AAA9A9" }}
                >
                  {recentUsers.map((user) => (
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
                        {user.date}
                      </td>
                      <td
                        className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center"
                        style={{
                          borderWidth: "0px 1px 1px 0px",
                          borderStyle: "solid",
                          borderColor: "#AAA9A9",
                        }}
                      >
                        {user.certs}
                      </td>
                      <td
                        className="py-2 sm:py-4 whitespace-nowrap text-center"
                        style={{
                          borderWidth: "0px 1px 1px 0px",
                          borderStyle: "solid",
                          borderColor: "#AAA9A9",
                        }}
                      >
                        <button
                          className="text-primary hover:underline hover:underline-offset-2 cursor-pointer font-medium px-4"
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
        </main>
      </div>
  );
};

export default AdminHome;
