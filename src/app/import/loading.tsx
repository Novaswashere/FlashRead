import React from "react";

export default function ImportLoading() {
  return (
    <div className="pt-24 pb-20 md:pb-8 md:pl-72 px-space-md max-w-container-max mx-auto min-h-screen animate-pulse">
      <div className="max-w-[800px] mx-auto">
        <div className="h-8 w-48 bg-surface-container-high rounded mb-4"></div>
        <div className="h-4 w-72 bg-surface-container-high rounded mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-surface-container rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 w-full bg-surface-container rounded-xl"></div>
      </div>
    </div>
  );
}
