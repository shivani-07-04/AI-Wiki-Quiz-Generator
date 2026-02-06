import Image from 'next/image'
import { ArticleSection } from '@/lib/api-client'

interface TopicSectionsProps {
  sections: ArticleSection[]
}

export default function TopicSections({ sections }: TopicSectionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
        Topics & Sections
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {section.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                  {section.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
