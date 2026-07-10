import React from "react";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="pt-24 pb-32 max-w-container-max mx-auto px-space-md md:px-space-xl md:pl-72 text-left bg-background min-h-screen animate-pulse">
      {/* Hero card skeleton */}
      <div className="w-full h-64 bg-surface-container-low border border-border-subtle rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-32 h-44 bg-surface-container rounded shrink-0"></div>
        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-surface-container rounded"></div>
            <div className="h-7 w-3/4 bg-surface-container rounded"></div>
            <div className="h-4 w-32 bg-surface-container rounded"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-2.5 w-full bg-surface-container rounded-full"></div>
            <div className="h-10 w-36 bg-surface-container rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Carousel header placeholder */}
      <div className="h-6 w-44 bg-surface-container rounded mb-4"></div>

      {/* Recent books carousel skeleton */}
      <div className="flex gap-4 mb-8 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-32 md:w-36 flex flex-col gap-2 shrink-0 border border-border-subtle p-3 rounded-xl bg-surface-container-low"
          >
            <div className="w-full aspect-[2/3] bg-surface-container rounded"></div>
            <div className="h-4 w-24 bg-surface-container rounded"></div>
            <div className="h-3 w-16 bg-surface-container rounded"></div>
          </div>
        ))}
      </div>

      {/* Grid header placeholder */}
      <div className="h-6 w-32 bg-surface-container rounded mb-4"></div>

      {/* Library Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-2 border border-border-subtle p-3 rounded-xl bg-surface-container-low"
          >
            <div className="w-full aspect-[2/3] bg-surface-container rounded"></div>
            <div className="h-4 w-24 bg-surface-container rounded"></div>
            <div className="h-3 w-16 bg-surface-container rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
