import React from "react";

export default function SettingsLoading() {
  return (
    <div className="md:ml-64 pt-24 pb-24 px-space-md md:px-space-xl min-h-screen max-w-reader-width mx-auto animate-pulse">
      <div className="h-8 w-32 bg-surface-container-high rounded mb-2"></div>
      <div className="h-4 w-64 bg-surface-container rounded mb-8"></div>
      
      <div className="space-y-8">
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-3">
            <div className="h-4 w-28 bg-surface-container-high rounded"></div>
            <div className="bg-surface-container/30 border border-border-subtle rounded-xl p-6 space-y-4">
              <div className="h-12 w-full bg-surface-container rounded-lg"></div>
              <div className="h-12 w-full bg-surface-container rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
