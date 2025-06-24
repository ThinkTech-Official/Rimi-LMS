import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ClientHeader: React.FC = () => {
  const [isLanguageSelectOpen, setIsLanguageSelectOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  type Language = "En" | "Fr";
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("En");
  const navigate = useNavigate();

  const handleLanguageSelect = (lang: Language) => {
    if (lang === selectedLanguage) {
      setIsLanguageSelectOpen(false);
      return;
    }

    setSelectedLanguage(lang);
    setIsLanguageSelectOpen(false);
    toggleProfileMenu();
  };

  const handleProfileClick = () => {
    navigate("/client/profile");
    toggleProfileMenu();
  };

  const toggleLanguageSelect = () => {
    setIsLanguageSelectOpen(!isLanguageSelectOpen);
  };
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  return (
    <header className=" bg-white border-b border-[#E9EEF1] flex items-center justify-end px-6 space-x-4 py-4 gap-3">
      <div className="relative">
        <button
          className="flex items-center gap-2 text-primary text-[16px] 2xl:text-xl font-medium relative cursor-pointer"
          onClick={toggleLanguageSelect}
        >
          <span className="flex gap-2 items-center">
            {" "}
            <img
              src="ion_language.svg"
              alt=""
              className="h-5 w-5 2xl:w-6 2xl:h-6"
            />{" "}
            {selectedLanguage}
          </span>
          <MdKeyboardArrowRight
            className={`h-4 w-4 2xl:w-6 2xl:h-6 transform transition ${
              isLanguageSelectOpen ? "rotate-90" : ""
            }`}
          />
        </button>
        {isLanguageSelectOpen && (
          <div className="absolute mt-4 w-24 2xl:w-28 rounded-sm shadow-lg bg-white border border-[#E9EEF1] z-10">
            <ul className="py-1 text-sm 2xl:text-lg text-gray-700">
              <li>
                <button
                  onClick={() => handleLanguageSelect("En")}
                  className="block w-full text-left px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                >
                  En
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLanguageSelect("Fr")}
                  className="block w-full text-left px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                >
                  Fr
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          className="flex items-center gap-2 text-primary text-[16px] 2xl:text-xl font-medium cursor-pointer"
          onClick={toggleProfileMenu}
        >
          <span className="flex gap-2 items-center">
            <FaUserCircle className="h-5 w-5 2xl:w-6 2xl:h-6 text-primary" />
            Username{" "}
          </span>
          <MdKeyboardArrowRight
            className={`h-4 w-4 2xl:w-6 2xl:h-6 transform transition ${
              isProfileMenuOpen ? "rotate-90" : ""
            }`}
          />
        </button>
        {isProfileMenuOpen && (
          <div className="absolute mt-4 ml-1 w-28 2xl:w-32 rounded-sm shadow-lg bg-white border border-[#E9EEF1] z-10">
            <ul className="py-1 text-sm 2xl:text-lg text-gray-700">
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex gap-2 items-center"
                  onClick={handleProfileClick}
                >
                  <FaUser className="h-4 w-4 2xl:w-5 2xl:h-5" /> Profile
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex gap-2 items-center">
                  <IoIosLogOut className="h-4 w-4 2xl:w-5 2xl:h-5" /> Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default ClientHeader;
