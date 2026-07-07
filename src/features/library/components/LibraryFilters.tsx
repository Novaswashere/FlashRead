import React from "react";
import { cn } from "@/lib/utils";

export interface LibraryFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filters = ["All", "EPUB", "PDF", "TXT"];

  return (
    <div className="flex items-center gap-space-sm mb-space-lg overflow-x-auto pb-2 no-scrollbar">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={cn(
              "px-5 py-2 rounded-full font-label-mono text-label-mono shadow-sm active:scale-95 transition-all",
              isActive
                ? "bg-primary text-on-primary"
                : "bg-surface-container border border-border-subtle text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};
