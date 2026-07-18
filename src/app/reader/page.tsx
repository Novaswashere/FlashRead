"use client";

import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReaderProvider, useReaderContext } from "@/providers/ReaderProvider";
import { useSettingsContext } from "@/providers/SettingsProvider";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcuts } from "@/features/reader/hooks/useKeyboardShortcuts";
import { ReaderWordDisplay } from "@/features/reader/components/ReaderWordDisplay";
import { ReaderToolbar } from "@/features/reader/components/ReaderToolbar";
import { ReaderControls } from "@/features/reader/components/ReaderControls";
import { AppearanceSettingsModal } from "@/features/reader/components/AppearanceSettingsModal";
import { PlaybackSettingsModal } from "@/features/reader/components/PlaybackSettingsModal";
import { ReadingAnchorPanel } from "@/features/reader/components/ReadingAnchorPanel";
import { KeyboardShortcutsHelp } from "@/features/reader/components/KeyboardShortcutsHelp";
import { storageService } from "@/services/storage";
import { Book, ParsedBook, ReadingProgress as ProgressType } from "@/types";
import { ReaderSkeleton } from "@/features/reader/components/ReaderSkeleton";
import { useToast } from "@/providers/ToastProvider";
import { readerConfig } from "@/config/reader";
import { addWordsToday } from "@/lib/readingStats";
import {
  ArrowRight,
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
  initialProgress: _initialProgress,
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
  const [showShortcuts, setShowShortcuts] = useState(false);

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

  // Feed the Home 7-day reading chart. Minimal and side-effect free on the
  // engine/autosave: only logs positive deltas when the index advances within
  // a chapter, and resets the baseline across chapter boundaries.
  const lastWordRef = useRef(0);
  const lastChapterRef = useRef(currentChapterIndex);
  useEffect(() => {
    if (lastChapterRef.current !== currentChapterIndex) {
      lastWordRef.current = 0;
      lastChapterRef.current = currentChapterIndex;
    }
    if (snapshot.currentIndex > lastWordRef.current) {
      addWordsToday(snapshot.currentIndex - lastWordRef.current);
    }
    lastWordRef.current = snapshot.currentIndex;
  }, [snapshot.currentIndex, currentChapterIndex]);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  const handleBack = () => {
    router.push("/");
  };

  // Transport + speed handlers (shared by mobile dock and desktop control card)
  const handlePlayToggle = () =>
    snapshot.state === "playing" ? actions.pause() : actions.play();
  const handleCanvasClick = () => {
    if (isEmptyChapter) return;
    handlePlayToggle();
  };
  const handleSkipBack = () =>
    actions.seek(Math.max(0, snapshot.currentIndex - 10));
  const handleSkipForward = () =>
    actions.seek(Math.min(snapshot.totalWords - 1, snapshot.currentIndex + 10));
  const incWpm = () =>
    actions.setWpm(Math.min(readerConfig.maxWpm, snapshot.wpm + readerConfig.wpmStep));
  const decWpm = () =>
    actions.setWpm(Math.max(readerConfig.minWpm, snapshot.wpm - readerConfig.wpmStep));

  return (
    <div className="bg-background text-on-background min-h-screen">
      <PlayTimeTracker bookId={book.id} />

      {/* Shared toolbar — fixed; offsets for the desktop drawer at md+ */}
      <ReaderToolbar
        title={book.title}
        chapterLabel={`Chapter ${currentChapterIndex + 1} of ${chaptersCount} • ${Math.round(snapshot.progressPercent)}%`}
        onBackClick={handleBack}
        onTextSettingsClick={() => setShowAppearanceModal(true)}
        onMoreActionsClick={() => setShowPlaybackModal(true)}
      />

      {/* ============================ MOBILE (< md) ============================ */}
      <div className="md:hidden">
        <main className="flex flex-col min-h-screen pt-16 pb-56">
          {/* RSVP engine card */}
          <div className="px-md pt-md mb-sm">
            <div
              onClick={handleCanvasClick}
              className="relative mx-auto max-w-reader-width h-64 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {/* Vertical ORP guide line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-primary/5" />
              <div className="relative z-10 px-md text-center">
                {isEmptyChapter ? (
                  <div className="max-w-[300px] mx-auto flex flex-col items-center gap-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-3xl text-primary">image</span>
                    <p className="font-body-md text-sm">
                      This chapter has images or illustrations. Skip to the next chapter to continue reading.
                    </p>
                    {hasNextChapter ? (
                      <button
                        onClick={handleNextChapter}
                        className="mt-xs inline-flex items-center gap-1 px-md py-xs rounded-lg bg-primary text-on-primary text-xs font-semibold active:scale-95 transition"
                      >
                        Next Chapter <ArrowRight className="h-3 w-3" />
                      </button>
                    ) : (
                      <button
                        onClick={handleBack}
                        className="mt-xs inline-flex items-center gap-1 px-md py-xs rounded-lg bg-primary text-on-primary text-xs font-semibold active:scale-95 transition"
                      >
                        <Library className="h-3 w-3" /> Library
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={snapshot.state === "playing" ? "" : "pulse-active"}>
                    <ReaderWordDisplay
                      word={snapshot.currentWord}
                      orpIndex={snapshot.orpIndex}
                      font={settings.font}
                      fontSize={settings.fontSize}
                      orpEnabled={settings.orpEnabled}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Context panel */}
          {!isEmptyChapter && settings.readingAnchorEnabled && (
            <div className="px-md flex-1 min-h-0">
              <ReadingAnchorPanel
                chapter={currentChapter}
                font={settings.font}
                fontSize={settings.fontSize}
              />
            </div>
          )}
        </main>

        {/* Bottom dock: speed pill + transport bar (raised to clear global BottomNavBar) */}
        {!isEmptyChapter && (
          <div className="fixed bottom-24 inset-x-0 z-40 px-md md:hidden">
            <div className="mx-auto max-w-reader-width flex flex-col items-center gap-sm">
              {/* Speed pill */}
              <div className="glass-dock rounded-full flex items-center justify-between gap-md px-md py-xs w-[240px]">
                <button
                  onClick={decWpm}
                  aria-label="Decrease speed"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high active:scale-90 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">remove</span>
                </button>
                <div className="flex flex-col items-center leading-none">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Reading Speed</span>
                  <span className="font-bold text-primary text-sm">{snapshot.wpm} WPM</span>
                </div>
                <button
                  onClick={incWpm}
                  aria-label="Increase speed"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-high active:scale-90 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">add</span>
                </button>
              </div>

              {/* Transport bar */}
              <div className="glass-dock rounded-full shadow-2xl flex items-center justify-between gap-md px-md py-sm">
                <button
                  onClick={handlePrevChapter}
                  disabled={currentChapterIndex === 0}
                  aria-label="Previous chapter"
                  className="material-symbols-outlined text-on-surface-variant hover:text-primary disabled:opacity-30 p-xs active:scale-90 transition cursor-pointer"
                >
                  keyboard_double_arrow_left
                </button>
                <div className="h-5 w-px bg-outline-variant/30" />
                <ReaderControls
                  isPlaying={snapshot.state === "playing"}
                  onPlayToggle={handlePlayToggle}
                  onSkipBack={handleSkipBack}
                  onSkipForward={handleSkipForward}
                />
                <div className="h-5 w-px bg-outline-variant/30" />
                <button
                  onClick={handleNextChapter}
                  disabled={!hasNextChapter}
                  aria-label="Next chapter"
                  className="material-symbols-outlined text-on-surface-variant hover:text-primary disabled:opacity-30 p-xs active:scale-90 transition cursor-pointer"
                >
                  keyboard_double_arrow_right
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================ DESKTOP (>= md) ============================ */}
      <div className="hidden md:block md:pl-64">
        <div className="flex min-h-screen">
          {/* Center reading column */}
          <main className="flex-1 relative flex flex-col pt-20 pb-md px-lg min-h-screen">
            {/* Timer info row */}
            <div className="flex items-center justify-center gap-md font-label-sm text-label-sm text-on-surface-variant tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {snapshot.elapsedTimeLabel}
              </span>
              <span className="opacity-30">|</span>
              <span>{Math.round(snapshot.progressPercent)}% COMPLETE</span>
              <span className="opacity-30">|</span>
              <span>{snapshot.remainingTimeLabel} REMAINING</span>
            </div>

            {/* RSVP word + full-height guide line */}
            <div
              onClick={handleCanvasClick}
              className="flex-1 flex items-center justify-center relative my-lg cursor-pointer"
            >
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-primary/5" />
              <div className={snapshot.state === "playing" ? "" : "pulse-active"}>
                {isEmptyChapter ? (
                  <div className="text-center text-on-surface-variant font-body-md">
                    <span className="material-symbols-outlined text-5xl text-primary block mb-sm">image</span>
                    This chapter contains images or illustrations.
                  </div>
                ) : (
                  <ReaderWordDisplay
                    word={snapshot.currentWord}
                    orpIndex={snapshot.orpIndex}
                    font={settings.font}
                    fontSize={Math.round(settings.fontSize * 1.4)}
                    orpEnabled={settings.orpEnabled}
                  />
                )}
              </div>
            </div>

            {/* Current Context panel */}
            {!isEmptyChapter && settings.readingAnchorEnabled && (
              <div className="w-full max-w-2xl mx-auto mb-md">
                <ReadingAnchorPanel
                  chapter={currentChapter}
                  font={settings.font}
                  fontSize={settings.fontSize}
                />
              </div>
            )}

            {/* Main control card */}
            {!isEmptyChapter && (
              <div className="w-full max-w-xl mx-auto">
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm px-lg py-md flex items-center justify-between">
                  {/* Left: speed */}
                  <div className="flex items-center gap-sm w-32">
                    <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
                    <div className="flex flex-col leading-none">
                      <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Speed</span>
                      <span className="font-bold text-on-surface text-sm">
                        {snapshot.wpm} <span className="font-normal text-on-surface-variant">wpm</span>
                      </span>
                    </div>
                  </div>

                  {/* Center: transport */}
                  <div className="flex items-center gap-sm">
                    <button
                      onClick={handlePrevChapter}
                      disabled={currentChapterIndex === 0}
                      aria-label="Previous chapter"
                      className="material-symbols-outlined text-on-surface-variant hover:text-primary disabled:opacity-30 p-xs active:scale-90 transition cursor-pointer"
                    >
                      keyboard_double_arrow_left
                    </button>
                    <ReaderControls
                      isPlaying={snapshot.state === "playing"}
                      onPlayToggle={handlePlayToggle}
                      onSkipBack={handleSkipBack}
                      onSkipForward={handleSkipForward}
                    />
                    <button
                      onClick={handleNextChapter}
                      disabled={!hasNextChapter}
                      aria-label="Next chapter"
                      className="material-symbols-outlined text-on-surface-variant hover:text-primary disabled:opacity-30 p-xs active:scale-90 transition cursor-pointer"
                    >
                      keyboard_double_arrow_right
                    </button>
                  </div>

                  {/* Right: progress */}
                  <div className="flex flex-col items-end w-32">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Progress</span>
                    <span className="font-bold text-on-surface text-sm">
                      {snapshot.wordsRead} <span className="font-normal text-on-surface-variant">words</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Right settings panel (lg+) */}
          <aside className="hidden lg:flex w-64 shrink-0 border-l border-outline-variant/30 flex-col gap-lg p-lg overflow-y-auto">
            {/* Reading Speed */}
            <section className="flex flex-col gap-sm">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Reading Speed</span>
              <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-md">
                <div className="flex items-center justify-between mb-sm">
                  <span className="font-headline-lg text-on-surface">{snapshot.wpm}</span>
                  <div className="flex gap-xs">
                    <button
                      onClick={decWpm}
                      aria-label="Decrease speed"
                      className="w-8 h-8 flex items-center justify-center border border-outline-variant/30 rounded-lg hover:bg-surface-container-high active:scale-90 transition cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <button
                      onClick={incWpm}
                      aria-label="Increase speed"
                      className="w-8 h-8 flex items-center justify-center border border-outline-variant/30 rounded-lg hover:bg-surface-container-high active:scale-90 transition cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={readerConfig.minWpm}
                  max={readerConfig.maxWpm}
                  step={readerConfig.wpmStep}
                  value={snapshot.wpm}
                  onChange={(e) => actions.setWpm(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            </section>

            {/* Visual Mode */}
            <section className="flex flex-col gap-sm">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Visual Mode</span>
              <div className="grid grid-cols-2 gap-xs p-xs bg-surface-container border border-outline-variant/30 rounded-xl">
                <button
                  onClick={() => updateSettings({ orpEnabled: true })}
                  className={`py-xs font-label-sm text-label-sm rounded-lg transition cursor-pointer ${settings.orpEnabled ? "bg-surface-container-lowest text-primary border border-primary/20 shadow-sm" : "text-on-surface-variant"}`}
                >
                  Focus
                </button>
                <button
                  onClick={() => updateSettings({ orpEnabled: false })}
                  className={`py-xs font-label-sm text-label-sm rounded-lg transition cursor-pointer ${!settings.orpEnabled ? "bg-surface-container-lowest text-primary border border-primary/20 shadow-sm" : "text-on-surface-variant"}`}
                >
                  Serene
                </button>
              </div>
            </section>

            {/* Text Scale */}
            <section className="flex flex-col gap-sm">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Text Scale</span>
              <div className="flex items-center gap-md">
                <span className="text-xs text-on-surface-variant">A</span>
                <input
                  type="range"
                  min={32}
                  max={96}
                  step={4}
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                  className="flex-1 accent-primary cursor-pointer"
                />
                <span className="text-xl text-on-surface-variant font-bold">A</span>
              </div>
            </section>

            {/* ORP Position */}
            <section className="flex flex-col gap-sm">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Optimal Recognition</span>
              <div className="p-sm bg-surface-container rounded-xl text-center">
                <span className="font-body-md text-xs text-on-surface-variant italic">Auto-optimized for focus</span>
              </div>
            </section>

            {/* Keyboard Shortcuts */}
            <div className="mt-auto pt-md border-t border-outline-variant/20">
              <button
                onClick={() => setShowShortcuts(true)}
                className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">keyboard</span>
                <span className="font-label-sm text-label-sm">Keyboard Shortcuts</span>
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ============================ Shared overlays ============================ */}
      {isChapterFinished && (
        <div className="fixed inset-0 md:left-64 bg-surface-container-lowest/95 backdrop-blur-md flex items-center justify-center z-50 p-md">
          <div className="max-w-[450px] w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-xl text-center shadow-2xl animate-fade-in-up">
            {hasNextChapter ? (
              <>
                <div className="h-14 w-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-lg text-primary animate-bounce">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="font-headline-lg text-xl font-bold text-on-surface mb-2">
                  Chapter Complete!
                </h3>
                <p className="text-on-surface-variant text-sm mb-lg font-body-md">
                  You read {snapshot.totalWords} words at {snapshot.wpm} words per minute.
                  Great progress!
                </p>

                <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-lg mb-lg text-left">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary block mb-1">
                    Up Next
                  </span>
                  <div className="font-medium text-on-surface line-clamp-1">
                    {parsedBook.chapters[currentChapterIndex + 1]?.title ||
                      `Chapter ${currentChapterIndex + 2}`}
                  </div>
                </div>

                {!isAutoplayPaused ? (
                  <div className="text-xs text-on-surface-variant mb-lg flex items-center justify-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary animate-ping" />
                    Auto-advancing in{" "}
                    <span className="font-bold text-on-surface">
                      {autoplaySeconds}s
                    </span>
                    ...
                  </div>
                ) : (
                  <div className="text-xs text-on-surface-variant mb-lg">
                    Autoplay paused
                  </div>
                )}

                <div className="flex gap-md">
                  <button
                    onClick={() => setIsAutoplayPaused((p) => !p)}
                    className="flex-1 px-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-medium border border-outline-variant/30 transition active:scale-95"
                  >
                    {isAutoplayPaused ? "Resume Autoplay" : "Pause"}
                  </button>
                  <button
                    onClick={handleNextChapter}
                    className="flex-1 px-md py-2.5 rounded-lg bg-primary hover:brightness-110 text-on-primary font-bold text-sm transition active:scale-95"
                  >
                    Read Next Chapter
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="h-16 w-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-lg text-primary animate-pulse">
                  <Trophy className="h-8 w-8" />
                </div>
                <h3 className="font-headline-lg text-2xl font-bold text-on-surface mb-2">
                  Book Finished!
                </h3>
                <p className="text-on-surface-variant text-sm mb-xl leading-relaxed font-body-md">
                  Congratulations! You have successfully completed reading{" "}
                  <span className="text-on-surface font-semibold">
                    &ldquo;{book.title}&rdquo;
                  </span>
                  .
                </p>

                <div className="flex flex-col gap-sm">
                  <button
                    onClick={() => {
                      actions.seek(0);
                      if (currentChapterIndex > 0) {
                        onChapterChange(0);
                      }
                    }}
                    className="w-full px-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-medium border border-outline-variant/30 transition flex items-center justify-center gap-sm active:scale-95"
                  >
                    <RefreshCw className="h-4 w-4" /> Restart Book
                  </button>
                  <button
                    onClick={handleBack}
                    className="w-full px-md py-2.5 rounded-lg bg-primary hover:brightness-110 text-on-primary font-bold text-sm transition flex items-center justify-center gap-sm active:scale-95"
                  >
                    <Library className="h-4 w-4" /> Back to Library
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showAppearanceModal && (
        <AppearanceSettingsModal
          onClose={() => setShowAppearanceModal(false)}
          currentTheme={activeTheme}
          onThemeSelect={handleThemeChange}
        />
      )}

      {showPlaybackModal && (
        <PlaybackSettingsModal onClose={() => setShowPlaybackModal(false)} />
      )}

      {showShortcuts && (
        <KeyboardShortcutsHelp
          onClose={() => setShowShortcuts(false)}
          currentTheme={activeTheme}
          onThemeSelect={handleThemeChange}
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
      <div className="bg-background min-h-screen text-on-background flex flex-col items-center justify-center p-xl text-center">
        <div className="max-w-[400px] bg-surface-container-lowest border border-outline-variant rounded-xl p-xl text-center">
          <span
            className="material-symbols-outlined text-5xl text-primary mb-lg"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_stories
          </span>
          <h3 className="font-headline-lg text-lg font-bold text-on-surface mb-2">
            No Book Selected
          </h3>
          <p className="text-on-surface-variant text-sm mb-lg font-body-md">
            Select a Book from the Library to start reading.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full px-md py-2.5 bg-primary text-on-primary hover:brightness-110 text-sm font-semibold rounded-lg transition-all active:scale-95"
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
