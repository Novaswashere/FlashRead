"use client";

import React, { useState, useEffect } from "react";

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
  const [showSettingsHint, setShowSettingsHint] = useState(false);
  const [showPlaybackHint, setShowPlaybackHint] = useState(false);

  useEffect(() => {
    // Show hints after 3 seconds if user hasn't interacted with settings
    const settingsHintTimer = setTimeout(() => {
      const hasSeenSettingsHint = localStorage.getItem("readpilot_settings_hint_seen");
      if (!hasSeenSettingsHint) {
        setShowSettingsHint(true);
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowSettingsHint(false);
          localStorage.setItem("readpilot_settings_hint_seen", "true");
        }, 5000);
      }
    }, 3000);

    const playbackHintTimer = setTimeout(() => {
      const hasSeenPlaybackHint = localStorage.getItem("readpilot_playback_hint_seen");
      if (!hasSeenPlaybackHint) {
        setShowPlaybackHint(true);
        setTimeout(() => {
          setShowPlaybackHint(false);
          localStorage.setItem("readpilot_playback_hint_seen", "true");
        }, 5000);
      }
    }, 4000);

    return () => {
      clearTimeout(settingsHintTimer);
      clearTimeout(playbackHintTimer);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
      <div className="flex items-center justify-between px-margin-mobile md:px-lg h-16 max-w-container-max mx-auto">
        <div className="flex items-center gap-md">
          <button
            onClick={onBackClick}
            className="material-symbols-outlined text-primary hover:bg-surface-container-high/50 p-2 rounded-full transition-colors active:scale-95 cursor-pointer"
            aria-label="Back"
          >
            arrow_back
          </button>
          <div className="flex flex-col text-left">
            <h1 className="font-headline-md text-[18px] leading-none text-on-surface line-clamp-1">
              {title}
            </h1>
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-widest mt-1">
              {chapterLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <div className="relative">
            <button
              onClick={() => {
                onTextSettingsClick?.();
                setShowSettingsHint(false);
              }}
              className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high/50 p-2 rounded-full transition-colors cursor-pointer relative"
              aria-label="Appearance settings"
            >
              text_fields
            </button>
            {showSettingsHint && (
              <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg animate-fade-in-up z-50">
                Customize fonts & themes
                <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-px w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-primary" />
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => {
                onMoreActionsClick?.();
                setShowPlaybackHint(false);
              }}
              className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high/50 p-2 rounded-full transition-colors cursor-pointer relative"
              aria-label="Playback settings"
            >
              more_vert
            </button>
            {showPlaybackHint && (
              <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg animate-fade-in-up z-50">
                Adjust speed & ORP
                <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-px w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
