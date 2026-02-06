import Image from 'next/image'

interface Section {
  title: string
  description: string
  image: string
}

interface TopicSectionsProps {
  sections: Section[]
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
              {/* Image */}
              <div className="flex-shrink-0 w-full sm:w-32 h-32">
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {section.image ? (
                    <Image
                      src={section.image || "/placeholder.svg"}
                      alt={section.title}
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
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {section.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                  {section.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
