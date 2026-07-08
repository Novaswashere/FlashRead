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

export * from "./document";

export interface Settings {
  defaultWPM: number;
  theme: "light" | "dark" | "sepia" | "system";
  font: "Inter" | "Open Sans" | "Merriweather" | "JetBrains Mono";
  fontSize: number;
  orpEnabled: boolean;
  smartPauseEnabled: boolean;
  readingMode: "rsvp" | "traditional";
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}
