import React from "react";

export const ImportHelpSection: React.FC = () => {
  return (
    <div className="mt-space-xl grid grid-cols-1 md:grid-cols-2 gap-space-lg">
      <div className="p-space-lg bg-surface-container-low rounded-xl flex gap-space-md">
        <span className="material-symbols-outlined text-primary">speed</span>
        <div className="text-left">
          <h4 className="font-semibold text-on-surface mb-1">
            Optimized Processing
          </h4>
          <p className="text-sm text-on-surface-variant">
            Our RSVP engine automatically parses chapters and removes metadata
            for a cleaner experience.
          </p>
        </div>
      </div>
      <div className="p-space-lg bg-surface-container-low rounded-xl flex gap-space-md">
        <span className="material-symbols-outlined text-primary">security</span>
        <div className="text-left">
          <h4 className="font-semibold text-on-surface mb-1">Privacy First</h4>
          <p className="text-sm text-on-surface-variant">
            All processing happens in your browser. Your files are never
            uploaded to our servers.
          </p>
        </div>
      </div>
    </div>
  );
};
