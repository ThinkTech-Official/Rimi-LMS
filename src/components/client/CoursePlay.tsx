import { type FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import Quiz, { type Question } from "./Quiz";
import { MdFullscreen } from "react-icons/md";

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface Test {
  id: number;
  testName: string;
  duration: string;
  startTime: number;
  passingMarks: number;
  isCleared: boolean;
  questions: Question[];
}

const course = {
  id: 1,
  title: "RIMI Insurance Masterclass",
  duration: 30,
  imageUrl: "/images/rimi-insurance.jpg",
  videoUrl:
    "https://data-1.utreon.com/v/Nj/Y3/Yj/V4P1iTHWQv6/V4P1iTHWQv6_1080p.mp4",
  category: "Insurance",
  description:
    "Master the essentials of RIMI Insurance, policies, and claim processing.",
  tests: [
    {
      id: 101,
      testName: "Insurance Basics",
      duration: "120",
      startTime: 10,
      passingMarks: 1,
      isCleared: false,
      questions: [
        {
          id: "q1",
          question: "What is RIMI Insurance?",
          options: ["Health", "Auto", "Travel", "Life"],
          correctIndex: 0,
        },
        {
          id: "q2",
          question: "What does a premium mean?",
          options: ["Bonus", "Monthly payment", "Policy name", "Tax"],
          correctIndex: 1,
        },
      ],
    },
    {
      id: 102,
      testName: "Understanding Policies",
      duration: "120",
      startTime: 20,
      passingMarks: 2,
      isCleared: false,
      questions: [
        {
          id: "q3",
          question: "What is a policy term?",
          options: ["Premium", "Duration of coverage", "Claim", "Policyholder"],
          correctIndex: 1,
        },
        {
          id: "q4",
          question: "What is a deductible?",
          options: [
            "Insurer payout",
            "Customer's upfront cost",
            "Discount",
            "Late fee",
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      id: 103,
      testName: "Claims & Processing",
      duration: "120",
      startTime: 25,
      passingMarks: 1,
      isCleared: false,
      questions: [
        {
          id: "q5",
          question: "What is a claim in insurance?",
          options: [
            "A contract",
            "A request for payment",
            "A refund",
            "An invoice",
          ],
          correctIndex: 1,
        },
        {
          id: "q6",
          question: "Who processes insurance claims?",
          options: ["Insurer", "Client", "Bank", "Government"],
          correctIndex: 0,
        },
      ],
    },
  ],
};

const studyMaterials: StudyMaterial[] = [
  {
    id: "1",
    title: "RIMI Insurance Video 1",
    description:
      "Discover the essentials of Rimi Health Insurance with our in-depth courses tailored to empower your understanding of health coverage.",
    url: "/materials/insurance-video-1.pdf",
  },
  {
    id: "2",
    title: "Policy Deep Dive",
    description: "A detailed PDF on policy terms, claims processes, and more.",
    url: "/materials/policy-deep-dive.pdf",
  },
  {
    id: "3",
    title: "Claims Checklist",
    description: "Step-by-step checklist to follow when filing a claim.",
    url: "/materials/claims-checklist.pdf",
  },
];

type View = "home" | "certificates" | "play";

const CoursePlay: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFull, setShowFull] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastPausedBreakpoint, setLastPausedBreakpoint] = useState<
    number | null
  >(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showTest, setShowTest] = useState<Test | null>(null);
  const [maxAllowedTime, setMaxAllowedTime] = useState(
    course.tests[0].startTime
  );
  const hideMarkersTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const navigate = useNavigate();

  // Toggle fullscreen for the video container
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
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

  // Main video monitoring effect: pause video and show test when hitting startTime
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video) return;

      const currentTime = video.currentTime;

      // Prevent skipping ahead
      if (currentTime > maxAllowedTime) {
        video.currentTime = maxAllowedTime;
      }

      // Detect if test should be triggered
      const hitTest = course.tests.find(
        (test) =>
          Math.abs(currentTime - test.startTime) < 0.5 &&
          lastPausedBreakpoint !== test.startTime
      );

      if (hitTest && !hitTest.isCleared) {
        setShowMarkers(false);
        setShowTest(hitTest);
        setLastPausedBreakpoint(hitTest.startTime);
        video.pause();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [lastPausedBreakpoint, maxAllowedTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsVideoPaused(false);
      handleMouseActivity(); // start timeout for hiding
    };

    const handlePause = () => {
      setIsVideoPaused(true);
      setShowMarkers(true); // Always show when paused
      if (hideMarkersTimeoutRef.current) {
        clearTimeout(hideMarkersTimeoutRef.current);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  // Toggle test markers when mouse hovers over video
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

  const handleResume = () => {
    // Find the index of the cleared test
    const clearedIndex = course.tests.findIndex((t) => t.id === showTest?.id);

    // Update the max allowed time to next test's start time (if exists), or full duration
    const nextTest = course.tests[clearedIndex + 1];
    const nextAllowedTime = nextTest
      ? Math.max(0, nextTest.startTime - 1)
      : course.duration;

    setMaxAllowedTime((prev) => Math.max(prev, nextAllowedTime));

    // Mark the current test as cleared (only in memory unless persisted)
    if (showTest) {
      showTest.isCleared = true;
    }

    setShowTest(null);
    videoRef.current?.play();
    setShowMarkers(true);
  };

  const handleBack = () => {
    setShowTest(null);

    // Find the last cleared test
    const lastClearedIndex = [...course.tests]
      .reverse()
      .findIndex((t) => t.isCleared);

    // If none are cleared, start from 0
    let resumeTime = 0;

    // If one or more are cleared, jump to the next test's startTime
    if (lastClearedIndex !== -1) {
      const actualIndex = course.tests.length - 1 - lastClearedIndex;
      const currentTest = course.tests[actualIndex];
      resumeTime = currentTest.startTime + 0.5; // move slightly ahead of test trigger point
    }

    if (videoRef.current) {
      videoRef.current.currentTime = resumeTime;
      videoRef.current.play();
    }

    // Update maxAllowedTime back to previous test's startTime or to 0
    const prevTest = course.tests[lastClearedIndex];
    const prevAllowedTime = prevTest ? prevTest.startTime : 0;
    setMaxAllowedTime((prev) => Math.max(prev, prevAllowedTime));

    //update the last paused breakpoint to the previous test's startTime
    setLastPausedBreakpoint(prevTest ? prevTest.startTime + 1 : 0);
    setShowMarkers(true);
  };

  // Show/hide long description
  const toggleDescription = () => setShowFull((f) => !f);

  // Static course description
  const description =
    "Discover the essentials of Rimi Health Insurance with our in-depth courses tailored to empower your understanding of health coverage. Explore various topics, from policy details to claims processes, and equip yourself with the knowledge to make informed decisions about your health. Join us on this enlightening journey.";

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
            ref={containerRef}
            onMouseMove={handleMouseActivity}
            onMouseLeave={handleMouseLeave}
          >
            <video
              ref={videoRef}
              src={course.videoUrl}
              controls
              controlsList="nofullscreen noplaybackrate nodownload"
              disableRemotePlayback
              disablePictureInPicture
              className="w-full h-full"
            />

            <button
              onClick={toggleFullscreen}
              className="absolute top-2 right-2 bg-white/80 z-30 p-1.5 rounded-full cursor-pointer"
              title="Toggle Fullscreen"
            >
              <MdFullscreen
                className={`w-5 h-5 text-black ${
                  isFullscreen ? "w-8 h-8" : ""
                }`}
              />
            </button>

            {showMarkers && (
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-transparent z-20 pointer-events-none">
                <div className="relative w-full h-full">
                  {course.tests.map((test) => (
                    <div
                      key={test.id}
                      className="absolute bottom-3.5 h-full w-4 flex items-center justify-center bg-[#D9D9D9] rounded-full"
                      style={{
                        left: `${(test.startTime / course.duration) * 100}%`,
                      }}
                    >
                      <img src="/Document.svg" alt="" className="h-2.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showTest && (
              <div className="absolute z-20 top-0 left-0 w-full h-full">
                <Quiz
                  test={showTest}
                  onBack={handleBack}
                  onResume={handleResume}
                />
              </div>
            )}
          </div>
        </div>

        <h1 className="mt-6 text-xl sm:text-2xl font-semibold text-text-dark">
          RIMI Insurance Video 1
        </h1>
        <p className="mt-2 text-text-light">
          {showFull ? description : description.slice(0, 120) + "…"}
          <button
            onClick={toggleDescription}
            className="ml-2 text-primary font-medium hover:underline cursor-pointer"
          >
            {showFull ? "less" : "more"}
          </button>
        </p>

        <h2 className="mt-8 text-xl font-semibold text-text-dark">
          Study materials
        </h2>
        <ul className="mt-4 space-y-3">
          {studyMaterials.map((mat) => (
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
                    {mat.title}
                  </h3>
                  <p className="text-text-light text-sm">{mat.description}</p>
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
      </main>
    </div>
  );
};

export default CoursePlay;
