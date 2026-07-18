"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useLibraryContext } from "@/providers/LibraryProvider";
import { storageService } from "@/services/storage";
import { Book, ReadingProgress as ProgressType } from "@/types";
import { useSettingsContext } from "@/providers/SettingsProvider";
import { AlertCircle } from "lucide-react";
import { getLast7Days, type DayStat } from "@/lib/readingStats";
import { cn } from "@/lib/utils";

// Dynamic imports for code splitting
const ContinueReadingHero = dynamic(
  () => import("@/features/home/components/ContinueReadingHero").then(mod => ({ default: mod.ContinueReadingHero })),
  { loading: () => <div className="h-80 bg-surface-dim rounded-xl animate-pulse" /> }
);

const RecentBooksCarousel = dynamic(
  () => import("@/features/home/components/RecentBooksCarousel").then(mod => ({ default: mod.RecentBooksCarousel })),
  { loading: () => <div className="h-48 bg-surface-dim rounded-xl animate-pulse" /> }
);

const LibraryGrid = dynamic(
  () => import("@/features/home/components/LibraryGrid").then(mod => ({ default: mod.LibraryGrid })),
  { loading: () => <div className="h-64 bg-surface-dim rounded-xl animate-pulse" /> }
);

const QuickImportCard = dynamic(
  () => import("@/features/home/components/QuickImportCard").then(mod => ({ default: mod.QuickImportCard })),
  { loading: () => <div className="h-32 bg-surface-dim rounded-xl animate-pulse" /> }
);

const OnboardingChecklist = dynamic(
  () => import("@/features/home/components/OnboardingChecklist").then(mod => ({ default: mod.OnboardingChecklist })),
  { loading: () => <div className="h-48 bg-surface-dim rounded-xl animate-pulse" /> }
);

const DashboardSkeleton = dynamic(
  () => import("@/features/home/components/DashboardSkeleton").then(mod => ({ default: mod.DashboardSkeleton }))
);

// Type import for onboarding steps
type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  actionLabel: string;
  actionPath: string;
};

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
  const [last7Days, setLast7Days] = useState<DayStat[]>([]);
  const [lifetimeWords, setLifetimeWords] = useState<number>(0);
  const [statsUpdatedAt, setStatsUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    async function loadStatsAndProgress() {
      try {
        const map: Record<string, ProgressType> = {};
        const progresses: ProgressType[] = [];
        let lifetime = 0;

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

          // Accumulate lifetime words consumed from each book's parsed content.
          try {
            const parsed = await storageService.parsedBooks.getById(b.id);
            if (parsed) {
              const completion = map[b.id]?.completionPercentage || 0;
              lifetime += Math.round(
                (parsed.totalWords * completion) / 100
              );
            }
          } catch (err) {
            console.error(`Error loading parsed book ${b.id}:`, err);
            // Graceful degradation: skip this book's lifetime contribution
          }
        }
        setProgressMap(map);
        setLifetimeWords(lifetime);

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

        setStatsUpdatedAt(new Date());
      } catch (err: any) {
        console.error("Failed to load statistics or reading history:", err);
        setWidgetError("Some reading history data could not be retrieved from local storage.");
      }
    }

    if (books.length > 0) {
      loadStatsAndProgress();
    }
  }, [books]);

  // Load the 7-day word-count history once on mount.
  useEffect(() => {
    setLast7Days(getLast7Days());
  }, []);

  // Client-side effect to compute onboarding steps
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasBooks = books.length > 0;
      const hasProgress = Object.keys(progressMap).length > 0;
      const hasVisitedSettings = localStorage.getItem("readpilot_settings_visited") === "true";

      setOnboardingSteps([
        {
          id: "import",
          title: "Add your first book",
          description: "Upload EPUB, PDF, or TXT files, or paste text directly to start reading instantly.",
          isCompleted: hasBooks,
          actionLabel: "Import Now",
          actionPath: "/import",
        },
        {
          id: "read",
          title: "Try speed reading",
          description: "Open any book to experience word-by-word reading that helps you focus and read faster.",
          isCompleted: hasProgress,
          actionLabel: "Start Reading",
          actionPath: "/library",
        },
        {
          id: "settings",
          title: "Customize your experience",
          description: "Adjust reading speed, themes, and fonts to match your comfort level.",
          isCompleted: hasVisitedSettings,
          actionLabel: "Open Settings",
          actionPath: "/settings",
        },
      ]);
    }
  }, [books, progressMap]);

  const handleSelectBook = useCallback((book: Book) => {
    router.push(`/reader?id=${book.id}`);
  }, [router]);

  // Render Skeleton Loader while loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Render Onboarding Checklist for empty dashboard
  if (books.length === 0) {
    return (
      <main className="pt-24 pb-32 max-w-container-max mx-auto px-margin-mobile md:px-xl md:pl-72 text-left bg-background text-on-background min-h-screen">
        <div className="mb-xl max-w-2xl mx-auto text-center md:text-left">
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface mb-sm">
            Welcome to FlashRead
          </h1>
          <p className="text-on-surface-variant font-body-lg max-w-lg">
            Read faster by focusing on one word at a time. Import your books, set your pace, and watch your reading speed improve naturally.
          </p>
        </div>
        <OnboardingChecklist steps={onboardingSteps} />
      </main>
    );
  }

  // Mobile layout gets first 5 books
  const mobileBooks = books.slice(0, 5);

  return (
    <main className="pt-20 pb-24 md:pt-24 md:pb-32 max-w-container-max mx-auto px-margin-mobile md:px-xl md:pl-72 text-left bg-background text-on-background min-h-screen">
      {/* Isolated Failure Warning Indicator */}
      {widgetError && (
        <div className="mb-xl md:mb-xl p-md rounded-xl border border-error/30 bg-error-container/40 text-on-error-container font-body-md flex items-center gap-md">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{widgetError}</span>
        </div>
      )}

      {/* Mobile-only Home Layout */}
      <div className="block md:hidden space-y-lg md:space-y-xl">
        {activeBook && activeProgress && (
          <ContinueReadingHero
            book={activeBook}
            progress={activeProgress}
            defaultWpm={settings.defaultWPM}
            onResume={() => handleSelectBook(activeBook)}
          />
        )}
        <PerformanceSection
          last7Days={last7Days}
          lifetimeWords={lifetimeWords}
          statsUpdatedAt={statsUpdatedAt}
        />
        <RecentBooksCarousel
          books={recentBooks}
          progress={progressMap}
          onSelectBook={handleSelectBook}
        />
        <QuickImportCard onImportClick={() => router.push("/import")} />
        <LibraryGrid books={mobileBooks} onSelectBook={handleSelectBook} />
      </div>

      {/* Desktop-only Home Layout */}
      <div className="hidden md:block space-y-xl">
        {activeBook && activeProgress && (
          <ContinueReadingHero
            book={activeBook}
            progress={activeProgress}
            defaultWpm={settings.defaultWPM}
            onResume={() => handleSelectBook(activeBook)}
          />
        )}
        <PerformanceSection
          last7Days={last7Days}
          lifetimeWords={lifetimeWords}
          statsUpdatedAt={statsUpdatedAt}
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

/* -------------------------------------------------------------------------- */
/*  Performance dashboard section (presentation only; data passed from page)  */
/* -------------------------------------------------------------------------- */

function formatRelativeFromDate(d: Date): string {
  const diffMs = Date.now() - d.getTime();
  if (diffMs < 0) return "just now";
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

function formatLifetime(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toLocaleString();
}

function lifetimeTier(n: number): string {
  if (n < 10000) return "Novice Reader";
  if (n < 100000) return "Avid Reader";
  if (n < 1000000) return "Voracious Reader";
  return "Legendary Reader";
}

interface PerformanceSectionProps {
  last7Days: DayStat[];
  lifetimeWords: number;
  statsUpdatedAt: Date | null;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = React.memo(({
  last7Days,
  lifetimeWords,
  statsUpdatedAt,
}) => {
  const total7 = useMemo(() => last7Days.reduce((sum, d) => sum + d.words, 0), [last7Days]);
  const max7 = useMemo(() => Math.max(1, ...last7Days.map((d) => d.words)), [last7Days]);

  return (
    <section className="animate-fade-in-up stagger-2">
      <div className="flex items-center justify-between mb-md">
        <h3 className="font-headline-md text-headline-md font-bold tracking-tight">
          Your Reading Progress
        </h3>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-tighter">
          {statsUpdatedAt
            ? `${formatRelativeFromDate(statsUpdatedAt)}`
            : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* 7-Day Word Count */}
        <div className="md:col-span-2 glass-card p-md md:p-lg rounded-xl">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <p className="font-label-md text-label-md text-on-surface-variant text-sm md:text-base">
              Words Read This Week
            </p>
            <p className="font-headline-md text-headline-md font-bold text-base md:text-lg">
              {total7.toLocaleString()}{" "}
              <span className="text-label-sm text-primary">WORDS</span>
            </p>
          </div>
          <div className="flex items-end justify-between h-24 md:h-32 gap-1.5 md:gap-2">
            {last7Days.map((d, i) => {
              const isToday = i === last7Days.length - 1;
              const heightPct = Math.max(4, (d.words / max7) * 100);
              return (
                <div
                  key={d.date}
                  className="flex-1 h-full flex flex-col items-center justify-end gap-1.5 md:gap-2"
                >
                  <div
                    className={cn(
                      "w-full rounded-t-sm transition-all",
                      isToday
                        ? "bg-primary"
                        : "bg-primary/20 hover:bg-primary/40"
                    )}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span
                    className={cn(
                      "font-label-sm text-label-sm text-[10px] md:text-xs",
                      isToday
                        ? "text-primary font-bold"
                        : "text-on-surface-variant"
                    )}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lifetime Milestones badge */}
        <div className="glass-card p-md md:p-lg rounded-xl flex flex-col items-center justify-center text-center border-primary/20 bg-primary/5">
          <div className="relative mb-sm md:mb-md">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <span
              className="material-symbols-outlined text-5xl md:text-6xl text-primary relative z-10"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              military_tech
            </span>
          </div>
          <h4 className="font-label-sm md:font-label-md text-label-sm md:label-md text-on-surface-variant uppercase text-xs md:text-sm">
            All-Time Reading
          </h4>
          <p className="font-headline-lg text-headline-lg font-extrabold text-primary text-base md:text-lg">
            {formatLifetime(lifetimeWords)}
          </p>
          <p className="font-label-sm text-label-sm text-on-surface-variant text-xs md:text-sm">
            Words Read
          </p>
          <div className="w-full h-px bg-outline/20 my-md" />
          <p className="font-label-sm text-label-sm text-primary italic text-xs md:text-sm">
            {lifetimeTier(lifetimeWords)}
          </p>
        </div>
      </div>
    </section>
  );
});
PerformanceSection.displayName = "PerformanceSection";
