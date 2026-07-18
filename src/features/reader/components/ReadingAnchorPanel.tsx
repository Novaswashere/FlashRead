"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useReaderContext } from "@/providers/ReaderProvider";
import { Chapter, Block } from "@/types";
import {
  computeBlockWordRanges,
  findParagraphForWordIndex,
  highlightWordInParagraph,
  findNextTextBlock,
  findPreviousTextBlock,
  getTextBlocks,
} from "@/lib/paragraphMapping";
import {
  ChevronLeft,
  ChevronRight,
  AlignCenter,
  BookOpen,
} from "lucide-react";
import { escapeHtml } from "@/lib/htmlSanitizer";

interface ReadingAnchorPanelProps {
  chapter: Chapter;
  font: string;
  fontSize: number;
}

export const ReadingAnchorPanel: React.FC<ReadingAnchorPanelProps> = ({
  chapter,
  font,
  fontSize,
}) => {
  const { snapshot } = useReaderContext();

  // Pre-compute block word ranges
  const blockRanges = useMemo(() => computeBlockWordRanges(chapter), [chapter]);

  // Track which block we're currently viewing (for browsing)
  const [viewedBlockIndex, setViewedBlockIndex] = useState<number | null>(null);

  // Find the current paragraph for the active word
  const currentMapping = useMemo(() => {
    return findParagraphForWordIndex(snapshot.currentIndex, blockRanges);
  }, [snapshot.currentIndex, blockRanges]);

  // The block to display (either the one we're browsing or the current one)
  const displayBlockIndex = useMemo(() => {
    if (viewedBlockIndex !== null) {
      return viewedBlockIndex;
    }
    return currentMapping?.blockIndex ?? null;
  }, [viewedBlockIndex, currentMapping]);

  const displayBlock = useMemo(() => {
    if (displayBlockIndex === null || displayBlockIndex < 0 || displayBlockIndex >= chapter.blocks.length) {
      return null;
    }
    return chapter.blocks[displayBlockIndex];
  }, [displayBlockIndex, chapter.blocks]);

  // Whether we're viewing a different paragraph than the current one
  const isBrowsing = viewedBlockIndex !== null;

  // Auto-reset to current paragraph when we stop browsing
  useEffect(() => {
    if (currentMapping && !isBrowsing && viewedBlockIndex !== null) {
      // Clear browsing state when we return to following playback
      setViewedBlockIndex(null);
    }
  }, [currentMapping, currentMapping?.blockIndex, isBrowsing, viewedBlockIndex]);

  // Get all text blocks for navigation bounds
  const textBlocks = useMemo(() => getTextBlocks(chapter), [chapter]);
  const textBlockIndices = useMemo(
    () => textBlocks.map(b => chapter.blocks.indexOf(b)),
    [chapter.blocks, textBlocks]
  );

  // Navigation handlers
  const goToPreviousParagraph = useCallback(() => {
    if (displayBlockIndex === null) return;

    const currentIndex = isBrowsing ? displayBlockIndex : (currentMapping?.blockIndex ?? -1);
    const prevIndex = findPreviousTextBlock(currentIndex, chapter);

    if (prevIndex !== currentIndex) {
      setViewedBlockIndex(prevIndex);
    }
  }, [displayBlockIndex, isBrowsing, currentMapping, chapter]);

  const goToNextParagraph = useCallback(() => {
    if (displayBlockIndex === null) return;

    const currentIndex = isBrowsing ? displayBlockIndex : (currentMapping?.blockIndex ?? -1);
    const nextIndex = findNextTextBlock(currentIndex, chapter);

    if (nextIndex !== currentIndex) {
      setViewedBlockIndex(nextIndex);
    }
  }, [displayBlockIndex, isBrowsing, currentMapping, chapter]);

  const goToCurrentParagraph = useCallback(() => {
    setViewedBlockIndex(null);
  }, []);

  // Compute highlighted text
  const highlightedText = useMemo(() => {
    if (!displayBlock || displayBlock.type !== "paragraph" && displayBlock.type !== "heading") {
      return null;
    }

    // If we're viewing the current paragraph, highlight the current word
    if (!isBrowsing && currentMapping && displayBlockIndex === currentMapping.blockIndex) {
      return highlightWordInParagraph(displayBlock.text, currentMapping.wordIndexInBlock);
    }

    // No highlight when browsing other paragraphs, but escape for consistency
    return escapeHtml(displayBlock.text);
  }, [displayBlock, isBrowsing, currentMapping, displayBlockIndex]);

  // Can we navigate?
  const currentNavIndex = isBrowsing ? displayBlockIndex : (currentMapping?.blockIndex ?? -1);
  const hasPrevious = currentNavIndex !== null && currentNavIndex > 0 && textBlockIndices.some(i => i < currentNavIndex);
  const hasNext = currentNavIndex !== null && currentNavIndex < chapter.blocks.length - 1 && textBlockIndices.some(i => i > currentNavIndex);

  if (!displayBlock || !highlightedText) {
    return null;
  }

  const isHeading = displayBlock.type === "heading";

  return (
    <div className="reading-anchor-panel w-full max-w-reader-width mx-auto px-xl py-md">
      <div className="glass-card rounded-xl p-lg md:p-xl border border-outline-variant/30">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-md">
          <div className="flex items-center gap-sm text-on-surface-variant">
            <BookOpen className="h-4 w-4" />
            <span className="font-label-sm text-label-sm uppercase tracking-wider">
              Context
            </span>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-xs">
            <button
              onClick={goToPreviousParagraph}
              disabled={!hasPrevious}
              className="p-xs rounded-lg hover:bg-surface-container-high disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Previous paragraph"
            >
              <ChevronLeft className="h-4 w-4 text-on-surface-variant" />
            </button>

            {isBrowsing && (
              <button
                onClick={goToCurrentParagraph}
                className="px-sm py-xs rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer flex items-center gap-xs"
                title="Return to current paragraph"
              >
                <AlignCenter className="h-3 w-3" />
              </button>
            )}

            <button
              onClick={goToNextParagraph}
              disabled={!hasNext}
              className="p-xs rounded-lg hover:bg-surface-container-high disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Next paragraph"
            >
              <ChevronRight className="h-4 w-4 text-on-surface-variant" />
            </button>
          </div>
        </div>

        {/* Paragraph content */}
        <div className="reading-anchor-content">
          {isHeading ? (
            <h3
              className="font-headline-md text-headline-md text-on-surface leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          ) : (
            <p
              className="font-body-md text-body-md text-on-surface leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          )}
        </div>

        {/* Browsing indicator */}
        {isBrowsing && (
          <div className="mt-sm pt-sm border-t border-outline-variant/20">
            <p className="font-label-sm text-label-sm text-on-surface-variant text-center">
              Browsing • Click center button to return to current position
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
