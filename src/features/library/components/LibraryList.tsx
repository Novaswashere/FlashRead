import React from "react";
import { Book, ReadingProgress } from "@/types";
import { BookCover } from "@/components/shared/BookCover";
import { cn } from "@/lib/utils";

export interface LibraryListProps {
  books: Book[];
  progress: Record<string, ReadingProgress>;
  onSelectBook: (book: Book) => void;
  onMoreActions: (book: Book, event: React.MouseEvent) => void;
}

export const LibraryList: React.FC<LibraryListProps> = ({
  books,
  progress,
  onSelectBook,
  onMoreActions,
}) => {
  return (
    <div className="flex flex-col border-t border-border-subtle">
      {books.map((book) => {
        const prog = progress[book.id];
        const percent = prog
          ? Math.round((prog.currentWordIndex / 2000) * 100)
          : 0;
        return (
          <div
            key={book.id}
            onClick={() => onSelectBook(book)}
            className="list-item-hover flex items-center justify-between py-4 border-b border-border-subtle group hover:bg-surface-container-low transition-colors px-2 -mx-2 rounded-lg cursor-pointer"
          >
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-14 relative shrink-0">
                <BookCover
                  title={book.title}
                  coverUrl={book.coverUrl}
                  coverAssetId={book.coverAssetId}
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-body-md text-on-surface font-semibold group-hover:text-primary transition-colors line-clamp-1">
                  {book.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-label-mono text-label-mono text-outline line-clamp-1">
                    {book.author}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant shrink-0"></span>
                  <span
                    className={cn(
                      "font-label-mono text-label-mono px-1.5 py-0.5 rounded uppercase shrink-0",
                      book.format === "epub" &&
                        "text-primary bg-primary-fixed/30",
                      book.format === "pdf" &&
                        "text-secondary bg-surface-container-high",
                      book.format === "txt" &&
                        "text-secondary bg-surface-container-high"
                    )}
                  >
                    {book.format}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-md shrink-0">
              <div className="hidden md:flex flex-col items-end mr-4">
                {prog ? (
                  <>
                    <div className="w-24 h-1 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="font-label-mono text-label-mono text-outline mt-1">
                      {percent}% Read
                    </span>
                  </>
                ) : (
                  <span className="font-label-mono text-label-mono text-outline mt-1">
                    Unread
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreActions(book, e);
                }}
                className="action-trigger material-symbols-outlined text-outline hover:text-on-surface p-1 rounded-md hover:bg-surface-container-highest transition-all"
              >
                more_vert
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
