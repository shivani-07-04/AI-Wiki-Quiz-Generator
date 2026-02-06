'use client'

import { useState } from 'react'
import GenerateQuizTab from './generate-tab'
import HistoryTab from './history-tab'

interface QuizTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function QuizTabs({ activeTab, setActiveTab }: QuizTabsProps) {
  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'generate'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Generate Quiz
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'history'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          History
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === 'generate' && <GenerateQuizTab />}
        {activeTab === 'history' && <HistoryTab />}
      </div>
    </div>
  )
}
