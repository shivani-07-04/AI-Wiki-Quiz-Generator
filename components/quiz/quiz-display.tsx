'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import QuestionCard from './question-card'

interface QuizProps {
  quiz: {
    url: string
    title: string
    summary: string
    sections: string[]
    key_entities: {
      people: string[]
      organizations: string[]
      locations: string[]
    }
    quiz: Array<{
      question: string
      options: string[]
      answer: string
      difficulty: 'easy' | 'medium' | 'hard'
      explanation: string
    }>
    related_topics: string[]
  }
  onViewTakeMode: () => void
  takeMode: boolean
}

export default function QuizDisplay({
  quiz,
  onViewTakeMode,
  takeMode,
}: QuizProps) {
  const [scores, setScores] = useState<{ [key: number]: string | null }>({})

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (!takeMode) return
    setScores((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }))
  }

  const correctAnswers = quiz.quiz.filter(
    (q, idx) => scores[idx] === q.answer
  ).length

  return (
    <div className="space-y-8">
      {/* Article Info */}
      <div className="bg-card rounded-lg border border-border p-8">
        <h2 className="text-3xl font-bold mb-4">{quiz.title}</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">{quiz.summary}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Key People */}
          {quiz.key_entities.people.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-3">
                Key People
              </h3>
              <div className="space-y-2">
                {quiz.key_entities.people.map((person) => (
                  <div
                    key={person}
                    className="text-sm bg-secondary/30 rounded px-3 py-1"
                  >
                    {person}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Organizations */}
          {quiz.key_entities.organizations.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-3">
                Organizations
              </h3>
              <div className="space-y-2">
                {quiz.key_entities.organizations.map((org) => (
                  <div
                    key={org}
                    className="text-sm bg-secondary/30 rounded px-3 py-1"
                  >
                    {org}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Locations */}
          {quiz.key_entities.locations.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-3">
                Locations
              </h3>
              <div className="space-y-2">
                {quiz.key_entities.locations.map((location) => (
                  <div
                    key={location}
                    className="text-sm bg-secondary/30 rounded px-3 py-1"
                  >
                    {location}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Article Sections */}
        {quiz.sections.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-3">
              Article Sections
            </h3>
            <div className="flex flex-wrap gap-2">
              {quiz.sections.map((section) => (
                <span
                  key={section}
                  className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1"
                >
                  {section}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mode Toggle & Score */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quiz Questions</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {quiz.quiz.length} questions • Test your knowledge
          </p>
        </div>
        <div className="flex items-center gap-4">
          {takeMode && (
            <div className="bg-card border border-border rounded-lg px-4 py-2">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-2xl font-bold text-primary">
                {correctAnswers}/{quiz.quiz.length}
              </p>
            </div>
          )}
          <Button
            onClick={onViewTakeMode}
            variant={takeMode ? 'default' : 'outline'}
          >
            {takeMode ? 'Review Mode' : 'Take Quiz'}
          </Button>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.quiz.map((question, idx) => (
          <QuestionCard
            key={idx}
            index={idx}
            question={question}
            takeMode={takeMode}
            selectedAnswer={scores[idx] || null}
            onSelectAnswer={(answer) => handleAnswerSelect(idx, answer)}
          />
        ))}
      </div>

      {/* Related Topics */}
      {quiz.related_topics.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-8">
          <h3 className="text-xl font-bold mb-4">Related Topics</h3>
          <p className="text-foreground/70 text-sm mb-4">
            Explore these topics to deepen your knowledge:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {quiz.related_topics.map((topic) => (
              <div
                key={topic}
                className="bg-secondary/50 rounded px-4 py-3 text-sm text-center hover:bg-secondary transition-colors cursor-pointer"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
