'use client'

import React from "react"

import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import ArticleOverview from '@/components/sections/article-overview'
import TopicSections from '@/components/sections/topic-sections'
import QuizSection from '@/components/sections/quiz-section'
import RelatedTopics from '@/components/sections/related-topics'

interface QuizData {
  id: number
  url: string
  title: string
  summary: string
  article_image: string
  sections: Array<{
    title: string
    description: string
    image: string
  }>
  quiz: Array<{
    question: string
    options: string[]
    answer: string
    difficulty: 'easy' | 'medium' | 'hard'
    topic: string
    explanation: string
  }>
  related_topics: Array<{
    name: string
    image: string
  }>
}

export default function GenerateTab() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quizData, setQuizData] = useState<QuizData | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data = await response.json()
      setQuizData(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate quiz. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            Wikipedia Article URL
          </label>
          <div className="flex gap-2">
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://en.wikipedia.org/wiki/Alan_Turing"
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Quiz'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
          </div>
        )}
      </form>

      {/* Results */}
      {quizData && (
        <div className="space-y-8 animate-fade-in">
          <ArticleOverview
            title={quizData.title}
            summary={quizData.summary}
            image={quizData.article_image}
            url={quizData.url}
          />
          <TopicSections sections={quizData.sections} />
          <QuizSection questions={quizData.quiz} />
          <RelatedTopics topics={quizData.related_topics} />
        </div>
      )}

      {/* Empty State */}
      {!quizData && !loading && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            Enter a Wikipedia URL above to generate a quiz
          </p>
        </div>
      )}
    </div>
  )
}
