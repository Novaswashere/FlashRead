"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_BOOKS } from "@/mocks/books";
import { MOCK_PROGRESS } from "@/mocks/readingProgress";
import { LibrarySearch } from "@/features/library/components/LibrarySearch";
import { LibraryFilters } from "@/features/library/components/LibraryFilters";
import { LibraryList } from "@/features/library/components/LibraryList";
import { EmptyLibraryState } from "@/features/library/components/EmptyLibraryState";
import { LoadingLibraryState } from "@/features/library/components/LoadingLibraryState";
import { Book } from "@/types";

export default function LibraryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false); // Can be toggled for testing loading skeleton

  const handleSelectBook = (book: Book) => {
    router.push(`/reader?id=${book.id}`);
  };

  const handleMoreActions = (book: Book, e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Actions triggered for:", book.title);
  };

  const filteredBooks = MOCK_BOOKS.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      b.format.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="pt-24 pb-20 px-space-md md:px-space-xl max-w-[900px] mx-auto min-h-screen md:pl-72 text-left">
      <LibrarySearch value={search} onChange={setSearch} />
      <LibraryFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isLoading ? (
        <LoadingLibraryState />
      ) : filteredBooks.length === 0 ? (
        <EmptyLibraryState onImportClick={() => router.push("/import")} />
      ) : (
        <LibraryList
          books={filteredBooks}
          progress={MOCK_PROGRESS}
          onSelectBook={handleSelectBook}
          onMoreActions={handleMoreActions}
        />
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => router.push("/import")}
        className="fixed right-6 bottom-20 md:bottom-10 z-40 bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
        aria-label="Import New Book"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </main>
  );
}
