import { type FC, useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { PiSmiley, PiSmileySad } from "react-icons/pi";
import type { Test } from "./CoursePlay";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}
export interface QuizProps {
  test: Test;
  onBack: () => void;
  onResume: () => void;
}
const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")} : ${s.toString().padStart(2, "0")}`;
};

const Quiz: FC<QuizProps> = ({ test, onBack, onResume }) => {
  const [timeLeft, setTimeLeft] = useState(Number(test.duration));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);
  const questions = test.questions;
  const passingScore = 0.7;

  // countdown timer
  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }
    const iv = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(iv);
  }, [timeLeft, finished]);

  const select = (optIdx: number) => {
    setAnswers({ ...answers, [questions[current].id]: optIdx });
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      finishQuiz();
    }
  };
  const prev = () => current > 0 && setCurrent(current - 1);

  function finishQuiz() {
    setFinished(true);
    const correct = questions.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length;
    const score = correct / questions.length;
    const isPassed = score >= passingScore;
    if (isPassed) {
      test.isCleared = true;
    }
    setPassed(isPassed);
    // onComplete(isPassed, score);
  }
  // new comment
  // const retry = () => {
  //   setTimeLeft(duration);
  //   setCurrent(0);
  //   setAnswers({});
  //   setFinished(false);
  // };

  if (finished) {
    const correctCount = questions.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length;
    return (
      <div className="w-full h-full bg-[#F3F3F3] flex flex-col items-center justify-center overflow-auto relative">
        <div className="flex flex-col items-center justify-center max-w-2xl">
          {" "}
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-text-dark">
              Overall Performance
            </span>
            <span className="text-base text-text-light">
              Summary of your test results
            </span>
          </div>
          <div className="flex flex-col gap-1 w-full justify-between">
            <div className="flex justify-between">
              <span className="text-text-dark font-semibold text-2xl">
                {correctCount}/{questions.length}
              </span>
              {passed ? (
                <span className="text-green-600">Weel done!</span>
              ) : (
                <span className="text-[#CD4947] text-base">
                  Needs Improvement
                </span>
              )}
            </div>
            <div className="relative w-full bg-[#E1E1E1] h-2.5">
              <div
                className="absolute  h-2.5 bg-primary"
                style={{ width: `${(correctCount / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-text-light text-sm">
              <span>
                Score : {((correctCount / questions.length) * 100).toFixed(2)}%
              </span>
              <span>Progress</span>
            </div>
          </div>
          {passed ? (
            <div className="flex flex-col gap-1 items-center mt-2">
              <PiSmiley className="text-[#797878] w-8 h-8" />
              <span className="text-lg text-green-600 font-semibold">
                Congratulations! You Passed the Quiz
              </span>
              <p className="text-base text-[#747474] text-center">
                Great job! You've successfully completed this checkpoint and can
                now continue with the video.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1 items-center mt-2">
              <PiSmileySad className="text-[#797878] w-8 h-8" />
              <span className="text-lg text-[#CD4947] font-semibold">
                You Didn’t Pass This Time
              </span>
              <p className="text-base text-[#747474] text-center">
                Don't worry! You can rewatch the video and try the quiz again to
                move forward.
              </p>
            </div>
          )}
          {passed ? (
            <button
              className="px-2.5 py-3 bg-primary text-white flex gap-2 items-center justify-center cursor-pointer font-semibold mt-5"
              onClick={() => {
                onResume(), onBack();
              }}
            >
              Proceed to Next Session
            </button>
          ) : (
            <button
              className="px-2.5 py-3 bg-primary text-white flex gap-2 items-center justify-center cursor-pointer font-semibold mt-5"
              onClick={onBack}
            >
              Watch Video Again
            </button>
          )}
          {!passed && (
            <span className="text-2xl text-text-dark mt-3 font-semibold">
              Passing Score : {}/{questions.length}
            </span>
          )}
        </div>
      </div>
    );
  }

  const q = questions[current];
  const sel = answers[q.id];

  return (
    <div className="w-full h-full bg-[#F3F3F3] flex flex-col items-center justify-center overflow-auto relative">
      {/* Header: timer */}
      <div className="flex flex-col justify-center items-center mb-6 gap-3">
        <div className="text-xl font-medium flex items-center gap-2">
          <img src="/timerClock.svg" alt="timer" className="h-10 w-10" />{" "}
          <div className="flex flex-col items-center">
            <span className="text-lg font-medium text-text-dark">
              {" "}
              {formatTime(timeLeft)}
            </span>
            <div className="flex justify-between text-text-light text-sm gap-3">
              <span>min</span>
              <span>sec</span>
            </div>
          </div>
        </div>
        <div className="text-text-dark text-lg font-semibold">
          Complete the Quiz to Continue
        </div>
      </div>

      {/* Question */}
      <div className="w-full max-w-2xl px-6 mt-1">
        <div className="flex flex-col border-b border-[#D4D4D4] pb-6">
          <div className="flex justify-between items-center">
            <span className="text-text-light font-semibold text-base">
              Question {current + 1}
            </span>
            <span className="text-text-light text-base">
              {current + 1}/{questions.length}
            </span>
          </div>
          <h3 className="text-black text-base font-semibold">{q.question}</h3>
        </div>

        {/* Options */}
        <ul className="space-y-4 mt-7">
          {q.options.map((opt, i) => (
            <li key={i}>
              <label className="flex items-center justify-between space-x-3 py-2 px-5 bg-white cursor-pointer">
                <span>{opt}</span>
                <input
                  type="radio"
                  name={q.id}
                  checked={sel === i}
                  onChange={() => select(i)}
                  className="form-radio h-5 w-5 text-indigo-600 cursor-pointer"
                />
              </label>
            </li>
          ))}
        </ul>

        {/* Navigation */}
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={prev}
            disabled={current === 0}
            className="w-[120px] px-2.5 py-3 bg-primary text-white flex gap-2 items-center justify-center disabled:cursor-default cursor-pointer font-semibold"
          >
            <FaArrowLeft /> Previous
          </button>
          <button
            onClick={next}
            className="w-[120px] px-2.5 py-3 bg-primary text-white flex gap-2 items-center justify-center disabled:cursor-default cursor-pointer font-semibold"
          >
            {current < questions.length - 1 ? "Next" : "Finish"}
            {current < questions.length - 1 && <FaArrowRight />}
          </button>
        </div>
      </div>
      <button
        className="px-2.5 py-2 cursor-pointer bg-primary text-white flex gap-2 items-center justify-center font-semibold absolute left-5 top-5"
        onClick={onBack}
      >
        <FaArrowLeft /> Back
      </button>
      <div className="flex flex-col absolute right-4 top-3">
        <span className="text-lg font-medium text-text-dark">Mock Test</span>
        <span className="text-base text-text-light">Session 1</span>
      </div>
    </div>
  );
};

export default Quiz;
