import React from "react";

export interface ReaderWordDisplayProps {
  word: string;
  orpIndex: number;
}

export const ReaderWordDisplay: React.FC<ReaderWordDisplayProps> = ({
  word,
  orpIndex
}) => {
  const index = word.length > 0 ? Math.min(Math.max(0, orpIndex), word.length - 1) : 0;
  const prefix = word.substring(0, index);
  const orpChar = word.charAt(index);
  const suffix = word.substring(index + 1);

  return (
    <div className="relative z-10 select-none">
      <div className="flex font-display-rsvp text-display-rsvp-mobile md:text-display-rsvp tracking-tight">
        <span className="text-on-surface">{prefix}</span>
        <span className="text-orp-highlight">{orpChar}</span>
        <span className="text-on-surface">{suffix}</span>
      </div>
    </div>
  );
};
