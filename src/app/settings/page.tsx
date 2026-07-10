"use client";

import React from "react";
import { ThemeSection } from "@/features/settings/components/ThemeSection";
import { FontSection } from "@/features/settings/components/FontSection";
import { ReaderSection } from "@/features/settings/components/ReaderSection";
import { AccessibilitySection } from "@/features/settings/components/AccessibilitySection";
import { PreviewSection } from "@/features/settings/components/PreviewSection";
import { useTheme } from "@/hooks/useTheme";
import { useSettingsContext } from "@/providers/SettingsProvider";
import { Settings } from "@/types";

export default function SettingsPage() {
  const { setTheme } = useTheme();
  const { settings, updateSettings } = useSettingsContext();
  
  // Local draft state for tracking configurations before saving
  const [draftSettings, setDraftSettings] = React.useState<Settings>(settings);

  // Sync draft settings with hydrated settings from local storage
  React.useEffect(() => {
    setDraftSettings(settings);
  }, [settings]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("flashread_settings_visited", "true");
    }
  }, []);

  const handleDraftChange = (changed: Partial<Settings>) => {
    setDraftSettings((prev) => ({ ...prev, ...changed }));
  };

  const handleSave = () => {
    // Apply changes globally
    setTheme(draftSettings.theme);
    updateSettings(draftSettings);
  };

  const handleCancel = () => {
    // Reset draft to current saved settings
    setDraftSettings(settings);
  };

  const isDirty = JSON.stringify(draftSettings) !== JSON.stringify(settings);

  return (
    <main className="md:ml-64 pt-24 pb-32 px-space-md md:px-space-xl min-h-screen max-w-reader-width mx-auto text-left relative">
      <div className="mb-space-xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Settings
        </h2>
        <p className="text-on-surface-variant mt-2">
          Configure your personalized rapid reading environment.
        </p>
      </div>

      <div className="space-y-space-xl">
        {/* Reading Experience */}
        <section>
          <h3 className="font-label-mono text-label-mono text-primary uppercase tracking-wider mb-space-sm">
            Reading Experience
          </h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden divide-y divide-border-subtle">
            <ReaderSection
              defaultWpm={draftSettings.defaultWPM}
              orpEnabled={draftSettings.orpEnabled}
              smartPauseEnabled={draftSettings.smartPauseEnabled}
              onWpmChange={(wpm) => handleDraftChange({ defaultWPM: wpm })}
              onOrpChange={(orp) => handleDraftChange({ orpEnabled: orp })}
              onSmartPauseChange={(smartPause) => handleDraftChange({ smartPauseEnabled: smartPause })}
            />
          </div>
        </section>

        {/* Preview */}
        <section>
          <h3 className="font-label-mono text-label-mono text-primary uppercase tracking-wider mb-space-sm">
            Preview
          </h3>
          <PreviewSection
            font={draftSettings.font}
            fontSize={draftSettings.fontSize}
            orpEnabled={draftSettings.orpEnabled}
          />
        </section>

        {/* Appearance */}
        <section>
          <h3 className="font-label-mono text-label-mono text-primary uppercase tracking-wider mb-space-sm">
            Appearance
          </h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden divide-y divide-border-subtle">
            <ThemeSection
              currentTheme={draftSettings.theme}
              onThemeChange={(theme) => handleDraftChange({ theme })}
            />
            <FontSection
              currentFont={draftSettings.font}
              currentFontSize={draftSettings.fontSize}
              onFontChange={(font) => handleDraftChange({ font })}
              onFontSizeChange={(size) => handleDraftChange({ fontSize: size })}
            />
          </div>
        </section>

        {/* Accessibility */}
        <section>
          <h3 className="font-label-mono text-label-mono text-primary uppercase tracking-wider mb-space-sm">
            Accessibility
          </h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden divide-y divide-border-subtle">
            <AccessibilitySection
              reducedMotion={draftSettings.reducedMotion}
              screenReaderOptimized={draftSettings.screenReaderOptimized}
              onReducedMotionChange={(reduced) => handleDraftChange({ reducedMotion: reduced })}
              onScreenReaderChange={(sr) => handleDraftChange({ screenReaderOptimized: sr })}
            />
          </div>
        </section>

        <div className="pt-space-xl pb-space-lg text-center">
          <p className="text-xs text-outline font-label-mono">
            FlashRead v2.4.0 • Build 829
          </p>
        </div>
      </div>

      {/* Floating Save/Cancel Action Bar */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-surface-container-high/90 dark:bg-surface-container-high/95 backdrop-blur-md border border-border-subtle rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
            <div className="text-left">
              <p className="font-bold text-on-surface text-sm">Unsaved Changes</p>
              <p className="text-xs text-on-surface-variant">You have configured updates that aren&apos;t saved yet.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-bold text-on-surface hover:bg-surface-container-lowest border border-border-subtle rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
