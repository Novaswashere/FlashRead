import React from "react";

export const ReaderSkeleton: React.FC = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center relative md:pl-64 pt-16 animate-pulse">
      {/* Top Toolbar Skeleton */}
      <div className="absolute top-0 left-0 right-0 h-16 border-b border-border-subtle bg-surface-container-low flex items-center justify-between px-6 md:pl-72">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-surface-container"></div>
          <div className="h-5 w-48 bg-surface-container rounded"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-surface-container"></div>
          <div className="w-8 h-8 rounded bg-surface-container"></div>
        </div>
      </div>

      {/* Chapter Skip Buttons Skeleton */}
      <div className="absolute top-20 right-6 flex gap-2">
        <div className="w-24 h-8 rounded bg-surface-container"></div>
        <div className="w-24 h-8 rounded bg-surface-container"></div>
      </div>

      {/* Main RSVP Box Canvas Skeleton */}
      <main className="flex-grow flex items-center justify-center w-full px-space-md mt-12">
        <div className="w-full max-w-[600px] aspect-[2/1] rounded-2xl border border-border-subtle bg-surface-container-low flex items-center justify-center relative">
          {/* ORP Focus Guides skeleton */}
          <div className="absolute top-0 bottom-0 left-[35%] w-px border-r border-dashed border-border-subtle"></div>
          <div className="absolute top-0 bottom-0 left-[65%] w-px border-r border-dashed border-border-subtle"></div>
          {/* Pulsing word block */}
          <div className="h-8 w-32 bg-surface-container rounded-md"></div>
        </div>
      </main>

      {/* Floating Control Dock Skeleton */}
      <footer className="relative w-full max-w-[600px] px-space-md z-45 mb-space-xl">
        <div className="bg-surface-container-low border border-border-subtle rounded-xl p-space-md flex flex-col gap-space-md">
          {/* Progress bar skeleton */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="h-3 w-10 bg-surface-container rounded"></div>
              <div className="h-3 w-20 bg-surface-container rounded"></div>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full"></div>
          </div>
          {/* Control items skeleton */}
          <div className="flex items-center justify-between w-full h-[56px] pt-2">
            <div className="w-16 h-8 bg-surface-container rounded-lg"></div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded bg-surface-container"></div>
              <div className="w-12 h-12 rounded-full bg-surface-container"></div>
              <div className="w-8 h-8 rounded bg-surface-container"></div>
            </div>
            <div className="w-16 h-8 bg-surface-container rounded-lg"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};
