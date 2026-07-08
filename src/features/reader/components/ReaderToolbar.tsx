import React from "react";

export interface ReaderToolbarProps {
  title: string;
  chapterLabel: string;
  onBackClick: () => void;
  onTextSettingsClick?: () => void;
  onMoreActionsClick?: () => void;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  title,
  chapterLabel,
  onBackClick,
  onTextSettingsClick,
  onMoreActionsClick,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md md:pl-64">
      <div className="flex items-center justify-between px-space-lg h-16 max-w-container-max mx-auto">
        <div className="flex items-center gap-space-md">
          <button
            onClick={onBackClick}
            className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors active:scale-95 cursor-pointer"
          >
            arrow_back
          </button>
          <div className="flex flex-col text-left">
            <h1 className="font-headline-md text-[18px] leading-none text-on-surface line-clamp-1">
              {title}
            </h1>
            <p className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
              {chapterLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <button
            onClick={onTextSettingsClick}
            className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors cursor-pointer"
          >
            text_fields
          </button>
          <button
            onClick={onMoreActionsClick}
            className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors cursor-pointer"
          >
            more_vert
          </button>
        </div>
      </div>
    </header>
  );
};
