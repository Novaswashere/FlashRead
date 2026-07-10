"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Book, ParsedBook, ReadingProgress } from "../types";
import { storageService } from "../services/storage";
import { MOCK_BOOKS } from "../mocks/books";
import { MOCK_PROGRESS } from "../mocks/readingProgress";
import { MOCK_READER_TEXT } from "../mocks/readerText";

interface LibraryContextProps {
  books: Book[];
  isLoading: boolean;
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextProps | undefined>(
  undefined
);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshLibrary = async () => {
    try {
      setIsLoading(true);
      let list = await storageService.books.getAll();

      // Disabled auto-seeding to ensure first-time users see the onboarding checklist
      const isSeeded = true;
      if (list.length === 0 && !isSeeded) {
        for (const b of MOCK_BOOKS) {
          await storageService.books.save(b);

          // Seed progress
          const prog = MOCK_PROGRESS[b.id] || {
            bookId: b.id,
            currentChapterIndex: 0,
            currentWordIndex: 0,
            lastOpened: new Date().toISOString(),
            completionPercentage: 0,
            bookmarks: [],
            highlights: [],
            notes: [],
            readingTime: 0,
          };
          await storageService.progress.save(prog);

          // Seed parsed book content
          const parsed: ParsedBook = {
            id: b.id,
            bookId: b.id,
            chapters: [
              {
                id: `${b.id}-chap-1`,
                title: "Chapter 1",
                blocks: [
                  {
                    id: `${b.id}-para-1`,
                    type: "paragraph",
                    text: MOCK_READER_TEXT,
                  },
                ],
                content: MOCK_READER_TEXT,
                wordCount: MOCK_READER_TEXT.split(/\s+/).filter(Boolean).length,
              },
            ],
            totalWords: MOCK_READER_TEXT.split(/\s+/).filter(Boolean).length,
            metadata: {
              title: b.title,
              author: b.author,
            },
          };
          await storageService.parsedBooks.save(parsed);
        }

        list = await storageService.books.getAll();
      }

      setBooks(list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load/seed library database:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshLibrary();
  }, []);

  const addBook = async (book: Book) => {
    await storageService.books.save(book);
    await refreshLibrary();
  };

  const removeBook = async (id: string) => {
    try {
      // Coordinate deletion via Storage Facade
      await storageService.books.delete(id);
      await storageService.parsedBooks.delete(id);
      await storageService.progress.delete(id);

      // Revoke any cover URL assets
      storageService.assets.revokeAssetUrl(id);
      await storageService.assets.deleteAsset(id);

      await refreshLibrary();
    } catch (err) {
      console.error("Failed to remove book:", err);
    }
  };

  return (
    <LibraryContext.Provider
      value={{ books, isLoading, addBook, removeBook, refreshLibrary }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibraryContext = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibraryContext must be used within a LibraryProvider");
  }
  return context;
};
export default LibraryProvider;
