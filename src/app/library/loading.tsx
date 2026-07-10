import React from "react";

export default function LibraryLoading() {
  return (
    <div className="md:ml-64 pt-24 pb-24 px-space-md md:px-space-xl min-h-screen max-w-reader-width mx-auto animate-pulse">
      <div className="h-8 w-36 bg-surface-container-high rounded mb-2"></div>
      <div className="h-4 w-60 bg-surface-container rounded mb-8"></div>
      
      {/* Search Bar Skeleton */}
      <div className="h-12 w-full bg-surface-container rounded-xl mb-8"></div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-space-md">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col">
            <div className="aspect-[3/4] w-full bg-surface-container rounded-xl mb-3"></div>
            <div className="h-4 w-3/4 bg-surface-container-high rounded mb-1"></div>
            <div className="h-3 w-1/2 bg-surface-container rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
