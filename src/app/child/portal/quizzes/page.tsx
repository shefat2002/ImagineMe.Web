'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { childService } from '@/lib/api/child'
import { QuizDto, QuestionDto } from '@/types/api'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export default function QuizzesPage() {
  const { user } = useAuth()
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDto | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const { data: quizzes, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => childService.listQuizzes(),
    enabled: !!user && user.userType === 3
  })

  const logQuizMutation = useMutation({
    mutationFn: (data: { quizId: string; score: number; coinsEarned: number }) =>
      childService.logQuizActivity(data.quizId, data.score, data.coinsEarned)
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Failed to load quizzes</div>
      </div>
    )
  }

  if (selectedQuiz && !showResults) {
    const question = selectedQuiz.questions[currentQuestion]
    const isLastQuestion = currentQuestion === selectedQuiz.questions.length - 1

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedQuiz(null)
                setCurrentQuestion(0)
                setSelectedAnswers({})
                setShowResults(false)
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              ← Back to Quizzes
            </button>

            <div className="text-lg font-semibold text-blue-800">
              Question {currentQuestion + 1} of {selectedQuiz.questions.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold mb-8 text-blue-800">{selectedQuiz.title}</h1>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {question.questionText}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedAnswers({
                        ...selectedAnswers,
                        [currentQuestion]: index
                      })
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={() => {
                    const correctAnswers = selectedQuiz.questions.reduce((count, q, idx) => {
                      return count + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0)
                    }, 0)
                    const finalScore = Math.round((correctAnswers / selectedQuiz.questions.length) * 100)
                    setScore(finalScore)
                    setShowResults(true)
                  }}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-bold hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  See Results 🎉
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedQuiz && showResults) {
    const coinsEarned = score >= 70 ? Math.round(score / 10) : 0

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">
            {score >= 90 ? '🏆' : score >= 70 ? '🎉' : score >= 50 ? '👍' : '💪'}
          </div>

          <h1 className="text-4xl font-bold mb-4 text-blue-800">Quiz Complete!</h1>

          <div className="text-6xl font-bold text-blue-600 mb-4">{score}%</div>

          <div className="text-xl text-gray-600 mb-6">
            You got {Math.round((score / 100) * selectedQuiz.questions.length)} out of {selectedQuiz.questions.length} questions correct
          </div>

          {coinsEarned > 0 && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 px-6 rounded-xl mb-6">
              <span className="text-2xl font-bold">+{coinsEarned} coins earned!</span>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={async () => {
                if (coinsEarned > 0) {
                  try {
                    await logQuizMutation.mutateAsync({
                      quizId: selectedQuiz.id,
                      score,
                      coinsEarned
                    })
                    alert(`Activity logged! +${coinsEarned} coins added to your profile.`)
                  } catch (error) {
                    alert('Failed to log activity')
                  }
                }

                setSelectedQuiz(null)
                setCurrentQuestion(0)
                setSelectedAnswers({})
                setShowResults(false)
                setScore(0)
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-purple-600"
            >
              Done ✅
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
          🧠 Quiz Challenge
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes?.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => setSelectedQuiz(quiz)}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              <div className="text-4xl mb-4">📝</div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>

              <div className="text-sm text-gray-500 mb-4">
                {quiz.questions.length} questions
              </div>

              <div className="flex items-center justify-between">
                <span className={quiz.status === 1 ? 'text-green-600' : 'text-yellow-600'}>
                  {quiz.status === 1 ? '✅ Active' : '📝 Draft'}
                </span>
                <span className="text-blue-600 font-semibold">Start →</span>
              </div>
            </div>
          ))}
        </div>

        {quizzes?.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <div className="text-6xl mb-4">🧠</div>
            <p className="text-xl">No quizzes available yet!</p>
            <p className="mt-2">New quizzes coming soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}