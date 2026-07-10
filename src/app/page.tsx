"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLibraryContext } from "@/providers/LibraryProvider";
import { storageService } from "@/services/storage";
import { ContinueReadingHero } from "@/features/home/components/ContinueReadingHero";
import { RecentBooksCarousel } from "@/features/home/components/RecentBooksCarousel";
import { LibraryGrid } from "@/features/home/components/LibraryGrid";
import { QuickImportCard } from "@/features/home/components/QuickImportCard";
import { OnboardingChecklist, OnboardingStep } from "@/features/home/components/OnboardingChecklist";
import { DashboardSkeleton } from "@/features/home/components/DashboardSkeleton";
import { Book, ReadingProgress as ProgressType } from "@/types";
import { useSettingsContext } from "@/providers/SettingsProvider";
import { AlertCircle } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { books, isLoading } = useLibraryContext();
  const { settings } = useSettingsContext();

  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [activeProgress, setActiveProgress] = useState<ProgressType | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, ProgressType>>({});
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);

  useEffect(() => {
    async function loadStatsAndProgress() {
      try {
        const map: Record<string, ProgressType> = {};
        const progresses: ProgressType[] = [];

        for (const b of books) {
          try {
            const p = await storageService.progress.getById(b.id);
            if (p) {
              map[b.id] = p;
              progresses.push(p);
            }
          } catch (err) {
            console.error(`Error loading progress for book ${b.id}:`, err);
            // Graceful degradation: continue loading the rest of the books
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
      } catch (err: any) {
        console.error("Failed to load statistics or reading history:", err);
        setWidgetError("Some reading history data could not be retrieved from local storage.");
      }
    }

    if (books.length > 0) {
      loadStatsAndProgress();
    }
  }, [books]);

  // Client-side effect to compute onboarding steps
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasBooks = books.length > 0;
      const hasProgress = Object.keys(progressMap).length > 0;
      const hasVisitedSettings = localStorage.getItem("flashread_settings_visited") === "true";

      setOnboardingSteps([
        {
          id: "import",
          title: "Import your first document",
          description: "Upload an EPUB, PDF, TXT file or paste raw text in the Import tab.",
          isCompleted: hasBooks,
          actionLabel: "Go to Import",
          actionPath: "/import",
        },
        {
          id: "read",
          title: "Open the Reader",
          description: "Launch the reader canvas to play words sequentially in RSVP mode.",
          isCompleted: hasProgress,
          actionLabel: "Go to Library",
          actionPath: "/library",
        },
        {
          id: "settings",
          title: "Explore Settings",
          description: "Customize reading speed (WPM), themes, and fonts to your liking.",
          isCompleted: hasVisitedSettings,
          actionLabel: "Go to Settings",
          actionPath: "/settings",
        },
      ]);
    }
  }, [books, progressMap]);

  const handleSelectBook = (book: Book) => {
    router.push(`/reader?id=${book.id}`);
  };

  // Render Skeleton Loader while loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Render Onboarding Checklist for empty dashboard
  if (books.length === 0) {
    return (
      <main className="pt-24 pb-32 max-w-container-max mx-auto px-space-md md:px-space-xl md:pl-72 text-left bg-background text-on-background min-h-screen">
        <div className="mb-8 max-w-2xl mx-auto text-center md:text-left">
          <h1 className="font-headline-lg text-4xl font-extrabold text-on-surface mb-2">
            FlashRead
          </h1>
          <p className="text-on-surface-variant font-body-md max-w-lg">
            Train your focus and double your reading speed using Rapid Serial Visual Presentation (RSVP) display technology.
          </p>
        </div>
        <OnboardingChecklist steps={onboardingSteps} />
      </main>
    );
  }

  // Mobile layout gets first 5 books
  const mobileBooks = books.slice(0, 5);

  return (
    <main className="pt-24 pb-32 max-w-container-max mx-auto px-space-md md:px-space-xl md:pl-72 text-left bg-background text-on-background min-h-screen">
      {/* Isolated Failure Warning Indicator */}
      {widgetError && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{widgetError}</span>
        </div>
      )}

      {/* Mobile-only Home Layout */}
      <div className="block md:hidden">
        {activeBook && activeProgress && (
          <ContinueReadingHero
            book={activeBook}
            progress={activeProgress}
            defaultWpm={settings.defaultWPM}
            onResume={() => handleSelectBook(activeBook)}
          />
        )}
        <RecentBooksCarousel
          books={recentBooks}
          progress={progressMap}
          onSelectBook={handleSelectBook}
        />
        <LibraryGrid books={mobileBooks} onSelectBook={handleSelectBook} />
      </div>

      {/* Desktop-only Home Layout */}
      <div className="hidden md:block">
        {activeBook && activeProgress && (
          <ContinueReadingHero
            book={activeBook}
            progress={activeProgress}
            defaultWpm={settings.defaultWPM}
            onResume={() => handleSelectBook(activeBook)}
          />
        )}
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
