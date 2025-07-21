import React, { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useFetchTest, type TestDetail, type QuestionDto, type OptionDto } from '../hooks/useFetchTest';
import { useUpdateTest, type UpdateTestDto } from '../hooks/useUpdateTest';
import useNotification from '../hooks/useNotification';
import Spinner from './loaders/Spinner';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { Question } from './client/Quiz';

export interface EditTestDto {
  name: string;
  duration: number;
  startTime: number;
  questions: QuestionDto[];
}

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

  const [questions, setQuestions] = useState<QuestionDto[]>([{
      id: 1,
      text: "",
      options: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
    },]);
  const {triggerNotification} = useNotification();
  const [questionErrors, setQuestionErrors] = useState<Record<number, string[]>>({});
  const {
  register,
  handleSubmit,
  formState: { errors },
  reset
} = useForm<EditTestDto>({
  defaultValues: {
    name: '',
    duration: 0,
    startTime: 0,
    questions: [],
  },
});


const validateQuestion = (q: QuestionDto): string[] => {
  const errors: string[] = [];
  if (!q.text.trim()) errors.push("Question text is required.");
  if (q.options.length < 2) errors.push("At least 2 options required.");
  if (q.options.some((o) => !o.text.trim())) errors.push("All options must have text.");
  if (!q.options.some((o) => o.isCorrect)) errors.push("One option must be marked correct.");
  return errors;
};
const updateErrorsForQuestion = (qid: number, question: QuestionDto) => {
  const errors = validateQuestion(question);
  setQuestionErrors(prev => {
    const updated = { ...prev };
    if (errors.length > 0) {
      updated[qid] = errors;
    } else {
      delete updated[qid];
    }
    return updated;
  });
};


  // Populate form when `test` loads
useEffect(() => {
  if (!test) return;
  reset({
    name: test.name,
    duration: test.duration,
    startTime: test.startTime,
    questions: test.questions,
  });
  setQuestions(test.questions);
}, [test, reset]);


const handleQuestionChange = (qid: number, text: string) => {
  setQuestions(prev => {
    const updated = prev.map(q => q.id === qid ? { ...q, text } : q);
    const q = updated.find(q => q.id === qid)!;
    updateErrorsForQuestion(qid, q);
    return updated;
  });
};


const handleOptionChange = (qid: number, oid: number, text: string) => {
  setQuestions(prev => {
    const updated = prev.map(q => 
      q.id === qid
        ? {
            ...q,
            options: q.options.map(o =>
              o.id === oid ? { ...o, text } : o
            ),
          }
        : q
    );
    const q = updated.find(q => q.id === qid)!;
    updateErrorsForQuestion(qid, q);
    return updated;
  });
};


const toggleCorrect = (qid: number, oid: number) => {
  setQuestions(prev => {
    const updated = prev.map(q =>
      q.id === qid
        ? {
            ...q,
            options: q.options.map(o =>
              o.id === oid ? { ...o, isCorrect: !o.isCorrect } : o
            ),
          }
        : q
    );
    const q = updated.find(q => q.id === qid)!;
    updateErrorsForQuestion(qid, q);
    return updated;
  });
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

    const onSubmit: SubmitHandler<EditTestDto> = async (data: EditTestDto) => {
       const questionLevelErrors: Record<number, string[]> = {};
  questions.forEach((q) => {
    const errs = validateQuestion(q);
    if (errs.length > 0) questionLevelErrors[q.id] = errs;
  });

  if (Object.keys(questionLevelErrors).length > 0) {
    setQuestionErrors(questionLevelErrors);
    return;
  }
      const dto: UpdateTestDto = {
    name: data.name,
    duration: data.duration,
    startTime: data.startTime,
    questions: questions.map(q => ({
      text: q.text,
      options: q.options.map(o => ({ text: o.text, isCorrect: o.isCorrect })),
    })),
  };
    try {
      await updateTest(dto);
      navigate(`/admin/edit-course/${courseId}`,{
        state: {
          type: "success",
          message: "Test updated",
        }
      });
    } catch {
      // saveError will display below
    }
  };

  if (loadingFetch) return <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'><Spinner className='w-10 h-10'/></div>;
  if (fetchError) return <p className="text-red-500">{fetchError}</p>;

  return (
    <div className="space-y-6 p-2 md:p-4 lg:p-8">
       {/* Breadcrumbs */}
      <button
        onClick={() => navigate("/admin/edit-course/" + courseId)}
        className="underline underline-offset-2 cursor-pointer text-sm text-primary font-medium"
        title="Back to Course"
      >
       &lt; Back to Course
      </button>
      <main>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
           <div className="flex flex-col">
            <label htmlFor="" className='text-sm text-text-light-2 mb-1 capitalize'>Test Name</label>
             <input
              type="text"
               {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 4,
                      message: "Name must be at least 4 characters",
                    },
                  })}
              placeholder="Test Name"
              className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
           </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex flex-col">
               <label htmlFor="" className='text-sm text-text-light-2 mb-1 capitalize'>Test Duration</label>
               <input
                 type="number"
                    {...register("duration", {
                      required: "Duration is required",
                      min: {
                        value: 1,
                        message: "Duration must be at least 1 second",
                      },
                    })}
                placeholder="Duration (min)"
                className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
              />
                {errors.duration && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.duration.message}
                    </p>
                  )}
             </div>
             <div className="flex flex-col">
               <label htmlFor="" className='text-sm text-text-light-2 mb-1 capitalize'>Start Time</label>
               <input
                type="number"
                                    {...register("startTime", {
                      valueAsNumber : true,
                      required: "Start Time is required",
                      min: {
                        value: 1,
                        message: "Start Time must be at least 1 second",
                      },
                    })}
                placeholder="Start Time (min)"
                className="w-full border border-inputBorder px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.startTime && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startTime.message}
                    </p>
                  )}
            </div>
             </div>
          </div>

          {/* Questions */}
          <section className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="space-y-1 pb-4" style={{ borderBottom: "1px solid #AAA9A9" }}>
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
                 {questionErrors[q.id]?.length > 0 && (
  <ul className="text-sm text-red-500 list-disc pl-5 space-y-1">
    {questionErrors[q.id].map((err, i) => (
      <li key={i}>{err}</li>
    ))}
  </ul>
)}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[800px] mt-2">
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
                      {/* <button
                        type="button"
                        onClick={() => removeOption(q.id, o.id)}
                        title='Delete option'
                        className="ml-2 text-text-light hover:text-red-600 hover:underline cursor-pointer"
                      >
                        <RiDeleteBinLine className='w-4 h-4'/>
                      </button> */}
                    </div>
                  ))}
                  {/* <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="text-[#0832DE] font-medium flex items-center cursor-pointer"
                  >
                    + Add Option
                  </button> */}
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