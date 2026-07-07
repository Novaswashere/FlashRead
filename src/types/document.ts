export type BlockType = "paragraph" | "heading" | "image";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  text: string;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  level: number;
  text: string;
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  assetId: string;
  caption?: string;
  altText?: string;
  width?: number;
  height?: number;
  originalPosition: number;
}

export type Block = ParagraphBlock | HeadingBlock | ImageBlock;

export interface Chapter {
  id: string;
  title: string;
  blocks: Block[];
  content: string; // Pre-flattened text generated once during parsing for RSVP
  wordCount: number;
  metadata?: Record<string, any>;
}

export interface BookMetadata {
  title?: string;
  author?: string;
  subtitle?: string;
  language?: string;
  publisher?: string;
  publicationDate?: string;
  description?: string;
  series?: string;
  volume?: number;
  isbn?: string;
  coverAssetId?: string;
  tags?: string[];
  // File details for backward compatibility
  fileName?: string;
  fileSize?: number;
  contentType?: string;
}

export interface ParsedBook {
  id: string;
  bookId: string;
  chapters: Chapter[];
  totalWords: number;
  metadata: BookMetadata;
  assets?: ImageAsset[];
}

export interface Bookmark {
  id: string;
  chapterIndex: number;
  blockIndex: number;
  wordIndex: number;
  createdAt: string;
}

export interface ReadingProgress {
  bookId: string;
  currentChapterIndex: number;
  currentWordIndex: number;
  lastOpened: string; // ISO string
  userId?: string;
  readingTime?: number; // in seconds
  currentBlockIndex?: number;
  wpm?: number;
  completionPercentage?: number;
  bookmarks?: Bookmark[];
  highlights?: any[];
  notes?: any[];
}

export interface ImageAsset {
  id: string;
  bookId: string;
  mimeType: string;
  data: Blob;
}
