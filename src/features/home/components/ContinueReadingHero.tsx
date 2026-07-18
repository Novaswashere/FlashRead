import React, { useState, useEffect } from "react";
import { Book, ReadingProgress } from "@/types";
import { storageService } from "@/services/storage";

export interface ContinueReadingHeroProps {
  book: Book;
  progress: ReadingProgress;
  defaultWpm: number;
  onResume: () => void;
}

export const ContinueReadingHero: React.FC<ContinueReadingHeroProps> = ({
  book,
  progress,
  defaultWpm,
  onResume,
}) => {
  const [coverUrl, setCoverUrl] = useState<string | undefined>(book.coverUrl);

  useEffect(() => {
    if (book.coverAssetId) {
      let active = true;
      const loadAssetUrl = async () => {
        try {
          const url = await storageService.assets.getAssetUrl(book.coverAssetId!);
          if (url && active) {
            setCoverUrl(url);
          }
        } catch (e) {
          console.error("Failed to load hero cover asset URL:", e);
        }
      };
      loadAssetUrl();
      return () => {
        active = false;
      };
    } else {
      setCoverUrl(book.coverUrl);
    }
  }, [book.coverAssetId, book.coverUrl]);

  // Use the stored completion percentage if available, otherwise calculate from current word
  const completion = progress.completionPercentage ?? 0;
  const chapterNumber = (progress.currentChapterIndex ?? 0) + 1;

  return (
    <section className="animate-fade-in-up stagger-1">
      <div className="relative w-full h-56 sm:h-64 md:h-80 rounded-xl overflow-hidden group">
        {/* Cinematic background */}
        {coverUrl ? (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${coverUrl})` }}
            aria-hidden
          />
        ) : (
          <div
            className="absolute inset-0 z-0 bg-gradient-to-br from-primary/30 to-background transition-transform duration-700 group-hover:scale-105"
            aria-hidden
          />
        )}

        {/* Readability overlay (fades into background at the bottom) */}
        <div
          className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/40 to-transparent"
          aria-hidden
        />

        {/* Bottom-left content */}
        <div className="absolute bottom-0 left-0 p-md md:p-lg z-20 w-full md:w-2/3">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold mb-1 md:mb-2 block">
            Resume Reading
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-extrabold mb-3 md:mb-4 leading-tight text-on-surface line-clamp-2">
            {book.title}
          </h2>
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="flex-1 h-1 bg-surface-dim rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, completion))}%`,
                }}
              />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
              {completion}%
            </span>
          </div>
          <button
            onClick={onResume}
            className="bg-primary text-on-primary px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 inline-flex items-center gap-2 text-sm md:text-base"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
            <span className="hidden sm:inline">CONTINUE CHAPTER {chapterNumber}</span>
            <span className="sm:hidden">CONTINUE</span>
          </button>
        </div>
      </div>
    </section>
  );
};
