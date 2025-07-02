import {  useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import Quiz from "./Quiz";
import { MdFullscreen } from "react-icons/md";

import {
  useFetchCourseClient,
  type CourseClient,
  type TestClient,
} from "../../hooks/useFetchCourseClient";
import {
  useFetchTestClient,
  type TestWithQuestions,
} from "../../hooks/useFetchTestClient";

const CoursePlay = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch course with isCleared flags
  const { course: fetchedCourse, loading: loadingCourse, error: errorCourse , refetch  } = useFetchCourseClient(courseId!);

   // Mirror the hook’s course into local state so we can mutate it
  const [course, setCourse] = useState<CourseClient | null>(null);

  // current basic test (metadata)
  const [activeTestBasic, setActiveTestBasic] = useState<TestClient | null>(null);
  // fetch full test when a basic test is active
  const {
    test: fetchedTest,
    loading: loadingTest,
    error: errorTest,
  } = useFetchTestClient(courseId, activeTestBasic?.id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [lastPassedTime, setLastPassedTime] = useState<number>(0);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showTest, setShowTest] = useState<TestWithQuestions | null>(null);

  // keep track to avoid re-trigger
  const triggeredTests = useRef<Set<number>>(new Set());



   useEffect(() => {
    setCourse(fetchedCourse);
  }, [fetchedCourse]);

  // On mount or when course loads: seek to first un-passed test and pre-mark triggers
  // on mount or course change: seek to beginning or 1s past last passed test
  useEffect(() => {
    if (!course || !videoRef.current) return;
    // find all passed tests
    const passedTests = course.tests.filter(t => t.isCleared);
    // last passed test startTime (or 0 if none)
    const lastStart = passedTests.length > 0
      ? Math.max(...passedTests.map(t => t.startTime))
      : 0;
    // resume at 1 second after last passed test, or 0
    const resumeAt = lastStart > 0 ? lastStart + 1 : 0;
    setLastPassedTime(lastStart);

    // seek video to resume point
    videoRef.current.currentTime = resumeAt;

    // pre-mark tests up to resumeAt as triggered
    triggeredTests.current = new Set(
      course.tests
        .filter(t => t.startTime <= resumeAt)
        .map(t => t.id)
    );
  }, [course]);

  // auto-pause at tests
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !course) return;

    const onTimeUpdate = () => {
      const now = video.currentTime;
      for (const t of course.tests) {
        if (
          now >= t.startTime &&
          !triggeredTests.current.has(t.id) &&
          !t.isCleared
        ) {
          triggeredTests.current.add(t.id);
          video.pause();
          setActiveTestBasic(t);
          break;
        }
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [course]);

  // show full test when fetched
  useEffect(() => {
    if (fetchedTest) setShowTest(fetchedTest);
  }, [fetchedTest]);

  // user passed: update checkpoint and resume
  const handleResume = async () => {
    if (activeTestBasic){
      
       setLastPassedTime(activeTestBasic.startTime);
      //  await refetch()
    }
    setShowTest(null);
    videoRef.current?.play();
  };

  // user failed: allow re-trigger and seek back
  // const handleBack = () => {
  //   if (activeTestBasic) triggeredTests.current.delete(activeTestBasic.id);
  //   setShowTest(null);
  //   if (videoRef.current) {
  //     videoRef.current.currentTime = lastPassedTime;
  //     videoRef.current.play();
  //   }
  // };



    // user failed: allow re-trigger and seek back
    const handleBack = () => {
    // Hide the quiz UI
    setShowTest(null);

    if (activeTestBasic) {
      // Allow this test to fire again when replaying
      triggeredTests.current.delete(activeTestBasic.id);
      // Reset activeTestBasic so state change is detected next time
      setActiveTestBasic(null);
    }

    // Seek back to the last passed checkpoint (or 0)
    if (videoRef.current) {
      videoRef.current.currentTime = lastPassedTime;
      videoRef.current.play();
    }
  };








  if (loadingCourse || !course) return <p>Loading...</p>;
  if (errorCourse) return <p>Error: {errorCourse}</p>;
  
  return (

    <div className="flex min-h-screen bg-white">
      <main className="flex-1 px-2 py-6 sm:p-8 overflow-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-primary font-medium underline underline-offset-2 flex items-center gap-2 cursor-pointer"
        >
          &lt; Back To Courses
        </button>

        <div className="mt-6 bg-black rounded overflow-hidden relative max-w-[1100px] 2xl:max-w-[1200px]">
          <div
            className="relative w-full aspect-video bg-black rounded overflow-hidden"
            // ref={containerRef}
            // onMouseMove={handleMouseActivity}
            // onMouseLeave={handleMouseLeave}
          >
            <video
              ref={videoRef}
              src={course?.videoUrl}
              controls
              controlsList="nofullscreen"
              disableRemotePlayback
              disablePictureInPicture
              className="w-full h-full"
            />

            {/* <button
              onClick={toggleFullscreen}
              className="absolute top-2 right-2 bg-white/80 z-30 p-1.5 rounded-full cursor-pointer"
              title="Toggle Fullscreen"
            >
              <MdFullscreen
                className={`w-5 h-5 text-black ${
                  isFullscreen ? "w-8 h-8" : ""
                }`}
              />
            </button> */}


            {/* DONE 3  */}

            {showMarkers && (
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-transparent z-20 pointer-events-none">
                <div className="relative w-full h-full">
                  {course?.tests.map((test) => (
                    <div
                      key={test.id}
                      className={`absolute bottom-3.5 h-full w-4 flex items-center justify-center rounded-full ${test.isCleared ? 'bg-red-200' : 'bg-[#D9D9D9]'}`}
                      style={{ left: `${(test.startTime / (course.duration||1)) * 100}%` }}
                    >
                      <img src="/Document.svg" alt="" className="h-2.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* // DONE 3  */}

            {showTest && (
              <div className="absolute z-20 top-0 left-0 w-full h-full">
                <Quiz
                  test={showTest}
                  onBack={handleBack}
                  onResume={handleResume}
                  course={course}
                  setCourse={setCourse}
                  activeTestBasic={activeTestBasic}
                  
                />
              </div>
            )}
          </div>
        </div>

        {/* DONE 1 */}

        <h1 className="mt-6 text-xl sm:text-2xl font-semibold text-text-dark">
          {course?.name}
        </h1>
        {/* <p className="mt-2 text-text-light">
          {showFull ? course?.description : course?.description.slice(0, 120) + "…"}
          <button
            onClick={toggleDescription}
            className="ml-2 text-primary font-medium hover:underline cursor-pointer"
          >
            {showFull ? "less" : "more"}
          </button>
        </p> */}

        {/* // DONE 1 */}

        {/* DONE 2  */}

        <h2 className="mt-8 text-xl font-semibold text-text-dark">
          Study materials
        </h2>
        <ul className="mt-4 space-y-3">
          {course?.documents.map((mat) => (
            <li
              key={mat.id}
              className="bg-[#F5F5F5] p-3 flex flex-col md:flex-row items-center justify-between rounded gap-2"
            >
              <div className="flex flex-col md:flex-row gap-2 sm:gap-0 items-center space-x-4">
                <div className="bg-[#E4E3E3] flex items-center justify-center px-4 py-3 sm:px-6 sm:py-5">
                  <FaFilePdf className="w-7 h-8 sm:w-9 sm:h-11 fill-[#EF5350]" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-text-dark font-semibold text-lg sm:text-xl">
                    {mat.fileName}
                  </h3>
                  {/* <p className="text-text-light text-sm">{mat.description}</p> */}
                </div>
              </div>
              <a
                href={mat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1 sm:py-2 bg-primary text-base text-white font-medium hover:bg-indigo-700"
              >
                Open
              </a>
            </li>
          ))}
        </ul>

         {/* // DONE 2  */}


      </main>
    </div>


    
  );
};


export default CoursePlay;



































// =============================================================================



// import { type FC, useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";


// import { useFetchCourseClient, type CourseClient, type TestClient } from "../../hooks/useFetchCourseClient";
// import { useFetchTestClient, type TestWithQuestions } from '../../hooks/useFetchTestClient';

// import { FaFilePdf } from "react-icons/fa";
// import Quiz, { type Question } from "./Quiz";
// import { MdFullscreen } from "react-icons/md";



// const CoursePlay: FC = () => {

//   const { id: courseId } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//      // Fetch course with isCleared flags
//   const { course, loading: loadingCourse, error: errorCourse } = useFetchCourseClient(courseId!);


//   // current test id (basic)
//   const [activeTestBasic, setActiveTestBasic] = useState<TestClient | null>(null);

//   // fetch test questions when basic selected
//   const {
//     test: fetchedTest,
//     loading: loadingTest,
//     error: errorTest
//   } = useFetchTestClient(courseId, activeTestBasic?.id);


//   // refs and Ui State 

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [showFull, setShowFull] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [lastPausedBreakpoint, setLastPausedBreakpoint] = useState<
//     number | null
//   >(null);
//   const [lastPassedTime, setLastPassedTime] = useState<number>(0);
//   const [showMarkers, setShowMarkers] = useState(true);
//   const [showTest, setShowTest] = useState<TestWithQuestions | null>(null);
//   // const [maxAllowedTime, setMaxAllowedTime] = useState<number>(
//   //   course?.tests[0].startTime!
//   // );

 

  
//   const hideMarkersTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
//     null
//   );
//   const [isVideoPaused, setIsVideoPaused] = useState(false);


//     // Keep track of which tests have already triggered so you don’t re-pause for the same one
//   const triggeredTests = useRef<Set<number>>(new Set());

//   // const [activeTestBasic, setActiveTestBasic] = useState<BasicTest | null>(null);
//   // const [showTest, setShowTest] = useState<TestWithQuestions | null>(null);


//     // On mount or when course loads: seek to first un-passed test and pre-mark triggers
//   // on mount or course change: seek to beginning or 1s past last passed test
//   useEffect(() => {
//     if (!course) return;
//     const next = course.tests.find(t => !t.isCleared);
//     const startAt = next ? next.startTime : 0;
//     setLastPassedTime(startAt);
//     if (videoRef.current) {
//       videoRef.current.currentTime = startAt;
//     }
//   }, [course]);



//   // timeupdate effect will only fire for tests after that resume‐point: 
//   useEffect(() => {
//   if (!course || !videoRef.current) return;

//   // 1) Find first un‐passed test
//   const next = course.tests.find(t => !t.isCleared);
//   const resumeAt = next ? next.startTime : 0;

//   // 2) Seek the video to that point
//   videoRef.current.currentTime = resumeAt;
//   setLastPassedTime(resumeAt);

//   // 3) Mark as “already triggered” any test whose startTime <= resumeAt
//   triggeredTests.current = new Set(
//     course.tests
//       .filter(t => t.startTime <= resumeAt)
//       .map(t => t.id)
//   );
// }, [course]);


//     // 1) Attach a timeupdate listener as soon as we have course & video
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !course) return;

//     const onTimeUpdate = () => {
//       const now = video.currentTime;
//       for (const t of course.tests) {
//         if (
//           now >= t.startTime &&
//           !triggeredTests.current.has(t.id)
//         ) {
//           triggeredTests.current.add(t.id);
//           setLastPausedBreakpoint(t.startTime);
//           video.pause();
//           // 2) Tell your hook which test to load by id
//           setActiveTestBasic(t);
//           break;
//         }
//       }
//     };

//     video.addEventListener("timeupdate", onTimeUpdate);
//     return () => {
//       video.removeEventListener("timeupdate", onTimeUpdate);
//     };
//   }, [course]);


//     // 3) Once your hook actually returns the full test, display it
//   useEffect(() => {
//     if (fetchedTest) {
//       setShowTest(fetchedTest);
//     }
//   }, [fetchedTest]);


//     // 4) Handlers to resume the video or go back
//   const handleResume = () => {
//     if (activeTestBasic) {
//       setLastPassedTime(activeTestBasic.startTime);
//     }
//     setShowTest(null);
//     videoRef.current?.play();
//   };

//   // const handleBack = () => {
//   //   setShowTest(null);
//   //   // seek back to the last passed test (or 0 if none)
//   //   const seekTo = lastPassedTime;
//   //   if (videoRef.current){
//   //     videoRef.current.currentTime = seekTo;
//   //     videoRef.current.play()

//   //   }
//   //   // navigate(-1);
//   // };


//    const handleBack = () => {
//    setShowTest(null);

//    // Allow this test to fire again if we replay past its startTime
//    if (activeTestBasic) {
//      triggeredTests.current.delete(activeTestBasic.id);
//    }

//    // Seek back to the last PASSED checkpoint (or 0)
//    const seekTo = lastPassedTime;
//    if (videoRef.current) {
//      videoRef.current.currentTime = seekTo;
//      videoRef.current.play();
//    }
//  };

//  console.log('from course play ', course)
//  console.log('course loading value', loadingCourse)







  

  

 



 

  

//   // Show/hide long description
//   const toggleDescription = () => setShowFull((f) => !f);

  

//     // render
//   if (loadingCourse || !course) return <p>Loading...</p>;
//   if (errorCourse) return <p>Error: {errorCourse}</p>;
  
//   return (

//     <div className="flex min-h-screen bg-white">
//       <main className="flex-1 px-2 py-6 sm:p-8 overflow-auto">
//         <button
//           onClick={() => navigate(-1)}
//           className="text-primary font-medium underline underline-offset-2 flex items-center gap-2 cursor-pointer"
//         >
//           &lt; Back To Courses
//         </button>

//         <div className="mt-6 bg-black rounded overflow-hidden relative max-w-[1100px] 2xl:max-w-[1200px]">
//           <div
//             className="relative w-full aspect-video bg-black rounded overflow-hidden"
//             ref={containerRef}
//             // onMouseMove={handleMouseActivity}
//             // onMouseLeave={handleMouseLeave}
//           >
//             <video
//               ref={videoRef}
//               src={course?.videoUrl}
//               controls
//               controlsList="nofullscreen"
//               disableRemotePlayback
//               disablePictureInPicture
//               className="w-full h-full"
//             />

//             {/* <button
//               onClick={toggleFullscreen}
//               className="absolute top-2 right-2 bg-white/80 z-30 p-1.5 rounded-full cursor-pointer"
//               title="Toggle Fullscreen"
//             >
//               <MdFullscreen
//                 className={`w-5 h-5 text-black ${
//                   isFullscreen ? "w-8 h-8" : ""
//                 }`}
//               />
//             </button> */}


//             {/* DONE 3  */}

//             {showMarkers && (
//               <div className="absolute bottom-0 left-0 right-0 h-4 bg-transparent z-20 pointer-events-none">
//                 <div className="relative w-full h-full">
//                   {course?.tests.map((test) => (
//                     <div
//                       key={test.id}
//                       className={`absolute bottom-3.5 h-full w-4 flex items-center justify-center rounded-full ${test.isCleared ? 'bg-red-200' : 'bg-[#D9D9D9]'}`}
//                       style={{ left: `${(test.startTime / (course.duration||1)) * 100}%` }}
//                     >
//                       <img src="/Document.svg" alt="" className="h-2.5" />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* // DONE 3  */}

//             {showTest && (
//               <div className="absolute z-20 top-0 left-0 w-full h-full">
//                 <Quiz
//                   test={showTest}
//                   onBack={handleBack}
//                   onResume={handleResume}
                  
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* DONE 1 */}

//         <h1 className="mt-6 text-xl sm:text-2xl font-semibold text-text-dark">
//           {course?.name}
//         </h1>
//         <p className="mt-2 text-text-light">
//           {showFull ? course?.description : course?.description.slice(0, 120) + "…"}
//           <button
//             onClick={toggleDescription}
//             className="ml-2 text-primary font-medium hover:underline cursor-pointer"
//           >
//             {showFull ? "less" : "more"}
//           </button>
//         </p>

//         {/* // DONE 1 */}

//         {/* DONE 2  */}

//         <h2 className="mt-8 text-xl font-semibold text-text-dark">
//           Study materials
//         </h2>
//         <ul className="mt-4 space-y-3">
//           {course?.documents.map((mat) => (
//             <li
//               key={mat.id}
//               className="bg-[#F5F5F5] p-3 flex flex-col md:flex-row items-center justify-between rounded gap-2"
//             >
//               <div className="flex flex-col md:flex-row gap-2 sm:gap-0 items-center space-x-4">
//                 <div className="bg-[#E4E3E3] flex items-center justify-center px-4 py-3 sm:px-6 sm:py-5">
//                   <FaFilePdf className="w-7 h-8 sm:w-9 sm:h-11 fill-[#EF5350]" />
//                 </div>
//                 <div className="text-center sm:text-left">
//                   <h3 className="text-text-dark font-semibold text-lg sm:text-xl">
//                     {mat.fileName}
//                   </h3>
//                   {/* <p className="text-text-light text-sm">{mat.description}</p> */}
//                 </div>
//               </div>
//               <a
//                 href={mat.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-4 py-1 sm:py-2 bg-primary text-base text-white font-medium hover:bg-indigo-700"
//               >
//                 Open
//               </a>
//             </li>
//           ))}
//         </ul>

//          {/* // DONE 2  */}


//       </main>
//     </div>


    
//   );
// };


// export default CoursePlay;




























// ================================================================================


// import { type FC, useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";


// import { useFetchCourse, type Test as BasicTest } from '../../hooks/useFetchCourse'
// import { useFetchTestClient, type TestWithQuestions } from '../../hooks/useFetchTestClient';

// import { FaFilePdf } from "react-icons/fa";
// import Quiz, { type Question } from "./Quiz";
// import { MdFullscreen } from "react-icons/md";



// const CoursePlay: FC = () => {

//   const { id: courseId } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//     // fetch course and basic tests/docs
//     const { course , loading: loadingCourse , error: errorCourse } = useFetchCourse(courseId)


//   // current test id (basic)
//   const [activeTestBasic, setActiveTestBasic] = useState<BasicTest | null>(null);

//   // fetch test questions when basic selected
//   const {
//     test: fetchedTest,
//     loading: loadingTest,
//     error: errorTest
//   } = useFetchTestClient(courseId, activeTestBasic?.id);


//   // refs and Ui State 

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [showFull, setShowFull] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [lastPausedBreakpoint, setLastPausedBreakpoint] = useState<
//     number | null
//   >(null);
//   const [lastPassedTime, setLastPassedTime] = useState<number>(0);
//   const [showMarkers, setShowMarkers] = useState(true);
//   const [showTest, setShowTest] = useState<TestWithQuestions | null>(null);
//   const [maxAllowedTime, setMaxAllowedTime] = useState<number>(
//     course?.tests[0].startTime!
//   );

  
//   const hideMarkersTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
//     null
//   );
//   const [isVideoPaused, setIsVideoPaused] = useState(false);


//     // Keep track of which tests have already triggered so you don’t re-pause for the same one
//   const triggeredTests = useRef<Set<number>>(new Set());

//   // const [activeTestBasic, setActiveTestBasic] = useState<BasicTest | null>(null);
//   // const [showTest, setShowTest] = useState<TestWithQuestions | null>(null);


//     // 1) Attach a timeupdate listener as soon as we have course & video
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !course) return;

//     const onTimeUpdate = () => {
//       const now = video.currentTime;
//       for (const t of course.tests) {
//         if (
//           now >= t.startTime &&
//           !triggeredTests.current.has(t.id)
//         ) {
//           triggeredTests.current.add(t.id);
//           setLastPausedBreakpoint(t.startTime);
//           video.pause();
//           // 2) Tell your hook which test to load by id
//           setActiveTestBasic(t);
//           break;
//         }
//       }
//     };

//     video.addEventListener("timeupdate", onTimeUpdate);
//     return () => {
//       video.removeEventListener("timeupdate", onTimeUpdate);
//     };
//   }, [course]);


//     // 3) Once your hook actually returns the full test, display it
//   useEffect(() => {
//     if (fetchedTest) {
//       setShowTest(fetchedTest);
//     }
//   }, [fetchedTest]);


//     // 4) Handlers to resume the video or go back
//   const handleResume = () => {
//     if (activeTestBasic) {
//       setLastPassedTime(activeTestBasic.startTime);
//     }
//     setShowTest(null);
//     videoRef.current?.play();
//   };

//   // const handleBack = () => {
//   //   setShowTest(null);
//   //   // seek back to the last passed test (or 0 if none)
//   //   const seekTo = lastPassedTime;
//   //   if (videoRef.current){
//   //     videoRef.current.currentTime = seekTo;
//   //     videoRef.current.play()

//   //   }
//   //   // navigate(-1);
//   // };


//    const handleBack = () => {
//    setShowTest(null);

//    // Allow this test to fire again if we replay past its startTime
//    if (activeTestBasic) {
//      triggeredTests.current.delete(activeTestBasic.id);
//    }

//    // Seek back to the last PASSED checkpoint (or 0)
//    const seekTo = lastPassedTime;
//    if (videoRef.current) {
//      videoRef.current.currentTime = seekTo;
//      videoRef.current.play();
//    }
//  };







  

  

 



 

  

//   // Show/hide long description
//   const toggleDescription = () => setShowFull((f) => !f);

//   // Static course description
  
//   return (

//     <div className="flex min-h-screen bg-white">
//       <main className="flex-1 px-2 py-6 sm:p-8 overflow-auto">
//         <button
//           onClick={() => navigate(-1)}
//           className="text-primary font-medium underline underline-offset-2 flex items-center gap-2 cursor-pointer"
//         >
//           &lt; Back To Courses
//         </button>

//         <div className="mt-6 bg-black rounded overflow-hidden relative max-w-[1100px] 2xl:max-w-[1200px]">
//           <div
//             className="relative w-full aspect-video bg-black rounded overflow-hidden"
//             ref={containerRef}
//             // onMouseMove={handleMouseActivity}
//             // onMouseLeave={handleMouseLeave}
//           >
//             <video
//               ref={videoRef}
//               src={course?.videoUrl}
//               controls
//               controlsList="nofullscreen"
//               disableRemotePlayback
//               disablePictureInPicture
//               className="w-full h-full"
//             />

//             {/* <button
//               onClick={toggleFullscreen}
//               className="absolute top-2 right-2 bg-white/80 z-30 p-1.5 rounded-full cursor-pointer"
//               title="Toggle Fullscreen"
//             >
//               <MdFullscreen
//                 className={`w-5 h-5 text-black ${
//                   isFullscreen ? "w-8 h-8" : ""
//                 }`}
//               />
//             </button> */}


//             {/* DONE 3  */}

//             {showMarkers && (
//               <div className="absolute bottom-0 left-0 right-0 h-4 bg-transparent z-20 pointer-events-none">
//                 <div className="relative w-full h-full">
//                   {course?.tests.map((test) => (
//                     <div
//                       key={test.id}
//                       className="absolute bottom-3.5 h-full w-4 flex items-center justify-center bg-[#D9D9D9] rounded-full"
//                       style={{
//                         left: `${(test.startTime / course?.duration) * 100}%`,
//                       }}
//                     >
//                       <img src="/Document.svg" alt="" className="h-2.5" />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* // DONE 3  */}

//             {showTest && (
//               <div className="absolute z-20 top-0 left-0 w-full h-full">
//                 <Quiz
//                   test={showTest}
//                   onBack={handleBack}
//                   onResume={handleResume}
                  
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* DONE 1 */}

//         <h1 className="mt-6 text-xl sm:text-2xl font-semibold text-text-dark">
//           {course?.title}
//         </h1>
//         <p className="mt-2 text-text-light">
//           {showFull ? course?.description : course?.description.slice(0, 120) + "…"}
//           <button
//             onClick={toggleDescription}
//             className="ml-2 text-primary font-medium hover:underline cursor-pointer"
//           >
//             {showFull ? "less" : "more"}
//           </button>
//         </p>

//         {/* // DONE 1 */}

//         {/* DONE 2  */}

//         <h2 className="mt-8 text-xl font-semibold text-text-dark">
//           Study materials
//         </h2>
//         <ul className="mt-4 space-y-3">
//           {course?.studyMaterials.map((mat) => (
//             <li
//               key={mat.id}
//               className="bg-[#F5F5F5] p-3 flex flex-col md:flex-row items-center justify-between rounded gap-2"
//             >
//               <div className="flex flex-col md:flex-row gap-2 sm:gap-0 items-center space-x-4">
//                 <div className="bg-[#E4E3E3] flex items-center justify-center px-4 py-3 sm:px-6 sm:py-5">
//                   <FaFilePdf className="w-7 h-8 sm:w-9 sm:h-11 fill-[#EF5350]" />
//                 </div>
//                 <div className="text-center sm:text-left">
//                   <h3 className="text-text-dark font-semibold text-lg sm:text-xl">
//                     {mat.title}
//                   </h3>
//                   {/* <p className="text-text-light text-sm">{mat.description}</p> */}
//                 </div>
//               </div>
//               <a
//                 href={mat.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-4 py-1 sm:py-2 bg-primary text-base text-white font-medium hover:bg-indigo-700"
//               >
//                 Open
//               </a>
//             </li>
//           ))}
//         </ul>

//          {/* // DONE 2  */}


//       </main>
//     </div>


    
//   );
// };


// export default CoursePlay;



// ===============================================



// import React, { type FC, useRef, useState } from 'react'
// import Sidebar from './Sidebar'
// import { useFetchTestClient } from '../../hooks/useFetchTestClient'
// import { useFetchCourse } from '../../hooks/useFetchCourse'
// import { useParams } from 'react-router-dom'

// interface StudyMaterial {
//   id: string
//   title: string
//   description: string
//   url: string
// }

// const studyMaterials: StudyMaterial[] = [
//   {
//     id: '1',
//     title: 'RIMI Insurance Video 1',
//     description:
//       'Discover the essentials of Rimi Health Insurance with our in-depth courses tailored to empower your understanding of health coverage.',
//     url: '/materials/insurance-video-1.pdf',
//   },
//   {
//     id: '2',
//     title: 'Policy Deep Dive',
//     description: 'A detailed PDF on policy terms, claims processes, and more.',
//     url: '/materials/policy-deep-dive.pdf',
//   },
//   {
//     id: '3',
//     title: 'Claims Checklist',
//     description: 'Step-by-step checklist to follow when filing a claim.',
//     url: '/materials/claims-checklist.pdf',
//   },
// ]

// type View = 'home' | 'certificates' | 'play'

// const CoursePlay: FC = () => {

//   const { id: courseId } = useParams<{ id: string }>();






//   const [active, setActive] = useState<View>('play')
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const [showFull, setShowFull] = useState(false)

//   const toggleDescription = () => setShowFull((f) => !f)
//   const description =
//     'Discover the essentials of Rimi Health Insurance with our in-depth courses tailored to empower your understanding of health coverage. Explore various topics, from policy details to claims processes, and equip yourself with the knowledge to make informed decisions about your health. Join us on this enlightening journey.'

//   return (
//     <div className="flex min-h-screen bg-white">
//       {/* Sidebar */}
//       <Sidebar active={active} setActive={setActive} />

//       {/* Main content */}
//       <main className="flex-1 p-8 overflow-auto">
//         {/* Breadcrumbs */}
//         <div className="text-indigo-600 text-sm mb-4">
//           Health Insurance &gt; <span className="font-medium">RIMI Video 1</span>
//         </div>

//         {/* Back button */}
//         <button
//           onClick={() => window.history.back()}
//           className="inline-flex items-center px-4 py-2 bg-white shadow-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
//         >
//           ← Back
//         </button>

//         {/* Video player */}
//         <div className="mt-6 bg-black rounded overflow-hidden relative">
//           <video
//             ref={videoRef}
//             controls
//             className="w-full aspect-video bg-black"
//             poster="/video-poster.jpg"
//             src="/videos/insurance-video-1.mp4"
//           />
//         </div>

//         {/* Title & description */}
//         <h1 className="mt-6 text-2xl font-semibold text-gray-900">RIMI Insurance Video 1</h1>
//         <p className="mt-2 text-gray-600">
//           {showFull ? description : description.slice(0, 120) + '…'}
//           <button
//             onClick={toggleDescription}
//             className="ml-2 text-indigo-600 font-medium hover:underline"
//           >
//             {showFull ? 'less' : 'more'}
//           </button>
//         </p>

//         {/* Study materials */}
//         <h2 className="mt-8 text-xl font-semibold text-gray-900">Study materials</h2>
//         <ul className="mt-4 space-y-3">
//           {studyMaterials.map((mat) => (
//             <li
//               key={mat.id}
//               className="bg-neutral-100 p-4 flex items-center justify-between rounded"
//             >
//               <div className="flex items-center space-x-4">
//                 <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
//                   📄
//                 </div>
//                 <div>
//                   <h3 className="text-gray-900 font-medium">{mat.title}</h3>
//                   <p className="text-gray-600 text-sm">{mat.description}</p>
//                 </div>
//               </div>
//               <a
//                 href={mat.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700"
//               >
//                 Open
//               </a>
//             </li>
//           ))}
//         </ul>
//       </main>
//     </div>
//   )
// }

// export default CoursePlay