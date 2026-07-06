import React from "react";

export default function HomeLoading() {
  return (
    <div className="pt-24 pb-32 max-w-container-max mx-auto px-space-md md:px-space-xl md:pl-72 animate-pulse">
      <div className="h-6 w-48 bg-surface-container-high rounded mb-4"></div>
      <div className="h-64 w-full bg-surface-container rounded-xl mb-12"></div>
      <div className="h-6 w-36 bg-surface-container-high rounded mb-4"></div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-40 h-60 bg-surface-container rounded-lg flex-shrink-0"></div>
        ))}
      </div>
    </div>
  );
}
