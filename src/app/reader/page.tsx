"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_BOOKS } from "@/mocks/books";
import { MOCK_PROGRESS } from "@/mocks/readingProgress";
import { MOCK_SETTINGS } from "@/mocks/settings";
import { ReaderCanvas } from "@/features/reader/components/ReaderCanvas";
import { ReaderWordDisplay } from "@/features/reader/components/ReaderWordDisplay";
import { ReaderToolbar } from "@/features/reader/components/ReaderToolbar";
import { ReaderControls } from "@/features/reader/components/ReaderControls";
import { ReaderProgress } from "@/features/reader/components/ReaderProgress";
import { ReaderStats } from "@/features/reader/components/ReaderStats";
import { SpeedControl } from "@/features/reader/components/SpeedControl";
import { ThemePicker } from "@/features/reader/components/ThemePicker";
import { KeyboardShortcutsHelp } from "@/features/reader/components/KeyboardShortcutsHelp";
import { Book } from "@/types";

function ReaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("id") || "book-metamorphosis";

  // Find book and progress details
  const book = MOCK_BOOKS.find((b) => b.id === bookId) || MOCK_BOOKS[0];
  const progress = MOCK_PROGRESS[book.id] || {
    bookId: book.id,
    currentChapterIndex: 1,
    currentWordIndex: 0,
    readingTime: 0,
    lastOpened: new Date().toISOString()
  };

  // Local Presentation States
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(MOCK_SETTINGS.defaultWPM);
  const [progressPercent, setProgressPercent] = useState(12); // default mock 12%
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "sepia">("light");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);

  // Sync theme changes with document styles
  const handleThemeChange = (theme: "light" | "dark" | "sepia") => {
    setCurrentTheme(theme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "sepia");
    root.classList.add(theme);
  };

  // Keyboard shortcut listener placeholder
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === "Escape") {
        router.push("/");
      } else if (e.code === "KeyH") {
        setShowShortcuts((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center relative md:pl-64 pt-16">
      <ReaderToolbar
        title={book.title}
        chapterLabel={`Chapter ${progress.currentChapterIndex} • ${progressPercent}% Complete`}
        onBackClick={handleBack}
        onTextSettingsClick={() => setShowShortcuts(true)}
      />

      <main className="flex-grow flex items-center justify-center w-full px-space-md">
        <ReaderCanvas onCanvasClick={() => setIsPlaying((prev) => !prev)}>
          <ReaderWordDisplay word="Sophistication" orpIndex={6} />
          {isPlaying && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary/20 blur-xl"></div>
          )}
        </ReaderCanvas>
      </main>

      {/* Floating control dock */}
      <footer className="fixed bottom-space-xl left-1/2 -translate-x-1/2 w-full max-w-[600px] px-space-md z-50">
        <div className="glass-dock rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
          <ReaderProgress
            progressPercent={progressPercent}
            elapsedTimeLabel="04:12"
            remainingTimeLabel="18:45 remaining"
            onProgressScrub={setProgressPercent}
          />
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSpeedPicker((prev) => !prev)}
              className="flex flex-col items-start hover:bg-surface-container-low px-3 py-1 rounded-lg transition-colors cursor-pointer text-left"
            >
              <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">Speed</span>
              <div className="flex items-baseline gap-1">
                <span className="font-label-mono text-lg text-primary font-bold">{wpm}</span>
                <span className="font-label-mono text-[10px] text-on-surface-variant">WPM</span>
              </div>
            </button>

            <ReaderControls
              isPlaying={isPlaying}
              onPlayToggle={() => setIsPlaying((prev) => !prev)}
              onSkipBack={() => setProgressPercent((prev) => Math.max(0, prev - 5))}
              onSkipForward={() => setProgressPercent((prev) => Math.min(100, prev + 5))}
            />

            <div className="flex items-center gap-space-md">
              <ThemePicker currentTheme={currentTheme} onThemeSelect={handleThemeChange} />
              <ReaderStats wordsRead={1200} totalWords={10000} currentWPM={wpm} />
            </div>
          </div>
        </div>
      </footer>

      {showSpeedPicker && (
        <div className="fixed bottom-36 left-1/2 -translate-x-1/2 z-55">
          <SpeedControl
            currentWpm={wpm}
            onWpmChange={setWpm}
            onClose={() => setShowSpeedPicker(false)}
          />
        </div>
      )}

      {showShortcuts && <KeyboardShortcutsHelp onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}

export default function ReaderPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center">Loading Reader...</div>}>
      <ReaderContent />
    </Suspense>
  );
}
