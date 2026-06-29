function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card overflow-hidden flex flex-col">
      <div className="h-48 bg-muted animate-pulse shrink-0" />
      <div className="p-4 flex-1 space-y-3">
        <div className="h-5 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse w-4/5" />
        <div className="h-4 bg-muted rounded animate-pulse w-2/5" />
        <div className="flex gap-1 pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-5 w-5 bg-muted rounded animate-pulse" />
          ))}
          <div className="h-4 w-8 bg-muted rounded animate-pulse ml-1" />
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="h-10 bg-muted rounded-md animate-pulse" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <div className="h-9 w-36 bg-muted rounded animate-pulse" />
        <div className="h-5 w-72 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-10 bg-muted rounded-lg animate-pulse mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
