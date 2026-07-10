import React from "react";
import { Search, X, BookOpen } from "lucide-react";

export interface SearchEmptyStateProps {
  query: string;
  suggestion: string | null;
  onSuggestionClick: (suggestion: string) => void;
  onClear: () => void;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  query,
  suggestion,
  onSuggestionClick,
  onClear,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border-subtle rounded-2xl bg-surface-container-low text-center max-w-md mx-auto mt-12 shadow-md animate-in fade-in duration-200">
      <div className="h-12 w-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
        <Search className="h-6 w-6" />
      </div>
      
      <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
        No Results Found
      </h3>
      
      <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
        We couldn&apos;t find any books matching &ldquo;<span className="text-on-surface font-semibold">{query}</span>&rdquo; in your library.
      </p>

      {suggestion && (
        <div className="mb-6 bg-surface-container border border-border-subtle rounded-lg px-4 py-2.5 inline-flex items-center gap-1.5 text-sm text-on-surface animate-pulse">
          <span className="text-on-surface-variant">Did you mean</span>
          <button
            onClick={() => onSuggestionClick(suggestion)}
            className="font-bold text-primary hover:text-primary-hover underline focus:outline-none cursor-pointer"
          >
            {suggestion}
          </button>
          <span className="text-on-surface-variant">?</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={onClear}
          className="flex-1 h-10 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high border border-border-subtle text-on-surface font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <X className="h-4 w-4" /> Clear Search
        </button>
        
        <button
          onClick={onClear}
          className="flex-1 h-10 px-4 rounded-lg bg-primary hover:brightness-110 text-on-primary font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <BookOpen className="h-4 w-4" /> Browse Library
        </button>
      </div>
    </div>
  );
};
