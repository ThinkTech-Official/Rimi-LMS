import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { ImUser } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { useUpdateAdminPassword } from "../hooks/useUpdateAdminPassword";
import Spinner from "./loaders/Spinner";
import { useTranslation } from "react-i18next";

const AdminProfile: React.FC = () => {
  const { profile, loading, error } = useAdminProfile();
  const {
    updatePassword,
    loading: updating,
    error: updateError,
    success,
  } = useUpdateAdminPassword();
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [, setShowModal] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
    await updatePassword(currentPwd, newPwd);
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center gap-3 fixed top-1/2 left-1/2">
        <Spinner className="w-10 h-10" />
        <p>Loading...</p>
      </div>
    );
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-[1600px]">
      <div className="px-2 sm:px-6 py-4">
        <h2 className="text-primary text-sm font-medium mb-3 capitalize">
          &gt; {t("profile")}{" "}
        </h2>
        <h1 className="text-lg 2xl:text-2xl font-bold text-text-dark mb-3 sm:mb-6">
          {t("Admin Profile")}
        </h1>
        {profile && (
          <div>
            <div className="flex flex-col mt-8">
              <ImUser className="w-24 h-24 bg-gray-200 text-gray-400 rounded-md p-2" />

              <div className="mt-8 w-full max-w-md">
                {/* Name */}
                <div className="flex items-center mb-4 gap-2">
                  <span className="font-semibold">{t("name")}:</span>
                  <span className="text-gray-700">{profile?.name}</span>
                </div>
                {/* Email */}
                <div className="flex items-center mb-4 gap-2">
                  <span className="font-semibold">Email:</span>
                  <span className="text-gray-700">{profile?.email}</span>
                </div>

                {/* Join Date */}
                <div className="flex items-center mb-4 gap-2">
                  <span className="font-semibold">{t("Joined at")}:</span>
                  <span className="text-gray-700">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
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
                    onClick={() => setShowResetPasswordModal(false)}
                    className="absolute top-2 right-2 cursor-pointer text-xl text-primary"
                  />
                  <h2 className="text-lg font-bold mb-4">
                    {t("reset password")}
                  </h2>

                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div>
                      <label className="block text-text-light-2 capitalize">
                        {t("Current password")}
                      </label>
                      <input
                        type="password"
                        value={currentPwd}
                        onChange={(e) => setCurrentPwd(e.target.value)}
                        className="w-full border border-inputBorder px-4 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-text-light-2 capitalize">
                        {t("new password")}
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          value={newPwd}
                          onChange={(e) => setNewPwd(e.target.value)}
                          className="w-full border border-inputBorder px-4 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew((v) => !v)}
                          className="absolute inset-y-3 right-0 pr-3 flex items-center text-zinc-500"
                        >
                          {showNew ? (
                            <EyeSlashIcon className="h-5 cursor-pointer" />
                          ) : (
                            <EyeIcon className="h-5 cursor-pointer" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-text-light-2 capitalize">
                        {t("Confirm new password")}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={confirmPwd}
                          onChange={(e) => setConfirmPwd(e.target.value)}
                          className="w-full border border-inputBorder px-4 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute inset-y-3 right-0 pr-3 flex items-center text-zinc-500"
                        >
                          {showConfirm ? (
                            <EyeSlashIcon className="h-5 cursor-pointer" />
                          ) : (
                            <EyeIcon className="h-5 cursor-pointer" />
                          )}
                        </button>
                      </div>
                    </div>

                    {updateError && (
                      <p className="text-red-500 mb-2 -mt-2 text-sm">
                        {updateError}
                      </p>
                    )}
                    {success && (
                      <p className="text-green-600 mb-2 -mt-2 text-sm">
                        {t("Password updated")}!
                      </p>
                    )}
                    {localError && (
                      <p className="text-red-600 mb-2 -mt-2 text-sm">
                        {localError}
                      </p>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowResetPasswordModal(false)}
                        className="flex-1 border border-inputBorder cursor-pointer text-text-light-2"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 px-4 py-2 sm:py-3 bg-primary text-white font-semibold cursor-pointer transition-all delay-100 shadow hover:bg-indigo-700"
                      >
                        {updating ? `${t("Updating")}...` : `${t("Update")}`}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
