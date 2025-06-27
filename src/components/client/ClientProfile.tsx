import { useState } from "react";
import { ImUser } from "react-icons/im";
import { TbEdit, TbX } from "react-icons/tb";

const ClientProfile: React.FC = () => {
  const [name, setName] = useState("Liam Smith");
  const [tempName, setTempName] = useState(name);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const handleResetCancel = () => {
    setShowPasswordReset(false);
    setNewPassword("");
  };
  return (
    <div className="p-2 sm:p-8 relative">
      {/* Breadcrumb */}
      <span className="text-primary font-medium flex items-center gap-2 cursor-pointer">
        &gt; Back To Courses
      </span>

      <div className="w-full flex flex-col  mt-[10%] sm:mt-10">
        <ImUser className="w-16 sm:w-24 h-16 sm:h-24 bg-gray-200 text-text-light rounded-md" />

        <div className="mt-5 sm:mt-8 flex flex-col">
          <h2 className="text-text-dark text-lg font-bold">User Information</h2>
          <div className="space-y-2 mt-5 sm:mt-8">
            <div className="flex items-center space-x-2 text-base">
              <span className="font-semibold text-black">Name:</span>

              {!editMode ? (
                <>
                  <span className="text-black opacity-50">Liam Smith</span>
                  <button
                    className="text-primary cursor-pointer ml-3"
                    title="Edit Name"
                    onClick={() => setEditMode(true)}
                  >
                    <TbEdit className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <>
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-[200px] border border-inputBorder p-1 focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                  <button
                    // onClick={handleCancel}
                    title="Cancel"
                    className="text-text-light ml-2"
                  >
                    <TbX
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => setEditMode(false)}
                    />
                  </button>
                  <button
                    // onClick={handleSave}
                    className="ml-2 bg-primary text-white px-3 py-1 font-medium cursor-pointer"
                  >
                    Save
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2 text-base">
              <span className="font-semibold text-black">Email:</span>
              <span className="text-black opacity-50">V0I7o@example.com</span>
            </div>

            {!showPasswordReset ? (
              <button
                className="text-primary underline text-sm underline-offset-2 cursor-pointer"
                onClick={() => setShowPasswordReset(true)}
              >
                Reset password?
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-[200px] border border-inputBorder p-1 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCancel}
                    title="Cancel"
                    className="text-text-light "
                  >
                    <TbX className="w-6 h-6 cursor-pointer" onClick={handleResetCancel}/>
                  </button>
                  <button
                    //   onClick={handleSave}
                    className="ml-2 bg-primary text-white px-3 py-1 font-medium cursor-pointer"
                    disabled={!newPassword.trim()}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
