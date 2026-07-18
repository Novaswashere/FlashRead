"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLayoutContext } from "@/providers/LayoutProvider";
import { getStreak } from "@/lib/readingStats";

export const TopAppBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleMobileMenu, isMobileMenuOpen, setMobileMenuOpen } = useLayoutContext();
  const [streak, setStreak] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  useEffect(() => {
    // Close search when navigating away from library
    if (pathname !== "/library") {
      setIsSearchExpanded(false);
      setSearchQuery("");
    }
  }, [pathname]);

  // Hide the global app bar on the reader page, as it has its own toolbar
  if (pathname === "/reader") return null;

  const handleSearch = () => {
    if (isSearchExpanded && searchQuery.trim()) {
      // Navigate to library with search query
      router.push(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery("");
      setMobileMenuOpen(false);
    } else {
      setIsSearchExpanded(!isSearchExpanded);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery("");
      setMobileMenuOpen(false);
    } else if (e.key === "Escape") {
      setIsSearchExpanded(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/20">
      <div className="flex items-center justify-between px-margin-mobile md:px-lg h-16 max-w-container-max mx-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMobileMenu}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              menu
            </span>
          </button>
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
              ReadPilot
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isSearchExpanded ? (
            <div className="flex items-center gap-2 animate-fade-in-up">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                placeholder="Search library..."
                className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/50 w-48 md:w-64"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-on-primary hover:bg-primary-container transition-colors active:scale-95"
                aria-label="Search"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
              <button
                onClick={() => {
                  setIsSearchExpanded(false);
                  setSearchQuery("");
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95"
                aria-label="Cancel search"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full streak-glow">
                <span
                  className="material-symbols-outlined text-primary text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                <span className="font-label-md text-label-md text-primary font-bold">
                  {streak}-DAY STREAK
                </span>
              </div>
              <button
                onClick={handleSearch}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95"
                aria-label="Search library"
              >
                <span className="material-symbols-outlined text-on-surface-variant">
                  search
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
