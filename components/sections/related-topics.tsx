import { RelatedTopic } from '@/lib/api-client'

interface RelatedTopicsProps {
  topics: RelatedTopic[]
}

export default function RelatedTopics({ topics }: RelatedTopicsProps) {
  if (!topics || topics.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
        Related Topics
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {topics.map((topic, idx) => (
          <a
            key={idx}
            href={topic.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                  {topic.title}
                </h4>
                {topic.summary && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">
                    {topic.summary}
                  </p>
                )}
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex-shrink-0">
                Link
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
