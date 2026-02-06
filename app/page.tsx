'use client'

import { useState } from 'react'
import GenerateTab from '@/components/tabs/generate-tab'
import HistoryTab from '@/components/tabs/history-tab'

export default function QuizApp() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate')

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              AI Wiki Quiz Generator
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              Transform Wikipedia articles into interactive quizzes powered by AI
            </p>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-1 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'generate'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              Generate Quiz
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-1 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              Quiz History
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'generate' && <GenerateTab />}
        {activeTab === 'history' && <HistoryTab />}
      </div>
    </main>
  )
}
