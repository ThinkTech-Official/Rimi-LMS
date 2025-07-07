import React, { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useFetchTest, type TestDetail, type QuestionDto, type OptionDto } from '../hooks/useFetchTest';
import { useUpdateTest, type UpdateTestDto } from '../hooks/useUpdateTest';
import useNotification from '../hooks/useNotification';

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
  const {triggerNotification} = useNotification();

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
      triggerNotification({type: 'success', message: 'Test updated', duration: 3000});
      navigate(`/admin/edit-course/${courseId}`);
    } catch {
      // saveError will display below
    }
  };

  if (loadingFetch) return <p></p>;
  if (fetchError) return <p className="text-red-500">{fetchError}</p>;

  return (
    <div className="min-h-screen flex bg-white">
      <main className="flex-1 p-4 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg 2xl:text-2xl font-bold text-[#1B1B1B]">Edit Test</h2>
            <button
              type="submit"
              disabled={loadingSave}
              className="inline-block w-[120px] sm:w-[150px] text-sm sm:text-[16px] px-5 py-2 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
            >
              {loadingSave ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          {/* Basic fields */}
          <div className="space-y-4 text-text-light">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Test Name"
              className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="Duration (min)"
                className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <input
                type="number"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                placeholder="Start Time (min)"
                className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Questions */}
          <section className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="space-y-4 pb-4" style={{ borderBottom: "1px solid #AAA9A9" }}>
                <div className="flex justify-between items-center">
                  <label className="font-medium text-text-light-2">Q{idx + 1}</label>
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="text-text-dark hover:text-red-600 hover:underline flex gap-2 items-center cursor-pointer"
                    title='Delete question'
                  >
                     <RiDeleteBinLine className='w-5 h-5'/>
                  </button>
                </div>
                <textarea
                  value={q.text}
                  onChange={e => handleQuestionChange(q.id, e.target.value)}
                  className="w-full text-text-light border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <div className="space-y-2">
                  {q.options.map(o => (
                    <div key={o.id} className="flex items-center bg-[#EBEBEB] px-3 py-2 relative">
                      <input
                        type="checkbox"
                        checked={o.isCorrect}
                        onChange={() => toggleCorrect(q.id, o.id)}
                        className="mr-2 h-4 w-4 border-gray-300 rounded accent-primary cursor-pointer"
                      />
                      <input
                        type="text"
                        value={o.text}
                        onChange={e => handleOptionChange(q.id, o.id, e.target.value)}
                        placeholder="Option text"
                        className="flex-1 focus:outline-none focus:ring-primary text-text-light-2"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(q.id, o.id)}
                        title='Delete option'
                        className="ml-2 text-text-light hover:text-red-600 hover:underline cursor-pointer"
                      >
                        <RiDeleteBinLine className='w-4 h-4'/>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="text-[#0832DE] font-medium flex items-center cursor-pointer"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="text-[#0832DE] font-medium flex items-center cursor-pointer"
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