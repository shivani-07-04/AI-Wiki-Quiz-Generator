'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import LoadingSpinner from './loading-spinner'
import QuizModal from './quiz-modal'

interface HistoryItem {
  id: number
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
  created_at: string
}

export default function HistoryTab() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedQuiz, setSelectedQuiz] = useState<HistoryItem | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/quiz/history')
        if (!response.ok) throw new Error('Failed to fetch history')
        const data = await response.json()
        setHistory(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded p-6 text-center">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <p className="text-muted-foreground text-lg mb-4">
          No quizzes generated yet
        </p>
        <p className="text-muted-foreground text-sm">
          Start by generating your first quiz in the Generate Quiz tab
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/30 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Title</th>
                <th className="text-left px-6 py-4 font-semibold">Questions</th>
                <th className="text-left px-6 py-4 font-semibold">Generated</th>
                <th className="text-right px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {item.url}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                      {item.quiz.length} Q
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedQuiz(item)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedQuiz && (
        <QuizModal
          quiz={selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
        />
      )}
    </div>
  )
}
