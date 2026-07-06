"use client";

import React, { useState } from "react";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();

  const [wpm, setWpm] = useState(settings.defaultWPM);
  const [fontSize, setFontSize] = useState(settings.fontSize);

  const handleWpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 350;
    setWpm(val);
    updateSettings({ defaultWPM: val });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 48;
    setFontSize(val);
    updateSettings({ fontSize: val });
  };

  return (
    <main className="md:ml-64 pt-24 pb-24 px-space-md md:px-space-xl min-h-screen max-w-reader-width mx-auto">
      <div className="mb-space-xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Settings</h2>
        <p className="text-on-surface-variant mt-2">Configure your personalized rapid reading environment.</p>
      </div>

      <div className="space-y-space-xl">
        {/* Reading Experience Section */}
        <section>
          <h3 className="font-label-mono text-label-mono text-primary uppercase tracking-wider mb-space-sm">
            Reading Experience
          </h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden divide-y divide-border-subtle">
            {/* WPM Setting */}
            <div className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-space-md">
                <span className="material-symbols-outlined text-secondary">speed</span>
                <div>
                  <p className="font-medium">Words Per Minute (WPM)</p>
                  <p className="text-xs text-on-surface-variant">Adjust your target reading speed</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="w-20 px-3 py-1 border border-border-subtle rounded-lg font-label-mono text-center focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-transparent"
                  type="number"
                  value={wpm}
                  onChange={handleWpmChange}
                />
                <span className="text-xs font-label-mono text-on-surface-variant">WPM</span>
              </div>
            </div>

            {/* ORP Toggle */}
            <label className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className="flex items-center gap-space-md">
                <span className="material-symbols-outlined text-orp-highlight">format_paint</span>
                <div>
                  <p className="font-medium">ORP Highlight</p>
                  <p className="text-xs text-on-surface-variant">Highlight the Optimal Recognition Point in red</p>
                </div>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only ios-toggle"
                  checked={settings.orpEnabled}
                  onChange={(e) => updateSettings({ orpEnabled: e.target.checked })}
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full transition-colors toggle-bg"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform toggle-dot"></div>
              </div>
            </label>

            {/* Smart Pause */}
            <label className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className="flex items-center gap-space-md">
                <span className="material-symbols-outlined text-secondary">pause_circle</span>
                <div>
                  <p className="font-medium">Smart Pause</p>
                  <p className="text-xs text-on-surface-variant">
                    Pause automatically at punctuations and paragraph ends
                  </p>
                </div>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only ios-toggle"
                  checked={settings.smartPauseEnabled}
                  onChange={(e) => updateSettings({ smartPauseEnabled: e.target.checked })}
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full transition-colors toggle-bg"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform toggle-dot"></div>
              </div>
            </label>
          </div>
        </section>

        {/* Appearance Section */}
        <section>
          <h3 className="font-label-mono text-label-mono text-primary uppercase tracking-wider mb-space-sm">
            Appearance
          </h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden divide-y divide-border-subtle">
            {/* Theme Selector */}
            <div className="p-space-md flex flex-col gap-space-md">
              <div className="flex items-center gap-space-md">
                <span className="material-symbols-outlined text-secondary">contrast</span>
                <p className="font-medium">Interface Theme</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 ${
                    theme === "light" ? "border-primary bg-primary-container/10" : "border-border-subtle hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined">light_mode</span>
                  <span className="text-xs font-medium">Light</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 ${
                    theme === "dark" ? "border-primary bg-primary-container/10" : "border-border-subtle hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined">dark_mode</span>
                  <span className="text-xs font-medium">Dark</span>
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 ${
                    theme === "system" ? "border-primary bg-primary-container/10" : "border-border-subtle hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined">settings_brightness</span>
                  <span className="text-xs font-medium">System</span>
                </button>
              </div>
            </div>

            {/* Font Selector */}
            <div className="p-space-md flex flex-col gap-space-md">
              <div className="flex items-center gap-space-md">
                <span className="material-symbols-outlined text-secondary">font_download</span>
                <p className="font-medium">Reading Font</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Inter", "Open Sans", "Merriweather", "JetBrains Mono"].map((fontOpt) => {
                  const isSelected = settings.font === fontOpt;
                  return (
                    <button
                      key={fontOpt}
                      onClick={() => updateSettings({ font: fontOpt as any })}
                      className={`px-4 py-2 rounded-lg border-2 ${
                        isSelected ? "border-primary font-bold" : "border-border-subtle hover:bg-surface-container-low"
                      }`}
                    >
                      {fontOpt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size */}
            <div className="p-space-md flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-md">
                  <span className="material-symbols-outlined text-secondary">format_size</span>
                  <p className="font-medium">Font Size</p>
                </div>
                <span className="text-xs font-label-mono text-primary font-bold">{fontSize}px</span>
              </div>
              <input
                type="range"
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                max="96"
                min="16"
                value={fontSize}
                onChange={handleFontSizeChange}
              />
            </div>
          </div>
        </section>

        {/* Account Section */}
        <section>
          <h3 className="font-label-mono text-label-mono text-primary uppercase tracking-wider mb-space-sm">
            Account
          </h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden divide-y divide-border-subtle">
            <div className="p-space-md flex items-center justify-between">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover"
                    alt="User headshot profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgRgsP0ljZmdxeZ7rjg-9aFLB7ZAegxADAwSyfnZv_GrwbmuW1grGH6lDStNzO4GdOmr4-p2ZVNMsJ3HGMtM-rPafWhIgqtXsvZdv5jBtBPGLuXmRw59yKE6x4lbBb3FoZyjl__j9JW9x0YhLi77VTV3CQ-8W0ekt26wxa1KfG7Eg5dYakfEE6_7GSfICU9QpRZlrVBl26pFp9egipT0jtxHHZ79-bDBogh8xp39nUb3gfsTKQbYKM0GuKoAqSvx7vXgP6tGwAYoju"
                  />
                </div>
                <div>
                  <p className="font-bold">Alex Thorne</p>
                  <p className="text-xs text-on-surface-variant">alex.thorne@minimalist.io</p>
                </div>
              </div>
              <button className="text-primary text-sm font-bold hover:underline">Edit</button>
            </div>
            <a className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors" href="#">
              <div className="flex items-center gap-space-md">
                <span className="material-symbols-outlined text-secondary">sync</span>
                <p className="font-medium">Cloud Synchronization</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </a>
            <a className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors" href="#">
              <div className="flex items-center gap-space-md text-error">
                <span className="material-symbols-outlined">logout</span>
                <p className="font-medium">Sign Out</p>
              </div>
            </a>
          </div>
        </section>

        <div className="pt-space-xl pb-space-lg text-center">
          <p className="text-xs text-outline font-label-mono">FlashRead v2.4.0 • Build 829</p>
        </div>
      </div>
    </main>
  );
}
