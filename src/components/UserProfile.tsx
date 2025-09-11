import React, { useState, useRef, useEffect } from "react";
import { useAdminClientProfile } from "../hooks/useAdminClientProfile";
import { GoClock } from "react-icons/go";
import { ImUser } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { API_BASE } from "../utils/ulrs";
import { useAdminResetPasswordOfClient } from "../hooks/useAdminResetPasswordOfClient";
import Spinner from "./loaders/Spinner";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";

import useNotification from "../hooks/useNotification";

interface PasswordForm {
  newPwd: string;
  confirmPwd: string;
}
export const formatDate = (date: string) => {
  const d = date ? new Date(date) : new Date();
  const formattedDate = [
    String(d.getDate()).padStart(2, "0"),
    String(d.getMonth() + 1).padStart(2, "0"),
    d.getFullYear(),
  ].join("-");
  return formattedDate;
};
export const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data, loading, error } = useAdminClientProfile();
  const {
    resetPassword,
    loading: savingPwd,
    error: resetError,
    success: resetSuccess,
  } = useAdminResetPasswordOfClient(Number(id));

  const { triggerNotification, NotificationComponent } =
    useNotification("top-center");

  const [activeTab, setActiveTab] = useState<"Courses" | "Certificates">(
    "Courses"
  );
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // const onBack = () => navigate(-1);

  // Password Reset States
  const [localError, setLocalError] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>();

  // Handle notification triggers for success/error
  useEffect(() => {
    if (resetSuccess) {
      triggerNotification({
        type: "success",
        message: t("Password reset successfully"),
        duration: 4000,
      });
      // Close modal on success
      setShowResetPasswordModal(false);
      reset(); // Reset form
    }
  }, [resetSuccess, triggerNotification, t, reset]);

  useEffect(() => {
    if (resetError) {
      triggerNotification({
        type: "error",
        message: resetError,
        duration: 5000,
      });
    }
  }, [resetError, triggerNotification, t]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowResetPasswordModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResetSubmit = async (data: PasswordForm) => {
    await resetPassword(data.newPwd);
    // reset();
  };
  const handleCloseModal = () => {
    setShowResetPasswordModal(false);
    reset();
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center gap-3 fixed top-1/2 left-1/2">
        <Spinner className="w-10 h-10" />
        <p>{t("Loading...")}</p>
      </div>
    );
  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return null;

  const { user, enrolledCourses, certificates } = data;

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <main className="px-2 sm:px-6 py-4">
          {/* Profile Info */}
          <div className="flex space-x-4 sm:space-x-8 mb-8 items-center">
            <ImUser className="w-20 h-20 bg-gray-200 rounded-full p-4" />

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-base">
                <span className="font-semibold text-text-dark">
                  {t("name")}:
                </span>
                <span className="text-text-light">{user.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-base">
                <span className="font-semibold text-text-dark">
                  {t("Email")}:
                </span>
                <span className="text-text-light">{user.email}</span>
              </div>
              <button
                onClick={() => setShowResetPasswordModal(true)}
                className="text-primary underline text-sm cursor-pointer"
              >
                {t("reset password")}?
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-inputBorder mb-6">
            <ul className="flex space-x-4">
              <li
                onClick={() => setActiveTab("Courses")}
                className={`pb-2 cursor-pointer ${
                  activeTab === "Courses"
                    ? "border-b-2 text-primary"
                    : "text-gray-500"
                }`}
              >
                {t("Courses")}
              </li>
              <li
                onClick={() => setActiveTab("Certificates")}
                className={`pb-2 cursor-pointer ${
                  activeTab === "Certificates"
                    ? "border-b-2 text-primary"
                    : "text-gray-500"
                }`}
              >
                {t("certificates")}
              </li>
            </ul>
          </div>

          {/* Content */}
          {activeTab === "Courses" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <div className="mt-1 text-sm font-medium text-primary capitalize">
                          {t("progress")}: {course.progress}%
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p>{t("No progres to show")}</p>
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
                          {t("Certificate")} ID:{" "}
                          <span className="text-text-light font-normal">
                            {cert.id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-text-dark font-semibold">
                            {t("Issued at")}:{" "}
                            <span className="text-text-light font-normal">
                              {formatDate(cert.issueDate)}
                            </span>
                          </div>
                          <a
                            href={`${API_BASE}${cert.imageUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary font-semibold hover:underline cursor-pointer"
                          >
                            {t("View Certificate")}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p>{t("No certificate issued yet")}</p>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Reset Password Modal */}

      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded shadow-lg w-[90%] sm:w-md relative"
            ref={modalRef}
          >
            <IoMdClose
              onClick={handleCloseModal}
              className="absolute top-2 right-2 cursor-pointer text-xl text-primary"
            />
            <h2 className="text-lg font-bold mb-4">{t("reset password")}</h2>

            <form
              onSubmit={handleSubmit(handleResetSubmit)}
              className="space-y-4"
            >
              <div className="relative">
                <label className="block text-text-light-2 capitalize">
                  {t("new password")}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPwd", {
                      required: t("New password is required") as string,
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                      validate: {
                        hasLetter: (value) =>
                          /[A-Za-z]/.test(value) ||
                          "Password must contain at least one letter",
                        hasNumber: (value) =>
                          /\d/.test(value) ||
                          "Password must contain at least one number",
                      },
                    })}
                    className="w-full border border-inputBorder px-4 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500"
                  >
                    {showNewPassword ? (
                      <EyeIcon
                        className="h-5 w-5 cursor-pointer"
                        aria-hidden="true"
                      />
                    ) : (
                      <EyeSlashIcon
                        className="h-5 w-5 cursor-pointer"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
                {errors.newPwd && (
                  <p className="text-red-500 text-sm">
                    {t(String(errors.newPwd.message))}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-text-light-2 capitalize">
                  {t("confirm password")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPwd", {
                      required: t("Confirm new password") as string,
                      validate: (value) =>
                        value === watch("newPwd") || t("Passwords don't match"),
                    })}
                    className="w-full border border-inputBorder px-4 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-3 right-0 pr-3 flex items-center text-zinc-500"
                  >
                    {showConfirmPassword ? (
                      <EyeIcon
                        className="h-5 w-5 cursor-pointer"
                        aria-hidden="true"
                      />
                    ) : (
                      <EyeSlashIcon
                        className="h-5 w-5 cursor-pointer"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
                {errors.confirmPwd && (
                  <p className="text-red-500 text-sm">
                    {t(String(errors.confirmPwd.message))}
                  </p>
                )}
              </div>
              {localError && (
                <div className="mb-2 text-red-600">{localError}</div>
              )}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 border border-inputBorder cursor-pointer text-text-light-2"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  // disabled={resetting}
                  disabled={savingPwd}
                  className="flex-1 px-4 py-2 sm:py-3 bg-primary text-white font-semibold cursor-pointer transition-all delay-100 shadow hover:bg-indigo-700"
                >
                  {savingPwd ? `${t("Updating")}...` : `${t("Update")}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {NotificationComponent}
    </div>
  );
};

export default UserProfile;
