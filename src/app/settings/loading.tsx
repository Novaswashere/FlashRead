import React from "react";

export default function SettingsLoading() {
  return (
    <div className="md:ml-64 pt-24 pb-24 px-space-md md:px-space-xl min-h-screen max-w-reader-width mx-auto animate-pulse">
      <div className="h-8 w-40 bg-surface-container-high rounded mb-4"></div>
      <div className="h-4 w-72 bg-surface-container-high rounded mb-10"></div>
      <div className="space-y-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="space-y-2">
            <div className="h-4 w-28 bg-surface-container rounded"></div>
            <div className="h-44 w-full bg-surface-container rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
