import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useRecentSignups } from "../hooks/useRecentSignups";
import { useLiveTotals } from "../hooks/useLiveTotals";
import Spinner from "./loaders/Spinner";
import { useNavigate } from "react-router-dom";
import AdminCharts from "./Admin/AdminCharts";

const AdminHome: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const {
    users: recentUsers,
    totalCount,
    loading: recentLoading,
    error: recentError,
  } = useRecentSignups(currentPage, pageSize);
  const {
    totals,
    loading: totalsLoading,
    error: totalsError,
  } = useLiveTotals();

  if (statsLoading || recentLoading) {
    return (
      <div className="flex flex-col justify-center items-center gap-3 fixed top-1/2 left-1/2">
        <Spinner className="w-10 h-10" />
        <p>{t("Loading...")}</p>
      </div>
    );
  }
  if (statsError || recentError) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500">
        {t("Error loading dashboard")} !
      </div>
    );
  }

  // Build an array for live totals
  const liveStats = totals
    ? [
        { label: t("Total Users"), value: totals.totalUsers },
        { label: t("Created Courses"), value: totals.createdCourses },
        { label: t("Tests Created"), value: totals.testsCreated },
        { label: t("Issued Certificates"), value: totals.issuedCertificates },
      ]
    : [];

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleClientProfile = (id: any) => {
    console.log(id);
    navigate(`/admin/users/${id}`);
  };
const colors = ["#E9E5F3", "#E0EDF4", "#E9E5F3", "#FEEEF5"];
  return (
    <div className="flex-1 flex flex-col">
      {/* Dashboard */}
      <main
        className={`px-2 py-4 sm:p-6 xl:p-8 overflow-auto space-y-8 flex flex-col justify-center items-center `}
      >
        {/* Stats Cards */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-8 w-full"
          role="stats"
        >
          {liveStats?.map((stat, i) => (
            <div
              key={stat.label}
              data-testid="stat-card"
              className={`p-2 sm:p-6 sm:h-24`}
              style={{
                backgroundColor: colors[i],
                boxShadow: "0px 4px 6.7px 0px rgba(0, 0, 0, 0.04)",
                border: "1px solid rgba(235, 235, 235, 1)",
              }}
            >
              <div className="text-lg 2xl:text-2xl leading-6 font-bold text-text-dark">
                {stat.value}
              </div>
              <div className="text-sm 2xl:text-lg leading-[20px] mt-1 text-text-light-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS  */}
        <AdminCharts />

        {/* Recent Signups Table */}
        <div className={`bg-white w-full`}>
          <div className="py-5 2xl:py-8">
            <h2 className="text-lg 2xl:text-2xl capitalize leading-[20px] 2xl:leading-1.5 font-bold text-[#1B1B1B] text-center sm:text-left">
              {t("Recently Signed up Users")}
            </h2>
          </div>
          <div className="w-full overflow-x-auto custom-scrollbar pb-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary text-white text-[16px] 2xl:text-xl">
                <tr>
                  <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                    {t("Client Name")}
                  </th>
                  <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                    {t("Email")}
                  </th>
                  <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                    {t("Date")}
                  </th>
                  {/* <th className="px-2 xl:px-0 py-1 sm:py-3 text-center font-medium text-nowrap">
                     {t("Number of Certificates")}
                    </th> */}
                  <th className="py-1 sm:py-3 text-center font-medium">
                    {t("Action")}
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
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    {/* <td
                        className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center"
                        style={{
                          borderWidth: "0px 1px 1px 0px",
                          borderStyle: "solid",
                          borderColor: "#AAA9A9",
                        }}
                      >
                        {user.certs}
                      </td> */}
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
                        onClick={() => handleClientProfile(user.id)}
                      >
                        {t("View Profile")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination NO Need For Pagination Here As Just Showing Result of Last 10 SIgined up User  */}
          <div className="flex items-center justify-center p-4 space-x-2">
            {/* <button
                disabled={currentPage === 1}
                className="px-3 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
                title="Previous"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button> */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
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
            {/* <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
                title="Next"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
