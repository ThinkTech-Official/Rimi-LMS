import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FetchingError: React.FC = () => {
  const navigate = useNavigate();
  const url = window.location.href;
  const isClient = url.includes("client");
  const { t } = useTranslation();
  const handleBackToHome = () =>
    isClient ? navigate("/advisor") : navigate("/admin/home");
  return (
    <div className="p-4 fixed w-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center max-w-sm sm:max-w-xl ml-6">
      <img src="/Failed.png" alt="Not Found" className="w-24 md:w-32" />
      <div className="flex flex-col items-center gap-5 md:gap-10 mt-8 sm:mt-10">
        <h3 className="text-[1.2rem] sm:text-[1.6rem] text-text-dark font-bold">
          {t("Failed to load data")}
        </h3>
        <button
          onClick={handleBackToHome}
          className="bg-primary text-sm sm:text-base text-white font-semibold py-2 sm:py-3 w-full hover:bg-indigo-700 cursor-pointer capitalize"
        >
         {t("Back to home")}
        </button>
      </div>
    </div>
  );
};
export default FetchingError;
