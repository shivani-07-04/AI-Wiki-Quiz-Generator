import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

interface ArticleOverviewProps {
  title: string
  summary: string
  image: string
  url: string
}

export default function ArticleOverview({
  title,
  summary,
  image,
  url,
}: ArticleOverviewProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8">
        {/* Image */}
        <div className="md:col-span-1">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
            {image ? (
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                No image
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
              {summary}
            </p>
          </div>

          {/* Wikipedia Link */}
          <div className="pt-4">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
            >
              View on Wikipedia
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
