import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ImUser } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { TbEdit, TbX } from "react-icons/tb";
import { useAdminProfile } from "../hooks/useAdminProfile";
import { useUpdateAdminPassword } from "../hooks/useUpdateAdminPassword";

const AdminProfile: React.FC = () => {


   const { profile, loading, error } = useAdminProfile();
  const {
    updatePassword,
    loading: updating,
    error: updateError,
    success,
  } = useUpdateAdminPassword();


  // const [newPassword, setNewPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [currentPwd, setCurrentPwd]     = useState('');
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
    await updatePassword(currentPwd, newPwd);
  };

  if (loading) return <p>Loading profile…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-[1600px]">
      <div className="px-2 sm:px-6 py-4">
        <h2 className="text-primary text-sm font-medium mb-3">&gt; Profile </h2>
        <h1 className="text-lg 2xl:text-2xl font-bold text-text-dark mb-3 sm:mb-6">
          Admin Profile
        </h1>
        {profile && (
          <div>
          <div className="flex flex-col mt-8">
            <ImUser className="w-24 h-24 bg-gray-200 text-gray-400 rounded-md p-2" />
           

            <div className="mt-8 w-full max-w-md">
                 {/* Name */}
                     <div className="flex items-center mb-4 gap-2">
                <span className="font-semibold">Name:</span>
                <span className="text-gray-700">{profile?.name}</span>
              </div> 
              {/* Email */}
              <div className="flex items-center mb-4 gap-2">
                <span className="font-semibold">Email:</span>
                <span className="text-gray-700">{profile?.email}</span>
              </div>

              {/* Join Date */}
              <div className="flex items-center mb-4 gap-2">
                <span className="font-semibold">Joined:</span>
                <span className="text-gray-700">{new Date(profile.createdAt).toLocaleDateString()}</span>
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

               {updateError && <p className="text-red-600 mb-2">{updateError}</p>}
            {success     && <p className="text-green-600 mb-2">Password updated!</p>}
            {localError  && <p className="text-red-600 mb-2">{localError}</p>}

                <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  className="w-full border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label>New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="w-full border px-3 py-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showNew ? <EyeSlashIcon className="h-5" /> : <EyeIcon className="h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label>Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="w-full border px-3 py-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showConfirm ? <EyeSlashIcon className="h-5" /> : <EyeIcon className="h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-primary text-white cursor-pointer"
                >
                  {updating ? 'Updating…' : 'Update'}
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
