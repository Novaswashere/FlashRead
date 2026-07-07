import React from "react";

export interface SupportedFormatsCardProps {
  onFormatSelect: (format: string) => void;
}

export const SupportedFormatsCard: React.FC<SupportedFormatsCardProps> = ({
  onFormatSelect,
}) => {
  const formats = [
    { label: "Upload EPUB", icon: "book" },
    { label: "Upload PDF", icon: "picture_as_pdf" },
    { label: "Upload TXT", icon: "description" },
    { label: "Paste Text", icon: "content_paste" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg">
      {formats.map((fmt) => (
        <button
          key={fmt.label}
          onClick={() => onFormatSelect(fmt.label)}
          className="flex flex-col items-center justify-center p-space-lg bg-surface-container-lowest border border-border-subtle rounded-xl hover:border-primary hover:text-primary transition-all active:scale-95 group"
        >
          <span className="material-symbols-outlined text-4xl mb-space-sm text-outline group-hover:text-primary transition-colors">
            {fmt.icon}
          </span>
          <span className="font-label-mono text-label-mono uppercase tracking-widest">
            {fmt.label}
          </span>
        </button>
      ))}
    </div>
  );
};
