import React from "react";

export default function LibraryLoading() {
  return (
    <div className="pt-24 pb-20 px-space-md md:px-space-xl max-w-[900px] mx-auto min-h-screen md:pl-72 animate-pulse">
      <div className="h-8 w-32 bg-surface-container-high rounded mb-4"></div>
      <div className="h-12 w-full bg-surface-container rounded-xl mb-6"></div>
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-16 bg-surface-container rounded-full"></div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 w-full bg-surface-container rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}
