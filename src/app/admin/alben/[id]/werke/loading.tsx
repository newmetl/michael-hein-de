export default function WerkeLoading() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-surface-container-low animate-pulse" />
          <div className="h-9 w-64 bg-surface-container-low animate-pulse" />
        </div>
        <div className="h-12 w-36 bg-surface-container-low animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square bg-surface-container-low animate-pulse" />
            <div className="mt-3 h-4 w-24 bg-surface-container-low animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
