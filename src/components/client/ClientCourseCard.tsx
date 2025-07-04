import React, { useState } from 'react'
import { GoClock } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { useFetchCourseProgress } from '../../hooks/useFetchCourseProgress';


interface ClientCourseCardProps {
    courseId: any;
    imageUrl: any;
    title: any;
    duration: any;
    description: any;

}

const ClientCourseCard = ({courseId, imageUrl , title, duration, description}: ClientCourseCardProps) => {
  

    const navigate = useNavigate()

     const { progress, loading } = useFetchCourseProgress(courseId);

      const [showFullDescription, setShowFullDescription] = useState(false);

      console.log('from client course card course id is ', courseId)

      console.log('from client course card course id is ', duration)
    


    //   console.log('from client course card progress for course is', progress)

      const percent = loading ? 0 : progress?.percentComplete ?? 0;


      
      const getTruncatedText = (text: string, wordLimit: number) => {
        const words = text.split(" ");
        return words.length > wordLimit
          ? words.slice(0, wordLimit).join(" ") + "..."
          : text;
      };

      const handleStartCourse = (id: number) => {
    navigate(`/client/play/${id}`);
  };

  const handleGenerate = () => {
  navigate(`/client/certificate/generate/${courseId}`, {
    state: { courseTitle: title },
  });
};
     
  
    return (
    <>
    
    <div
            key={courseId}
            className="w-[95%] sm:w-[320px] xl:w-[380px] flex flex-col gap-2 p-4 justify-center items-centr md:justify-start"
            style={{
              boxShadow: "0px 4px 6.7px 0px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(235, 235, 235, 1)",
            }}
          >
            <div className="relative bg-blue-200 rounded-sm overflow-hidden h-60">
              <img
                src={imageUrl}
                alt={title}
                className="absolute inset-0 m-auto h-40 w-40 mix-blend-multiply"
              />

              {/* Progress Bar  */}
               <div
          className="absolute h-1 bg-red-500 bottom-0 left-0"
          style={{ width: `${percent}%` }}
        />

              
              <div className=" absolute top-2 right-2 flex items-center text-[#6F6B7D] text-xs 2xl:text-base space-x-3 bg-white px-2.5 py-2 rounded-full">
                <div className="flex items-center gap-1">
                  <GoClock />
                  <span>{duration}</span>
                  
                </div>

                {/* percentage badge */}
        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white px-2 py-1 rounded-full text-xs">
          {loading
            ? <span>Loading…</span>
            : <><GoClock /> <span>{percent}%</span></>
          }
        </div>
                {/* <div className="flex items-center gap-1">
                  <img src="Document.svg" alt="" />
                  <span>{course.questions} Questions</span>
                </div> */}
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <div>
              <p className="text-gray-600 text-sm pr-2">
                {showFullDescription
                  ? description
                  : description
                  ? getTruncatedText(description, 20)
                  : ""}
              </p>

              {description &&
                description.split(" ").length > 20 && (
                  <button
                    className="text-primary text-xs mt-1 underline underline-offset-2 inline cursor-pointer"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? "less" : "more"}
                  </button>
                )}
            </div>

            { percent === 0 ? 
            ( 
                // Zero Percent Show Start course 
                <button
              className="inline-block mt-2 text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
              onClick={() => handleStartCourse(courseId)}
            >
              Start Course
            </button>
            ) 
            : 
            (
                percent === 100 ? 
                (
                    // 100 percent show get certificates 
                    <button
              className="inline-block mt-2 text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
              onClick={() => handleGenerate()}
            >
              Get Certificate
            </button>
                ) 
                : 
                (
                    // Some where between 0 and 100 
                    <button
              className="inline-block mt-2 text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
              onClick={() => handleStartCourse(courseId)}
            >
              Continue Course
            </button>
                )
            )}
          </div>

    </>
  )
}

export default ClientCourseCard