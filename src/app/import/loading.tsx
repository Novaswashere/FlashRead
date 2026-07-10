import React from "react";

export default function ImportLoading() {
  return (
    <div className="md:ml-64 pt-24 pb-24 px-space-md md:px-space-xl min-h-screen max-w-reader-width mx-auto animate-pulse">
      <div className="h-8 w-48 bg-surface-container-high rounded mb-2"></div>
      <div className="h-4 w-72 bg-surface-container rounded mb-8"></div>
      <div className="h-64 w-full bg-surface-container rounded-2xl mb-6"></div>
      <div className="flex justify-end gap-3">
        <div className="h-10 w-24 bg-surface-container rounded-lg"></div>
        <div className="h-10 w-32 bg-surface-container-high rounded-lg"></div>
      </div>
    </div>
  );
}
