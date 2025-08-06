import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { useNavigate } from "react-router-dom";
import Spinner from "./loaders/Spinner";

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<"all" | "certified">("all");
  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { users, total, loading, error } = useAdminUsers(
    currentPage,
    limit,
    filter,
    search
  );

  const totalPages = Math.ceil(total / limit);
  const handleFilterChange = (value: "all" | "certified") => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearch(searchInput.trim());
  };

  const handleClientProfile = (id: any) => {
    console.log(id);
    navigate(`/admin/users/${id}`);
  };

  if (loading)
    return (
      <div className="fixed top-1/2 left-1/2 flex flex-col items-center gap-2">
        <Spinner className="w-10 h-10" />{" "}
        <p className="text-text-light">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-red-600">
        {t("Error")}: {error}
      </div>
    );

  return (
    <div className="relative bg-white overflow-hidden min-h-screen">
      <div className="px-2 sm:px-6 py-4">
        <h2
          className="text-primary text-sm font-medium mb-3"
          role="breadcrumbs"
        >
          &gt; {t("users Management")}{" "}
        </h2>
        <h1 className="text-lg 2xl:text-2xl font-bold text-text-dark mb-3 sm:mb-6 capitalize">
          {t("Users")}
        </h1>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-start md:justify-between space-x-4 mb-6">
          <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
            {" "}
            <span className="text-[#4B465C] opacity-80">{t("show")}</span>
            <div className="bg-[#EDEDED] px-2 sm:px-4 py-1 sm:py-3 w-full max-w-[350px]">
              <label className="inline-flex items-center mr-4 text-[#4B465C] opacity-80">
                <input
                  type="radio"
                  name="filter"
                  value="all"
                  checked={filter === "all"}
                  onChange={() => handleFilterChange("all")}
                  className="form-radio cursor-pointer"
                />
                <span className="ml-2 capitalize">{t("all users")}</span>
              </label>
              <label className="inline-flex items-center text-[#4B465C] opacity-80">
                <input
                  type="radio"
                  name="filter"
                  value="certified"
                  checked={filter === "certified"}
                  onChange={() => handleFilterChange("certified")}
                  className="form-radio cursor-pointer"
                />
                <span className="ml-2">{t("certified users")}</span>
              </label>
            </div>
          </div>
          <div className="flex items-center border border-[#DBDADE] justify-between max-w-[350px]">
            <input
              type="text"
              placeholder={t("Search by name")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="px-2 sm:px-4 py-1 sm:py-3 w-[200px] sm:w-[330px] focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-2 sm:px-3 cursor-pointer flex items-center text-white bg-primary py-3 gap-1"
            >
              <BiSearch className="" />
              Search
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-600 mb-4">
            {t("Error")}: {error}
          </div>
        )}

        {/* Users Table */}
        <div className="w-full overflow-x-auto custom-scrollbar pb-2">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner className="w-12 h-12" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary text-white text-base 2xl:text-xl capitalize">
                <tr>
                  <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                    {t("name")}
                  </th>
                  <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                    {t("email")}
                  </th>
                  <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                    {t("course")}
                  </th>
                  <th className="px-2 sm:px-6 py-1 sm:py-3 text-left font-medium">
                    {t("progress")}
                  </th>
                  <th className="px-2 sm:px-6 py-1 sm:py-3 text-center font-medium text-nowrap">
                    {t("certificate issued")}
                  </th>
                  <th className="px-2 sm:px-6 py-1 sm:py-3 text-center font-medium">
                    {t("Action")}
                  </th>
                </tr>
              </thead>
              <tbody
                className="bg-white"
                style={{ border: "1px solid #AAA9A9" }}
              >
                {users.map((user: any) => (
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
                      className="px-2 sm:px-6 py-2 sm:py-4 min-w-[200px] max-w-[250px] text-wrap"
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
                        onClick={() => handleClientProfile(user.id)}
                      >
                        {t("View Profile")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Pagination */}
        <div
          className="flex items-center justify-center p-4 space-x-2"
          role="pagination"
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-2 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
            title="Previous"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
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
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-2 py-[10px] bg-[#CCCCCC] text-[#6F6B7D] cursor-pointer"
            title="Next"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
