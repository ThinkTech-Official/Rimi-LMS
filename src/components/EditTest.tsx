import React, { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useFetchTest, type TestDetail, type QuestionDto, type OptionDto } from '../hooks/useFetchTest';
import { useUpdateTest, type UpdateTestDto } from '../hooks/useUpdateTest';

const EditTest: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, testId } = useParams<{ courseId: string; testId: string }>();

  
  const {
    test,
    loading: loadingFetch,
    error: fetchError
  } = useFetchTest(courseId!, testId!);

  const {
    updateTest,
    loading: loadingSave,
    error: saveError
  } = useUpdateTest(courseId!, testId!);

  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [startTime, setStartTime] = useState('');
  const [questions, setQuestions] = useState<QuestionDto[]>([]);

  // Populate form when `test` loads
  useEffect(() => {
    if (!test) return;
    setName(test.name);
    setDuration(String(test.duration));
    setStartTime(String(test.startTime));
    setQuestions(test.questions);
  }, [test]);

  const handleQuestionChange = (qid: number, text: string) => {
    setQuestions(qs =>
      qs.map(q => q.id === qid ? { ...q, text } : q)
    );
  };

  const handleOptionChange = (qid: number, oid: number, text: string) => {
    setQuestions(qs =>
      qs.map(q => {
        if (q.id !== qid) return q;
        return {
          ...q,
          options: q.options.map(o =>
            o.id === oid ? { ...o, text } : o
          )
        };
      })
    );
  };

  const toggleCorrect = (qid: number, oid: number) => {
    setQuestions(qs =>
      qs.map(q => {
        if (q.id !== qid) return q;
        return {
          ...q,
          options: q.options.map(o =>
            o.id === oid ? { ...o, isCorrect: !o.isCorrect } : o
          )
        };
      })
    );
  };

  const addQuestion = () => {
    const newId = Math.max(0, ...questions.map(q => q.id)) + 1;
    setQuestions([
      ...questions,
      { id: newId, text: '', options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false },
        { id: 3, text: '', isCorrect: false },
        { id: 4, text: '', isCorrect: false },
      ] }
    ]);
  };

  const removeQuestion = (qid: number) => {
    setQuestions(qs => qs.filter(q => q.id !== qid));
  };

  const addOption = (qid: number) => {
    setQuestions(qs =>
      qs.map(q => {
        if (q.id !== qid) return q;
        const newOid = Math.max(0, ...q.options.map(o => o.id)) + 1;
        return {
          ...q,
          options: [...q.options, { id: newOid, text: '', isCorrect: false }]
        };
      })
    );
  };

  const removeOption = (qid: number, oid: number) => {
    setQuestions(qs =>
      qs.map(q => {
        if (q.id !== qid) return q;
        return {
          ...q,
          options: q.options.filter(o => o.id !== oid)
        };
      })
    );
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const dto: UpdateTestDto = {
      name,
      duration: Number(duration),
      startTime: Number(startTime),
      questions: questions.map(q => ({
        text: q.text,
        options: q.options.map(o => ({ text: o.text, isCorrect: o.isCorrect }))
      }))
    };
    try {
      await updateTest(dto);
      navigate(`/admin/edit-course/${courseId}`);
    } catch {
      // saveError will display below
    }
  };

  if (loadingFetch) return <p>Loading test…</p>;
  if (fetchError) return <p className="text-red-500">{fetchError}</p>;

  return (
    <div className="min-h-screen flex bg-white">
      <main className="flex-1 p-4 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Edit Test</h2>
            <button
              type="submit"
              disabled={loadingSave}
              className="px-5 py-2 bg-primary text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {loadingSave ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          {/* Basic fields */}
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Test Name"
              className="w-full border p-2 focus:ring-primary"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="Duration (min)"
                className="w-full border p-2 focus:ring-primary"
                required
              />
              <input
                type="number"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                placeholder="Start Time (min)"
                className="w-full border p-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Questions */}
          <section className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="space-y-4 border-b pb-4">
                <div className="flex justify-between items-center">
                  <label className="font-medium">Q{idx + 1}</label>
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="text-red-600 hover:underline"
                  >
                    <RiDeleteBinLine /> Remove Question
                  </button>
                </div>
                <textarea
                  value={q.text}
                  onChange={e => handleQuestionChange(q.id, e.target.value)}
                  className="w-full border p-2 focus:ring-primary"
                  required
                />
                <div className="space-y-2">
                  {q.options.map(o => (
                    <div key={o.id} className="flex items-center bg-[#EBEBEB] px-3 py-2">
                      <input
                        type="checkbox"
                        checked={o.isCorrect}
                        onChange={() => toggleCorrect(q.id, o.id)}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={o.text}
                        onChange={e => handleOptionChange(q.id, o.id, e.target.value)}
                        placeholder="Option text"
                        className="flex-1 focus:ring-primary"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(q.id, o.id)}
                        className="ml-2 text-red-500 hover:underline"
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="text-[#0832DE] font-medium flex items-center"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="text-[#0832DE] font-medium flex items-center"
            >
              + Add Question
            </button>
          </section>

          {saveError && <p className="text-red-500">{saveError}</p>}
        </form>
      </main>
    </div>
  );
};

export default EditTest;