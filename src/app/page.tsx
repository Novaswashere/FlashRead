"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MOCK_BOOKS } from "@/mocks/books";
import { MOCK_PROGRESS } from "@/mocks/readingProgress";
import { MOCK_SETTINGS } from "@/mocks/settings";
import { ContinueReadingHero } from "@/features/home/components/ContinueReadingHero";
import { RecentBooksCarousel } from "@/features/home/components/RecentBooksCarousel";
import { LibraryGrid } from "@/features/home/components/LibraryGrid";
import { QuickImportCard } from "@/features/home/components/QuickImportCard";
import { Book } from "@/types";

export default function HomePage() {
  const router = useRouter();

  // Active book is Kafka Metamorphosis
  const activeBook =
    MOCK_BOOKS.find((b) => b.id === "book-metamorphosis") || MOCK_BOOKS[0];
  const activeProgress = MOCK_PROGRESS[activeBook.id] || {
    bookId: activeBook.id,
    currentChapterIndex: 0,
    currentWordIndex: 0,
    readingTime: 0,
    lastOpened: new Date().toISOString(),
  };

  // Recent books are Dune, 1984, Brave New World, Moby Dick
  const recentBooks = MOCK_BOOKS.filter((b) =>
    [
      "book-atomic-habits",
      "book-deep-work",
      "book-great-gatsby",
      "book-thinking-fast",
    ].includes(b.id)
  );

  const handleSelectBook = (book: Book) => {
    router.push(`/reader?id=${book.id}`);
  };

  // Mobile library books (exactly the 5 books shown in the stich mobile mockup)
  const mobileBooks = MOCK_BOOKS.filter((b) =>
    [
      "book-dune",
      "book-1984",
      "book-brave-new-world",
      "book-moby-dick",
      "book-pride-prejudice",
    ].includes(b.id)
  );

  return (
    <main className="pt-24 pb-32 max-w-container-max mx-auto px-space-md md:px-space-xl md:pl-72 text-left">
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
          progress={MOCK_PROGRESS}
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
          progress={MOCK_PROGRESS}
          onSelectBook={handleSelectBook}
        />
        <QuickImportCard onImportClick={() => router.push("/import")} />
        <LibraryGrid books={MOCK_BOOKS} onSelectBook={handleSelectBook} />
      </div>
    </main>
  );
}
