"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReaderProvider, useReaderContext } from "@/providers/ReaderProvider";
import { useKeyboardShortcuts } from "@/features/reader/hooks/useKeyboardShortcuts";
import { ReaderCanvas } from "@/features/reader/components/ReaderCanvas";
import { ReaderWordDisplay } from "@/features/reader/components/ReaderWordDisplay";
import { ReaderToolbar } from "@/features/reader/components/ReaderToolbar";
import { ReaderControls } from "@/features/reader/components/ReaderControls";
import { ReaderProgress } from "@/features/reader/components/ReaderProgress";
import { ReaderStats } from "@/features/reader/components/ReaderStats";
import { SpeedControl } from "@/features/reader/components/SpeedControl";
import { KeyboardShortcutsHelp } from "@/features/reader/components/KeyboardShortcutsHelp";
import { storageService } from "@/services/storage";
import { Book, ParsedBook, ReadingProgress as ProgressType } from "@/types";
import { Loader2, ArrowLeft, ArrowRight, Play, Trophy, RefreshCw, Library } from "lucide-react";

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

  // Local presentation controls
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // Autoplay countdown state
  const [autoplaySeconds, setAutoplaySeconds] = useState(5);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  // Bind shortcuts
  useKeyboardShortcuts(snapshot, actions);

  const chaptersCount = parsedBook.chapters.length;
  const currentChapter = parsedBook.chapters[currentChapterIndex];
  const hasNextChapter = currentChapterIndex < chaptersCount - 1;
  const isChapterFinished = snapshot.state === "completed";

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
  }, [isChapterFinished, currentChapterIndex, isAutoplayPaused]);

  // Sync callbacks
  useEffect(() => {
    onWordIndexChange(snapshot.currentIndex);
  }, [snapshot.currentIndex]);

  useEffect(() => {
    onWpmChange(snapshot.wpm);
  }, [snapshot.wpm]);

  const handleThemeChange = (theme: "light" | "dark") => {
    setCurrentTheme(theme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "sepia");
    root.classList.add(theme);
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleNextChapter = () => {
    if (hasNextChapter) {
      onChapterChange(currentChapterIndex + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      onChapterChange(currentChapterIndex - 1);
    }
  };

  const handleProgressScrub = (percent: number) => {
    const targetIndex = Math.round((percent / 100) * snapshot.totalWords);
    actions.seek(targetIndex);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center relative md:pl-64 pt-16">
      
      {/* Play time logger */}
      <PlayTimeTracker bookId={book.id} />

      <ReaderToolbar
        title={book.title}
        chapterLabel={`Chapter ${currentChapterIndex + 1} of ${chaptersCount} • ${Math.round(snapshot.progressPercent)}%`}
        onBackClick={handleBack}
        onTextSettingsClick={() => setShowShortcuts(true)}
      />

      {/* Chapter navigation hotkeys in header */}
      <div className="absolute top-20 right-6 flex gap-2 z-40">
        <button
          onClick={handlePrevChapter}
          disabled={currentChapterIndex === 0}
          className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-30 disabled:hover:border-zinc-800 transition text-zinc-400"
          title="Previous Chapter"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          onClick={handleNextChapter}
          disabled={!hasNextChapter}
          className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 disabled:opacity-30 disabled:hover:border-zinc-800 transition text-zinc-400"
          title="Next Chapter"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <main className="flex-grow flex items-center justify-center w-full px-space-md relative">
        <ReaderCanvas
          onCanvasClick={() =>
            snapshot.state === "playing" ? actions.pause() : actions.play()
          }
        >
          <ReaderWordDisplay
            word={snapshot.currentWord}
            orpIndex={snapshot.orpIndex}
          />
          {snapshot.state === "playing" && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary/20 blur-xl"></div>
          )}
        </ReaderCanvas>

        {/* OVERLAY: Chapter / Book Completion */}
        {isChapterFinished && (
          <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
            <div className="max-w-[450px] w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
              
              {hasNextChapter ? (
                <>
                  <div className="h-14 w-14 bg-cyan-950 border border-cyan-800 rounded-full flex items-center justify-center mx-auto mb-6 text-cyan-400 animate-bounce">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-2">Chapter Completed!</h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    You read {snapshot.totalWords} words at {snapshot.wpm} WPM. Excellent speed reading.
                  </p>

                  <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 mb-6 text-left">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-cyan-500 block mb-1">Up Next</span>
                    <div className="font-medium text-zinc-200 line-clamp-1">
                      {parsedBook.chapters[currentChapterIndex + 1]?.title || `Chapter ${currentChapterIndex + 2}`}
                    </div>
                  </div>

                  {!isAutoplayPaused ? (
                    <div className="text-xs text-zinc-500 mb-6 flex items-center justify-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
                      Auto-advancing in <span className="font-bold text-zinc-300">{autoplaySeconds}s</span>...
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-500 mb-6">Autoplay paused</div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsAutoplayPaused((p) => !p)}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium border border-zinc-700 transition"
                    >
                      {isAutoplayPaused ? "Resume Autoplay" : "Pause"}
                    </button>
                    <button
                      onClick={handleNextChapter}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm transition shadow-lg shadow-cyan-950/20"
                    >
                      Read Next Chapter
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 bg-gradient-to-tr from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-950 animate-pulse shadow-lg shadow-yellow-950/20">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-100 mb-2">Book Finished!</h3>
                  <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                    Congratulations! You have successfully completed reading <span className="text-zinc-200 font-semibold">&ldquo;{book.title}&rdquo;</span>.
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => onChapterChange(0)}
                      className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium border border-zinc-700 transition flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" /> Restart Book
                    </button>
                    <button
                      onClick={handleBack}
                      className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2"
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
        <div className="glass-dock rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
          <ReaderProgress
            progressPercent={snapshot.progressPercent}
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

      {showShortcuts && (
        <KeyboardShortcutsHelp
          onClose={() => setShowShortcuts(false)}
          currentTheme={currentTheme}
          onThemeSelect={handleThemeChange}
        />
      )}
    </div>
  );
}

function ReaderLoader() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("id") || "";
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [book, setBook] = useState<Book | null>(null);
  const [parsedBook, setParsedBook] = useState<ParsedBook | null>(null);
  const [progress, setProgress] = useState<ProgressType | null>(null);

  // Active playing settings
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWpm, setCurrentWpm] = useState(350);

  useEffect(() => {
    if (!bookId) {
      setError("No book ID specified in reader URL.");
      setIsLoading(false);
      return;
    }

    async function loadBookData() {
      try {
        const fetchedBook = await storageService.books.getById(bookId);
        const fetchedParsed = await storageService.parsedBooks.getById(bookId);
        const fetchedProgress = await storageService.progress.getById(bookId);

        if (!fetchedBook || !fetchedParsed) {
          setError("Book not found in IndexedDB library.");
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
        }

        setIsLoading(false);
      } catch (err: any) {
        setError(`Failed to read from IndexedDB: ${err?.message || err}`);
        setIsLoading(false);
      }
    }

    loadBookData();
  }, [bookId]);

  // Debounced progress saving effect
  useEffect(() => {
    if (!bookId || isLoading || error || !parsedBook) return;

    const saveProgress = async () => {
      const totalChapters = parsedBook.chapters.length;
      const chapter = parsedBook.chapters[currentChapterIndex];
      const chapterWords = chapter?.wordCount || 1;

      // Calculate precise progress percentage across the entire book
      const currentProgressRatio = currentWordIndex / chapterWords;
      const pct = Math.min(
        100,
        Math.round(((currentChapterIndex + currentProgressRatio) / totalChapters) * 100)
      );

      const progressUpdate: ProgressType = {
        bookId,
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

      await storageService.progress.save(progressUpdate);
    };

    const handler = setTimeout(saveProgress, 1500);
    return () => clearTimeout(handler);
  }, [currentWordIndex, currentWpm, currentChapterIndex, bookId, parsedBook, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-cyan-500 animate-spin mb-4" />
        <span className="text-zinc-400 text-sm">Opening reader canvas...</span>
      </div>
    );
  }

  if (error || !book || !parsedBook || !progress) {
    return (
      <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-[400px] bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-red-500 mb-2">Error Loading Book</h3>
          <p className="text-zinc-400 text-sm mb-6">{error || "Could not initialize document state."}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-lg border border-zinc-750 transition"
          >
            Return to Library
          </button>
        </div>
      </div>
    );
  }

  const currentChapter = parsedBook.chapters[currentChapterIndex] || parsedBook.chapters[0];

  return (
    /* We change the key whenever the chapter changes so that the RSVP engine unmounts and remounts cleanly */
    <ReaderProvider
      key={`${bookId}-${currentChapterIndex}`}
      text={currentChapter.content}
      initialWpm={currentWpm}
      initialWordIndex={currentWordIndex}
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
    <Suspense
      fallback={
        <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-cyan-500 animate-spin mb-4" />
          <span className="text-zinc-400 text-sm font-medium">Booting engine...</span>
        </div>
      }
    >
      <ReaderLoader />
    </Suspense>
  );
}
