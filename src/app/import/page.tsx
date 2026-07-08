"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/features/import/components/UploadDropzone";
import { PasteTextCard } from "@/features/import/components/PasteTextCard";
import { ImportHelpSection } from "@/features/import/components/ImportHelpSection";
import { SupportedFormatsCard } from "@/features/import/components/SupportedFormatsCard";
import { Toast } from "@/components/ui/Toast";
import { parserService } from "@/services/parser";
import { storageService } from "@/services/storage";
import { useLibraryContext } from "@/providers/LibraryProvider";
import { ParsedBook, Book, ReadingProgress } from "@/types";
import { ParserError } from "@/lib/errors";
import {
  Loader2,
  AlertTriangle,
  FileText,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";

type ImportState = "IDLE" | "PARSING" | "PREVIEW" | "SAVING" | "ERROR";

export default function ImportPage() {
  const router = useRouter();
  const { addBook } = useLibraryContext();

  // State Machine
  const [state, setState] = useState<ImportState>("IDLE");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing parser...");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState("");

  // Preview Data
  const [parsedBook, setParsedBook] = useState<ParsedBook | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedAuthor, setEditedAuthor] = useState("");
  const [fileFormat, setFileFormat] = useState<
    "epub" | "pdf" | "txt" | "pasted"
  >("txt");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  // Ingestion Controllers
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [acceptFilter, setAcceptFilter] = useState(".epub,.pdf,.txt");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );

  // Cleanup Object URLs on unmount
  useEffect(() => {
    return () => {
      if (coverPreviewUrl) {
        window.URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [coverPreviewUrl]);

  const handleStartParsing = async (
    data: File | string,
    format: "epub" | "pdf" | "txt" | "pasted"
  ) => {
    setState("PARSING");
    setProgress(0);
    setFileFormat(format);
    setStatusText("Reading document data...");

    abortControllerRef.current = new AbortController();

    try {
      const result = await parserService.parse(data, undefined, {
        signal: abortControllerRef.current.signal,
        onProgress: (pct) => {
          setProgress(pct);
          if (pct < 30) {
            setStatusText("Reading document layout...");
          } else if (pct < 70) {
            setStatusText("Processing text paragraphs...");
          } else if (pct < 95) {
            setStatusText("Extracting assets and chapters...");
          } else {
            setStatusText("Completing parse...");
          }
        },
      });

      // Handle Preview Setup
      setParsedBook(result);
      setEditedTitle(result.metadata.title || "Untitled Book");
      setEditedAuthor(result.metadata.author || "Unknown Author");

      // Setup cover preview
      if (result.metadata.coverAssetId && result.assets) {
        const coverAsset = result.assets.find(
          (a) => a.id === result.metadata.coverAssetId
        );
        if (coverAsset) {
          const previewUrl = window.URL.createObjectURL(coverAsset.data);
          setCoverPreviewUrl(previewUrl);
        }
      }

      setState("PREVIEW");
    } catch (err: any) {
      if (err.code === "ABORTED" || err.message === "Parsing aborted") {
        setToastMessage("Import process cancelled by user");
        setToastType("info");
        setShowToast(true);
        setState("IDLE");
        return;
      }

      console.error("Parser Ingestion Error:", err);
      setErrorType(err.code || "UNKNOWN_ERROR");
      setErrorMessage(
        err.message || "An unexpected error occurred during document parsing."
      );
      setState("ERROR");
    }
  };

  const handleFileDrop = (file: File) => {
    let format: "epub" | "pdf" | "txt" | "pasted" = "txt";
    const nameLower = file.name.toLowerCase();
    if (nameLower.endsWith(".epub")) format = "epub";
    else if (nameLower.endsWith(".pdf")) format = "pdf";
    else if (nameLower.endsWith(".txt")) format = "txt";

    handleStartParsing(file, format);
  };

  const handlePasteText = (text: string) => {
    handleStartParsing(text, "pasted");
  };

  const handleFormatSelect = (label: string) => {
    if (label === "Upload EPUB") {
      setAcceptFilter(".epub");
      setTimeout(() => fileInputRef.current?.click(), 0);
    } else if (label === "Upload PDF") {
      setAcceptFilter(".pdf");
      setTimeout(() => fileInputRef.current?.click(), 0);
    } else if (label === "Upload TXT") {
      setAcceptFilter(".txt");
      setTimeout(() => fileInputRef.current?.click(), 0);
    } else if (label === "Paste Text") {
      const el = document.getElementById("paste-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        const textarea = el.querySelector("textarea");
        if (textarea) {
          textarea.focus();
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      let format: "epub" | "pdf" | "txt" | "pasted" = "txt";
      const nameLower = file.name.toLowerCase();
      if (nameLower.endsWith(".epub")) format = "epub";
      else if (nameLower.endsWith(".pdf")) format = "pdf";
      else if (nameLower.endsWith(".txt")) format = "txt";
      handleStartParsing(file, format);
      e.target.value = "";
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleConfirmImport = async () => {
    if (!parsedBook) return;

    setState("SAVING");
    try {
      // 1. Save cover asset and any other image assets to AssetRepository
      if (parsedBook.assets && parsedBook.assets.length > 0) {
        for (const asset of parsedBook.assets) {
          await storageService.assets.saveAsset(asset);
        }
      }

      // 2. Create high level Book record
      const newBook: Book = {
        id: parsedBook.id,
        title: editedTitle.trim() || "Untitled Book",
        author: editedAuthor.trim() || "Unknown Author",
        format: fileFormat,
        chapterCount: parsedBook.chapters.length,
        coverUrl: coverPreviewUrl || undefined,
        createdAt: new Date().toISOString(),
      };

      // Update the title in parsedBook metadata just to keep them in sync
      parsedBook.metadata.title = newBook.title;
      parsedBook.metadata.author = newBook.author;

      // 3. Save records using Storage Facade
      await addBook(newBook);
      await storageService.parsedBooks.save(parsedBook);

      // 4. Initialize Reading Progress
      const initialProgress: ReadingProgress = {
        bookId: parsedBook.id,
        currentChapterIndex: 0,
        currentWordIndex: 0,
        lastOpened: new Date().toISOString(),
        completionPercentage: 0,
        bookmarks: [],
        highlights: [],
        notes: [],
        readingTime: 0,
      };
      await storageService.progress.save(initialProgress);

      setToastMessage("Book imported successfully!");
      setToastType("success");
      setShowToast(true);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      console.error("Storage Save Error:", err);
      setToastMessage("Failed to save book to IndexedDB storage.");
      setToastType("error");
      setShowToast(true);
      setState("PREVIEW");
    }
  };

  const handleCancelPreview = () => {
    if (coverPreviewUrl) {
      window.URL.revokeObjectURL(coverPreviewUrl);
      setCoverPreviewUrl(null);
    }
    setParsedBook(null);
    setState("IDLE");
  };

  return (
    <main className="pt-24 pb-20 md:pb-8 md:pl-72 px-space-md max-w-container-max mx-auto min-h-screen text-left bg-background text-on-background">
      <div className="max-w-[800px] mx-auto">
        {/* IDLE STATE */}
        {state === "IDLE" && (
          <>
            <div className="mb-space-xl">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                Import New Content
              </h2>
              <p className="text-on-surface-variant font-body-md">
                Add documents or raw text to your library to start speed
                reading.
              </p>
            </div>

            <SupportedFormatsCard onFormatSelect={handleFormatSelect} />
            <input
              type="file"
              ref={fileInputRef}
              accept={acceptFilter}
              className="hidden"
              onChange={handleFileChange}
            />
            <UploadDropzone onFileDrop={handleFileDrop} isProcessing={false} />
            <PasteTextCard onPasteText={handlePasteText} />
            <ImportHelpSection />
          </>
        )}

        {/* PARSING STATE */}
        {state === "PARSING" && (
          <div className="backdrop-blur-md bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[350px] shadow-2xl relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />

            <Loader2 className="h-12 w-12 text-cyan-500 animate-spin mb-6" />
            <h3 className="text-xl font-semibold mb-2">Ingesting Document</h3>
            <p className="text-zinc-400 text-sm mb-6">{statusText}</p>

            <div className="w-full max-w-md bg-zinc-800 rounded-full h-2.5 mb-8 overflow-hidden">
              <div
                className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={handleAbort}
              className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium border border-zinc-700 transition"
            >
              Cancel Import
            </button>
          </div>
        )}

        {/* PREVIEW STATE */}
        {state === "PREVIEW" && parsedBook && (
          <div className="backdrop-blur-md bg-surface-container-low/60 border border-border-subtle rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-subtle">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold text-on-surface">
                Document Preview
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Cover Column */}
              <div className="md:col-span-1 flex flex-col items-center justify-center bg-surface-container-lowest/60 border border-border-subtle rounded-xl p-4 min-h-[220px]">
                {coverPreviewUrl ? (
                  <img
                    src={coverPreviewUrl}
                    alt="Cover preview"
                    className="max-h-[180px] rounded shadow-md object-contain"
                  />
                ) : (
                  <div className="text-center text-zinc-500">
                    <FileText className="h-16 w-16 mx-auto mb-3 stroke-[1]" />
                    <span className="text-xs">No Cover Extracted</span>
                  </div>
                )}
              </div>

              {/* Editing Column */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Book Title
                  </label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-zinc-600 transition outline-none"
                    placeholder="Enter book title"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={editedAuthor}
                    onChange={(e) => setEditedAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder-zinc-600 transition outline-none"
                    placeholder="Enter author name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-surface-container-lowest/60 border border-border-subtle p-3 rounded-lg text-center">
                    <div className="text-zinc-500 text-xs uppercase font-medium">
                      Chapters
                    </div>
                    <div className="text-lg font-bold text-on-surface">
                      {parsedBook.chapters.length}
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest/60 border border-border-subtle p-3 rounded-lg text-center">
                    <div className="text-zinc-500 text-xs uppercase font-medium">
                      Word Count
                    </div>
                    <div className="text-lg font-bold text-on-surface">
                      {parsedBook.totalWords.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end border-t border-zinc-800 pt-6">
              <button
                onClick={handleCancelPreview}
                className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium border border-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-semibold text-sm transition shadow-lg shadow-cyan-950/20"
              >
                Add to Library
              </button>
            </div>
          </div>
        )}

        {/* SAVING STATE */}
        {state === "SAVING" && (
          <div className="backdrop-blur-md bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] shadow-2xl">
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-6" />
            <h3 className="text-xl font-semibold mb-2">Saving to Library</h3>
            <p className="text-zinc-400 text-sm">
              Persisting document indices to local IndexedDB...
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {state === "ERROR" && (
          <div className="backdrop-blur-md bg-surface-container-low/60 border border-border-subtle rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-6 pb-4 border-b border-border-subtle">
              <ShieldAlert className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="text-xl font-semibold text-on-surface">
                  Parser Exception
                </h3>
                <span className="text-xs text-red-400 uppercase tracking-wider font-semibold font-mono">
                  {errorType}
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest/60 border border-red-950/40 rounded-xl p-6 text-on-surface-variant text-sm mb-8 leading-relaxed">
              {errorMessage}
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setState("IDLE")}
                className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium border border-zinc-700 transition"
              >
                Close
              </button>
              <button
                onClick={() => setState("IDLE")}
                className="px-6 py-2.5 rounded-lg bg-red-950/30 hover:bg-red-950/50 text-red-400 text-sm font-semibold border border-red-900/40 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        type={toastType === "info" ? "success" : toastType}
        onClose={() => setShowToast(false)}
      />
    </main>
  );
}
