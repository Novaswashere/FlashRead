import React from "react";
import { Book, ReadingProgress } from "@/types";
import { BookCover } from "@/components/shared/BookCover";
import { Button } from "@/components/ui/Button";

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
  onResume
}) => {
  const percent = Math.round((progress.currentWordIndex / 2000) * 100); 

  return (
    <section className="mb-space-xl">
      <h2 className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest mb-space-sm">
        Continue Reading
      </h2>
      <div className="group relative overflow-hidden bg-surface-container-lowest border border-border-subtle rounded-xl flex flex-col md:flex-row items-center gap-space-lg p-space-lg transition-all hover:border-primary/20">
        <div className="relative w-full md:w-48 h-64 flex-shrink-0">
          <BookCover title={book.title} coverUrl={book.coverUrl} progressPercent={percent} />
        </div>
        <div className="flex-1 flex flex-col justify-center py-space-sm w-full">
          <div className="flex items-center gap-space-sm mb-space-xs">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <span className="font-label-mono text-label-mono text-primary font-bold">ACTIVE SESSION</span>
          </div>
          <h3 className="font-headline-lg text-headline-lg mb-space-xs">{book.title}</h3>
          <p className="text-on-surface-variant mb-space-lg">
            {book.author} • {percent}% Complete
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-lg mb-space-xl">
            <div>
              <p className="font-label-mono text-label-mono text-on-surface-variant mb-1">CURRENT SPEED</p>
              <p className="font-label-mono text-body-lg font-bold text-primary">
                {defaultWpm} <span className="text-xs font-normal">WPM</span>
              </p>
            </div>
            <div>
              <p className="font-label-mono text-label-mono text-on-surface-variant mb-1">TIME REMAINING</p>
              <p className="font-label-mono text-body-lg font-bold">
                18 <span className="text-xs font-normal">MIN</span>
              </p>
            </div>
          </div>
          <Button variant="primary" onClick={onResume} className="w-fit">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
            <span>RESUME READING</span>
          </Button>
        </div>
        <div className="absolute top-0 right-0 p-space-lg opacity-5 pointer-events-none hidden md:block">
          <span className="material-symbols-outlined text-[120px]">auto_stories</span>
        </div>
      </div>
    </section>
  );
};
