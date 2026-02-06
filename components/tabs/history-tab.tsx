'use client'

import { useEffect, useState } from 'react'
import { Loader2, Eye } from 'lucide-react'
import QuizDetailModal from '@/components/modals/quiz-detail-modal'
import { getHistory, getQuizById, QuizResponse, QuizHistoryItem } from '@/lib/api-client'

export default function HistoryTab() {
  const [history, setHistory] = useState<QuizHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResponse | null>(null)
  const [selectedLoading, setSelectedLoading] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setError('')
      const data = await getHistory(50, 0)
      setHistory(data.quizzes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history')
      console.error('Failed to fetch history:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (quizId: string) => {
    try {
      setSelectedLoading(true)
      const quiz = await getQuizById(quizId)
      setSelectedQuiz(quiz)
    } catch (err) {
      console.error('Failed to fetch quiz details:', err)
      alert(err instanceof Error ? err.message : 'Failed to load quiz details')
    } finally {
      setSelectedLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchHistory}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">
          No quiz history yet. Generate your first quiz to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Article Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Wikipedia URL
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {history.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                  {item.article_title}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  <a
                    href={item.wikipedia_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline truncate block"
                  >
                    {item.wikipedia_url}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewDetails(item.id)}
                    disabled={selectedLoading}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQuiz && (
        <QuizDetailModal
          quiz={selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
        />
      )}
    </div>
  )
}
