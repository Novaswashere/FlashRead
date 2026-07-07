"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlaybackActions, PlaybackSnapshot } from "../engine/types";

/**
 * useKeyboardShortcuts — maps keyboard events to playback actions.
 *
 * Separated from page composition to keep page.tsx thin.
 * Unregisters all listeners on unmount.
 */
export function useKeyboardShortcuts(
  snapshot: PlaybackSnapshot,
  actions: PlaybackActions,
  wpmStep: number = 50
): void {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (snapshot.state === "playing") {
            actions.pause();
          } else {
            actions.play();
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          actions.seek(Math.max(0, snapshot.currentIndex - 10));
          break;
        case "ArrowRight":
          e.preventDefault();
          actions.seek(
            Math.min(snapshot.totalWords - 1, snapshot.currentIndex + 10)
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          actions.setWpm(Math.min(1200, snapshot.wpm + wpmStep));
          break;
        case "ArrowDown":
          e.preventDefault();
          actions.setWpm(Math.max(100, snapshot.wpm - wpmStep));
          break;
        case "Escape":
          router.push("/");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    snapshot.state,
    snapshot.currentIndex,
    snapshot.wpm,
    snapshot.totalWords,
    actions,
    router,
    wpmStep,
  ]);
}
