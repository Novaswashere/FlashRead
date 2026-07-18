import React from "react";

export const ReaderSkeleton: React.FC = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center relative md:pl-64 pt-16 animate-pulse">
      {/* Top Toolbar Skeleton */}
      <div className="absolute top-0 left-0 right-0 h-16 border-b border-outline-variant/30 bg-surface-container-low flex items-center justify-between px-margin-mobile md:pl-72">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container"></div>
          <div className="h-5 w-48 bg-surface-container rounded"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-surface-container"></div>
          <div className="w-8 h-8 rounded-full bg-surface-container"></div>
        </div>
      </div>

      {/* Chapter Skip buttons Skeleton */}
      <div className="absolute top-20 right-6 flex gap-2">
        <div className="w-24 h-8 rounded-lg bg-surface-container"></div>
        <div className="w-24 h-8 rounded-lg bg-surface-container"></div>
      </div>

      {/* Top progress skeleton */}
      <div className="absolute top-20 left-0 right-0 px-xl max-w-container-max mx-auto flex flex-col gap-xs">
        <div className="flex justify-between items-center">
          <div className="h-3 w-24 bg-surface-container rounded"></div>
          <div className="h-3 w-20 bg-surface-container rounded"></div>
        </div>
        <div className="w-full h-1 bg-surface-container rounded-full"></div>
      </div>

      {/* Main RSVP Box Canvas Skeleton */}
      <main className="flex-grow flex items-center justify-center w-full px-xl mt-12">
        <div className="w-full max-w-reader-width aspect-[2/1] rounded-xl border border-outline-variant/30 bg-surface-container-low flex items-center justify-center relative">
          {/* ORP Focus Guides skeleton */}
          <div className="absolute top-0 bottom-0 left-[35%] w-px border-r border-dashed border-outline-variant/30"></div>
          <div className="absolute top-0 bottom-0 left-[65%] w-px border-r border-dashed border-outline-variant/30"></div>
          {/* Pulsing word block */}
          <div className="h-8 w-32 bg-surface-container rounded-md"></div>
        </div>
      </main>

      {/* Floating Control Dock Skeleton */}
      <footer className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-lg px-lg py-md glass-dock rounded-full">
        <div className="w-8 h-8 rounded-full bg-surface-container"></div>
        <div className="w-12 h-12 rounded-full bg-surface-container"></div>
        <div className="w-8 h-8 rounded-full bg-surface-container"></div>
      </footer>
    </div>
  );
};
