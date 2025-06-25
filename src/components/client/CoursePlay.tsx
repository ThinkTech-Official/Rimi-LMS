import { type FC, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import Quiz, { type Question } from "./Quiz";

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  url: string;
}

const questions: Question[] = [
  {
    id: "1",
    question: "What is RIMI Insurance?",
    options: ["A", "B", "C", "D"],
    correctIndex: 0,
  },
  {
    id: "2",
    question: "What is a policy?",
    options: ["A", "B", "C", "D"],
    correctIndex: 1,
  },
  {
    id: "3",
    question: "What is a claim?",
    options: ["A", "B", "C", "D"],
    correctIndex: 2,
  },
];

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
  const [active, setActive] = useState<View>("play");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showFull, setShowFull] = useState(false);
  const navigate = useNavigate();

  const toggleDescription = () => setShowFull((f) => !f);
  const description =
    "Discover the essentials of Rimi Health Insurance with our in-depth courses tailored to empower your understanding of health coverage. Explore various topics, from policy details to claims processes, and equip yourself with the knowledge to make informed decisions about your health. Join us on this enlightening journey.";

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main content */}
      <main className="flex-1 px-2 py-6 sm:p-8 overflow-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-primary font-medium underline underline-offset-2 flex items-center gap-2 cursor-pointer"
        >
          &lt; Back To Courses
        </button>

        <div className="mt-6 bg-black rounded overflow-hidden relative max-w-[1100px] 2xl:max-w-[1200px]">
          {/* Video player */}
          <video
            ref={videoRef}
            controls
            className="w-full aspect-video bg-black"
            poster="/video-poster.jpg"
            src="/videos/insurance-video-1.mp4"
          />

          {/* Quiz overlay */}
          <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center">
            <Quiz questions={questions} duration={6000} onComplete={() => {}} />
          </div>
        </div>

        {/* Title & description */}
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

        {/* Study materials */}
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
                className="px-4 py-1 sm:py-2 bg-primary text-base text-white font-medium  hover:bg-indigo-700"
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
