import Image from 'next/image'

interface RelatedTopic {
  name: string
  image: string
}

interface RelatedTopicsProps {
  topics: RelatedTopic[]
}

export default function RelatedTopics({ topics }: RelatedTopicsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
        Related Topics
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className="group relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square cursor-pointer hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative w-full h-full">
              {topic.image ? (
                <Image
                  src={topic.image || "/placeholder.svg"}
                  alt={topic.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No image
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
            </div>

            {/* Topic Name */}
            <div className="absolute inset-0 flex items-end p-3">
              <p className="text-white font-medium text-sm text-balance leading-tight">
                {topic.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
