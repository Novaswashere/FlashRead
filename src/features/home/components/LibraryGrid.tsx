import React, { useState, useEffect } from "react";
import { Book } from "@/types";
import { storageService } from "@/services/storage";
import { cn } from "@/lib/utils";

export interface LibraryGridProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

/** Formats an ISO timestamp as a short relative label ("" if unparseable). */
function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  if (diffMs < 0) return "Just now";
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "Yesterday";
  if (day < 7) return `${day} days ago`;
  const wk = Math.floor(day / 7);
  return `${wk}w ago`;
}

/** Resolves a book cover asset (or url) and renders a fill image / token fallback. */
const CoverThumb: React.FC<{
  coverUrl?: string;
  coverAssetId?: string;
  className?: string;
}> = ({ coverUrl, coverAssetId, className }) => {
  const [url, setUrl] = useState<string | undefined>(coverUrl);

  useEffect(() => {
    let active = true;
    if (coverAssetId) {
      storageService.assets
        .getAssetUrl(coverAssetId)
        .then((u) => {
          if (active && u) setUrl(u);
        })
        .catch(() => {
          /* graceful: keep fallback */
        });
    } else {
      setUrl(coverUrl);
    }
    return () => {
      active = false;
    };
  }, [coverAssetId, coverUrl]);

  if (url) {
    return (
      <div
        className={cn(className, "bg-cover bg-center")}
        style={{ backgroundImage: `url(${url})` }}
        aria-hidden
      />
    );
  }
  return (
    <div
      className={cn(
        className,
        "bg-gradient-to-br from-primary/20 to-surface-dim flex items-center justify-center"
      )}
    >
      <span className="material-symbols-outlined text-on-surface-variant opacity-50 text-xl">
        menu_book
      </span>
    </div>
  );
};

export const LibraryGrid: React.FC<LibraryGridProps> = ({
  books,
  onSelectBook,
}) => {
  const [lastOpenedMap, setLastOpenedMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      const map: Record<string, string> = {};
      for (const b of books) {
        try {
          const p = await storageService.progress.getById(b.id);
          if (p?.lastOpened) map[b.id] = p.lastOpened;
        } catch {
          /* graceful: leave blank */
        }
      }
      if (active) setLastOpenedMap(map);
    })();
    return () => {
      active = false;
    };
  }, [books]);

  return (
    <section className="animate-fade-in-up stagger-4">
      <div className="flex items-center justify-between mb-md">
        <h2 className="font-headline-md text-headline-md font-bold tracking-tight">
          My Library
        </h2>
        <a
          href="/library"
          className="text-primary font-label-md text-label-md hover:underline"
        >
          View All
        </a>
      </div>
      <div className="space-y-xs">
        {books.map((book) => {
          const last = lastOpenedMap[book.id];
          return (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="flex items-center gap-md p-md rounded-lg hover:bg-surface-dim border-b border-outline/5 group cursor-pointer transition-colors"
            >
              <CoverThumb
                coverUrl={book.coverUrl}
                coverAssetId={book.coverAssetId}
                className="w-12 h-16 rounded shrink-0 bg-surface-dim"
              />
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md font-bold truncate text-on-surface">
                  {book.title}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                  {book.author}
                </p>
              </div>
              <div className="hidden md:flex flex-col items-end gap-1 px-md text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Last read
                </span>
                <span className="font-label-sm text-label-sm text-on-surface">
                  {last ? formatRelative(last) : "—"}
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
