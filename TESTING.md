Stage 2 — Unit Tests

Test

ORP calculations

Timing calculations

Parser registry

TXT parser

Clipboard parser

EPUB parser

PDF parser

Repository CRUD

Progress repository

Asset repository

ReaderProvider

PlaybackController

Stage 3 — Integration Tests

Verify

Import

↓

Parser

↓

Repository

↓

Reader

↓

Playback

↓

Progress Save

↓

Reload

↓

Resume

Stage 4 — Playwright E2E

Automate:

Import

Upload TXT

Upload EPUB

Upload PDF

Verify preview

Reader

Open

Play

Pause

Seek

Change WPM

Keyboard shortcuts

Library

Delete

Re-import

Search (future)

Progress

Read halfway

Refresh

Verify restore

Chapters

Next

Previous

Completion overlay

Browser

Chromium

Firefox

WebKit

Responsive

360px

768px

1024px

1440px

Accessibility

Verify

Keyboard navigation

Focus order

ARIA labels

Color contrast

Stage 5 — Regression Testing

Ensure Phase 1 still works

UI unchanged

Animations unchanged

Theme unchanged

Layout unchanged

Ensure Phase 2 still works

Playback

Timing

ORP

Keyboard shortcuts

Statistics

Progress bar

WPM changes

Ensure Phase 3 still works

All import types

Persistence

Chapter navigation

Library

Progress

Images

Stage 6 — Performance

Measure

Import time

Reader startup

IndexedDB writes

IndexedDB reads

Memory usage

Large EPUB loading

Large PDF loading

Animation frame stability

Stage 7 — Failure Testing

Force failures

Corrupted EPUB

Empty TXT

Encrypted PDF

Unsupported file type

Abort import

Duplicate import

Missing metadata

IndexedDB unavailable

Verify graceful recovery.