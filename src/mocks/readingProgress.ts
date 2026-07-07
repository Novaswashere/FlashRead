import { ReadingProgress } from "@/types";

export const MOCK_PROGRESS: Record<string, ReadingProgress> = {
  "book-metamorphosis": {
    bookId: "book-metamorphosis",
    currentChapterIndex: 1,
    currentWordIndex: 1200,
    readingTime: 3200,
    lastOpened: "2026-07-06T12:00:00Z",
  },
  "book-atomic-habits": {
    bookId: "book-atomic-habits",
    currentChapterIndex: 14,
    currentWordIndex: 3400,
    readingTime: 12500,
    lastOpened: "2026-07-05T18:30:00Z",
  },
  "book-deep-work": {
    bookId: "book-deep-work",
    currentChapterIndex: 2,
    currentWordIndex: 400,
    readingTime: 4200,
    lastOpened: "2026-07-04T10:15:00Z",
  },
  "book-great-gatsby": {
    bookId: "book-great-gatsby",
    currentChapterIndex: 3,
    currentWordIndex: 0,
    readingTime: 0,
    lastOpened: "2026-07-06T11:22:00Z",
  },
  "book-thinking-fast": {
    bookId: "book-thinking-fast",
    currentChapterIndex: 4,
    currentWordIndex: 120,
    readingTime: 900,
    lastOpened: "2026-07-03T16:45:00Z",
  },
  "book-pragmatic-programmer": {
    bookId: "book-pragmatic-programmer",
    currentChapterIndex: 10,
    currentWordIndex: 8200,
    readingTime: 23400,
    lastOpened: "2026-07-06T10:00:00Z",
  },
  "book-clean-code": {
    bookId: "book-clean-code",
    currentChapterIndex: 1,
    currentWordIndex: 300,
    readingTime: 1800,
    lastOpened: "2026-07-06T09:30:00Z",
  },
};
