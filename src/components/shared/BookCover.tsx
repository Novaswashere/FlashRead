import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { storageService } from "@/services/storage";

export interface BookCoverProps {
  title: string;
  coverUrl?: string;
  coverAssetId?: string;
  progressPercent?: number;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  coverUrl,
  coverAssetId,
  progressPercent,
  className,
}) => {
  const [resolvedCoverUrl, setResolvedCoverUrl] = useState<string | undefined>(coverUrl);

  useEffect(() => {
    if (coverAssetId) {
      let active = true;
      async function loadAssetUrl() {
        try {
          const url = await storageService.assets.getAssetUrl(coverAssetId);
          if (url && active) {
            setResolvedCoverUrl(url);
          }
        } catch (e) {
          console.error("Failed to load cover asset URL:", e);
        }
      }
      loadAssetUrl();
      return () => {
        active = false;
      };
    } else {
      setResolvedCoverUrl(coverUrl);
    }
  }, [coverAssetId, coverUrl]);

  return (
    <div
      className={cn(
        "relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-surface-container flex items-center justify-center",
        className
      )}
    >
      {resolvedCoverUrl ? (
        <img
          src={resolvedCoverUrl}
          alt={`Cover of ${title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="material-symbols-outlined text-outline text-3xl mb-1">
            book
          </span>
          <span className="text-xs font-semibold text-on-surface-variant line-clamp-2">
            {title}
          </span>
        </div>
      )}
      {progressPercent !== undefined && progressPercent > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
          <div
            className="h-full bg-primary"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};
