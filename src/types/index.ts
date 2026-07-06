export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  format: "epub" | "pdf" | "txt" | "pasted";
  coverUrl?: string;
  chapterCount: number;
  createdAt: string;
}

export interface Chapter {
  title: string;
  content: string;
  wordCount: number;
}

export interface ParsedBook {
  id: string;
  bookId: string;
  chapters: Chapter[];
  totalWords: number;
  metadata?: Record<string, any>;
}

export interface ReadingProgress {
  userId?: string; // Optional if guest
  bookId: string;
  currentChapterIndex: number;
  currentWordIndex: number;
  readingTime: number; // in seconds
  lastOpened: string; // ISO string
}

export interface Settings {
  defaultWPM: number;
  theme: "light" | "dark" | "sepia" | "system";
  font: "Inter" | "Open Sans" | "Merriweather" | "JetBrains Mono";
  fontSize: number;
  orpEnabled: boolean;
  smartPauseEnabled: boolean;
  readingMode: "rsvp" | "traditional";
}
