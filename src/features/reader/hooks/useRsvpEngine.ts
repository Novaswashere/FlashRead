"use client";

import { useRef, useEffect, useSyncExternalStore, useMemo } from "react";
import { PlaybackController } from "../engine/playback";
import { PlaybackSnapshot, PlaybackActions } from "../engine/types";

/**
 * useRsvpEngine — bridges the PlaybackController into React.
 *
 * Creates exactly one controller instance (survives re-renders via useRef).
 * Exposes snapshot via useSyncExternalStore for efficient, deduplicated re-renders.
 * Destroys the controller exactly once on unmount.
 */
export function useRsvpEngine(
  text: string,
  initialWpm?: number,
  smartPauseEnabled?: boolean
): { snapshot: PlaybackSnapshot; actions: PlaybackActions } {
  const controllerRef = useRef<PlaybackController | null>(null);

  // Lazily create the controller once
  if (controllerRef.current === null) {
    controllerRef.current = new PlaybackController(text, {
      wpm: initialWpm,
      smartPause: smartPauseEnabled,
    });
  }

  const controller = controllerRef.current;

  // Sync smartPauseEnabled setting when it changes
  useEffect(() => {
    if (smartPauseEnabled !== undefined) {
      controller.setSmartPause(smartPauseEnabled);
    }
  }, [controller, smartPauseEnabled]);

  // Cleanup on unmount — destroy is called exactly once
  useEffect(() => {
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  // Stable subscribe and getSnapshot references for useSyncExternalStore
  const subscribe = useMemo(
    () => controller.subscribe.bind(controller),
    [controller]
  );
  const getSnapshot = useMemo(
    () => controller.getSnapshot.bind(controller),
    [controller]
  );

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const actions: PlaybackActions = useMemo(
    () => ({
      play: () => controller.play(),
      pause: () => controller.pause(),
      seek: (index: number) => controller.seek(index),
      setWpm: (wpm: number) => controller.setWpm(wpm),
      setSmartPause: (enabled: boolean) => controller.setSmartPause(enabled),
    }),
    [controller]
  );

  return { snapshot, actions };
}
