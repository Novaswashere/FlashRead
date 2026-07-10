"use client";

import React from "react";
import { MOCK_USER } from "@/mocks/user";
import { ThemeSection } from "@/features/settings/components/ThemeSection";
import { FontSection } from "@/features/settings/components/FontSection";
import { ReaderSection } from "@/features/settings/components/ReaderSection";
import { AccessibilitySection } from "@/features/settings/components/AccessibilitySection";
import { ProfileSection } from "@/features/settings/components/ProfileSection";
import { PreviewSection } from "@/features/settings/components/PreviewSection";
import { useTheme } from "@/hooks/useTheme";
import { useSettingsContext } from "@/providers/SettingsProvider";

export default function SettingsPage() {
  const { setTheme } = useTheme();
  const { settings, updateSettings } = useSettingsContext();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("flashread_settings_visited", "true");
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
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
              defaultWpm={settings.defaultWPM}
              orpEnabled={settings.orpEnabled}
              smartPauseEnabled={settings.smartPauseEnabled}
              onWpmChange={(wpm) => updateSettings({ defaultWPM: wpm })}
              onOrpChange={(orp) => updateSettings({ orpEnabled: orp })}
              onSmartPauseChange={(smartPause) => updateSettings({ smartPauseEnabled: smartPause })}
            />
          </div>
        </section>

        {/* Preview */}
        <section>
          <h3 className="font-label-mono text-label-mono text-primary uppercase tracking-wider mb-space-sm">
            Preview
          </h3>
          <PreviewSection
            font={settings.font}
            fontSize={settings.fontSize}
            orpEnabled={settings.orpEnabled}
          />
        </section>

        {/* Appearance */}
        <section>
          <h3 className="font-label-mono text-label-mono text-primary uppercase tracking-wider mb-space-sm">
            Appearance
          </h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden divide-y divide-border-subtle">
            <ThemeSection
              currentTheme={settings.theme}
              onThemeChange={handleThemeChange}
            />
            <FontSection
              currentFont={settings.font}
              currentFontSize={settings.fontSize}
              onFontChange={(font) => updateSettings({ font })}
              onFontSizeChange={(size) => updateSettings({ fontSize: size })}
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
              reducedMotion={settings.reducedMotion}
              screenReaderOptimized={settings.screenReaderOptimized}
              onReducedMotionChange={(reduced) => updateSettings({ reducedMotion: reduced })}
              onScreenReaderChange={(sr) => updateSettings({ screenReaderOptimized: sr })}
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
