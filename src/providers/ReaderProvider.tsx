"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useRsvpEngine } from "../features/reader/hooks/useRsvpEngine";
import {
  PlaybackSnapshot,
  PlaybackActions,
} from "../features/reader/engine/types";

interface ReaderContextProps {
  snapshot: PlaybackSnapshot;
  actions: PlaybackActions;
}

const ReaderContext = createContext<ReaderContextProps | undefined>(undefined);

export const ReaderProvider: React.FC<{
  text?: string;
  initialWpm?: number;
  initialWordIndex?: number;
  smartPauseEnabled?: boolean;
  onWordIndexChange?: (index: number) => void;
  onWpmChange?: (wpm: number) => void;
  children: React.ReactNode;
}> = ({
  text = "",
  initialWpm = 350,
  initialWordIndex = 0,
  smartPauseEnabled = true,
  onWordIndexChange,
  onWpmChange,
  children,
}) => {
  const { snapshot, actions } = useRsvpEngine(text, initialWpm, smartPauseEnabled);

  // Handle initial seek on mount
  const initialSeekDone = useRef(false);
  useEffect(() => {
    if (
      !initialSeekDone.current &&
      initialWordIndex > 0 &&
      snapshot.totalWords > 0
    ) {
      actions.seek(initialWordIndex);
      initialSeekDone.current = true;
    }
  }, [initialWordIndex, snapshot.totalWords, actions]);

  // Reset seek state if text changes (new chapter)
  const prevText = useRef(text);
  if (prevText.current !== text) {
    initialSeekDone.current = false;
    prevText.current = text;
  }

  // Notify parent of word index changes
  useEffect(() => {
    onWordIndexChange?.(snapshot.currentIndex);
  }, [snapshot.currentIndex, onWordIndexChange]);

  // Notify parent of WPM changes
  useEffect(() => {
    onWpmChange?.(snapshot.wpm);
  }, [snapshot.wpm, onWpmChange]);

  return (
    <ReaderContext.Provider value={{ snapshot, actions }}>
      {children}
    </ReaderContext.Provider>
  );
};

export const useReaderContext = () => {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error("useReaderContext must be used within a ReaderProvider");
  }
  return context;
};
export default ReaderProvider;
