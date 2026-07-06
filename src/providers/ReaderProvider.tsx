"use client";

import React, { createContext, useContext, useState } from "react";
import { Book, ParsedBook, ReadingProgress } from "../types";

interface ReaderContextProps {
  currentBook: Book | null;
  parsedBook: ParsedBook | null;
  progress: ReadingProgress | null;
  isPlaying: boolean;
  wpm: number;
  setWpm: (wpm: number) => void;
  play: () => void;
  pause: () => void;
  seek: (wordIndex: number) => void;
  loadBook: (book: Book, parsed: ParsedBook, progress?: ReadingProgress) => void;
}

const ReaderContext = createContext<ReaderContextProps | undefined>(undefined);

export const ReaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [parsedBook, setParsedBook] = useState<ParsedBook | null>(null);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(350);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const seek = (wordIndex: number) => {
    // Stub seeking operation
  };
  const loadBook = (book: Book, parsed: ParsedBook, prog?: ReadingProgress) => {
    setCurrentBook(book);
    setParsedBook(parsed);
    if (prog) {
      setProgress(prog);
    }
  };

  return (
    <ReaderContext.Provider
      value={{
        currentBook,
        parsedBook,
        progress,
        isPlaying,
        wpm,
        setWpm,
        play,
        pause,
        seek,
        loadBook,
      }}
    >
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
