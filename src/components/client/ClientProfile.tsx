



import { useState, useEffect } from "react";
import { ImUser } from "react-icons/im";
import { TbEdit, TbX } from "react-icons/tb";
import { useProfile } from "../../hooks/useProfile";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useResetPassword } from "../../hooks/useResetPassword";

const ClientProfile: React.FC = () => {
  const { profile, loading: loadingProfile, error: profileError, refetch } = useProfile();
  const { updateProfile, loading: savingName, error: nameError } = useUpdateProfile();
  const { resetPassword, loading: savingPwd, error: pwdError } = useResetPassword();

  const [editMode, setEditMode]               = useState(false);
  const [tempName, setTempName]               = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword]         = useState("");

  // when profile loads, initialize tempName
  useEffect(() => {
    if (profile) {
      setTempName(profile.name ?? "");
    }
  }, [profile]);

  // handlers
  const handleNameSave = async () => {
    try {
      const updated = await updateProfile({ name: tempName });
      setEditMode(false);
      setTempName(updated.name ?? "");
      await refetch();
    } catch {
      // error is in nameError
    }
  };

  const handlePwdSave = async () => {
    try {
      await resetPassword(newPassword);
      setShowPasswordReset(false);
      setNewPassword("");
    } catch {
      // error 
    }
  };

  if (loadingProfile) return <div>Loading profile…</div>;
  if (profileError)
    return (
      <div className="p-4 text-red-600">
        Error fetching profile: {profileError}{" "}
        <button onClick={refetch} className="underline">Try again</button>
      </div>
    );

  return (
    <div className="p-4 sm:p-8">
      {/* Breadcrumb */}
      <button
        onClick={() => window.history.back()}
        className="text-primary font-medium flex items-center gap-2 mb-4"
      >
        &gt; Back To Courses
      </button>

      <div className="flex flex-col items-center mt-8">
        <ImUser className="w-24 h-24 bg-gray-200 text-gray-400 rounded-md p-2" />

        <div className="mt-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">User Information</h2>

          {/* Name */}
          <div className="flex items-center mb-4">
            <span className="font-semibold w-24">Name:</span>
            {!editMode ? (
              <>
                <span className="flex-1 text-gray-700">{profile?.name}</span>
                <button
                  onClick={() => setEditMode(true)}
                  title="Edit Name"
                  className="text-primary"
                >
                  <TbEdit className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex flex-1 items-center gap-2">
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 border border-gray-300 p-1"
                  autoFocus
                />
                <button onClick={() => setEditMode(false)} title="Cancel">
                  <TbX className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={handleNameSave}
                  disabled={savingName}
                  className="bg-primary text-white px-3 py-1 rounded"
                >
                  {savingName ? "Saving…" : "Save"}
                </button>
              </div>
            )}
          </div>
          {nameError && <p className="text-red-600 mb-2">{nameError}</p>}

          {/* Email */}
          <div className="flex items-center mb-4">
            <span className="font-semibold w-24">Email:</span>
            <span className="text-gray-700">{profile?.email}</span>
          </div>

          {/* Password Reset */}
          {!showPasswordReset ? (
            <button
              onClick={() => setShowPasswordReset(true)}
              className="text-primary underline text-sm"
            >
              Reset password?
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 p-1"
              />
              <div className="flex items-center gap-2">
                <button onClick={() => { setShowPasswordReset(false); setNewPassword(""); }}>
                  <TbX className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={handlePwdSave}
                  disabled={savingPwd || !newPassword.trim()}
                  className="bg-primary text-white px-3 py-1 rounded"
                >
                  {savingPwd ? "Saving…" : "Save"}
                </button>
              </div>
              {pwdError && <p className="text-red-600">{pwdError}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;