# Document Import & Parsing (Phase 3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a production-grade file ingestion and parsing pipeline supporting TXT, EPUB, and PDF formats, with separate IndexedDB repositories for metadata, parsed documents, progress, and binary assets, integrated with the RSVP playback engine.

**Architecture:** Use a stage-based ingestion pipeline. File formats are matched dynamically in a `ParserRegistry`. Parsed content is normalized into block nodes (headings, paragraphs, images). Images are saved separately as Blobs inside IndexedDB via an `AssetRepository` to prevent performance overhead, while progress is maintained separately to support multiple reading views.

**Tech Stack:** Next.js, React, TypeScript, jszip, pdfjs-dist, IndexedDB.

## Global Constraints
- Do not let each parser implement its own completely different workflow; use a common parser contract.
- Preserve the block-based document model (paragraphs, headings, images).
- PDF worker must be configured safely to avoid SSR build errors.
- The parser layer must remain completely independent from the RSVP engine.
- The parser layer must never import React.

---

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
  ```

- [ ] **Step 2: Define strongly typed document structure**
  Write to `src/types/document.ts`:
  ```typescript
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
    content: string;
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
  ```

- [ ] **Step 3: Update global types**
  In `src/types/index.ts`, import types from `./document` and export them.
- [ ] **Step 4: Run typecheck to verify**
  Run: `npm run typecheck`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/lib/errors.ts src/types/document.ts src/types/index.ts`
  Run: `git commit -m "feat: define document block schemas and custom parser errors"`

---

### Task 2: Repository-Based Storage Layer (IndexedDB)

**Files:**
- Create: `src/services/storage/indexedDB.ts`
- Create: `src/services/storage/bookRepository.ts`
- Create: `src/services/storage/parsedBookRepository.ts`
- Create: `src/services/storage/progressRepository.ts`
- Create: `src/services/storage/assetRepository.ts`
- Modify: `src/services/storage.ts`

**Interfaces:**
- Produces: `storageService` facade coordinating `BookRepository`, `ParsedBookRepository`, `ProgressRepository`, and `AssetRepository`.

- [ ] **Step 1: Write IndexedDB driver initialization**
  Write to `src/services/storage/indexedDB.ts` using raw IndexedDB API. Create stores: `books`, `parsed_books`, `progress`, and `assets`.
- [ ] **Step 2: Write repositories**
  Create the four repository files implementing save, load, get, and delete operations.
- [ ] **Step 3: Update storage facade**
  In `src/services/storage.ts`, re-export the repositories and update `StorageService` to expose them:
  ```typescript
  import { bookRepository } from "./storage/bookRepository";
  import { parsedBookRepository } from "./storage/parsedBookRepository";
  import { progressRepository } from "./storage/progressRepository";
  import { assetRepository } from "./storage/assetRepository";

  export const storageService = {
    books: bookRepository,
    parsedBooks: parsedBookRepository,
    progress: progressRepository,
    assets: assetRepository,
  };
  ```
- [ ] **Step 4: Run typecheck to verify**
  Run: `npm run typecheck`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/services/storage/ src/services/storage.ts`
  Run: `git commit -m "feat: split storage service into indexeddb repositories"`

---

### Task 3: Unified Parser Pipeline & TXT Parser

**Files:**
- Create: `src/services/parser/contract.ts`
- Modify: `src/services/parser/index.ts`
- Modify: `src/services/parser/txt.ts`
- Modify: `src/services/parser/clipboard.ts`

**Interfaces:**
- Consumes: `ParseOptions`, `IDocumentParser`
- Produces: Unified `ParserRegistry`, `txtParser`, and `clipboardParser`.

- [ ] **Step 1: Write unified parser contract**
  Write `src/services/parser/contract.ts`:
  ```typescript
  import { ParsedBook, ParseOptions } from "../../types";
  export interface IDocumentParser {
    parse(data: File | string, options?: ParseOptions): Promise<ParsedBook>;
  }
  ```
- [ ] **Step 2: Implement TXT Parser**
  Modify `src/services/parser/txt.ts` to parse raw txt files into single chapter containing heading and paragraphs.
- [ ] **Step 3: Implement Clipboard Parser**
  Modify `src/services/parser/clipboard.ts` to support parsed block output.
- [ ] **Step 4: Run typecheck**
  Run: `npm run typecheck`
  Expected: PASS
- [ ] **Step 5: Commit**
  Run: `git add src/services/parser/`
  Run: `git commit -m "feat: implement unified parser contract and txt/clipboard parsers"`

---

### Task 4: EPUB Parser Implementation

**Files:**
- Modify: `package.json`
- Modify: `src/services/parser/epub.ts`

- [ ] **Step 1: Install jszip**
  Run: `npm install jszip`
- [ ] **Step 2: Implement EPUB parser logic**
  Implement in `src/services/parser/epub.ts`:
  - Use `jszip` to extract EPUB zip content.
  - Parse manifest and spine.
  - Extract structured XHTML tags (`<p>`, `<h1>`, `<img>`) and save binary images as blobs to the asset repository.
- [ ] **Step 3: Commit**
  Run: `git add package.json src/services/parser/epub.ts`
  Run: `git commit -m "feat: implement xml-spine EPUB parser using JSZip"`

---

### Task 5: PDF Parser Implementation

**Files:**
- Modify: `package.json`
- Modify: `src/services/parser/pdf.ts`

- [ ] **Step 1: Install pdfjs-dist**
  Run: `npm install pdfjs-dist`
- [ ] **Step 2: Implement PDF text extraction**
  Implement in `src/services/parser/pdf.ts` page-by-page text mapping with layout analysis to form paragraph blocks. Include check for scanned PDFs without selectable text (throw EmptyDocumentError) or password protection (throw EncryptedPdfError).
- [ ] **Step 3: Commit**
  Run: `git add package.json src/services/parser/pdf.ts`
  Run: `git commit -m "feat: implement page-based PDF parser using pdfjs-dist"`

---

### Task 6: UI Ingestion Pipeline (Import Page)

**Files:**
- Modify: `src/app/import/page.tsx`

- [ ] **Step 1: Connect file drop to ParserRegistry**
  Update UI state machine: `idle` -> `parsing` -> `preview` -> `completed`.
- [ ] **Step 2: Render preview card with title/author metadata inputs**
  Allow user to edit metadata, verify word count and cover image, then write to repositories upon clicking "Open in Reader".
- [ ] **Step 3: Commit**
  Run: `git add src/app/import/page.tsx`
  Run: `git commit -m "feat: build import state preview pipeline"`

---

### Task 7: Reader Page Loading & Chapter Navigation

**Files:**
- Modify: `src/providers/ReaderProvider.tsx`
- Modify: `src/app/reader/page.tsx`

- [ ] **Step 1: Delegate loading logic to ReaderProvider**
  Fetch metadata, parsed chapters, and progress using the repositories. Initialize the RSVP engine with active chapter content.
- [ ] **Step 2: Add chapter navigation to Reader UI**
  Trigger next/previous chapter buttons, rendering a "Chapter Completed" overlay when playback ends.
- [ ] **Step 3: Commit**
  Run: `git add src/providers/ReaderProvider.tsx src/app/reader/page.tsx`
  Run: `git commit -m "feat: connect reader load state to repositories with chapter navigation"`
