"use client";

import React, { useState } from "react";
import { useReader } from "@/features/reader/hooks/useReader";
import { useSettings } from "@/features/settings/hooks/useSettings";

export default function ReaderPage() {
  const { isPlaying, wpm, setWpm, play, pause } = useReader();
  const { settings } = useSettings();
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);
  const [tempWpm, setTempWpm] = useState(wpm || 350);

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleOpenSpeedModal = () => {
    setTempWpm(wpm);
    setIsSpeedModalOpen(true);
  };

  const handleApplySpeed = () => {
    setWpm(tempWpm);
    setIsSpeedModalOpen(false);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col overflow-hidden md:pl-64">
      {/* Top App Bar (Header) */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle md:pr-64">
        <div className="flex items-center justify-between px-space-lg h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-space-md">
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors active:scale-95">
              arrow_back
            </button>
            <div className="flex flex-col">
              <h1 className="font-headline-md text-[18px] leading-none text-on-surface">The Great Gatsby</h1>
              <p className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
                Chapter III • 12% Complete
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
              text_fields
            </button>
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
              more_vert
            </button>
          </div>
        </div>
      </header>

      {/* Main RSVP Canvas */}
      <main className="flex-grow flex items-center justify-center relative px-space-md pt-16">
        <div className="max-w-reader-width w-full h-96 flex flex-col items-center justify-center relative">
          {/* Focus Crosshairs (Subtle Visual Guides) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-full h-px bg-border-subtle opacity-30"></div>
            <div className="orp-marker absolute h-full flex items-center justify-center"></div>
          </div>
          {/* The Word Display */}
          <div className="relative z-10 select-none cursor-pointer group" id="rsvp-container" onClick={togglePlay}>
            <div className="flex font-display-rsvp text-display-rsvp-mobile md:text-display-rsvp tracking-tight">
              <span className="text-on-surface">Sophis</span>
              <span className="text-orp-highlight">t</span>
              <span className="text-on-surface">ication</span>
            </div>
          </div>
          {/* Transition Shadow Effect */}
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary/20 blur-xl transition-opacity duration-300 ${
              isPlaying ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        </div>
      </main>

      {/* Controls Dock */}
      <footer className="fixed bottom-space-xl left-1/2 -translate-x-1/2 w-full max-w-[600px] px-space-md z-50">
        <div className="glass-dock rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
          {/* Scrubbing/Progress Bar */}
          <div className="group relative px-2">
            <div className="flex justify-between mb-2">
              <span className="font-label-mono text-on-surface-variant">04:12</span>
              <span className="font-label-mono text-on-surface-variant">18:45 remaining</span>
            </div>
            <input className="w-full h-1" max="100" min="0" type="range" defaultValue="12" />
          </div>
          {/* Playback Controls Cluster */}
          <div className="flex items-center justify-between">
            {/* Speed Display */}
            <button
              className="flex flex-col items-start hover:bg-surface-container-low px-3 py-1 rounded-lg transition-colors active:scale-95"
              onClick={handleOpenSpeedModal}
            >
              <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">Speed</span>
              <div className="flex items-baseline gap-1">
                <span className="font-label-mono text-lg text-primary font-bold">{wpm}</span>
                <span className="font-label-mono text-[10px] text-on-surface-variant">WPM</span>
              </div>
            </button>
            {/* Center Controls */}
            <div className="flex items-center gap-space-lg">
              <button
                className="material-symbols-outlined text-on-surface-variant text-2xl hover:text-primary transition-colors active:scale-90"
                title="Skip Back"
              >
                replay_10
              </button>
              <button
                className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary-container transition-all active:scale-95"
                onClick={togglePlay}
              >
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
              </button>
              <button
                className="material-symbols-outlined text-on-surface-variant text-2xl hover:text-primary transition-colors active:scale-90"
                title="Skip Forward"
              >
                forward_10
              </button>
            </div>
            {/* Session Stats */}
            <div className="flex flex-col items-end px-3">
              <span class="font-label-mono text-[10px] text-on-surface-variant uppercase">Progress</span>
              <span class="font-label-mono text-lg text-on-surface">
                1.2k<span class="text-[10px] text-on-surface-variant font-normal ml-1">words</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* WPM Adjustment Modal */}
      {isSpeedModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/10 backdrop-blur-sm z-[60] flex items-center justify-center transition-opacity duration-200">
          <div className="bg-surface-container-lowest p-space-xl rounded-xl border border-border-subtle shadow-xl w-80 relative">
            <button
              onClick={() => setIsSpeedModalOpen(false)}
              className="absolute top-4 right-4 material-symbols-outlined text-on-surface-variant hover:text-on-surface text-xl cursor-pointer"
            >
              close
            </button>
            <h3 className="font-headline-md text-center mb-space-lg">Adjust Reading Speed</h3>
            <div className="flex flex-col gap-space-md">
              <input
                className="w-full"
                max="1000"
                min="100"
                step="50"
                type="range"
                value={tempWpm}
                onChange={(e) => setTempWpm(parseInt(e.target.value))}
              />
              <div className="text-center">
                <span className="font-display-rsvp text-4xl text-primary">{tempWpm}</span>
                <span className="font-label-mono ml-2">WPM</span>
              </div>
              <button
                className="mt-space-lg w-full bg-primary text-on-primary py-3 rounded-full font-bold active:scale-95 transition-transform"
                onClick={handleApplySpeed}
              >
                Apply Speed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
