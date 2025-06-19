import React, { useState, type FormEvent } from "react";

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
  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [duration, setDuration] = useState("");
  const [startTime, setStartTime] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "",
      options: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
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

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    // handle submit
    console.log({ name, courseId, duration, startTime, questions });
  };

  return (
    <div className="min-h-screen flex bg-white">
      <main className="flex-1 p-8">
        {/* Breadcrumb & Save */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save Test
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Test Information */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Test Information
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Course Name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="Enter Course ID"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Select Test Duration"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="Enter the starting time for the test in minutes during the video."
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </section>

          {/* Add Questions */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Add Questions</h2>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="text-blue-600 font-medium"
              >
                + Add More Question
              </button>
            </div>

            {questions.map((q) => (
              <div key={q.id} className="space-y-4">
                <label className="font-medium">Q{q.id}</label>
                <textarea
                  value={q.text}
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  placeholder="Type Your Question Here"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500"
                  rows={2}
                  required
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Options</label>
                  {q.options.map((o) => (
                    <div key={o.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={o.isCorrect}
                        onChange={() => toggleCorrect(q.id, o.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={o.text}
                        onChange={(e) =>
                          handleOptionChange(q.id, o.id, e.target.value)
                        }
                        placeholder={`Option ${o.id}`}
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOption(q.id)}
                    className="text-blue-600 font-medium flex items-center space-x-1"
                  >
                    <span className="text-2xl">+</span>
                    <span>Add new option</span>
                  </button>
                </div>
              </div>
            ))}
          </section>

          <div>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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
