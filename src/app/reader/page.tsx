"use client";

import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReaderProvider, useReaderContext } from "@/providers/ReaderProvider";
import { useSettingsContext } from "@/providers/SettingsProvider";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcuts } from "@/features/reader/hooks/useKeyboardShortcuts";
import { ReaderCanvas } from "@/features/reader/components/ReaderCanvas";
import { ReaderWordDisplay } from "@/features/reader/components/ReaderWordDisplay";
import { ReaderToolbar } from "@/features/reader/components/ReaderToolbar";
import { ReaderControls } from "@/features/reader/components/ReaderControls";
import { ReaderProgress } from "@/features/reader/components/ReaderProgress";
import { ReaderStats } from "@/features/reader/components/ReaderStats";
import { SpeedControl } from "@/features/reader/components/SpeedControl";
import { AppearanceSettingsModal } from "@/features/reader/components/AppearanceSettingsModal";
import { PlaybackSettingsModal } from "@/features/reader/components/PlaybackSettingsModal";
import { storageService } from "@/services/storage";
import { Book, ParsedBook, ReadingProgress as ProgressType } from "@/types";
import { ReaderSkeleton } from "@/features/reader/components/ReaderSkeleton";
import { useToast } from "@/providers/ToastProvider";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Play,
  Trophy,
  RefreshCw,
  Library,
} from "lucide-react";

/**
 * PlayTimeTracker — records reading time in seconds while RSVP is active
 */
function PlayTimeTracker({ bookId }: { bookId: string }) {
  const { snapshot } = useReaderContext();

  useEffect(() => {
    if (snapshot.state !== "playing") return;

    const interval = setInterval(async () => {
      const prog = await storageService.progress.getById(bookId);
      if (prog) {
        prog.readingTime = (prog.readingTime || 0) + 1;
        await storageService.progress.save(prog);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [snapshot.state, bookId]);

  return null;
}

interface ReaderInnerProps {
  book: Book;
  parsedBook: ParsedBook;
  initialProgress: ProgressType;
  currentChapterIndex: number;
  onChapterChange: (index: number) => void;
  onWordIndexChange: (index: number) => void;
  onWpmChange: (wpm: number) => void;
}

function ReaderInner({
  book,
  parsedBook,
  initialProgress,
  currentChapterIndex,
  onChapterChange,
  onWordIndexChange,
  onWpmChange,
}: ReaderInnerProps) {
  const router = useRouter();
  const { snapshot, actions } = useReaderContext();
  const { settings, updateSettings } = useSettingsContext();
  const { theme, setTheme } = useTheme();

  // Local presentation controls
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [showPlaybackModal, setShowPlaybackModal] = useState(false);
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);

  const activeTheme =
    theme === "system"
      ? typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme === "sepia"
        ? "light"
        : theme;

  // Autoplay countdown state
  const [autoplaySeconds, setAutoplaySeconds] = useState(5);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  // Bind shortcuts
  useKeyboardShortcuts(snapshot, actions);

  const chaptersCount = parsedBook.chapters.length;
  const currentChapter = parsedBook.chapters[currentChapterIndex];
  const hasNextChapter = currentChapterIndex < chaptersCount - 1;
  const isChapterFinished = snapshot.state === "completed";
  const isEmptyChapter =
    !currentChapter ||
    currentChapter.wordCount === 0 ||
    !currentChapter.content.trim();

  const handleNextChapter = useCallback(() => {
    if (hasNextChapter) {
      onChapterChange(currentChapterIndex + 1);
    }
  }, [hasNextChapter, currentChapterIndex, onChapterChange]);

  const handlePrevChapter = useCallback(() => {
    if (currentChapterIndex > 0) {
      onChapterChange(currentChapterIndex - 1);
    }
  }, [currentChapterIndex, onChapterChange]);

  // Handle Autoplay Next Chapter countdown
  useEffect(() => {
    if (!isChapterFinished || !hasNextChapter || isAutoplayPaused) return;

    setAutoplaySeconds(5);
    const interval = setInterval(() => {
      setAutoplaySeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleNextChapter();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isChapterFinished, currentChapterIndex, isAutoplayPaused, hasNextChapter, handleNextChapter]);

  // Sync callbacks
  useEffect(() => {
    onWordIndexChange(snapshot.currentIndex);
  }, [snapshot.currentIndex, onWordIndexChange]);

  useEffect(() => {
    onWpmChange(snapshot.wpm);
  }, [snapshot.wpm, onWpmChange]);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  const handleBack = () => {
    router.push("/");
  };

  // Navigation functions defined using useCallback above

  const handleProgressScrub = (index: number) => {
    actions.seek(index);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center relative md:pl-64 pt-16">
      {/* Play time logger */}
      <PlayTimeTracker bookId={book.id} />

      <ReaderToolbar
        title={book.title}
        chapterLabel={`Chapter ${currentChapterIndex + 1} of ${chaptersCount} • ${Math.round(snapshot.progressPercent)}%`}
        onBackClick={handleBack}
        onTextSettingsClick={() => setShowAppearanceModal(true)}
        onMoreActionsClick={() => setShowPlaybackModal(true)}
      />

      {/* Chapter navigation hotkeys in header */}
      <div className="absolute top-20 right-6 flex gap-2 z-40 items-center">
        <button
          onClick={handlePrevChapter}
          disabled={currentChapterIndex === 0}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-container dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 hover:border-border-subtle/80 dark:hover:border-zinc-700 disabled:opacity-30 transition text-on-surface-variant dark:text-zinc-400 active:scale-95 cursor-pointer text-xs font-semibold"
          title="Previous Chapter"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Prev Chapter</span>
        </button>
        <button
          onClick={handleNextChapter}
          disabled={!hasNextChapter}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-container dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 hover:border-border-subtle/80 dark:hover:border-zinc-700 disabled:opacity-30 transition text-on-surface-variant dark:text-zinc-400 active:scale-95 cursor-pointer text-xs font-semibold"
          title="Next Chapter"
        >
          <span className="hidden sm:inline">Next Chapter</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <main className="flex-grow flex items-center justify-center w-full px-space-md relative">
        <ReaderCanvas
          onCanvasClick={() => {
            if (isEmptyChapter) return;
            snapshot.state === "playing" ? actions.pause() : actions.play();
          }}
          orpEnabled={settings.orpEnabled && !isEmptyChapter}
        >
          {isEmptyChapter ? (
            <div className="max-w-[400px] w-full bg-white/75 dark:bg-zinc-900/75 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md rounded-2xl p-6 text-center shadow-xl animate-in fade-in duration-200 flex flex-col items-center justify-center gap-4 text-on-surface">
              <div className="h-12 w-12 bg-primary/10 dark:bg-cyan-950 border border-primary/20 dark:border-cyan-800 rounded-full flex items-center justify-center text-primary dark:text-cyan-400">
                <span className="material-symbols-outlined text-2xl">image</span>
              </div>
              <h3 className="text-base font-bold">Visual Page / Illustration</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                This chapter contains no readable text content (likely a cover page or drawing illustration) and cannot be read using rapid serial visual presentation (RSVP) mode.
              </p>
              <div className="flex gap-3 w-full mt-2">
                {currentChapterIndex > 0 && (
                  <button
                    onClick={handlePrevChapter}
                    className="flex-1 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold border border-border-subtle transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" /> Prev Chapter
                  </button>
                )}
                {hasNextChapter ? (
                  <button
                    onClick={handleNextChapter}
                    className="flex-1 px-3 py-2 rounded-lg bg-primary text-on-primary hover:brightness-110 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    Next Chapter <ArrowRight className="h-3 w-3" />
                  </button>
                ) : (
                  <button
                    onClick={handleBack}
                    className="flex-1 px-3 py-2 rounded-lg bg-primary text-on-primary hover:brightness-110 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Library className="h-3 w-3" /> Library
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <ReaderWordDisplay
                word={snapshot.currentWord}
                orpIndex={snapshot.orpIndex}
                font={settings.font}
                fontSize={settings.fontSize}
                orpEnabled={settings.orpEnabled}
              />
              {snapshot.state === "playing" && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary/20 blur-xl"></div>
              )}
            </>
          )}
        </ReaderCanvas>

        {/* OVERLAY: Chapter / Book Completion */}
        {isChapterFinished && (
          <div className="absolute inset-0 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
            <div className="max-w-[450px] w-full bg-surface-container-lowest dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 rounded-2xl p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
              {hasNextChapter ? (
                <>
                  <div className="h-14 w-14 bg-primary/10 dark:bg-cyan-950 border border-primary/20 dark:border-cyan-800 rounded-full flex items-center justify-center mx-auto mb-6 text-primary dark:text-cyan-400 animate-bounce">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-2">
                    Chapter Completed!
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-6">
                    You read {snapshot.totalWords} words at {snapshot.wpm} WPM.
                    Excellent speed reading.
                  </p>

                  <div className="bg-surface-container dark:bg-zinc-950 border border-border-subtle dark:border-zinc-850 rounded-xl p-5 mb-6 text-left">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-primary dark:text-cyan-500 block mb-1">
                      Up Next
                    </span>
                    <div className="font-medium text-on-surface line-clamp-1">
                      {parsedBook.chapters[currentChapterIndex + 1]?.title ||
                        `Chapter ${currentChapterIndex + 2}`}
                    </div>
                  </div>

                  {!isAutoplayPaused ? (
                    <div className="text-xs text-on-surface-variant mb-6 flex items-center justify-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary dark:bg-cyan-500 animate-ping" />
                      Auto-advancing in{" "}
                      <span className="font-bold text-on-surface">
                        {autoplaySeconds}s
                      </span>
                      ...
                    </div>
                  ) : (
                    <div className="text-xs text-on-surface-variant mb-6">
                      Autoplay paused
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsAutoplayPaused((p) => !p)}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high dark:bg-zinc-800 dark:hover:bg-zinc-700 text-on-surface dark:text-zinc-300 text-sm font-medium border border-border-subtle dark:border-zinc-700 transition"
                    >
                      {isAutoplayPaused ? "Resume Autoplay" : "Pause"}
                    </button>
                    <button
                      onClick={handleNextChapter}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:brightness-110 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-on-primary dark:text-zinc-950 font-bold text-sm transition shadow-lg shadow-primary-container/20 dark:shadow-cyan-950/20"
                    >
                      Read Next Chapter
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 bg-gradient-to-tr from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-950 animate-pulse shadow-lg shadow-yellow-500/20 dark:shadow-yellow-950/20">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-on-surface mb-2">
                    Book Finished!
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                    Congratulations! You have successfully completed reading{" "}
                    <span className="text-on-surface font-semibold">
                      &ldquo;{book.title}&rdquo;
                    </span>
                    .
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        actions.seek(0);
                        if (currentChapterIndex > 0) {
                          onChapterChange(0);
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high dark:bg-zinc-800 dark:hover:bg-zinc-700 text-on-surface dark:text-zinc-200 text-sm font-medium border border-border-subtle dark:border-zinc-700 transition flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" /> Restart Book
                    </button>
                    <button
                      onClick={handleBack}
                      className="w-full px-4 py-2.5 rounded-lg bg-primary hover:brightness-110 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-emerald-500 dark:hover:from-cyan-400 dark:hover:to-emerald-400 text-on-primary dark:text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2"
                    >
                      <Library className="h-4 w-4" /> Back to Library
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating control dock */}
      <footer className="relative w-full max-w-[600px] px-space-md z-45 mb-space-xl">
        <div className="bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
          <ReaderProgress
            currentIndex={snapshot.currentIndex}
            totalWords={snapshot.totalWords}
            elapsedTimeLabel={snapshot.elapsedTimeLabel}
            remainingTimeLabel={`${snapshot.remainingTimeLabel} remaining`}
            onProgressScrub={handleProgressScrub}
          />
          <div className="relative flex items-center justify-between w-full min-h-[56px]">
            <div className="flex justify-start">
              <button
                onClick={() => setShowSpeedPicker((prev) => !prev)}
                className="flex flex-col items-start hover:bg-surface-container-low px-3 py-1 rounded-lg transition-colors cursor-pointer text-left"
              >
                <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">
                  Speed
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-label-mono text-lg text-primary font-bold">
                    {snapshot.wpm}
                  </span>
                  <span className="font-label-mono text-[10px] text-on-surface-variant">
                    WPM
                  </span>
                </div>
              </button>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <ReaderControls
                isPlaying={snapshot.state === "playing"}
                onPlayToggle={() =>
                  snapshot.state === "playing"
                    ? actions.pause()
                    : actions.play()
                }
                onSkipBack={() =>
                  actions.seek(Math.max(0, snapshot.currentIndex - 10))
                }
                onSkipForward={() =>
                  actions.seek(
                    Math.min(
                      snapshot.totalWords - 1,
                      snapshot.currentIndex + 10
                    )
                  )
                }
              />
            </div>

            <div className="flex justify-end items-center gap-space-sm sm:gap-space-md">
              <ReaderStats
                wordsRead={snapshot.wordsRead}
                totalWords={snapshot.totalWords}
                currentWPM={snapshot.wpm}
              />
            </div>
          </div>
        </div>

        {showSpeedPicker && (
          <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-55">
            <SpeedControl
              currentWpm={snapshot.wpm}
              onWpmChange={(wpm) => actions.setWpm(wpm)}
              onClose={() => setShowSpeedPicker(false)}
            />
          </div>
        )}
      </footer>

      {showAppearanceModal && (
        <AppearanceSettingsModal
          onClose={() => setShowAppearanceModal(false)}
          currentTheme={activeTheme}
          onThemeSelect={handleThemeChange}
        />
      )}

      {showPlaybackModal && (
        <PlaybackSettingsModal
          onClose={() => setShowPlaybackModal(false)}
        />
      )}
    </div>
  );
}

function ReaderLoader() {
  const { showToast: showGlobalToast } = useToast();
  const searchParams = useSearchParams();
  const bookIdParam = searchParams.get("id") || "";
  const router = useRouter();
  const { settings } = useSettingsContext();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [book, setBook] = useState<Book | null>(null);
  const [parsedBook, setParsedBook] = useState<ParsedBook | null>(null);
  const [progress, setProgress] = useState<ProgressType | null>(null);
  const [activeBookId, setActiveBookId] = useState("");

  // Active playing settings
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWpm, setCurrentWpm] = useState(350);

  useEffect(() => {
    async function loadBookData() {
      try {
        let idToLoad = bookIdParam;
        if (!idToLoad) {
          const allBooks = await storageService.books.getAll();
          if (allBooks.length > 0) {
            // Find most recently opened from progress
            const progresses: ProgressType[] = [];
            for (const b of allBooks) {
              const p = await storageService.progress.getById(b.id);
              if (p) progresses.push(p);
            }
            progresses.sort((a, b) => b.lastOpened.localeCompare(a.lastOpened));
            if (progresses.length > 0) {
              idToLoad = progresses[0].bookId;
            } else {
              idToLoad = allBooks[0].id;
            }
          } else {
            setError("Select a Book from the Library");
            setIsLoading(false);
            return;
          }
        }

        setActiveBookId(idToLoad);

        const fetchedBook = await storageService.books.getById(idToLoad);
        const fetchedParsed =
          await storageService.parsedBooks.getById(idToLoad);
        const fetchedProgress = await storageService.progress.getById(idToLoad);

        if (!fetchedBook || !fetchedParsed) {
          setError("Select a Book from the Library");
          setIsLoading(false);
          return;
        }

        setBook(fetchedBook);
        setParsedBook(fetchedParsed);

        if (fetchedProgress) {
          setProgress(fetchedProgress);
          setCurrentChapterIndex(fetchedProgress.currentChapterIndex || 0);
          setCurrentWordIndex(fetchedProgress.currentWordIndex || 0);
          setCurrentWpm(fetchedProgress.wpm || 350);
          
          if (fetchedProgress.currentChapterIndex > 0 || fetchedProgress.currentWordIndex > 0) {
            showGlobalToast(`Reading progress restored. Resumed at Chapter ${fetchedProgress.currentChapterIndex + 1}`, "success");
          }
        }

        setIsLoading(false);
      } catch (err: any) {
        setError("Select a Book from the Library");
        setIsLoading(false);
      }
    }

    loadBookData();
  }, [bookIdParam, showGlobalToast]);

  // Debounced progress saving effect
  useEffect(() => {
    if (!activeBookId || isLoading || error || !parsedBook) return;

    const saveProgress = async () => {
      const totalChapters = parsedBook.chapters.length;
      const chapter = parsedBook.chapters[currentChapterIndex];
      const chapterWords = chapter?.wordCount || 1;

      // Calculate precise progress percentage across the entire book
      const currentProgressRatio = currentWordIndex / chapterWords;
      const pct = Math.min(
        100,
        Math.round(
          ((currentChapterIndex + currentProgressRatio) / totalChapters) * 100
        )
      );

      const progressUpdate: ProgressType = {
        bookId: activeBookId,
        currentChapterIndex,
        currentWordIndex,
        wpm: currentWpm,
        lastOpened: new Date().toISOString(),
        completionPercentage: pct,
        bookmarks: progress?.bookmarks || [],
        highlights: progress?.highlights || [],
        notes: progress?.notes || [],
        readingTime: progress?.readingTime || 0,
      };

      try {
        await storageService.progress.save(progressUpdate);
      } catch (err) {
        console.error("Autosave Failure:", err);
        showGlobalToast("Unable to save progress. Retrying in background...", "error");
      }
    };

    const handler = setTimeout(saveProgress, 1500);
    return () => clearTimeout(handler);
  }, [
    currentWordIndex,
    currentWpm,
    currentChapterIndex,
    activeBookId,
    parsedBook,
    isLoading,
    error,
    progress?.bookmarks,
    progress?.highlights,
    progress?.notes,
    progress?.readingTime,
    showGlobalToast,
  ]);

  if (isLoading) {
    return <ReaderSkeleton />;
  }

  if (error || !book || !parsedBook || !progress) {
    return (
      <div className="bg-background min-h-screen text-on-background flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-[400px] bg-surface-container border border-border-subtle rounded-xl p-6 shadow-xl text-center">
          <span
            className="material-symbols-outlined text-5xl text-primary mb-4"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_stories
          </span>
          <h3 className="text-lg font-bold text-on-surface mb-2">
            No Book Selected
          </h3>
          <p className="text-on-surface-variant text-sm mb-6">
            Select a Book from the Library to start reading.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-2.5 bg-primary text-on-primary hover:brightness-110 text-sm font-semibold rounded-lg transition-all"
          >
            Go to Library
          </button>
        </div>
      </div>
    );
  }

  const currentChapter =
    parsedBook.chapters[currentChapterIndex] || parsedBook.chapters[0];

  return (
    /* We change the key whenever the chapter changes so that the RSVP engine unmounts and remounts cleanly */
    <ReaderProvider
      key={`${activeBookId}-${currentChapterIndex}`}
      text={currentChapter.content}
      initialWpm={currentWpm}
      initialWordIndex={currentWordIndex}
      smartPauseEnabled={settings.smartPauseEnabled}
      onWordIndexChange={setCurrentWordIndex}
      onWpmChange={setCurrentWpm}
    >
      <ReaderInner
        book={book}
        parsedBook={parsedBook}
        initialProgress={progress}
        currentChapterIndex={currentChapterIndex}
        onChapterChange={(idx) => {
          setCurrentChapterIndex(idx);
          setCurrentWordIndex(0); // Reset word index for new chapter
        }}
        onWordIndexChange={setCurrentWordIndex}
        onWpmChange={setCurrentWpm}
      />
    </ReaderProvider>
  );
}

export default function ReaderPage() {
  return (
    <Suspense fallback={<ReaderSkeleton />}>
      <ReaderLoader />
    </Suspense>
  );
}
