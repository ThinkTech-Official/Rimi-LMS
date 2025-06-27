import React, { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateTest } from "../hooks/useCreateTest";

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}
interface Question {
  id: number;
  text: string;
  options: Option[];
}

const CreateTest: React.FC = () => {

  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { createTest , loading , error } = useCreateTest(courseId!) 


  const [name, setName] = useState("");
  // const [courseId, setCourseId] = useState("");
  const [duration, setDuration] = useState("");
  const [startTime, setStartTime] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "",
      options: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: "",
        options: [
          { id: 1, text: "", isCorrect: false },
          { id: 2, text: "", isCorrect: false },
          { id: 3, text: "", isCorrect: false },
          { id: 4, text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const handleQuestionChange = (qid: number, text: string) => {
    setQuestions((qs) => qs.map((q) => (q.id === qid ? { ...q, text } : q)));
  };

  const handleOptionChange = (qid: number, oid: number, text: string) => {
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.id !== qid) return q;
        return {
          ...q,
          options: q.options.map((o) => (o.id === oid ? { ...o, text } : o)),
        };
      })
    );
  };

  const toggleCorrect = (qid: number, oid: number) => {
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.id !== qid) return q;
        return {
          ...q,
          options: q.options.map((o) =>
            o.id === oid ? { ...o, isCorrect: !o.isCorrect } : o
          ),
        };
      })
    );
  };

  const handleAddOption = (qid: number) => {
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.id !== qid) return q;
        const newId = q.options.length + 1;
        return {
          ...q,
          options: [...q.options, { id: newId, text: "", isCorrect: false }],
        };
      })
    );
  };

  const handleRemoveQuestion = (qid: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qid));
  };

  // const handleSave = (e: FormEvent) => {
  //   e.preventDefault();
  //   // handle submit
  //   console.log({ name, courseId, duration, startTime, questions });
  // };

    const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    const dto = {
      name,
      duration: Number(duration),
      startTime: Number(startTime),
      questions: questions.map((q) => ({
        text: q.text,
        options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
      })),
    };

    console.log('from create test submit', dto)

    try {
      await createTest(dto);
      navigate(`/admin/edit-course/${courseId}`);
    } catch {
      // error displayed by hook
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <main className="flex-1 p-2 sm:p-8">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Test Information */}
          <section className="space-y-4">
            <div className="flex w-full justify-between items-center">
              <h2 className="text-lg 2xl:text-2xl font-bold text-[#1B1B1B]">
                Test Information
              </h2>
              <button
                onClick={handleSave}
                className="inline-block text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
              >
                Save Test
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Course Name"
                className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              {/* <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="Enter Course ID"
                className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              /> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Select Test Duration"
                  className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="Enter the starting time for the test in minutes during the video."
                  className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </section>

          {/* Add Questions */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Add Questions</h2>
            </div>

            {questions.map((q, index) => (
              <div key={q.id} className="space-y-4">
                <label className="font-medium">Q{index + 1}</label>
                <textarea
                  value={q.text}
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  placeholder="Type Your Question Here"
                  className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={2}
                  required
                />
                <div className="space-y-2">
                  <label className="text-sm 2xl:text-base font-medium">
                    Options
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[800px] mt-2">
                    {" "}
                    {q.options.map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center bg-[#EBEBEB] px-3 relative"
                      >
                        <input
                          type="checkbox"
                          checked={o.isCorrect}
                          onChange={() => toggleCorrect(q.id, o.id)}
                          className="h-4 w-4 accent-[#0832DE] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={o.text}
                          onChange={(e) =>
                            handleOptionChange(q.id, o.id, e.target.value)
                          }
                          placeholder={`Option ${o.id}`}
                          className="flex-1 px-4 py-2 focus:ring-primary focus:outline-none"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddOption(q.id)}
                    className="text-[#0832DE] font-medium flex items-center space-x-1 cursor-pointer"
                  >
                    <span className="text-2xl">+</span>
                    <span>Add new option</span>
                  </button>
                  <button
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="inline-block text-sm sm:text-[16px]  text-red-500 hover:text-red-600 text-nowrap font-semibold  cursor-pointer transition-colors delay-100"
                  >
                    Remove Question
                  </button>
                </div>
              </div>
            ))}
          </section>

          <div className="flex gap-3 justify-between">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="text-[#0832DE] font-medium flex items-center space-x-1 cursor-pointer"
            >
              <span className="text-2xl">+</span>
              <span className="text-lg sm:text-xl">Add new Question</span>
            </button>
            <button
              type="submit"
              className="inline-block text-sm sm:text-[16px] px-5 py-1 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
            >
              Save Test
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateTest;
