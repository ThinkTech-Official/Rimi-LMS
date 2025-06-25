import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ImUser } from "react-icons/im";

const AdminProfile: React.FC = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className="max-w-[1600px]">
      <div className="px-2 sm:px-6 py-4">
        <h2 className="text-primary text-sm font-medium mb-3">&gt; Profile </h2>
        <h1 className="text-lg 2xl:text-2xl font-bold text-text-dark mb-3 sm:mb-6">
          Admin Profile
        </h1>
        <div>
          <div className="w-full bg-[#F8F8F8] px-2 py-4 sm:p-6 md:p-8 lg:px-14 lg:py-15">
            <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-6">
              <div className="flex flex-col gap-1 sm:gap-2 items-center lg:items-start">
                <ImUser className="w-16 sm:w-24 h-16 sm:h-24 bg-gray-200 rounded-md text-text-light" />
                <p className="text-lg sm:text-xl text-[#1B1B1B]">Username</p>
                <div className="flex items-center space-x-2 text-sm sm:text-base">
                  <span className="font-semibold text-black">Password:</span>
                  <span className="text-black opacity-50">XXXXXXXXX</span>
                </div>
              </div>
              <div className="w-full lg:w-2/3 bg-white py-7 px-2 lg:px-5 flex flex-col gap-10">
                <h1 className="text-[28px] font-bold text-center">
                  Reset Password
                </h1>
                <form action="submit" className="flex flex-col gap-2">
                  <div className="flex flex-col relative">
                    <label className="text-sm text-text-light-2">
                      New Password
                    </label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      //   value={name}
                      //   onChange={(e) => setName(e.target.value)}
                      placeholder="Enter New Password"
                      className="w-full border border-inputBorder py-1 px-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-[38px] text-xl text-gray-500 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col relative">
                    <label className="text-sm text-text-light-2">
                      Confirm Password
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      //   value={name}
                      //   onChange={(e) => setName(e.target.value)}
                      placeholder="Renter Your Password"
                      className="w-full border border-inputBorder py-1 px-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-[38px] text-xl text-gray-500 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </button>
                  </div>
                  <button className="inline-block mt-1 text-sm sm:text-[16px] px-5 py-2 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150">
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
