import React from "react";

export interface SupportedFormatsCardProps {
  onFormatSelect: (format: string) => void;
}

export const SupportedFormatsCard: React.FC<SupportedFormatsCardProps> = ({
  onFormatSelect,
}) => {
  const formats = [
    {
      label: "Upload EPUB",
      title: "EPUB",
      icon: "auto_stories",
      desc: "Import eBooks with full metadata and chapter support.",
      action: "Select File",
      tileClass: "bg-primary/10 group-hover:bg-primary/20",
      iconClass: "text-primary",
      stagger: "stagger-1",
    },
    {
      label: "Upload PDF",
      title: "PDF",
      icon: "picture_as_pdf",
      desc: "Best for articles, research papers, and static documents.",
      action: "Select File",
      tileClass:
        "bg-secondary-container/10 group-hover:bg-secondary-container/20",
      iconClass: "text-secondary-container",
      stagger: "stagger-2",
    },
    {
      label: "Upload TXT",
      title: "TXT",
      icon: "description",
      desc: "Simple text files. Optimized for raw notes and scripts.",
      action: "Select File",
      tileClass: "bg-tertiary-container/10 group-hover:bg-tertiary-container/20",
      iconClass: "text-tertiary",
      stagger: "stagger-3",
    },
    {
      label: "Paste Text",
      title: "Paste",
      icon: "content_paste",
      desc: "Instant import via clipboard for web articles or snippets.",
      action: "Open Editor",
      tileClass:
        "bg-primary-container/10 group-hover:bg-primary-container/20",
      iconClass: "text-primary-fixed-dim",
      stagger: "stagger-4",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
      {formats.map((fmt) => (
        <button
          key={fmt.label}
          onClick={() => onFormatSelect(fmt.label)}
          className={`import-card animate-fade-in-up ${fmt.stagger} group cursor-pointer p-lg bg-surface-container-low border border-outline-variant/30 rounded-xl hover:border-primary/50 hover:bg-surface-container-high active:scale-[0.98] transition-all flex flex-col gap-md`}
        >
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${fmt.tileClass}`}
          >
            <span
              className={`material-symbols-outlined text-[28px] ${fmt.iconClass}`}
            >
              {fmt.icon}
            </span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md mb-xs text-on-background">
              {fmt.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {fmt.desc}
            </p>
          </div>
          <div className="mt-auto pt-sm flex items-center text-primary font-label-md text-label-md">
            <span>{fmt.action}</span>
            <span className="material-symbols-outlined ml-xs text-[18px]">
              chevron_right
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
