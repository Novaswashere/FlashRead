"use client";

import React, { useState } from "react";
import { MOCK_USER } from "@/mocks/user";
import { MOCK_SETTINGS } from "@/mocks/settings";
import { ThemeSection } from "@/features/settings/components/ThemeSection";
import { FontSection } from "@/features/settings/components/FontSection";
import { ReaderSection } from "@/features/settings/components/ReaderSection";
import { AccessibilitySection } from "@/features/settings/components/AccessibilitySection";
import { ProfileSection } from "@/features/settings/components/ProfileSection";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsPage() {
  const { setTheme } = useTheme();

  // Local settings states populated from mocks
  const [wpm, setWpm] = useState(MOCK_SETTINGS.defaultWPM);
  const [orpEnabled, setOrpEnabled] = useState(MOCK_SETTINGS.orpEnabled);
  const [smartPauseEnabled, setSmartPauseEnabled] = useState(
    MOCK_SETTINGS.smartPauseEnabled
  );
  const [themeValue, setThemeValue] = useState<"light" | "dark" | "system">(
    "light"
  );
  const [fontFamily, setFontFamily] = useState<
    "Inter" | "Open Sans" | "Merriweather" | "JetBrains Mono"
  >("Inter");
  const [fontSize, setFontSize] = useState(MOCK_SETTINGS.fontSize);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReaderOptimized, setScreenReaderOptimized] = useState(false);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setThemeValue(newTheme);
    setTheme(newTheme);
  };

  const handleSignOut = () => {
    console.log("Mock signing out...");
  };

  return (
    <main className="md:ml-64 pt-24 pb-24 px-space-md md:px-space-xl min-h-screen max-w-reader-width mx-auto text-left">
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
              defaultWpm={wpm}
              orpEnabled={orpEnabled}
              smartPauseEnabled={smartPauseEnabled}
              onWpmChange={setWpm}
              onOrpChange={setOrpEnabled}
              onSmartPauseChange={setSmartPauseEnabled}
            />
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h3 className="font-label-mono text-label-mono text-primary uppercase tracking-wider mb-space-sm">
            Appearance
          </h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden divide-y divide-border-subtle">
            <ThemeSection
              currentTheme={themeValue}
              onThemeChange={handleThemeChange}
            />
            <FontSection
              currentFont={fontFamily}
              currentFontSize={fontSize}
              onFontChange={setFontFamily}
              onFontSizeChange={setFontSize}
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
              reducedMotion={reducedMotion}
              screenReaderOptimized={screenReaderOptimized}
              onReducedMotionChange={setReducedMotion}
              onScreenReaderChange={setScreenReaderOptimized}
            />
          </div>
        </section>

        {/* Account */}
        <section>
          <h3 className="font-label-mono text-label-mono text-primary uppercase tracking-wider mb-space-sm">
            Account
          </h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden divide-y divide-border-subtle">
            <ProfileSection user={MOCK_USER} onSignOut={handleSignOut} />
          </div>
        </section>

        <div className="pt-space-xl pb-space-lg text-center">
          <p className="text-xs text-outline font-label-mono">
            FlashRead v2.4.0 • Build 829
          </p>
        </div>
      </div>
    </main>
  );
}
