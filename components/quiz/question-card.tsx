'use client'

interface QuestionCardProps {
  index: number
  question: {
    question: string
    options: string[]
    answer: string
    difficulty: 'easy' | 'medium' | 'hard'
    explanation: string
  }
  takeMode: boolean
  selectedAnswer: string | null
  onSelectAnswer: (answer: string) => void
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  medium:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

export default function QuestionCard({
  index,
  question,
  takeMode,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  const isCorrect = selectedAnswer === question.answer
  const showFeedback = takeMode && selectedAnswer !== null

  return (
    <div className="bg-card rounded-lg border border-border p-8 space-y-6">
      {/* Question Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground mb-2">
            Question {index + 1} of {question ? 'X' : 0}
          </div>
          <h3 className="text-xl font-semibold">{question.question}</h3>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
            difficultyColors[question.difficulty]
          }`}
        >
          {question.difficulty.charAt(0).toUpperCase() +
            question.difficulty.slice(1)}
        </span>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, optIdx) => {
          const optionLetter = String.fromCharCode(65 + optIdx) // A, B, C, D
          const isSelected = selectedAnswer === option
          const isCorrectOption = option === question.answer

          let optionClass =
            'bg-secondary/30 border-secondary hover:bg-secondary/50'
          if (showFeedback) {
            if (isCorrectOption) {
              optionClass =
                'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700'
            } else if (isSelected && !isCorrect) {
              optionClass =
                'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700'
            }
          } else if (isSelected) {
            optionClass = 'bg-primary/20 border-primary'
          }

          return (
            <button
              key={optIdx}
              onClick={() => !takeMode || !showFeedback ? onSelectAnswer(option) : undefined}
              disabled={takeMode && showFeedback}
              className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${optionClass} ${
                takeMode && showFeedback ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="font-bold text-primary min-w-fit">
                  {optionLetter}.
                </span>
                <span>{option}</span>
                {showFeedback && isCorrectOption && (
                  <span className="ml-auto text-green-600 dark:text-green-400 font-bold">
                    ✓
                  </span>
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <span className="ml-auto text-red-600 dark:text-red-400 font-bold">
                    ✗
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`p-4 rounded-lg ${
            isCorrect
              ? 'bg-green-100/50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
              : 'bg-red-100/50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">
              {isCorrect ? '✓' : '✗'}
            </span>
            <div>
              <p
                className={`font-semibold mb-2 ${
                  isCorrect
                    ? 'text-green-900 dark:text-green-300'
                    : 'text-red-900 dark:text-red-300'
                }`}
              >
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p
                className={`text-sm ${
                  isCorrect
                    ? 'text-green-800 dark:text-green-400'
                    : 'text-red-800 dark:text-red-400'
                }`}
              >
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
