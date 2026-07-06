"use client";

import React from "react";

export default function ImportError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="pt-24 pb-20 md:pb-8 md:pl-72 px-space-md max-w-container-max mx-auto min-h-screen flex flex-col items-center justify-center">
      <span className="material-symbols-outlined text-error text-6xl mb-4">error</span>
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Import Error</h2>
      <p className="text-on-surface-variant mb-6 text-center">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="bg-primary text-on-primary font-semibold px-space-xl h-12 rounded-lg active:scale-95 transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
