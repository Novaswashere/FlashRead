"use client";

import React from "react";
import { useLibrary } from "@/features/library/hooks/useLibrary";

export default function LibraryPage() {
  const { books } = useLibrary();

  return (
    <main className="pt-24 pb-20 px-space-md md:px-space-xl max-w-[900px] mx-auto min-h-screen md:pl-72">
      {/* Header & Global Search */}
      <div className="mb-space-xl">
        <div className="flex flex-col gap-space-md">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Library</h2>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md placeholder:text-outline"
              placeholder="Search titles, authors, or topics..."
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-space-sm mb-space-lg overflow-x-auto pb-2 no-scrollbar">
        <button className="px-5 py-2 rounded-full bg-primary text-on-primary font-label-mono text-label-mono shadow-sm active:scale-95 transition-all">
          All
        </button>
        <button className="px-5 py-2 rounded-full bg-surface-container border border-border-subtle text-on-surface-variant font-label-mono text-label-mono hover:bg-surface-container-high active:scale-95 transition-all">
          EPUB
        </button>
        <button className="px-5 py-2 rounded-full bg-surface-container border border-border-subtle text-on-surface-variant font-label-mono text-label-mono hover:bg-surface-container-high active:scale-95 transition-all">
          PDF
        </button>
        <button className="px-5 py-2 rounded-full bg-surface-container border border-border-subtle text-on-surface-variant font-label-mono text-label-mono hover:bg-surface-container-high active:scale-95 transition-all">
          TXT
        </button>
      </div>

      {/* Book List (Linear-Inspired) */}
      <div className="flex flex-col border-t border-border-subtle">
        {/* List Item 1 */}
        <div className="list-item-hover flex items-center justify-between py-4 border-b border-border-subtle group hover:bg-surface-container-low transition-colors px-2 -mx-2 rounded-lg cursor-pointer">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-14 bg-surface-container-high rounded flex items-center justify-center border border-border-subtle overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="The Pragmatic Programmer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDepYG29bjWOMAY8VQb97xAgxlB3MtxWPlAMmxYdgvqHt9r-UjpPG4APLCJOW1JgTaLSU8l_LWm9CCfwBgGiNIq62ilIwFoca-Sg2-JqMFeiX-bb-55SlGeMirF0bjZTRrRBKjgCRfiODi1Cpi8g8n5WjEb5l7QAf9tXhwYeknFYMmpkK2hsXpZRkfLm50S7IwnfcHKsVlYilPy6fal6R9WAsWmig2HxoZwi9F16VoCH6aXDIfvaEinRNFZ6uNAByZRQMTNe0d63Wwp"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                The Pragmatic Programmer
              </span>
              <div className="flex items-center gap-2">
                <span className="font-label-mono text-label-mono text-outline">Andrew Hunt</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="font-label-mono text-label-mono text-primary bg-primary-fixed/30 px-1.5 py-0.5 rounded uppercase">
                  EPUB
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden md:flex flex-col items-end mr-4">
              <div className="w-24 h-1 bg-surface-container rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[65%]"></div>
              </div>
              <span className="font-label-mono text-label-mono text-outline mt-1">65% Read</span>
            </div>
            <button className="action-trigger material-symbols-outlined text-outline hover:text-on-surface p-1 rounded-md hover:bg-surface-container-highest transition-all">
              more_vert
            </button>
          </div>
        </div>

        {/* List Item 2 */}
        <div className="list-item-hover flex items-center justify-between py-4 border-b border-border-subtle group hover:bg-surface-container-low transition-colors px-2 -mx-2 rounded-lg cursor-pointer">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-14 bg-surface-container-high rounded flex items-center justify-center border border-border-subtle overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Clean Code"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7_pkUzfFjSWhIeDRJlxHnMkrbdFFm7icgr8n81rOR91NSHzsEy82Ok-E4H7lH376gFmyDTBeaJA7LGFs1VUHZjVnCxixF_qWxNfxFqS54Uahr1jPXqoy8m49Xd2vjmeE94wH7L1TEzsekg58kFIaAfUrSxhQhdb2_P9zpJatwZu7hQ26BWjbznnn7zsBKKaduJdmt8hgZwsvWf6JFgqzqX4Xq7myOrcB_iRey95D_ALl73e1xsiX5zf5XGMx62r5fuiRBkmyBy88T"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                Clean Code
              </span>
              <div className="flex items-center gap-2">
                <span className="font-label-mono text-label-mono text-outline">Robert C. Martin</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="font-label-mono text-label-mono text-secondary bg-surface-container-high px-1.5 py-0.5 rounded uppercase">
                  PDF
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden md:flex flex-col items-end mr-4">
              <div className="w-24 h-1 bg-surface-container rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[12%]"></div>
              </div>
              <span className="font-label-mono text-label-mono text-outline mt-1">12% Read</span>
            </div>
            <button className="action-trigger material-symbols-outlined text-outline hover:text-on-surface p-1 rounded-md hover:bg-surface-container-highest transition-all">
              more_vert
            </button>
          </div>
        </div>

        {/* List Item 3 */}
        <div className="list-item-hover flex items-center justify-between py-4 border-b border-border-subtle group hover:bg-surface-container-low transition-colors px-2 -mx-2 rounded-lg cursor-pointer">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-14 bg-surface-container-high rounded flex items-center justify-center border border-border-subtle overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                <span className="material-symbols-outlined text-outline">description</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                Project_Notes_Final
              </span>
              <div className="flex items-center gap-2">
                <span className="font-label-mono text-label-mono text-outline">Unknown Author</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="font-label-mono text-label-mono text-secondary bg-surface-container-high px-1.5 py-0.5 rounded uppercase">
                  TXT
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="font-label-mono text-label-mono text-outline mt-1">Unread</span>
            </div>
            <button className="action-trigger material-symbols-outlined text-outline hover:text-on-surface p-1 rounded-md hover:bg-surface-container-highest transition-all">
              more_vert
            </button>
          </div>
        </div>

        {/* List Item 4 */}
        <div className="list-item-hover flex items-center justify-between py-4 border-b border-border-subtle group hover:bg-surface-container-low transition-colors px-2 -mx-2 rounded-lg cursor-pointer">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-14 bg-surface-container-high rounded flex items-center justify-center border border-border-subtle overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Thinking, Fast and Slow"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTZnQtDIZsIEQeSSIp1hj7Wtj5pzRpcAxEEwzjnzfiuGvjcBsu-jS_6066UX4vshj-onYFxwGC7NkSGCE89zsGs_45IGPbl0SWheY9GNgJyq9kINWcNxg2OhYLIFKhyZwujrfca3WrCL07di_yN_c9zp8B0C2wHjB4TJfXAOfzUhwJDx4qXnIDfr-RC5uAQqnWdlbRcaI-NWLAuGoeiZ-kSNZ5xDzCYM0iBuyEYvaVvePGhWoJBG9RyyhHiIaqKNsarY1-Z2Qq9vRP"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                Thinking, Fast and Slow
              </span>
              <div className="flex items-center gap-2">
                <span className="font-label-mono text-label-mono text-outline">Daniel Kahneman</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="font-label-mono text-label-mono text-primary bg-primary-fixed/30 px-1.5 py-0.5 rounded uppercase">
                  EPUB
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden md:flex flex-col items-end mr-4">
              <div className="w-24 h-1 bg-surface-container rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[94%]"></div>
              </div>
              <span className="font-label-mono text-label-mono text-outline mt-1">94% Read</span>
            </div>
            <button className="action-trigger material-symbols-outlined text-outline hover:text-on-surface p-1 rounded-md hover:bg-surface-container-highest transition-all">
              more_vert
            </button>
          </div>
        </div>
      </div>

      {/* Empty State Filler */}
      <div className="mt-12 text-center py-12 border-2 border-dashed border-border-subtle rounded-2xl bg-surface-container-low group cursor-pointer hover:border-primary transition-colors">
        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-4xl mb-2">
          add_circle
        </span>
        <p className="font-headline-md text-headline-md text-on-surface">Import New Document</p>
        <p className="text-on-surface-variant max-w-xs mx-auto">
          Drop your EPUB, PDF, or TXT files here to start reading at high speed.
        </p>
      </div>

      {/* Floating Action Button */}
      <button className="fixed right-6 bottom-20 md:bottom-10 z-40 bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all">
        <span className="material-symbols-outlined">add</span>
      </button>
    </main>
  );
}
