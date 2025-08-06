import { useNavigate } from "react-router-dom";

const FetchingError: React.FC = () => {
  const navigate = useNavigate();
  const url = window.location.href;
  const isClient = url.includes("client");
  const handleBackToHome = () =>
    isClient ? navigate("/client") : navigate("/admin/home");
  return (
    <div className="p-4 fixed w-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <img src="/Failed.png" alt="Not Found" className="w-24 md:w-32" />
      <div className="flex flex-col items-center gap-5 md:gap-10 mt-8 sm:mt-10">
        <h3 className="text-[1.3rem] md:text-[2rem] text-text-dark font-bold">
          Failed to load data
        </h3>
        <button
          onClick={handleBackToHome}
          className="bg-primary text-white font-semibold py-2 sm:py-3 w-full hover:bg-indigo-700 cursor-pointer"
        >
          Back To Home
        </button>
      </div>
    </div>
  );
};
export default FetchingError;
