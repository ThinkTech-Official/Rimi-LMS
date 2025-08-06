import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaFilePdf, FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Quiz from "./Quiz";
import { MdFullscreen, MdPlayArrow, MdVolumeOff, MdVolumeUp } from "react-icons/md";

import {
  useFetchCourseClient,
  type CourseClient,
  type TestClient,
} from "../../hooks/useFetchCourseClient";
import {
  useFetchTestClient,
  type TestWithQuestions,
} from "../../hooks/useFetchTestClient";
import Spinner from "../loaders/Spinner";
import { BiExitFullscreen } from "react-icons/bi";

const CoursePlay = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch course with isCleared flags
  const {
    course: fetchedCourse,
    loading: loadingCourse,
    error: errorCourse,
    refetch,
  } = useFetchCourseClient(courseId!);

  // Mirror the hook’s course into local state so we can mutate it
  const [course, setCourse] = useState<CourseClient | null>(null);

  // current basic test (metadata)
  const [activeTestBasic, setActiveTestBasic] = useState<TestClient | null>(
    null
  );
  // fetch full test when a basic test is active
  const {
    test: fetchedTest,
    loading: loadingTest,
    error: errorTest,
  } = useFetchTestClient(courseId, activeTestBasic?.id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastPassedTime, setLastPassedTime] = useState<number>(0);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showTest, setShowTest] = useState<TestWithQuestions | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const hideMarkersTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  const [hasStarted, setHasStarted] = useState(false);

  const [videoDuration, setVideoDuration] = useState<number>(0);

  const [currentTime, setCurrentTime] = useState(0);
  const rangeRef = useRef<HTMLInputElement>(null);

  // keep track to avoid re-trigger
  const triggeredTests = useRef<Set<number>>(new Set());


  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);


//   useEffect(() => {
//   const v = videoRef.current;
//   if (!v) return;
//   const onLoaded = () => setVideoDuration(v.duration);
//   v.addEventListener("loadedmetadata", onLoaded);
//   return () => v.removeEventListener("loadedmetadata", onLoaded);
// }, [videoRef]);


  useEffect(() => {
    setCourse(fetchedCourse);
  }, [fetchedCourse]);


  // toggle play/pause
const togglePlay = () => {
  const v = videoRef.current!;
  if (isPlaying) v.pause();
  else v.play();
  setIsPlaying(!isPlaying);
  if (!hasStarted) setHasStarted(true);
};

// toggle mute
const toggleMute = () => {
  const v = videoRef.current!;
  v.muted = !v.muted;
  setIsMuted(v.muted);
};

// adjust volume slider
const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const vol = parseFloat(e.target.value);
  const v = videoRef.current!;
  v.volume = vol;
  v.muted = vol === 0;
  setVolume(vol);
  setIsMuted(v.muted);
};

// toggle full screen

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  const handleMouseActivity = () => {
    if (isVideoPaused) return; // Don't hide markers if video is paused
    setShowMarkers(true);

    // Clear existing timeout
    if (hideMarkersTimeoutRef.current) {
      clearTimeout(hideMarkersTimeoutRef.current);
    }

    // Start 3-second timer to hide markers
    hideMarkersTimeoutRef.current = setTimeout(() => {
      setShowMarkers(false);
    }, 3000);
  };
  const handleMouseLeave = () => {
    if (!videoRef.current?.paused) {
      setShowMarkers(false);
    }
    if (hideMarkersTimeoutRef.current) {
      clearTimeout(hideMarkersTimeoutRef.current);
    }
  };
  // Handle fullscreen toggle state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  // On mount or when course loads: seek to first un-passed test and pre-mark triggers
  // on mount or course change: seek to beginning or 1s past last passed test
  useEffect(() => {
    if (!course || !videoRef.current) return;
    // find all passed tests
    const passedTests = course.tests.filter((t) => t.isCleared);
    // last passed test startTime (or 0 if none)
    const lastStart =
      passedTests.length > 0
        ? Math.max(...passedTests.map((t) => t.startTime))
        : 0;
    // resume at 1 second after last passed test, or 0
    const resumeAt = lastStart > 0 ? lastStart + 1 : 0;
    setLastPassedTime(lastStart);

    // seek video to resume point
    videoRef.current.currentTime = resumeAt;

    // pre-mark tests up to resumeAt as triggered
    triggeredTests.current = new Set(
      course.tests.filter((t) => t.startTime <= resumeAt).map((t) => t.id)
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

  // Prevent scrubbing past the next un-cleared test
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !course) return;

    const onSeeking = () => {
      // find the next test the user hasn't cleared
      const nextTest = course.tests
        .filter((t) => !t.isCleared)
        .sort((a, b) => a.startTime - b.startTime)[0];

      // allowed limit is either the next test start, or full duration
      const limit = nextTest
        ? nextTest.startTime
        : course.duration ?? video.duration;

      // if they tried to jump ahead, snap back to the limit
      if (video.currentTime > limit) {
        video.currentTime = limit;
      }
    };

    video.addEventListener("seeking", onSeeking);
    return () => {
      video.removeEventListener("seeking", onSeeking);
    };
  }, [course]);

  // if user passed update checkpoint and resume
  const handleResume = async () => {
    if (activeTestBasic) {
      setLastPassedTime(activeTestBasic.startTime);
      //  await refetch()
    }
    setShowTest(null);
    videoRef.current?.play();
  };

  // if user failed allow re trigger and seek back
  // const handleBack = () => {
  //   if (activeTestBasic) triggeredTests.current.delete(activeTestBasic.id);
  //   setShowTest(null);
  //   if (videoRef.current) {
  //     videoRef.current.currentTime = lastPassedTime;
  //     videoRef.current.play();
  //   }
  // };

  // user failed allow re-trigger and seek back
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


   const handleStart = () => {
     setHasStarted(true);
      videoRef.current?.play();
      };


      const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const t = Number(e.target.value);
      setCurrentTime(t);
      videoRef.current!.currentTime = t;
      };

  // Show/hide long description
  const toggleDescription = () => setShowFull((f) => !f);

  if (loadingCourse || !course)
    return (
      <div className="fixed top-1/2 left-1/2 flex flex-col items-center gap-2">
        <Spinner className="w-10 h-10" />
        <p>Loading Course...</p>
      </div>
    );
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

        <div className="mt-6 bg-black overflow-hidden relative max-w-[1100px] 2xl:max-w-[1200px]">
         


          

  <div
     className="relative w-full aspect-video overflow-hidden"
    //  ref={containerRef}
     onMouseMove={handleMouseActivity}
     onMouseLeave={handleMouseLeave}
   >

            <video
              ref={videoRef}
              src={course?.videoUrl}
              poster={course?.thumbnail}
              // controls
              // controlsList="nofullscreen"
              disableRemotePlayback
              disablePictureInPicture
              className="w-full h-full"
              onLoadedMetadata={e => setVideoDuration(e.currentTarget.duration)}
              onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
            />

              {/* PLAY OVERLAY */}
  {!hasStarted && (
    <div
      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
      onClick={handleStart}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  )}

            

            {/* DONE 3  */}

            {/* {showMarkers && (
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-transparent z-20 pointer-events-none">
                <div className="relative w-full h-full">
                  {course?.tests.map((test) => (
                    <div
                      key={test.id}
                      className={`absolute bottom-3.5 h-full w-4 flex items-center justify-center rounded-full ${
                        test.isCleared ? "bg-red-200" : "bg-[#D9D9D9]"
                      }`}
                      style={{
                        left: `${
                          (test.startTime / (course.duration || 1)) * 100
                        }%`,
                      }}
                    >
                      <img src="/Document.svg" alt="" className="h-2.5" />
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* ========================= */}








            {/* ============================== */}
            

            {/* // DONE 3  */}
            {loadingTest && (
              <div className="absolute z-50 inset-0 bg-white/90 flex flex-col justify-center items-center gap-2">
                <Spinner className="w-6 h-6" />
                <p className="text-text-dark">Loading Test...</p>
              </div>
            )}

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

             {/* === CUSTOM SLIDER & MARKERS  === */}
   <div className="mt-2 relative w-full max-w-[1100px] px-2 pb-6 ">
     <input
       ref={rangeRef}
       type="range"
       min={0}
       max={videoDuration}
       step="0.1"
       value={currentTime}
       onChange={handleSeek}
       className="w-full h-1 bg-gray-300 rounded-lg cursor-pointer focus:outline-none"
     />

     <div className="mt-2 flex items-center space-x-4 px-2 max-w-[1100px]">
  {/* play / pause */}
  <button onClick={togglePlay} className="text-white">
    {isPlaying 
      ? <FaPause  className="w-6 h-6 cursor-pointer" /> 
      : <FaPlay  className="w-6 h-6 cursor-pointer" />
    }
  </button>

  {/* mute / unmute */}
  <button onClick={toggleMute} className="text-white">
    {isMuted 
      ? <FaVolumeMute  className="w-6 h-6 cursor-pointer" />
      : <FaVolumeUp  className="w-6 h-6 cursor-pointer" />
    }
  </button>

  {/* volume slider */}
  <input
    type="range"
    min={0}
    max={1}
    step={0.01}
    value={volume}
    onChange={onVolumeChange}
    className="w-24"
  />

  {/* timecode */}
  <span className="text-sm text-white">
    {new Date(currentTime * 1000).toISOString().substr(14, 5)} /{" "}
    {new Date(videoDuration * 1000).toISOString().substr(14, 5)}
  
  </span>


<button
              onClick={toggleFullscreen}
              className=" z-30 p-1.5 rounded-full cursor-pointer text-white"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <BiExitFullscreen
                title="Exit Fullscreen"
                  className={`w-5 h-5 text-white ${
                    isFullscreen ? "w-6 h-6" : ""
                  }`}
                />
              ) : (
                <MdFullscreen
                  title="Enter Fullscreen"
                  className={`w-5 h-5 text-white ${
                    isFullscreen ? "w-6 h-6" : ""
                  }`}
                />
              )}
            </button>



</div>

     {/* overlay the markers */}
        <div className="absolute inset-0 pointer-events-none">
     {course!.tests.map((test) => {
       const pct = videoDuration
         ? (test.startTime / videoDuration) * 100
         : 0;
       return (
         <div
           key={test.id}
           className="absolute"
           style={{
             left: `${pct}%`,
            //  transform: "translateX(-50%)",
            //  bottom: "0.5px"              // nudge icon just below the track
           }}
         >
           <img
             src="/Document.svg"
             alt="test marker"
             className={`h-5 ${test.isCleared ? "bg-red-200" : "bg-[#D9D9D9]"}`}
           />
         </div>
       );
     })}
   </div>


    
   </div>

   
        </div>

        {/* DONE 1 */}

        <h1 className="mt-6 text-xl sm:text-2xl font-semibold text-text-dark">
          {course?.name}
        </h1>
        <p className="mt-2 text-text-light">
          {showFull
            ? course?.description
            : course?.description.slice(0, 120) + "…"}
          <button
            onClick={toggleDescription}
            className="ml-2 text-primary font-medium hover:underline cursor-pointer"
          >
            {showFull ? "less" : "more"}
          </button>
        </p>

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
