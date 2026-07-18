import React from "react";

export const ImportHelpSection: React.FC = () => {
  return (
    <div className="mt-xl grid grid-cols-1 md:grid-cols-2 gap-lg">
      <div className="p-lg bg-surface-container-low border border-outline-variant/30 rounded-xl flex gap-md">
        <span className="material-symbols-outlined text-primary shrink-0">
          speed
        </span>
        <div className="text-left">
          <h4 className="font-headline-md text-headline-md text-on-surface mb-xs">
            Optimized Processing
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Our RSVP engine automatically parses chapters and removes metadata
            for a cleaner experience.
          </p>
        </div>
      </div>
      <div className="p-lg bg-surface-container-low border border-outline-variant/30 rounded-xl flex gap-md">
        <span className="material-symbols-outlined text-primary shrink-0">
          security
        </span>
        <div className="text-left">
          <h4 className="font-headline-md text-headline-md text-on-surface mb-xs">
            Privacy First
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            All processing happens in your browser. Your files are never
            uploaded to our servers.
          </p>
        </div>
      </div>
    </div>
  );
};
