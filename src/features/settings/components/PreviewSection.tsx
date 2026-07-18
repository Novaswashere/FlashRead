import React from "react";
import { ReaderCanvas } from "@/features/reader/components/ReaderCanvas";
import { ReaderWordDisplay } from "@/features/reader/components/ReaderWordDisplay";

interface PreviewSectionProps {
  font: string;
  fontSize: number;
  orpEnabled: boolean;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  font,
  fontSize,
  orpEnabled,
}) => {
  return (
    <div className="p-space-lg flex flex-col items-center justify-center bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden relative min-h-[160px]">
      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest absolute top-3 left-4 select-none">
        Real-time settings preview
      </span>
      <div className="w-full mt-6 flex items-center justify-center select-none">
        <ReaderCanvas orpEnabled={orpEnabled} className="h-36 border border-border-subtle/40 bg-surface-container-low/50 dark:bg-surface-dark/30 rounded-lg shadow-inner">
          <ReaderWordDisplay
            word="ReadPilot"
            orpIndex={2}
            font={font}
            fontSize={fontSize}
            orpEnabled={orpEnabled}
          />
        </ReaderCanvas>
      </div>
    </div>
  );
};
