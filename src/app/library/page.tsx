"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLibraryContext } from "@/providers/LibraryProvider";
import { storageService } from "@/services/storage";
import { LibrarySearch } from "@/features/library/components/LibrarySearch";
import { LibraryFilters } from "@/features/library/components/LibraryFilters";
import { LibraryList } from "@/features/library/components/LibraryList";
import { EmptyLibraryState } from "@/features/library/components/EmptyLibraryState";
import { LoadingLibraryState } from "@/features/library/components/LoadingLibraryState";
import { SearchEmptyState } from "@/features/library/components/SearchEmptyState";
import { useToast } from "@/providers/ToastProvider";
import { findSpellingSuggestion } from "@/lib/spelling";
import { Book, ReadingProgress as ProgressType } from "@/types";
import { Plus } from "lucide-react";

export default function LibraryPage() {
  const router = useRouter();
  const { books, isLoading, removeBook } = useLibraryContext();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [progressMap, setProgressMap] = useState<Record<string, ProgressType>>({});

  useEffect(() => {
    async function loadProgress() {
      const map: Record<string, ProgressType> = {};
      for (const b of books) {
        try {
          const p = await storageService.progress.getById(b.id);
          if (p) {
            map[b.id] = p;
          }
        } catch (err) {
          console.error(`Failed to load progress for book ${b.id}:`, err);
          // Graceful degradation: continue loading the rest
        }
      }
      setProgressMap(map);
    }

    if (books.length > 0) {
      loadProgress();
    }
  }, [books]);

  const handleSelectBook = (book: Book) => {
    router.push(`/reader?id=${book.id}`);
  };

  const handleMoreActions = async (book: Book, e: React.MouseEvent) => {
    e.preventDefault();
    if (
      confirm(
        `Are you sure you want to delete "${book.title}" from your library?`
      )
    ) {
      try {
        await removeBook(book.id);
        showToast(`"${book.title}" deleted from library`, "success");
      } catch (err) {
        showToast("Failed to delete book from storage", "error");
      }
    }
  };

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      b.format.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const spellingSuggestion = findSpellingSuggestion(search, books);

  return (
    <main className="pt-24 pb-20 px-space-md md:px-space-xl max-w-[900px] mx-auto min-h-screen md:pl-72 text-left bg-background text-on-background">
      <LibrarySearch value={search} onChange={setSearch} />
      <LibraryFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isLoading ? (
        <LoadingLibraryState />
      ) : books.length === 0 ? (
        <EmptyLibraryState onImportClick={() => router.push("/import")} />
      ) : filteredBooks.length === 0 ? (
        <SearchEmptyState
          query={search}
          suggestion={spellingSuggestion}
          onSuggestionClick={(s) => setSearch(s)}
          onClear={() => setSearch("")}
        />
      ) : (
        <LibraryList
          books={filteredBooks}
          progress={progressMap}
          onSelectBook={handleSelectBook}
          onMoreActions={handleMoreActions}
        />
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => router.push("/import")}
        className="fixed right-6 bottom-20 md:bottom-10 z-40 bg-cyan-500 text-zinc-950 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border border-cyan-400"
        aria-label="Import New Book"
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>
    </main>
  );
}
