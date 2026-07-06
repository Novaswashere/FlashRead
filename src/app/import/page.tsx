"use client";

import React, { useState } from "react";
import { useImport } from "@/features/import/hooks/useImport";

export default function ImportPage() {
  const { importFile, importPastedText, isImporting } = useImport();
  const [pasteText, setPasteText] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      importFile(e.target.files[0]);
    }
  };

  const handleProcessText = () => {
    if (pasteText.trim()) {
      importPastedText(pasteText);
    }
  };

  return (
    <main className="pt-24 pb-20 md:pb-8 md:pl-72 px-space-md max-w-container-max mx-auto min-h-screen">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-space-xl">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Import New Content</h2>
          <p className="text-on-surface-variant font-body-md">
            Add documents or raw text to your library to start speed reading.
          </p>
        </div>

        {/* Import Grid Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg">
          {/* EPUB */}
          <button className="flex flex-col items-center justify-center p-space-lg bg-surface-container-lowest border border-border-subtle rounded-xl hover:border-primary hover:text-primary transition-all active:scale-95 group">
            <span className="material-symbols-outlined text-4xl mb-space-sm text-outline group-hover:text-primary transition-colors">
              book
            </span>
            <span className="font-label-mono text-label-mono uppercase tracking-widest">Upload EPUB</span>
          </button>
          {/* PDF */}
          <button className="flex flex-col items-center justify-center p-space-lg bg-surface-container-lowest border border-border-subtle rounded-xl hover:border-primary hover:text-primary transition-all active:scale-95 group">
            <span className="material-symbols-outlined text-4xl mb-space-sm text-outline group-hover:text-primary transition-colors">
              picture_as_pdf
            </span>
            <span className="font-label-mono text-label-mono uppercase tracking-widest">Upload PDF</span>
          </button>
          {/* TXT */}
          <button className="flex flex-col items-center justify-center p-space-lg bg-surface-container-lowest border border-border-subtle rounded-xl hover:border-primary hover:text-primary transition-all active:scale-95 group">
            <span className="material-symbols-outlined text-4xl mb-space-sm text-outline group-hover:text-primary transition-colors">
              description
            </span>
            <span className="font-label-mono text-label-mono uppercase tracking-widest">Upload TXT</span>
          </button>
          {/* Paste */}
          <button className="flex flex-col items-center justify-center p-space-lg bg-surface-container-lowest border border-border-subtle rounded-xl hover:border-primary hover:text-primary transition-all active:scale-95 group">
            <span className="material-symbols-outlined text-4xl mb-space-sm text-outline group-hover:text-primary transition-colors">
              content_paste
            </span>
            <span className="font-label-mono text-label-mono uppercase tracking-widest">Paste Text</span>
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div className="relative w-full h-64 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center bg-surface-container-low cursor-pointer transition-all hover:bg-surface-container-high mb-space-xl">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">cloud_upload</span>
          <p className="font-body-lg text-body-lg font-semibold text-on-surface">
            {isImporting ? "Processing content..." : "Drag & drop files here"}
          </p>
          <p className="text-on-surface-variant text-sm mt-2">or tap to browse locally</p>
          <input
            accept=".epub,.pdf,.txt"
            className="absolute inset-0 opacity-0 cursor-pointer"
            multiple={false}
            type="file"
            onChange={handleFileChange}
          />
        </div>

        {/* Paste Area */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-space-lg" id="paste-section">
          <div className="flex items-center justify-between mb-space-md">
            <label className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
              Quick Paste &amp; Read
            </label>
            <span className="text-xs text-outline font-label-mono">
              {pasteText.length.toLocaleString()} characters
            </span>
          </div>
          <textarea
            className="w-full min-h-[320px] bg-transparent border-none focus:ring-0 font-body-md text-on-surface resize-none custom-scrollbar p-0 outline-none"
            placeholder="Paste your text content here..."
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          ></textarea>
          <div className="mt-space-lg flex justify-end gap-space-md border-t border-border-subtle pt-space-md">
            <button
              onClick={() => setPasteText("")}
              className="px-space-lg py-2 rounded-lg font-label-mono text-label-mono text-outline hover:text-on-surface transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleProcessText}
              className="px-space-xl py-2 bg-primary text-on-primary rounded-lg font-label-mono text-label-mono tracking-widest hover:brightness-110 active:scale-95 transition-all"
            >
              Process Text
            </button>
          </div>
        </div>

        {/* Context Info */}
        <div className="mt-space-xl grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          <div className="p-space-lg bg-surface-container-low rounded-xl flex gap-space-md">
            <span className="material-symbols-outlined text-primary">speed</span>
            <div>
              <h4 className="font-semibold text-on-surface mb-1">Optimized Processing</h4>
              <p className="text-sm text-on-surface-variant">
                Our RSVP engine automatically parses chapters and removes metadata for a cleaner experience.
              </p>
            </div>
          </div>
          <div className="p-space-lg bg-surface-container-low rounded-xl flex gap-space-md">
            <span className="material-symbols-outlined text-primary">security</span>
            <div>
              <h4 className="font-semibold text-on-surface mb-1">Privacy First</h4>
              <p className="text-sm text-on-surface-variant">
                All processing happens in your browser. Your files are never uploaded to our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
