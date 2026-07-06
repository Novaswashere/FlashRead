"use client";

import React from "react";

export default function ReaderError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center md:pl-64 p-space-lg">
      <span className="material-symbols-outlined text-error text-6xl mb-4">error</span>
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Failed to Start Reader</h2>
      <p className="text-on-surface-variant mb-6 text-center max-w-sm">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => window.history.back()}
          className="border border-border-subtle bg-surface-container-low text-on-surface font-semibold px-space-lg h-12 rounded-lg active:scale-95 transition-all"
        >
          Go Back
        </button>
        <button
          onClick={reset}
          className="bg-primary text-on-primary font-semibold px-space-xl h-12 rounded-lg active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
