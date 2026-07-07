import React from "react";

export const LoadingLibraryState: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 mt-8 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-4 border-b border-border-subtle"
        >
          <div className="w-10 h-14 bg-surface-container rounded shrink-0"></div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 w-48 bg-surface-container rounded"></div>
            <div className="h-3 w-32 bg-surface-container rounded"></div>
          </div>
          <div className="w-24 h-1 bg-surface-container rounded-full hidden md:block shrink-0"></div>
          <div className="w-8 h-8 bg-surface-container rounded shrink-0"></div>
        </div>
      ))}
    </div>
  );
};
