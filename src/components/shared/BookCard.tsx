import React from "react";
import { Book } from "@/types";
import { BookCover } from "./BookCover";

export interface BookCardProps {
  book: Book;
  progressPercent?: number;
  onSelect?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  progressPercent,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect?.(book)}
      className="group cursor-pointer flex flex-col w-full"
    >
      <div className="transition-transform duration-200 group-hover:-translate-y-1">
        <BookCover
          title={book.title}
          coverUrl={book.coverUrl}
          coverAssetId={book.coverAssetId}
          progressPercent={progressPercent}
        />
      </div>
      <h4 className="font-body-md font-semibold mt-space-sm leading-tight group-hover:text-primary transition-colors truncate">
        {book.title}
      </h4>
      <p className="font-label-mono text-label-mono text-on-surface-variant truncate">
        {book.author}
      </p>
    </div>
  );
};
