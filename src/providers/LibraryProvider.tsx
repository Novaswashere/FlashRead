"use client";

import React, { createContext, useContext, useState } from "react";
import { Book } from "../types";

interface LibraryContextProps {
  books: Book[];
  isLoading: boolean;
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextProps | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addBook = (book: Book) => {
    setBooks((prev) => [...prev, book]);
  };
  const removeBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };
  const refreshLibrary = async () => {
    // Stub function
  };

  return (
    <LibraryContext.Provider value={{ books, isLoading, addBook, removeBook, refreshLibrary }}>
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
