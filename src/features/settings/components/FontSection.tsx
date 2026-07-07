import React from "react";
import { Slider } from "@/components/ui/Slider";

export interface FontSectionProps {
  currentFont: string;
  currentFontSize: number;
  onFontChange: (
    font: "Inter" | "Open Sans" | "Merriweather" | "JetBrains Mono"
  ) => void;
  onFontSizeChange: (size: number) => void;
}

export const FontSection: React.FC<FontSectionProps> = ({
  currentFont,
  currentFontSize,
  onFontChange,
  onFontSizeChange,
}) => {
  const fonts: Array<
    "Inter" | "Open Sans" | "Merriweather" | "JetBrains Mono"
  > = ["Inter", "Open Sans", "Merriweather", "JetBrains Mono"];

  return (
    <div className="p-space-md flex flex-col gap-space-md">
      {/* Font Family */}
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center gap-space-md">
          <span className="material-symbols-outlined text-secondary">
            font_download
          </span>
          <p className="font-medium">Reading Font</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {fonts.map((f) => (
            <button
              key={f}
              onClick={() => onFontChange(f)}
              className={`px-4 py-2 rounded-lg border-2 ${
                currentFont === f
                  ? "border-primary font-bold"
                  : "border-border-subtle hover:bg-surface-container-low"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <span className="material-symbols-outlined text-secondary">
              format_size
            </span>
            <p className="font-medium">Font Size</p>
          </div>
          <span className="text-xs font-label-mono text-primary font-bold">
            {currentFontSize}px
          </span>
        </div>
        <Slider
          max="96"
          min="16"
          value={currentFontSize}
          onChange={(e) => onFontSizeChange(parseInt(e.target.value) || 48)}
        />
      </div>
    </div>
  );
};
