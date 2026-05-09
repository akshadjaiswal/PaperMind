export function PaperCardSkeleton() {
  return (
    <div className="bg-surface rounded-card border border-border p-5 flex gap-4">
      {/* Checkbox area */}
      <div className="size-5 rounded bg-surface-raised animate-pulse shrink-0 mt-0.5" />
      <div className="flex-1 space-y-3">
        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-4 bg-surface-raised rounded-full animate-pulse w-full" />
          <div className="h-4 bg-surface-raised rounded-full animate-pulse w-4/5" />
        </div>
        {/* Meta */}
        <div className="h-3 bg-surface-raised rounded-full animate-pulse w-2/5" />
        {/* Abstract lines */}
        <div className="space-y-1.5">
          <div className="h-3 bg-surface-raised rounded-full animate-pulse w-full" />
          <div className="h-3 bg-surface-raised rounded-full animate-pulse w-full" />
          <div className="h-3 bg-surface-raised rounded-full animate-pulse w-3/5" />
        </div>
        {/* Footer */}
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-surface-raised rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
