"use client";

import { useState } from "react";
import { parserService } from "../../../services/parser";
import { useLibrary } from "../../library/hooks/useLibrary";

export function useImport() {
  const { addBook } = useLibrary();
  const [isImporting, setIsImporting] = useState(false);

  const importFile = async (file: File) => {
    setIsImporting(true);
    try {
      const parsed = await parserService.parse(file);
      addBook({
        id: parsed.bookId,
        title: file.name,
        author: "Unknown Author",
        format: file.name.endsWith(".epub")
          ? "epub"
          : file.name.endsWith(".pdf")
            ? "pdf"
            : "txt",
        chapterCount: parsed.chapters.length,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsImporting(false);
    }
  };

  const importPastedText = async (text: string, title?: string) => {
    setIsImporting(true);
    try {
      const parsed = await parserService.parse(text, title);
      addBook({
        id: parsed.bookId,
        title: title || "Pasted Text",
        author: "Self",
        format: "pasted",
        chapterCount: parsed.chapters.length,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    importFile,
    importPastedText,
    isImporting,
  };
}
