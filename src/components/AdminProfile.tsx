import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ImUser } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { TbEdit, TbX } from "react-icons/tb";

const AdminProfile: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
    // await resetPassword(newPwd);
  };

  return (
    <div className="max-w-[1600px]">
      <div className="px-2 sm:px-6 py-4">
        <h2 className="text-primary text-sm font-medium mb-3">&gt; Profile </h2>
        <h1 className="text-lg 2xl:text-2xl font-bold text-text-dark mb-3 sm:mb-6">
          Admin Profile
        </h1>
        <div>
          <div className="flex flex-col mt-8">
            <ImUser className="w-24 h-24 bg-gray-200 text-gray-400 rounded-md p-2" />
           

            <div className="mt-8 w-full max-w-md">
                 {/* Name */}
                      <div className="flex items-center mb-4 gap-2">
                        <span className="font-semibold ">Name:</span>
                        {!editMode ? (
                          <>
                            {/* <span className="flex-1 text-gray-700">{profile?.name}</span>
                            <button
                              onClick={() => setEditMode(true)}
                              title="Edit Name"
                              className="text-primary cursor-pointer"
                            >
                              <TbEdit className="w-5 h-5" />
                            </button> */}
                          </>
                        ) : (
                          <div className="flex flex-1 items-center gap-2">
                            {/* <input
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
                            </button> */}
                          </div>
                        )}
                      </div>
                      {/* {nameError && <p className="text-red-600 mb-2">{nameError}</p>} */}
              {/* Email */}
              <div className="flex items-center mb-4 gap-2">
                <span className="font-semibold">Email:</span>
                <span className="text-gray-700">admin@gmail.com</span>
              </div>

              <button
                onClick={() => setShowResetPasswordModal(true)}
                className="text-primary underline text-sm cursor-pointer"
              >
                Reset password?
              </button>
            </div>
          </div>

          {showResetPasswordModal && (
            <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
              <div
                className="bg-white p-6 rounded shadow-lg w-[90%] sm:w-md"
                ref={modalRef}
              >
                <IoMdClose
                  onClick={() => setShowResetPasswordModal(false)}
                  className="absolute top-2 right-2 cursor-pointer text-xl text-primary"
                />
                <h2 className="text-lg font-bold mb-4">Reset Password</h2>

                {/* {resetError && (
                        <div className="mb-2 text-red-600">{resetError}</div>
                      )}
                      {resetSuccess && (
                        <div className="mb-2 text-green-600">Password updated!</div>
                      )} */}

                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="relative">
                    <label className="block text-text-light-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                        className="w-full border border-inputBorder px-4 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                        required
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
                  </div>
                  <div className="relative">
                    <label className="block text-text-light-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        className="w-full border border-inputBorder px-4 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                        required
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
                  </div>
                  {localError && (
                    <div className="mb-2 text-red-600">{localError}</div>
                  )}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowResetPasswordModal(false)}
                      className="flex-1 border border-inputBorder cursor-pointer text-text-light-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      // disabled={resetting}
                      className="flex-1 px-4 py-2 sm:py-3 bg-primary text-white font-semibold cursor-pointer transition-all delay-100 shadow hover:bg-indigo-700"
                    >
                      {/* {resetting ? 'Updating…' : 'Update Password'} */}
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
