# Product Requirements Document (PRD)

# Project Name

Project Codename: FlashRead

Version: 1.0 (MVP)

Status: Ready for Development

---

# Vision

FlashRead is a cross-platform reading application that enables users to read ebooks faster using Rapid Serial Visual Presentation (RSVP) while maintaining an enjoyable reading experience.

The first release focuses on providing a polished RSVP reader with strong ebook support and library management.

This release is NOT intended to compete with Kindle or Apple Books.

Instead, it validates whether users prefer an RSVP-first reading experience.

---

# Product Goals

Primary Goals

• Read books faster
• Reduce distractions
• Make importing books effortless
• Support major ebook formats
• Build a beautiful reading experience

Success Metrics

• Users complete books
• Users return regularly
• Users increase average reading speed
• Low crash rate
• Fast parsing performance

---

# Target Users

Primary

• Students
• Professionals
• Productivity enthusiasts
• Readers with limited time

Secondary

• Casual readers
• Speed readers

---

# Platforms

Frontend

• Web
• Android
• iOS

Backend

• Cloud API
• User accounts
• Book storage
• Reading progress syncing

---

# Functional Requirements

## Authentication

Required

• Email Sign Up
• Email Login
• Google Login
• Guest Mode

---

## Home Screen

Display

Continue Reading

Recently Opened

Library

Import Book

Settings

Search

---

## Library

Users can

Import EPUB

Import PDF

Import TXT

Paste Text

View all books

Search books

Delete books

Rename books

Sort books

Recently opened section

Continue Reading section

---

## Book Import

Supported Formats

EPUB

PDF

TXT

Clipboard Text

Processing

Automatic parsing

Extract chapters

Remove page numbers

Remove headers

Remove footers where possible

Preserve paragraphs

Generate metadata

Store parsed version

---

## Reading Modes

### RSVP Mode

Features

Adjustable WPM

100–1200+

Play

Pause

Restart

Skip Backward

Skip Forward

Progress Bar

Estimated Time Remaining

Resume Reading

Smart punctuation pauses

ORP highlighting

Custom fonts

Font size

Dark mode

Light mode

Fullscreen mode (Web)

Landscape support (Mobile)

Keep screen awake while reading

---

### Traditional Reading Mode

Features

Scrollable pages

Theme support

Font size

Font family

Bookmarks

Resume reading

This mode acts as a fallback for users who prefer standard reading.

---

## Reading Progress

Automatically save

Current word

Current chapter

Current page equivalent

Reading time

Last opened timestamp

Sync progress when authenticated

---

## Search

Search library

Search by

Title

Author

Filename

Recent search history

---

## Settings

Reading speed

Theme

Default font

Font size

Default reading mode

ORP toggle

Smart pause toggle

Keep screen awake

---

# Non Functional Requirements

Fast loading

Book import < 5 seconds for average EPUB

Smooth RSVP playback

60 FPS animations

Offline reading

Responsive UI

Accessibility support

Autosave every few seconds

Cross-device sync for authenticated users

---

# UI Pages

Splash

Authentication

Home

Library

Import

Reader

Settings

Search

About

---

# Reader UI

Top Bar

Book title

Current chapter

Search

Settings

Center

Current RSVP word

ORP highlighting

Bottom

Progress slider

Play/Pause

Skip Back

Skip Forward

Speed controls

Time remaining

---

# Data Models

User

- id
- email
- displayName
- createdAt

Book

- id
- title
- author
- format
- cover
- chapterCount
- createdAt

ParsedBook

- id
- bookId
- chapters
- totalWords
- metadata

ReadingProgress

- userId
- bookId
- currentChapter
- currentWord
- readingTime
- lastOpened

Settings

- defaultWPM
- theme
- font
- fontSize
- ORPEnabled
- SmartPauseEnabled
- ReadingMode

---

# MVP Features

Reading Engine

✓ RSVP Reader

✓ Adjustable WPM

✓ Play

✓ Pause

✓ Skip Back

✓ Skip Forward

✓ Progress Bar

✓ Reading Progress Saving

✓ ORP Highlighting

✓ Smart Punctuation Pauses

✓ Traditional Reading Mode

Importing

✓ EPUB

✓ PDF

✓ TXT

✓ Paste Text

✓ Automatic Parsing

✓ Chapter Detection

Library

✓ Library

✓ Continue Reading

✓ Recently Opened

✓ Search

Customization

✓ Themes

✓ Fonts

✓ Font Size

✓ Reading Speed

---

# Excluded From Version 1

AI

Summaries

Flashcards

Vocabulary

Quizzes

Multiplayer

Leaderboards

Achievements

Cloud Notes

Bookmarks Sharing

Online Sync Beyond Reading Progress

Adaptive RSVP

Reading Coach

Subscriptions

OCR

Browser Extension

Desktop App

---

# Technical Notes

Architecture

Frontend

React / Next.js

Backend

Supabase or Firebase (authentication, storage, database)

Reader Engine

Separate RSVP rendering engine

Separate parser module

Separate import service

State Management

Global reader state

Persistent reading progress

Autosave

---

# Acceptance Criteria

A user can

Import an EPUB

Import a PDF

Import a TXT

Paste text

Open a book

Read in RSVP mode

Read in traditional mode

Adjust WPM

Pause

Resume

Navigate chapters

Resume where they left off

Search their library

Switch themes

Change fonts

Change font sizes

All without losing progress.

---

# Future Roadmap

Version 2

Reading statistics

Daily streaks

Goals

Time saved

Version 3

AI summaries

AI quizzes

Vocabulary

Flashcards

Version 4

Online multiplayer

Leaderboards

Achievements

Reading clubs

Version 5

Adaptive RSVP

AI tutor

Cloud sync

Advanced analytics