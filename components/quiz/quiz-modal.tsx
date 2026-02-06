'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import QuizDisplay from './quiz-display'
import { X } from 'lucide-react'

interface QuizModalProps {
  quiz: {
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
  onClose: () => void
}

export default function QuizModal({ quiz, onClose }: QuizModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => onClose()}
    >
      <div
        className="bg-background rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Saved Quiz</p>
            <h2 className="text-xl font-bold">{quiz.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <QuizDisplay
            quiz={quiz}
            onViewTakeMode={() => {}}
            takeMode={false}
          />
        </div>
      </div>
    </div>
  )
}
