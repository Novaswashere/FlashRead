### Task 1: Type Definitions & Custom Parser Errors

**Files:**
- Create: `src/types/document.ts`
- Modify: `src/types/index.ts`
- Create: `src/lib/errors.ts`

**Interfaces:**
- Produces: Type interfaces `Block`, `Chapter`, `BookMetadata`, `ParsedBook`, and structured error classes `ParserError`, `UnsupportedFormatError`, etc.

- [ ] **Step 1: Create custom parser error classes**
  Write to `src/lib/errors.ts`:
  ```typescript
  export class ParserError extends Error {
    constructor(message: string, public code: string) {
      super(message);
      this.name = "ParserError";
    }
  }

  export class UnsupportedFormatError extends ParserError {
    constructor(message: string) { super(message, "UNSUPPORTED_FORMAT"); }
  }

  export class CorruptedFileError extends ParserError {
    constructor(message: string) { super(message, "CORRUPTED_FILE"); }
  }

  export class EncryptedPdfError extends ParserError {
    constructor(message: string) { super(message, "ENCRYPTED_PDF"); }
  }

  export class InvalidEpubError extends ParserError {
    constructor(message: string) { super(message, "INVALID_EPUB"); }
  }

  export class EmptyDocumentError extends ParserError {
    constructor(message: string) { super(message, "EMPTY_DOCUMENT"); }
  }

  export class ParserTimeoutError extends ParserError {
    constructor(message: string) { super(message, "PARSER_TIMEOUT"); }
  }
  ```

- [ ] **Step 2: Define strongly typed document structure**
  Write to `src/types/document.ts`:
  ```typescript
  export type BlockType = "paragraph" | "heading" | "image";

  export interface BaseBlock {
    id: string; // Unique UUID or short hash
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
    assetId: string; // Stable ID pointing to the assets store
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
    title: string;
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
  }

  export interface ParsedBook {
    id: string;
    bookId: string;
    chapters: Chapter[];
    totalWords: number;
    metadata: BookMetadata;
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
    currentBlockIndex: number;
    currentWordIndex: number;
    wpm: number;
    lastOpened: string; // ISO string
    completionPercentage: number;
    bookmarks: Bookmark[];
    highlights: any[];
    notes: any[];
  }
  ```

- [ ] **Step 3: Update global types**
  In `src/types/index.ts`, import types from `./document` and export them.
- [ ] **Step 4: Run typecheck to verify**
  Run: `npm run typecheck`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/lib/errors.ts src/types/document.ts src/types/index.ts`
  Run: `git commit -m "feat: define document block schemas and custom parser errors with progress structures"`

---
