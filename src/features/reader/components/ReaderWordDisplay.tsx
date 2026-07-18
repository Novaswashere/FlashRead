import React from "react";

export interface ReaderWordDisplayProps {
  word: string;
  orpIndex: number;
  font?: string;
  fontSize?: number;
  orpEnabled?: boolean;
}

export const ReaderWordDisplay: React.FC<ReaderWordDisplayProps> = ({
  word,
  orpIndex,
  font = "Inter",
  fontSize = 48,
  orpEnabled = true,
}) => {
  const index =
    word.length > 0 ? Math.min(Math.max(0, orpIndex), word.length - 1) : 0;
  const prefix = word.substring(0, index);
  const orpChar = word.charAt(index);
  const suffix = word.substring(index + 1);

  // Map font name to style
  const fontStyle = {
    fontFamily: font === "JetBrains Mono" ? "JetBrains Mono, monospace" : font,
    fontSize: `${fontSize}px`,
  };

  const showMarker = orpEnabled && word.length > 0;

  return (
    <div
      className={`relative z-10 select-none ${showMarker ? "orp-marker" : ""}`}
      style={fontStyle}
    >
      <div className="flex tracking-tight items-center justify-center">
        <span className="text-on-surface-variant text-right">
          {prefix}
        </span>
        {orpEnabled ? (
          <span className="text-primary font-bold drop-shadow-[0_0_12px_var(--primary)] transition-all duration-75 px-[1px]">
            {orpChar}
          </span>
        ) : (
          <span className="text-on-surface px-[1px]">{orpChar}</span>
        )}
        <span className="text-on-surface-variant text-left">
          {suffix}
        </span>
      </div>
    </div>
  );
};
