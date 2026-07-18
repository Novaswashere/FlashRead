import { Chapter, Block } from "@/types";
import { highlightWordInTextSafely } from "./htmlSanitizer";

/**
 * Maps a flat word index from the chapter's content string to the specific paragraph block.
 * This enables features like Reading Anchor to show context for the current word.
 */

export interface ParagraphMapping {
  blockIndex: number;          // Index of the paragraph in chapter.blocks
  wordIndexInBlock: number;    // Index of the word within this paragraph
  wordIndexInChapter: number;  // Absolute word index in the flattened content
  wordCountInBlock: number;    // Total words in this paragraph
}

export interface BlockWordRange {
  blockIndex: number;
  startWordIndex: number;      // First word index of this block in chapter
  endWordIndex: number;        // Last word index of this block in chapter
  wordCount: number;
}

/**
 * Pre-computes word ranges for all blocks in a chapter.
 * This allows O(log n) lookup of which block contains a given word index.
 */
export function computeBlockWordRanges(chapter: Chapter): BlockWordRange[] {
  const ranges: BlockWordRange[] = [];
  let currentWordIndex = 0;

  for (let i = 0; i < chapter.blocks.length; i++) {
    const block = chapter.blocks[i];

    // Only paragraph and heading blocks contain text
    if (block.type === "paragraph" || block.type === "heading") {
      const wordCount = block.text.split(/\s+/).filter(Boolean).length;

      ranges.push({
        blockIndex: i,
        startWordIndex: currentWordIndex,
        endWordIndex: currentWordIndex + wordCount - 1,
        wordCount,
      });

      currentWordIndex += wordCount;
    } else {
      // Image blocks have no words
      ranges.push({
        blockIndex: i,
        startWordIndex: currentWordIndex,
        endWordIndex: currentWordIndex - 1, // Empty range
        wordCount: 0,
      });
    }
  }

  return ranges;
}

/**
 * Finds which paragraph block contains a given word index.
 * Returns null if the word index is out of range or maps to a non-text block.
 */
export function findParagraphForWordIndex(
  wordIndex: number,
  blockRanges: BlockWordRange[]
): ParagraphMapping | null {
  // Find the block that contains this word index
  const range = blockRanges.find(
    r => wordIndex >= r.startWordIndex && wordIndex <= r.endWordIndex
  );

  if (!range || range.wordCount === 0) {
    return null;
  }

  return {
    blockIndex: range.blockIndex,
    wordIndexInBlock: wordIndex - range.startWordIndex,
    wordIndexInChapter: wordIndex,
    wordCountInBlock: range.wordCount,
  };
}

/**
 * Gets all text blocks (paragraphs and headings) from a chapter.
 */
export function getTextBlocks(chapter: Chapter): Array<Block & { type: "paragraph" | "heading" }> {
  return chapter.blocks.filter(
    (block): block is Block & { type: "paragraph" | "heading" } =>
      block.type === "paragraph" || block.type === "heading"
  );
}

/**
 * Highlights a specific word within a paragraph text (XSS-safe).
 * This function safely escapes HTML and highlights the target word.
 * Delegates to the safe highlighting utility in htmlSanitizer.
 */
export function highlightWordInParagraph(
  paragraphText: string,
  wordIndexInParagraph: number
): string {
  return highlightWordInTextSafely(paragraphText, wordIndexInParagraph, 'reading-anchor-highlight');
}

/**
 * Finds the next text block (paragraph or heading) after the current one.
 */
export function findNextTextBlock(currentBlockIndex: number, chapter: Chapter): number {
  for (let i = currentBlockIndex + 1; i < chapter.blocks.length; i++) {
    const block = chapter.blocks[i];
    if (block.type === "paragraph" || block.type === "heading") {
      return i;
    }
  }
  return currentBlockIndex; // No next block found
}

/**
 * Finds the previous text block (paragraph or heading) before the current one.
 */
export function findPreviousTextBlock(currentBlockIndex: number, chapter: Chapter): number {
  for (let i = currentBlockIndex - 1; i >= 0; i--) {
    const block = chapter.blocks[i];
    if (block.type === "paragraph" || block.type === "heading") {
      return i;
    }
  }
  return currentBlockIndex; // No previous block found
}
