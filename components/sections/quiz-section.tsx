'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { QuizQuestion } from '@/lib/api-client'

type Question = QuizQuestion

interface QuizSectionProps {
  questions: Question[]
}

const difficultyColors = {
  easy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700',
  medium:
    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700',
  hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700',
}

export default function QuizSection({ questions }: QuizSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})

  const handleSelectAnswer = (questionIndex: number, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
        Quiz
      </h3>

      <div className="space-y-4">
        {questions.map((question, idx) => {
          const isExpanded = expandedIndex === idx
          const selectedAnswer = selectedAnswers[idx]
          const isCorrect = selectedAnswer === question.answer

          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-all"
            >
              {/* Question Header */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-4 sm:p-6 flex gap-4 items-start hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400">
                      {question.topic}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${difficultyColors[question.difficulty]}`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {idx + 1}. {question.question}
                  </p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Question Details */}
              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4">
                  {/* Options */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                      Choose your answer:
                    </p>
                    {question.options.map((option, optIdx) => {
                      const optionText = typeof option === 'string' ? option : option.text
                      const isSelected = selectedAnswer === optionText
                      const isAnswerCorrect = optionText === question.correct_answer

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(idx, optionText)}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors font-medium text-sm ${
                            isSelected
                              ? isAnswerCorrect
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                              : isAnswerCorrect && selectedAnswer
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-slate-500'
                          }`}
                        >
                          <span className="font-bold mr-3">{option.label}.</span>
                          {optionText}
                        </button>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  {selectedAnswer && (
                    <div
                      className={`p-4 rounded-lg border ${
                        isCorrect
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span
                          className={`text-sm font-medium ${
                            isCorrect
                              ? 'text-green-900 dark:text-green-300'
                              : 'text-red-900 dark:text-red-300'
                          }`}
                        >
                          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isCorrect
                              ? 'text-green-700 dark:text-green-400'
                              : 'text-red-700 dark:text-red-400'
                          }`}
                        >
                          (Correct answer: {question.correct_answer})
                        </span>
                      </div>
                      <p
                        className={`text-sm leading-relaxed ${
                          isCorrect
                            ? 'text-green-800 dark:text-green-400'
                            : 'text-red-800 dark:text-red-400'
                        }`}
                      >
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
