import React from "react";
import { Book, ReadingProgress } from "@/types";
import { BookCard } from "@/components/shared/BookCard";

export interface RecentBooksCarouselProps {
  books: Book[];
  progress: Record<string, ReadingProgress>;
  onSelectBook: (book: Book) => void;
}

export const RecentBooksCarousel: React.FC<RecentBooksCarouselProps> = ({
  books,
  progress,
  onSelectBook,
}) => {
  return (
    <section className="mb-space-xl">
      <div className="flex items-center justify-between mb-space-md">
        <h2 className="font-headline-md text-headline-md">Recently Opened</h2>
        <button className="text-primary font-label-mono text-label-mono font-bold hover:underline">
          VIEW ALL
        </button>
      </div>
      <div className="flex gap-space-lg overflow-x-auto hide-scrollbar pb-space-sm -mx-space-md px-space-md md:mx-0 md:px-0">
        {books.map((book) => {
          const prog = progress[book.id];
          const percent = prog
            ? Math.round((prog.currentWordIndex / 2000) * 100)
            : 0;
          return (
            <div key={book.id} className="flex-shrink-0 w-40">
              <BookCard
                book={book}
                progressPercent={percent}
                onSelect={onSelectBook}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
