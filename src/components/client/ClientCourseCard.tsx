import { GoClock } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useFetchCourseProgress } from "../../hooks/useFetchCourseProgress";
import { useAuth } from "../../context/AuthContext";
import { RiProgress3Line } from "react-icons/ri";
import Spinner from "../loaders/Spinner";
import { useTranslation } from "react-i18next";

interface ClientCourseCardProps {
  courseId: any;
  imageUrl: any;
  title: any;
  duration: any;
  description: any;
}

const ClientCourseCard = ({
  courseId,
  imageUrl,
  title,
  duration,
  description,
}: ClientCourseCardProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { progress, loading } = useFetchCourseProgress(courseId);
  console.log("from client course card course id is ", courseId);
  console.log("from client course card course id is ", duration);
  const percent = loading ? 0 : progress?.percentComplete ?? 0;

  const handleStartCourse = (id: number) => {
    navigate(`/client/play/${id}`);
  };

  const handleGenerate = () => {
    navigate(`/client/certificate/generate/${courseId}`, {
      state: { courseTitle: title, userName: user?.name },
    });
  };

  return (
    <>
      <div
        key={courseId}
        title={title}
        className="w-[95%] sm:w-[320px] xl:w-[370px] flex flex-col gap-2 p-2 justify-center items-centr md:justify-start"
        style={{
          boxShadow: "0px 4px 6.7px 0px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(235, 235, 235, 1)",
        }}
      >
        <div className="relative bg-blue-200 rounded-sm overflow-hidden h-60">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-fill"
          />

          {/* Progress Bar  */}
          <div
            className="absolute h-1 bg-red-500 bottom-0 left-0"
            style={{ width: `${percent}%` }}
          />

          <div className=" absolute top-2 right-2 flex items-center gap-1 text-[#6F6B7D] text-xs 2xl:text-base bg-white px-2.5 py-2 rounded-full">
            <div className="flex items-center gap-1">
              <GoClock />
              <span>{duration}</span>
            </div>

            {/* percentage badge */}
            <div className=" flex items-center space-x-1 bg-white rounded-full text-xs 2xl:text-base">
              {loading ? (
                <span className="w-8 flex items-center justify-center">
                  <Spinner className="w-3 h-3" />
                </span>
              ) : (
                <>
                  <RiProgress3Line className="text-text-light" />{" "}
                  <span>{percent}%</span>
                </>
              )}
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {title}
        </h2>
        <div className="text-gray-600 text-sm pr-2">
          <span className="line-clamp-1">{description}</span>
        </div>

        {loading ? (
          <>
            <button className="disabled border border-inputBorder px-5 py-1 sm:py-3 bg-white">
              <Spinner className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            {percent === 0 ? (
              // Zero Percent Show Start course
              <button
                className="inline-block mt-2 text-sm sm:text-[16px] px-5 py-2 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
                onClick={() => handleStartCourse(courseId)}
              >
                {t("Start Course")}
              </button>
            ) : percent === 100 ? (
              // 100 percent show get certificates
              <button
                className="inline-block mt-2 text-sm sm:text-[16px] px-5 py-2 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
                onClick={() => handleGenerate()}
              >
                {t("Get Certificate")}
              </button>
            ) : (
              // Some where between 0 and 100
              <button
                className="inline-block mt-2 text-sm sm:text-[16px] px-5 py-2 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
                onClick={() => handleStartCourse(courseId)}
              >
                {t("Continue Learning")}
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ClientCourseCard;
