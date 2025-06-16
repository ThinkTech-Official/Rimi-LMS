
import { type FC, useEffect, useState } from 'react'

export interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
}

export interface QuizProps {
  questions: Question[]
  duration: number       // total quiz time in seconds
  passingScore?: number  // fraction required to pass, e.g. 0.7 = 70%
  onComplete: (passed: boolean, score: number) => void
}

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2,'0')} : ${s.toString().padStart(2,'0')}`
}

const Quiz: FC<QuizProps> = ({
  questions,
  duration,
  passingScore = 0.7,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [finished, setFinished] = useState(false)
  const [passed, setPassed] = useState(false)

  // countdown timer
  useEffect(() => {
    if (finished) return
    if (timeLeft <= 0) {
      finishQuiz()
      return
    }
    const iv = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(iv)
  }, [timeLeft, finished])

  const select = (optIdx: number) => {
    setAnswers({ ...answers, [questions[current].id]: optIdx })
  }

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1)
    } else {
      finishQuiz()
    }
  }
  const prev = () => current > 0 && setCurrent(current - 1)

  function finishQuiz() {
    setFinished(true)
    const correct = questions.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length
    const score = correct / questions.length
    const isPassed = score >= passingScore
    setPassed(isPassed)
    onComplete(isPassed, score)
  }
// new comment 
  const retry = () => {
    setTimeLeft(duration)
    setCurrent(0)
    setAnswers({})
    setFinished(false)
  }

  if (finished) {
    const correctCount = questions.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-semibold mb-4">
          You scored {correctCount} / {questions.length}
        </h2>
        <p className="mb-6 text-lg">
          {passed ? 'Congratulations, you passed! 🎉' : 'Sorry, you failed.'}
        </p>
        <div className="space-x-4">
          {!passed && (
            <button
              onClick={retry}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Retry
            </button>
          )}
          <button
            onClick={() => onComplete(passed, correctCount / questions.length)}
            className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const sel = answers[q.id]

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-start p-8 overflow-auto">
      {/* Header: timer */}
      <div className="text-center mb-6">
        <div className="text-xl font-medium">⏱ {formatTime(timeLeft)}</div>
        <div className="text-gray-600 mt-1">Complete the Quiz to Continue</div>
      </div>

      {/* Question */}
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500 font-medium">
            Question {current + 1}
          </span>
          <span className="text-gray-500">
            {current + 1}/{questions.length}
          </span>
        </div>
        <h3 className="mb-6 text-lg font-semibold">{q.text}</h3>

        {/* Options */}
        <ul className="space-y-4">
          {q.options.map((opt, i) => (
            <li key={i}>
              <label className="flex items-center space-x-3 p-3 bg-gray-100 rounded hover:bg-gray-200">
                <input
                  type="radio"
                  name={q.id}
                  checked={sel === i}
                  onChange={() => select(i)}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span>{opt}</span>
              </label>
            </li>
          ))}
        </ul>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            ← Previous
          </button>
          <button
            onClick={next}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {current < questions.length - 1 ? 'Next →' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz
