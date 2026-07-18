import React from "react";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="pt-24 pb-32 max-w-container-max mx-auto px-margin-mobile md:px-xl md:pl-72 text-left bg-background min-h-screen">
      {/* Hero card skeleton */}
      <div className="w-full h-72 md:h-80 rounded-xl bg-surface-container-high animate-pulse mb-xl" />

      {/* Performance row skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
        <div className="md:col-span-2 h-48 rounded-xl bg-surface-container-high animate-pulse" />
        <div className="h-48 rounded-xl bg-surface-container-high animate-pulse" />
      </div>

      {/* Recently opened header + grid skeleton */}
      <div className="h-6 w-40 bg-surface-container-high rounded animate-pulse mb-md" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-md rounded-xl">
            <div className="aspect-[3/4] rounded-lg bg-surface-container-high animate-pulse mb-md" />
            <div className="h-4 w-3/4 bg-surface-container-high rounded animate-pulse mb-2" />
            <div className="h-3 w-1/2 bg-surface-container-high rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Library list header + rows skeleton */}
      <div className="h-6 w-32 bg-surface-container-high rounded animate-pulse mb-md" />
      <div className="space-y-xs">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-md p-md rounded-lg border-b border-outline/5"
          >
            <div className="w-12 h-16 rounded bg-surface-container-high animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-surface-container-high rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-surface-container-high rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
