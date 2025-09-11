import { useState, useEffect, useRef } from "react";
import { ImUser } from "react-icons/im";
import { TbEdit, TbX } from "react-icons/tb";
import { useProfile } from "../../hooks/useProfile";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useResetPassword } from "../../hooks/useResetPassword";
import Spinner from "../loaders/Spinner";
import { IoMdClose } from "react-icons/io";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useNotification from "../../hooks/useNotification";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

const ClientProfile: React.FC = () => {
  const {
    profile,
    loading: loadingProfile,
    error: profileError,
    refetch,
  } = useProfile();
  const {
    updateProfile,
    loading: savingName,
    error: nameError,
  } = useUpdateProfile();
  const {
    resetPassword,
    loading: savingPwd,
    // error: pwdError,
  } = useResetPassword();

  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState("");
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { triggerNotification } = useNotification();
  const { t } = useTranslation();
  interface PasswordForm {
    newPwd: string;
    confirmPwd: string;
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>();
  // when profile loads, initialize tempName
  useEffect(() => {
    if (profile) {
      setTempName(profile.name ?? "");
    }
  }, [profile]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowResetPasswordModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handlers
  const handleNameSave = async () => {
    try {
      const updated = await updateProfile({ name: tempName });
      setEditMode(false);
      setTempName(updated.name ?? "");
      await refetch();
    } catch {
      triggerNotification({
        type: "error",
        message: nameError ?? t("Update failed"),
        duration: 3000,
      });
    }
  };
  const handleResetSubmit = async (data: PasswordForm) => {
    await resetPassword(data.newPwd);
    reset();
  };
  const handleCloseModal = () => {
    setShowResetPasswordModal(false);
    reset();
  };
  if (loadingProfile)
    return (
      <div className="fixed top-1/2 left-1/2 flex flex-col items-center gap-2">
        <Spinner className="w-10 h-10" /> <p>Loading profile…</p>
      </div>
    );
  if (profileError)
    return (
      <div className="p-4 text-red-600">
        Error fetching profile: {profileError}{" "}
        <button onClick={refetch} className="underline">
          Try again
        </button>
      </div>
    );

  return (
    <div className="p-4 sm:p-8">
      {/* Breadcrumb */}
      <button
        onClick={() => window.history.back()}
        className="text-primary font-medium flex items-center gap-2 mb-4 cursor-pointer"
      >
        &gt; {t("back to course")}
      </button>

      <div className="flex flex-col mt-8">
        <ImUser className="w-24 h-24 bg-gray-200 text-gray-400 rounded-md p-2" />

        <div className="mt-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">{t("User Information")}</h2>

          {/* Name */}
          <div className="flex items-center mb-4 gap-2">
            <span className="font-semibold ">{t("name")}:</span>
            {!editMode ? (
              <>
                <span className="flex-1 text-gray-700">{profile?.name}</span>
                <button
                  onClick={() => setEditMode(true)}
                  title="Edit Name"
                  className="text-primary cursor-pointer"
                >
                  <TbEdit className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex flex-1 items-center gap-2">
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full border border-inputBorder px-2 py-1 sm:px-4 focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                <button
                  onClick={handleNameSave}
                  disabled={savingName}
                  title="Save Name"
                  className="bg-primary text-white px-3 py-1 cursor-pointer"
                >
                  {savingName ? "Saving…" : "Save"}
                </button>
                <button onClick={() => setEditMode(false)} title="Cancel">
                  <TbX className="w-5 h-5 text-text-light cursor-pointer" />
                </button>
              </div>
            )}
          </div>
          {nameError && <p className="text-red-600 mb-2">{nameError}</p>}

          {/* Email */}
          <div className="flex items-center mb-4 gap-2">
            <span className="font-semibold">Email:</span>
            <span className="text-gray-700">{profile?.email}</span>
          </div>

          <button
            onClick={() => setShowResetPasswordModal(true)}
            className="text-primary underline text-sm cursor-pointer"
          >
            {t("reset password")}?
          </button>
        </div>
      </div>

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
                      <EyeSlashIcon
                        className="h-5 w-5 cursor-pointer"
                        aria-hidden="true"
                      />
                    ) : (
                      <EyeIcon
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
                      <EyeSlashIcon
                        className="h-5 w-5 cursor-pointer"
                        aria-hidden="true"
                      />
                    ) : (
                      <EyeIcon
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
    </div>
  );
};

export default ClientProfile;
