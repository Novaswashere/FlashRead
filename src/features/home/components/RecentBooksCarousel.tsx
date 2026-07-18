import React, { useState, useEffect } from "react";
import { Book, ReadingProgress } from "@/types";
import { storageService } from "@/services/storage";
import { cn } from "@/lib/utils";

export interface RecentBooksCarouselProps {
  books: Book[];
  progress: Record<string, ReadingProgress>;
  onSelectBook: (book: Book) => void;
}

/** Resolves a book cover asset (or url) and renders a fill image / token fallback. */
const CoverThumb: React.FC<{
  coverUrl?: string;
  coverAssetId?: string;
  className?: string;
}> = ({ coverUrl, coverAssetId, className }) => {
  const [url, setUrl] = useState<string | undefined>(coverUrl);

  useEffect(() => {
    let active = true;
    if (coverAssetId) {
      storageService.assets
        .getAssetUrl(coverAssetId)
        .then((u) => {
          if (active && u) setUrl(u);
        })
        .catch(() => {
          /* graceful: keep fallback */
        });
    } else {
      setUrl(coverUrl);
    }
    return () => {
      active = false;
    };
  }, [coverAssetId, coverUrl]);

  if (url) {
    return (
      <div
        className={cn(className, "bg-cover bg-center")}
        style={{ backgroundImage: `url(${url})` }}
        aria-hidden
      />
    );
  }
  return (
    <div
      className={cn(
        className,
        "bg-gradient-to-br from-primary/20 to-surface-dim flex items-center justify-center"
      )}
    >
      <span className="material-symbols-outlined text-on-surface-variant opacity-50">
        menu_book
      </span>
    </div>
  );
};

export const RecentBooksCarousel: React.FC<RecentBooksCarouselProps> = ({
  books,
  progress,
  onSelectBook,
}) => {
  return (
    <section className="animate-fade-in-up stagger-3">
      <h2 className="font-headline-md text-headline-md font-bold tracking-tight mb-md">
        Recently Opened
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md">
        {books.map((book) => {
          const prog = progress[book.id];
          const percent = prog?.completionPercentage ?? 0;
          return (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="glass-card p-sm md:p-md rounded-xl group cursor-pointer hover:border-primary/50 transition-all"
            >
              <div className="relative aspect-[3/4] rounded-lg mb-sm md:mb-md overflow-hidden bg-surface-dim">
                <CoverThumb
                  coverUrl={book.coverUrl}
                  coverAssetId={book.coverAssetId}
                  className="absolute inset-0 w-full h-full"
                />
                {percent > 0 && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                )}
              </div>
              <p className="font-label-md text-label-md font-bold truncate text-on-surface text-xs md:text-sm">
                {book.title}
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant truncate text-[10px] md:text-xs">
                {book.author}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
