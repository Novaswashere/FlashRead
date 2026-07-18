import React from "react";

export interface QuickImportCardProps {
  onImportClick: () => void;
}

export const QuickImportCard: React.FC<QuickImportCardProps> = ({
  onImportClick,
}) => {
  return (
    <section className="glass-card border border-outline-variant/30 rounded-xl p-lg flex flex-col sm:flex-row items-center justify-between gap-md hover:border-primary/50 transition-all group animate-fade-in-up stagger-4">
      <div className="flex items-center gap-md text-left w-full sm:w-auto">
        <span
          className="material-symbols-outlined text-primary text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          publish
        </span>
        <div>
          <h4 className="font-headline-md text-headline-md font-bold text-on-surface">
            Add More Books
          </h4>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Import EPUB, PDF, TXT files or paste text directly.
          </p>
        </div>
      </div>
      <button
        onClick={onImportClick}
        className="bg-primary text-on-primary rounded-lg font-label-md text-label-md px-lg py-3 hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 shrink-0"
      >
        Import Now
      </button>
    </section>
  );
};
