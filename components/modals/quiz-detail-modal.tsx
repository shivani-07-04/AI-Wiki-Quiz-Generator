'use client'

import { X } from 'lucide-react'
import ArticleOverview from '@/components/sections/article-overview'
import TopicSections from '@/components/sections/topic-sections'
import QuizSection from '@/components/sections/quiz-section'
import RelatedTopics from '@/components/sections/related-topics'
import { QuizResponse } from '@/lib/api-client'

interface QuizDetailModalProps {
  quiz: QuizResponse
  onClose: () => void
}

export default function QuizDetailModal({
  quiz,
  onClose,
}: QuizDetailModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end sm:items-center justify-center p-4">
          <div
            className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-xl shadow-xl transform transition-all animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex-1">
                {quiz.article_title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-8">
              <ArticleOverview
                title={quiz.article_title}
                summary={quiz.article_summary}
                image={quiz.article_image_url}
                url={quiz.wikipedia_url}
              />
              <TopicSections sections={quiz.sections} />
              <QuizSection questions={quiz.quiz_data} />
              <RelatedTopics topics={quiz.related_topics} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
