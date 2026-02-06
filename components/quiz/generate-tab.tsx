'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LoadingSpinner from './loading-spinner'
import QuizDisplay from './quiz-display'

interface Quiz {
  id?: number
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

export default function GenerateQuizTab() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setQuiz(null)

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate quiz')
      }

      const data = await response.json()
      setQuiz(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Quiz generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-card rounded-lg border border-border p-8">
        <form onSubmit={handleGenerateQuiz} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Wikipedia Article URL
            </label>
            <Input
              type="url"
              placeholder="https://en.wikipedia.org/wiki/Alan_Turing"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Enter a direct link to any Wikipedia article to generate a quiz
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !url}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⚙️</span>
                Generating Quiz...
              </>
            ) : (
              'Generate Quiz'
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Quiz Display */}
      {quiz && !loading && (
        <QuizDisplay
          quiz={quiz}
          onViewTakeMode={() => setShowPreview(!showPreview)}
          takeMode={showPreview}
        />
      )}
    </div>
  )
}
