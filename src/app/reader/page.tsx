"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_BOOKS } from "@/mocks/books";
import { MOCK_PROGRESS } from "@/mocks/readingProgress";
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

/**
 * ReaderInner — consumes the ReaderProvider context and composes UI.
 * All playback state comes from the single PlaybackController via context.
 */
function ReaderInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("id") || "book-metamorphosis";

  const book = MOCK_BOOKS.find((b) => b.id === bookId) || MOCK_BOOKS[0];
  const progress = MOCK_PROGRESS[book.id];

  const { snapshot, actions } = useReaderContext();

  // Local UI-only state (presentation toggles, not playback state)
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // Keyboard shortcuts — separated from page composition
  useKeyboardShortcuts(snapshot, actions);

  const handleThemeChange = (theme: "light" | "dark") => {
    setCurrentTheme(theme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "sepia");
    root.classList.add(theme);
  };

  const handleBack = () => {
    router.push("/");
  };

  // Seek by percentage: convert slider percent to word index
  const handleProgressScrub = (percent: number) => {
    const targetIndex = Math.round((percent / 100) * snapshot.totalWords);
    actions.seek(targetIndex);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center relative md:pl-64 pt-16">
      <ReaderToolbar
        title={book.title}
        chapterLabel={`Chapter ${progress?.currentChapterIndex ?? 1} • ${Math.round(snapshot.progressPercent)}% Complete`}
        onBackClick={handleBack}
        onTextSettingsClick={() => setShowShortcuts(true)}
      />

      <main className="flex-grow flex items-center justify-center w-full px-space-md">
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
      </main>

      {/* Floating control dock */}
      <footer className="relative w-full max-w-[600px] px-space-md z-50 mb-space-xl">
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

export default function ReaderPage() {
  return (
    <Suspense
      fallback={<div className="pt-24 text-center">Loading Reader...</div>}
    >
      <ReaderProvider>
        <ReaderInner />
      </ReaderProvider>
    </Suspense>
  );
}
