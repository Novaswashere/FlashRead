import React from "react";
import { cn } from "@/lib/utils";

export interface BookCoverProps {
  title: string;
  coverUrl?: string;
  progressPercent?: number;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  coverUrl,
  progressPercent,
  className
}) => {
  return (
    <div
      className={cn(
        "relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-surface-container flex items-center justify-center",
        className
      )}
    >
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={`Cover of ${title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="material-symbols-outlined text-outline text-3xl mb-1">book</span>
          <span className="text-xs font-semibold text-on-surface-variant line-clamp-2">{title}</span>
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
