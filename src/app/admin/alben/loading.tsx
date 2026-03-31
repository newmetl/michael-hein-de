export default function AlbenLoading() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="h-9 w-32 bg-surface-container-low animate-pulse" />
        <div className="h-12 w-40 bg-surface-container-low animate-pulse" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 flex items-center gap-6">
            <div className="w-20 h-20 bg-surface-container-low animate-pulse flex-shrink-0" />
            <div className="flex-grow space-y-2">
              <div className="h-6 w-48 bg-surface-container-low animate-pulse" />
              <div className="h-4 w-32 bg-surface-container-low animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
