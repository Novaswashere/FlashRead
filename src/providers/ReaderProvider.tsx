"use client";

import React, { createContext, useContext } from "react";
import { useRsvpEngine } from "../features/reader/hooks/useRsvpEngine";
import {
  PlaybackSnapshot,
  PlaybackActions,
} from "../features/reader/engine/types";
import { MOCK_READER_TEXT } from "../mocks/readerText";

interface ReaderContextProps {
  snapshot: PlaybackSnapshot;
  actions: PlaybackActions;
}

const ReaderContext = createContext<ReaderContextProps | undefined>(undefined);

export const ReaderProvider: React.FC<{
  text?: string;
  initialWpm?: number;
  children: React.ReactNode;
}> = ({ text, initialWpm = 350, children }) => {
  const content = text ?? MOCK_READER_TEXT;
  const { snapshot, actions } = useRsvpEngine(content, initialWpm);

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
