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
import { useToast } from "@/providers/ToastProvider";
import { mapError, MappedError } from "@/lib/errorMapper";
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
  const [mappedError, setMappedError] = useState<MappedError | null>(null);
  const { showToast: showGlobalToast } = useToast();

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

  // Recent Queue (read-only decorative list)
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);

  // Cleanup Object URLs on unmount
  useEffect(() => {
    return () => {
      if (coverPreviewUrl) {
        window.URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [coverPreviewUrl]);

  // Load recent imports for the decorative Recent Queue (read-only, best-effort)
  useEffect(() => {
    let mounted = true;
    storageService.books
      .getAll()
      .then((books) => {
        if (!mounted) return;
        const sorted = [...books]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);
        setRecentBooks(sorted);
      })
      .catch(() => {
        // Recent queue is decorative; ignore failures silently.
      });
    return () => {
      mounted = false;
    };
  }, []);

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
      const code = err.code || "UNKNOWN_ERROR";
      const msg = err.message || "";
      setErrorType(code);
      setErrorMessage(msg);

      const mapped = mapError(code, msg);
      setMappedError(mapped);
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
        coverAssetId: parsedBook.metadata.coverAssetId || undefined,
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

      showGlobalToast("Book imported successfully!", "success");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      console.error("Storage Save Error:", err);
      showGlobalToast("Failed to save book to IndexedDB storage.", "error");
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
    <main className="pt-24 pb-20 md:pb-8 md:pl-72 px-margin-mobile md:px-xl max-w-container-max mx-auto min-h-screen text-left bg-background text-on-background">
      <div className="max-w-[800px] mx-auto">
        {/* IDLE STATE */}
        {state === "IDLE" && (
          <>
            <div className="mb-xl max-w-2xl animate-fade-in-up">
              <h1 className="font-headline-xl text-headline-xl text-on-background tracking-tight mb-sm">
                Add Your Books
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Import your reading material to start speed reading. We support EPUB, PDF, TXT files, and direct text paste.
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

            {/* Recent Queue — read-only decorative list of recent imports */}
            {recentBooks.length > 0 && (
              <section className="mt-xl animate-fade-in-up stagger-4">
                <div className="flex items-center justify-between mb-md border-b border-outline-variant/10 pb-sm">
                  <h2 className="font-headline-md text-headline-md text-on-background">
                    Recently Imported
                  </h2>
                </div>
                <div className="space-y-sm">
                  {recentBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between p-md bg-surface-container-low/50 rounded-lg border border-outline-variant/10"
                    >
                      <div className="flex items-center gap-md min-w-0">
                        <div className="w-10 h-10 bg-surface-container-high rounded flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-on-surface-variant">
                            menu_book
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-label-md text-label-md text-on-background truncate">
                            {book.title}
                          </p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">
                            {book.format.toUpperCase()} •{" "}
                            {new Date(book.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        className="p-xs hover:bg-surface-container-high rounded transition-colors shrink-0"
                        aria-label="More options"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant">
                          more_vert
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* PARSING STATE */}
        {state === "PARSING" && (
          <div className="glass-card rounded-xl p-xl flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden text-on-surface">
            <div
              className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />

            <Loader2 className="h-12 w-12 text-primary animate-spin mb-lg" />
            <h3 className="font-headline-md text-headline-md mb-sm">
              Processing Your Book
            </h3>
            <p className="text-on-surface-variant font-body-md mb-lg">
              {statusText}
            </p>

            <div className="w-full max-w-md bg-surface-container-high rounded-full h-2.5 mb-xl overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={handleAbort}
              className="px-lg py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* PREVIEW STATE */}
        {state === "PREVIEW" && parsedBook && (
          <div className="glass-card rounded-xl p-xl">
            <div className="flex items-center gap-3 mb-lg pb-sm border-b border-outline-variant/30">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Review Your Book
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
              {/* Cover Column */}
              <div className="md:col-span-1 flex flex-col items-center justify-center bg-surface-container-lowest/60 border border-outline-variant/30 rounded-xl p-md min-h-[220px]">
                {coverPreviewUrl ? (
                  <img
                    src={coverPreviewUrl}
                    alt="Cover preview"
                    className="max-h-[180px] rounded-lg border border-outline-variant/30 object-contain"
                  />
                ) : (
                  <div className="text-center text-on-surface-variant">
                    <FileText className="h-16 w-16 mx-auto mb-3 stroke-[1]" />
                    <span className="font-label-sm text-label-sm">
                      No Cover Extracted
                    </span>
                  </div>
                )}
              </div>

              {/* Editing Column */}
              <div className="md:col-span-2 space-y-md">
                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-xs">
                    Book Title
                  </label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-md py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md placeholder-outline transition outline-none"
                    placeholder="Enter book title"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-xs">
                    Author
                  </label>
                  <input
                    type="text"
                    value={editedAuthor}
                    onChange={(e) => setEditedAuthor(e.target.value)}
                    className="w-full px-md py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md placeholder-outline transition outline-none"
                    placeholder="Enter author name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-md pt-xs">
                  <div className="bg-surface-container-lowest/60 border border-outline-variant/30 p-md rounded-lg text-center">
                    <div className="text-on-surface-variant font-label-sm text-label-sm uppercase font-medium">
                      Chapters
                    </div>
                    <div className="text-lg font-bold text-on-surface">
                      {parsedBook.chapters.length}
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest/60 border border-outline-variant/30 p-md rounded-lg text-center">
                    <div className="text-on-surface-variant font-label-sm text-label-sm uppercase font-medium">
                      Word Count
                    </div>
                    <div className="text-lg font-bold text-on-surface">
                      {parsedBook.totalWords.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-md justify-end border-t border-outline-variant/30 pt-lg">
              <button
                onClick={handleCancelPreview}
                className="px-lg py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-lg py-2.5 rounded-lg bg-primary text-on-primary hover:brightness-110 font-semibold font-label-md text-label-md transition cursor-pointer"
              >
                Add to Library
              </button>
            </div>
          </div>
        )}

        {/* SAVING STATE */}
        {state === "SAVING" && (
          <div className="glass-card rounded-xl p-xl flex flex-col items-center justify-center min-h-[300px] text-on-surface">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-lg" />
            <h3 className="font-headline-md text-headline-md mb-sm">
              Adding to Your Library
            </h3>
            <p className="text-on-surface-variant font-body-md">
              Almost there...
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {state === "ERROR" && mappedError && (
          <div className="glass-card rounded-xl p-xl text-on-surface animate-fade-in-up">
            <div className="flex items-center gap-3 text-error mb-lg pb-sm border-b border-outline-variant/30">
              <ShieldAlert className="h-8 w-8 text-error shrink-0" />
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  {mappedError.title}
                </h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold block mt-0.5">
                  Error Code: {errorType}
                </span>
              </div>
            </div>

            <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-lg mb-xl">
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                {mappedError.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-sm justify-end border-t border-outline-variant/30 pt-lg">
              <button
                onClick={() => {
                  setMappedError(null);
                  setState("IDLE");
                  router.push("/");
                }}
                className="px-lg py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                Return to Dashboard
              </button>

              <button
                onClick={() => {
                  setMappedError(null);
                  setState("IDLE");
                }}
                className="px-lg py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md border border-outline-variant/30 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                Try Again
              </button>

              <button
                onClick={() => {
                  setMappedError(null);
                  setState("IDLE");
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                className="px-lg py-2.5 rounded-lg bg-primary text-on-primary hover:brightness-110 font-bold font-label-md text-label-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                Choose Another File
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
