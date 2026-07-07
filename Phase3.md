# Implementation Plan - Phase 3: Document Import & Parsing

This phase implements FlashRead's complete document ingestion pipeline. Users will be able to import real documents (TXT, EPUB, PDF), which are parsed into a normalized internal document model that can be consumed by both the RSVP engine and future traditional reading modes.

This phase focuses only on importing and parsing documents.

---

# Phase Constraints

The following features are explicitly OUT OF SCOPE:

- Cloud synchronization
- Database persistence
- Library management
- User accounts
- AI processing
- OCR
- Editing imported documents
- Notes/highlights
- Bookmarks
- Traditional reading renderer (only prepare compatibility)

The parser layer must remain completely independent from the RSVP engine.

---

# Architectural Principles

The parser pipeline must follow this flow:

File
    ↓
File Type Detection
    ↓
Parser
    ↓
Normalized Document Model
    ↓
ReaderProvider
    ↓
PlaybackController

The RSVP engine must never parse files directly.

The parser layer must never import React.

The parser layer must never know about playback.

The PlaybackController must never know whether text originated from TXT, EPUB, or PDF.

---

# Future Compatibility Requirements

The parser must preserve document structure whenever possible.

DO NOT flatten rich documents into a single text string.

Instead preserve:

- document metadata
- chapter hierarchy
- headings
- paragraphs
- illustrations
- image positions
- emphasis (future)
- hyperlinks (future)
- footnotes (future)

Even if the current RSVP reader ignores some of these.

This prevents future rewrites when adding:

- Traditional Reader Mode
- Image viewing
- Notes
- Bookmarks
- Rich formatting

---

# Proposed Directory Structure

src/features/import/

    engine/
        parserRegistry.ts
        parserFactory.ts

    parsers/
        txtParser.ts
        epubParser.ts
        pdfParser.ts

    services/
        importService.ts

    types.ts

src/models/

    document.ts

src/mocks/

    sampleBooks/

---

# Normalized Document Model

Create a reusable document model.

Example:

Document

- id
- title
- author
- language
- description
- coverImage
- wordCount

chapters[]

Chapter

- id
- title
- blocks[]

Block

type:

- paragraph
- heading
- image

ParagraphBlock

- text

HeadingBlock

- level
- text

ImageBlock

- image reference
- caption
- original position

The RSVP engine will extract readable text from paragraph blocks only.

Future reader modes will render every block type.

---

# Parser Responsibilities

TXT Parser

- Read UTF-8 text
- Detect paragraphs
- Create a single chapter if none exist
- Count words
- Generate metadata

---

EPUB Parser

Extract:

- metadata
- chapters
- headings
- paragraphs
- illustrations
- cover image

Preserve chapter order.

Ignore unsupported formatting safely.

---

PDF Parser

Extract:

- paragraphs
- page order
- metadata (if available)

Handle:

- encrypted PDFs
- empty PDFs
- malformed PDFs

Gracefully report failures.

---

# Parser Registry

Implement a parser registry/factory.

Example concept:

".txt" → TxtParser

".epub" → EpubParser

".pdf" → PdfParser

Unsupported extensions return structured errors.

Adding DOCX later should only require registering another parser.

---

# Import Service

Implement ImportService.

Responsibilities:

- validate file
- detect parser
- invoke parser
- normalize output
- return ParsedDocument

ImportService becomes the only public API for importing files.

---

# Error Handling

Create structured import errors.

Examples:

UnsupportedFileType

CorruptedDocument

EncryptedPDF

EmptyDocument

ParsingFailed

Errors should include:

code

message

recoverable

No parser should throw uncaught exceptions.

---

# Reader Integration

Replace mock reader text.

ReaderProvider should receive ParsedDocument.

PlaybackController should receive extracted paragraph text from ParsedDocument.

No PlaybackController changes should be required.

---

# Import UI Integration

Connect the existing Import page.

Support:

- drag & drop
- file picker
- upload progress
- parsing progress
- success state
- error state

After parsing:

Display:

- title
- author
- word count
- chapter count
- cover image (if available)

Allow:

Open in Reader

Cancel

---

# Image Preservation

Images discovered during parsing must be stored.

Do NOT discard illustrations.

Reader rendering of images is deferred to a later phase.

Future reader settings may include:

- Show illustrations
- Hide illustrations
- Pause playback at illustrations

The parser should already preserve image positions.

---

# Accessibility

Maintain keyboard navigation.

Maintain drag-and-drop accessibility.

Maintain focus management.

---

# Verification Plan

Automated

- TypeScript compilation
- ESLint
- Build verification

Parser Tests

TXT

- empty file
- one paragraph
- multiple paragraphs

EPUB

- metadata extraction
- chapters
- cover extraction
- image preservation

PDF

- normal document
- encrypted document
- corrupted document

Import Service

- parser selection
- unsupported extension
- parser failure propagation

Manual Verification

Import TXT

Import EPUB

Import PDF

Large document

Small document

Malformed document

Unsupported extension

Verify metadata preview

Verify chapter count

Verify images preserved

Verify opening document in RSVP reader

Verify PlaybackController remains unchanged

Verify parser layer contains no React imports

Verify reader engine contains no parser imports

---

# Definition of Done

Phase 3 is complete when:

✓ TXT imports successfully

✓ EPUB imports successfully

✓ PDF imports successfully

✓ Unsupported files fail gracefully

✓ Metadata is extracted

✓ Chapters are preserved

✓ Images are preserved in the document model

✓ Reader opens imported documents

✓ PlaybackController requires no parser-specific logic

✓ The normalized document model can support both RSVP mode and a future traditional ebook reader without architectural changes.