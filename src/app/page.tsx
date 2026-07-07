"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLibraryContext } from "@/providers/LibraryProvider";
import { storageService } from "@/services/storage";
import { ContinueReadingHero } from "@/features/home/components/ContinueReadingHero";
import { RecentBooksCarousel } from "@/features/home/components/RecentBooksCarousel";
import { LibraryGrid } from "@/features/home/components/LibraryGrid";
import { QuickImportCard } from "@/features/home/components/QuickImportCard";
import { Book, ReadingProgress as ProgressType } from "@/types";
import { MOCK_SETTINGS } from "@/mocks/settings";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { books, isLoading } = useLibraryContext();

  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [activeProgress, setActiveProgress] = useState<ProgressType | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, ProgressType>>({});
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);

  useEffect(() => {
    async function loadStatsAndProgress() {
      const map: Record<string, ProgressType> = {};
      const progresses: ProgressType[] = [];

      for (const b of books) {
        const p = await storageService.progress.getById(b.id);
        if (p) {
          map[b.id] = p;
          progresses.push(p);
        }
      }
      setProgressMap(map);

      // Sort progresses by lastOpened to find the active book
      progresses.sort((a, b) => b.lastOpened.localeCompare(a.lastOpened));

      if (progresses.length > 0) {
        const active = books.find((b) => b.id === progresses[0].bookId);
        if (active) {
          setActiveBook(active);
          setActiveProgress(progresses[0]);
        }
      } else if (books.length > 0) {
        setActiveBook(books[0]);
        setActiveProgress({
          bookId: books[0].id,
          currentChapterIndex: 0,
          currentWordIndex: 0,
          lastOpened: new Date().toISOString(),
          completionPercentage: 0,
          readingTime: 0,
        });
      }

      // Recent books (top 4 books sorted by lastOpened)
      const sortedBooks = [...books].sort((a, b) => {
        const aOpen = map[a.id]?.lastOpened || "";
        const bOpen = map[b.id]?.lastOpened || "";
        return bOpen.localeCompare(aOpen);
      });
      setRecentBooks(sortedBooks.slice(0, 4));
    }

    if (books.length > 0) {
      loadStatsAndProgress();
    }
  }, [books]);

  const handleSelectBook = (book: Book) => {
    router.push(`/reader?id=${book.id}`);
  };

  if (isLoading || books.length === 0 || !activeBook || !activeProgress) {
    return (
      <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-cyan-500 animate-spin mb-4" />
        <span className="text-zinc-400 text-sm">Loading Library...</span>
      </div>
    );
  }

  // Mobile layout gets first 5 books
  const mobileBooks = books.slice(0, 5);

  return (
    <main className="pt-24 pb-32 max-w-container-max mx-auto px-space-md md:px-space-xl md:pl-72 text-left bg-zinc-950 text-zinc-100 min-h-screen">
      {/* Mobile-only Home Layout */}
      <div className="block md:hidden">
        <ContinueReadingHero
          book={activeBook}
          progress={activeProgress}
          defaultWpm={MOCK_SETTINGS.defaultWPM}
          onResume={() => handleSelectBook(activeBook)}
        />
        <RecentBooksCarousel
          books={recentBooks}
          progress={progressMap}
          onSelectBook={handleSelectBook}
        />
        <LibraryGrid books={mobileBooks} onSelectBook={handleSelectBook} />
      </div>

      {/* Desktop-only Home Layout */}
      <div className="hidden md:block">
        <ContinueReadingHero
          book={activeBook}
          progress={activeProgress}
          defaultWpm={MOCK_SETTINGS.defaultWPM}
          onResume={() => handleSelectBook(activeBook)}
        />
        <RecentBooksCarousel
          books={recentBooks}
          progress={progressMap}
          onSelectBook={handleSelectBook}
        />
        <QuickImportCard onImportClick={() => router.push("/import")} />
        <LibraryGrid books={books} onSelectBook={handleSelectBook} />
      </div>
    </main>
  );
}
