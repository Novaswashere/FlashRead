"use client";

import React from "react";
import { usePathname } from "next/navigation";

export const TopAppBar: React.FC = () => {
  const pathname = usePathname();

  // Hide the global app bar on the reader page, as it has its own toolbar
  if (pathname === "/reader") return null;

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border-subtle dark:border-outline-variant">
      <div className="flex items-center justify-between px-space-lg h-16 max-w-container-max mx-auto">
        <div className="flex items-center gap-space-md">
          <button className="p-2 hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-on-surface-variant dark:text-outline">
              menu
            </span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">
            FlashRead
          </h1>
        </div>
        <div className="flex items-center gap-space-sm">
          <button className="p-2 hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-on-surface-variant dark:text-outline">
              search
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
