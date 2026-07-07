"use client";

import React from "react";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="pt-24 pb-32 max-w-container-max mx-auto px-space-md md:px-space-xl md:pl-72 flex flex-col items-center justify-center min-h-[50vh]">
      <span className="material-symbols-outlined text-error text-6xl mb-4">
        error
      </span>
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
        Error Loading Dashboard
      </h2>
      <p className="text-on-surface-variant mb-6 max-w-md text-center">
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
