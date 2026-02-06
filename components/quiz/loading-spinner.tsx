export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-muted rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="font-medium text-foreground mb-1">Generating Quiz</p>
        <p className="text-sm text-muted-foreground">
          Scraping article and creating questions...
        </p>
      </div>
    </div>
  )
}
