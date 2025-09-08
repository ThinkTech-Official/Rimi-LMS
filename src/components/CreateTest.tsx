import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCreateTest } from "../hooks/useCreateTest";
import { useTranslation } from "react-i18next";
import { useForm, type SubmitHandler } from "react-hook-form";
import useNotification from "../hooks/useNotification";

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

interface NewTest {
  name: string;
  duration: number;
  startTime: number;
  passingMarks: number;
  quizQuestionNumber: number;
  questions: Question[];
}

const CreateTest: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { createTest, loading, error } = useCreateTest(courseId!);
  const { t } = useTranslation();
  const [questionErrors, setQuestionErrors] = useState<
    Record<number, string[]>
  >({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { triggerNotification, NotificationComponent } = useNotification();
  const [courseDuration, setCourseDuration] = useState<number>(0);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTest>();
  const location = useLocation();
  const state = location.state;
  useEffect(() => {
    if (state?.courseDuration) {
      setCourseDuration(state.courseDuration);
    }
  });

  const validateQuestion = (q: Question): string[] => {
    const errors: string[] = [];
    if (!q.text.trim()) errors.push("Question text is required.");
    if (q.options.length < 2) errors.push("At least 2 options required.");
    if (q.options.some((o) => !o.text.trim()))
      errors.push("All options must have text.");
    if (!q.options.some((o) => o.isCorrect))
      errors.push("One option must be marked correct.");
    return errors;
  };

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
    const updatedQuestions = questions.map((q) =>
      q.id === qid ? { ...q, text } : q
    );
    setQuestions(updatedQuestions);

    // Only validate if submission has been attempted
    if (hasSubmitted) {
      const current = updatedQuestions.find((q) => q.id === qid)!;
      const errors = validateQuestion(current);

      setQuestionErrors((prev) => {
        const updated = { ...prev };
        if (errors.length > 0) {
          updated[qid] = errors;
        } else {
          delete updated[qid];
        }
        return updated;
      });
    }
  };

  const handleOptionChange = (qid: number, oid: number, text: string) => {
    const updatedQuestions = questions.map((q) =>
      q.id === qid
        ? {
            ...q,
            options: q.options.map((o) => (o.id === oid ? { ...o, text } : o)),
          }
        : q
    );
    setQuestions(updatedQuestions);

    if (hasSubmitted) {
      const current = updatedQuestions.find((q) => q.id === qid)!;
      const errors = validateQuestion(current);

      setQuestionErrors((prev) => {
        const updated = { ...prev };
        if (errors.length > 0) {
          updated[qid] = errors;
        } else {
          delete updated[qid];
        }
        return updated;
      });
    }
  };

  const toggleCorrect = (qid: number, oid: number) => {
    // only one option can be correct at a time
    const updatedQuestions = questions.map((q) => {
      if (q.id === qid) {
        const clicked = q.options.find((o) => o.id === oid);

        const isCurrentlyCorrect = clicked?.isCorrect;

        return {
          ...q,
          options: q.options.map((o) => {
            if (o.id === oid) {
              // toggle the clicked one
              return { ...o, isCorrect: !o.isCorrect };
            }
            // if we are selecting a new correct one → reset others
            return isCurrentlyCorrect ? o : { ...o, isCorrect: false };
          }),
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);

    const current = updatedQuestions.find((q) => q.id === qid)!;
    const errors = validateQuestion(current);

    setQuestionErrors((prev) => {
      const updated = { ...prev };
      if (errors.length > 0) {
        updated[qid] = errors;
      } else {
        delete updated[qid];
      }
      return updated;
    });
  };

  // const handleAddOption = (qid: number) => {
  //   setQuestions((qs) =>
  //     qs.map((q) => {
  //       if (q.id !== qid) return q;
  //       const newId = q.options.length + 1;
  //       return {
  //         ...q,
  //         options: [...q.options, { id: newId, text: "", isCorrect: false }],
  //       };
  //     })
  //   );
  // };

  const handleRemoveQuestion = (qid: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qid));
  };

  const onSubmit: SubmitHandler<NewTest> = async (data: NewTest) => {
    if (!courseId) return;
    setHasSubmitted(true);
    const questionLevelErrors: Record<number, string[]> = {};

    questions.forEach((q) => {
      const errors: string[] = [];
      if (!q.text.trim()) errors.push("Question text is required.");
      if (q.options.length < 2) errors.push("At least 2 options required.");
      const emptyOptions = q.options.filter((o) => !o.text.trim());
      if (emptyOptions.length > 0) errors.push("All options must have text.");
      if (!q.options.some((o) => o.isCorrect))
        errors.push("One option must be marked correct.");
      if (errors.length > 0) {
        questionLevelErrors[q.id] = errors;
      }
    });

    if (Object.keys(questionLevelErrors).length > 0) {
      setQuestionErrors(questionLevelErrors);
      return;
    } else {
      setQuestionErrors({});
    }

    const dto = {
      name: data.name.trim(),
      duration: Number(data.duration),
      startTime: Number(data.startTime),
      passingMarks: Number(data.passingMarks),
      // quizQuestionNumber: Number(data.quizQuestionNumber) ,
      quizQuestionNumber: 1 ,
      questions: questions.map((q) => ({
        text: q.text.trim(),
        options: q.options.map((o) => ({
          text: o.text.trim(),
          isCorrect: o.isCorrect,
        })),
      })),
    };

    console.log("from create test submit", dto);

    try {
      await createTest(dto);
      navigate(`/admin/edit-course/${courseId}`, {
        state: {
          type: "success",
          message: t("Test created successfully"),
        },
      });
    } catch (error: any) {
      triggerNotification({
        type: "error",
        message: t("Failed to create test"),
        duration: 3000,
      });
    }
  };
  return (
    <>
      <div className="space-y-6 p-2 md:p-4 lg:p-8">
        {/* Breadcrumbs */}
        <button
          onClick={() => navigate("/admin/edit-course/" + courseId)}
          className="underline underline-offset-2 cursor-pointer text-sm text-primary font-medium"
          title={t("back to course")}
        >
          &lt; {t("back to course")}
        </button>

        <main className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Test Information */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row w-full justify-between sm:items-center mb-6 sm:mb-3">
                <h2 className="text-lg 2xl:text-2xl font-bold text-[#1B1B1B]">
                  {t("test information")}
                </h2>
                <button
                  type="submit"
                  className="w-fit inline-block text-sm sm:text-[16px] px-5 py-2 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
                >
                  {loading ? t("saving") : t("save test")}
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-text-light-2 mb-1 capitalize">
                      {t("name")}
                    </label>
                    <input
                      type="text"
                      {...register("name", {
                        required: t("name required"),
                        minLength: {
                          value: 4,
                          message: t("name min length"),
                        },
                      })}
                      placeholder={t("enter test name")}
                      className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-text-light-2 mb-1 capitalize">
                      {t("duration")}
                    </label>
                    <input
                      type="number"
                      {...register("duration", {
                        required: t("duration required"),
                        min: {
                          value: 1,
                          message: t("duration min"),
                        },
                      })}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder={t("select test duration")}
                      className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.duration && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm text-text-light-2 mb-1 capitalize">
                      {t("start time")}
                    </label>
                    <input
                      type="number"
                      {...register("startTime", {
                        valueAsNumber: true,
                        required: t("start time required"),
                        min: {
                          value: 1,
                          message: t("start time min"),
                        },
                        // start time should not exceed the duration of the course
                        max: {
                          value: courseDuration || 0,
                          message:
                            t(
                              "Start time cannot be more then course duration"
                            ) + `(${courseDuration})`,
                        },
                      })}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder={t("start time placeholder")}
                      className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {!errors.startTime && (
                      <p className="text-text-light-2 text-xs">
                        {t("Course duration")}: {courseDuration}sec
                      </p>
                    )}
                    {errors.startTime && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.startTime.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-text-light-2 mb-1 capitalize">
                      {t("passing percentage")}
                    </label>
                    <input
                      type="number"
                      {...register("passingMarks", {
                        valueAsNumber: true,
                        required: t("Passing percentage required"),
                        min: {
                          value: 1,
                          message: t("passing marks min"),
                        },
                        max: {
                          value: 100,
                          message: t("passing marks max"),
                        },
                      })}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder={t("passing percentage placeholder")}
                      className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.passingMarks && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.passingMarks.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Passing Marks and Quiz Questions */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm text-text-light-2 mb-1 capitalize">
                    {t("passing percentage")}
                  </label>
                  <input
                    type="number"
                    {...register("passingMarks", {
                      valueAsNumber: true,
                      required: t("Passing percentage required"),
                      min: {
                        value: 1,
                        message: t("passing marks min"),
                      },
                      max: {
                        value: 100,
                        message: t("passing marks max"),
                      },
                    })}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder={t("passing percentage placeholder")}
                    className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.passingMarks && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.passingMarks.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-text-light-2 mb-1 capitalize">
                    {t("number of questions")}
                  </label>
                  <input
                    type="number"
                    {...register("quizQuestionNumber", {
                      valueAsNumber: true,
                      required: t("number of questions required"),
                      min: {
                        value: 1,
                        message: t("number of questions min"),
                      },
                    })}
                    placeholder={t("number of questions placeholder")}
                    className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.quizQuestionNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.quizQuestionNumber.message}
                    </p>
                  )}
                </div>
              </div> */}
              </div>
            </section>

            {/* Add Questions */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">
                  {t("add questions")}
                </h2>
              </div>

              {questions.map((q, index) => (
                <div key={q.id} className="space-y-4">
                  <label className="font-medium">
                    {t("question label", { number: index + 1 })}
                  </label>
                  <textarea
                    value={q.text}
                    onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                    placeholder={t("type question here")}
                    className="w-full border border-inputBorder p-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={2}
                  />
                  <div className="space-y-2">
                    <label className="text-sm 2xl:text-base font-medium">
                      {t("options")}
                    </label>
                    {questionErrors[q.id]?.length > 0 && (
                      <ul className="text-sm text-red-500 list-disc pl-5 space-y-1">
                        {questionErrors[q.id].map((err, i) => (
                          <li key={i}>{t(err)}</li>
                        ))}
                      </ul>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[800px] mt-2">
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
                            placeholder={t("option placeholder", { id: o.id })}
                            className="flex-1 px-4 py-2 focus:ring-primary focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="inline-block text-sm sm:text-[16px] text-red-500 hover:text-red-600 text-nowrap font-semibold cursor-pointer transition-colors delay-100"
                    >
                      {t("remove question")}
                    </button>
                  </div>
                </div>
              ))}
            </section>

            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="text-[#0832DE] font-medium flex items-center space-x-1 cursor-pointer"
              >
                <span className="text-2xl">+</span>
                <span className="text-lg sm:text-xl">
                  {t("add new question")}
                </span>
              </button>
              <button
                type="submit"
                className="inline-block text-sm sm:text-[16px] px-5 py-2 sm:py-3 bg-primary text-white text-nowrap font-semibold hover:bg-indigo-700 cursor-pointer transition-colors delay-150"
              >
                {loading ? t("saving") : t("save test")}
              </button>
            </div>
          </form>
        </main>
      </div>
      {NotificationComponent}
    </>
  );
};

export default CreateTest;
