import React, { useState, useRef, useEffect } from "react";
import { useAdminClientProfile } from "../hooks/useAdminClientProfile";
import { GoClock } from "react-icons/go";
import { ImUser } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { API_BASE } from "../utils/ulrs";
import { useAdminResetPasswordOfClient } from "../hooks/useAdminResetPasswordOfClient";
import Spinner from "./loaders/Spinner";

export const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useAdminClientProfile();
  const {
    resetPassword,
    loading: resetting,
    error: resetError,
    success: resetSuccess,
  } = useAdminResetPasswordOfClient(Number(id));
  const [activeTab, setActiveTab] = useState<"Courses" | "Certificates">(
    "Courses"
  );
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // const onBack = () => navigate(-1);

  // Password Reset States
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowResetPasswordModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (newPwd !== confirmPwd) {
      setLocalError("Passwords don't match");
      return;
    }
    await resetPassword(newPwd);
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center gap-3 fixed top-1/2 left-1/2">
        <Spinner className="w-10 h-10" />
        <p>Loading...</p>
      </div>
    );
  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return null;

  const { user, enrolledCourses, certificates } = data;
  const tabs = ["Courses", "Certificates"] as const;

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <main className="px-2 sm:px-6 py-4">
          {/* Profile Info */}
          <div className="flex space-x-4 sm:space-x-8 mb-8 items-center">
            <ImUser className="w-20 h-20 bg-gray-200 rounded-full p-4" />

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-base">
                <span className="font-semibold text-text-dark">Name:</span>
                <span className="text-text-light">{user.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-base">
                <span className="font-semibold text-text-dark">Email:</span>
                <span className="text-text-light">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-inputBorder mb-6">
            <ul className="flex space-x-4">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 cursor-pointer ${
                    activeTab === tab
                      ? "border-b-2 text-primary"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          {activeTab === "Courses" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.length > 0 ? (
                <>
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-inputBorder p-2"
                    >
                      <img
                        src={`${API_BASE}/uploads/courses/${course.imageUrl}`}
                        alt={course.title}
                        className="w-full aspect-video object-cover"
                      />
                      <h3 className="font-semibold mt-2 line-clamp-1">
                        {course.title}
                      </h3>
                      <div className="flex justify-between gap-2">
                        {" "}
                        <div className="flex items-center text-sm text-gray-500 my-1">
                          <GoClock className="mr-1 text-text-dark" />
                          {course.duration}
                        </div>
                        <div className="mt-1 text-sm font-medium text-primary">
                          Progress: {course.progress}%
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p>No Progres To Show</p>
                </>
              )}
            </div>
          )}

          {activeTab === "Certificates" && (
            <div className="flex flex-col items-center w-full sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:w-fit">
              {certificates.length > 0 ? (
                <>
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="border border-inputBorder p-2 max-w-[320px]"
                    >
                      {/* <img src={`${API_BASE}${cert.imageUrl}`} alt={cert.courseName} className="w-full h-32 object-cover rounded" /> */}
                      <div className="flex flex-col gap-1">
                        <img
                          src="/certDummy.png"
                          alt={cert.courseName}
                          className="w-full aspect-video h-44 border border-[#CB5A31]"
                        />
                        <h3 className="font-semibold text-text-dark line-clamp-1 mt-2">
                          {cert.courseName}
                        </h3>
                        <div className="text-sm text-text-dark font-semibold">
                          Certificate ID:{" "}
                          <span className="text-text-light font-normal">
                            {cert.id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-text-dark font-semibold">
                            Issue Date:{" "}
                            <span className="text-text-light font-normal">
                              {cert.issueDate}
                            </span>
                          </div>
                          <a
                            href={`${API_BASE}${cert.imageUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary font-semibold hover:underline cursor-pointer"
                          >
                            View Certificate
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p>No Certificate Issued Yet</p>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Reset Password Modal */}

      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80" ref={modalRef}>
            <IoMdClose
              onClick={() => setShowResetPasswordModal(false)}
              className="absolute top-2 right-2 cursor-pointer text-xl text-primary"
            />
            <h2 className="text-lg font-bold mb-4">Reset Password</h2>

            {localError && (
              <div className="mb-2 text-red-600">{localError}</div>
            )}
            {resetError && (
              <div className="mb-2 text-red-600">{resetError}</div>
            )}
            {resetSuccess && (
              <div className="mb-2 text-green-600">Password updated!</div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="relative">
                <label className="block mb-1">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full border px-3 py-2 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-9"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>

              <div className="relative">
                <label className="block mb-1">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="w-full border px-3 py-2 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-9"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowResetPasswordModal(false)}
                  className="flex-1 border px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetting}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {resetting ? "Updating…" : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
