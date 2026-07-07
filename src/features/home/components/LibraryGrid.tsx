import React from "react";
import { Book } from "@/types";
import { BookCard } from "@/components/shared/BookCard";

export interface LibraryGridProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export const LibraryGrid: React.FC<LibraryGridProps> = ({
  books,
  onSelectBook,
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-space-lg">
        <h2 className="font-headline-md text-headline-md">My Library</h2>
        <div className="flex items-center gap-space-sm">
          <button className="p-2 rounded-lg border border-border-subtle hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">
              filter_list
            </span>
          </button>
          <button className="p-2 rounded-lg border border-border-subtle hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">
              grid_view
            </span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-space-lg gap-y-space-xl">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onSelect={onSelectBook} />
        ))}
      </div>
      <div className="mt-space-xl flex justify-center">
        <button className="bg-surface-container-high text-on-surface font-semibold px-space-xl h-12 rounded-lg border border-border-subtle active:scale-95 transition-all">
          Load More
        </button>
      </div>
    </section>
  );
};
