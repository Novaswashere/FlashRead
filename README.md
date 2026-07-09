# FlashRead

FlashRead is a rapid serial visual presentation (RSVP) speed-reading web application. You import documents, and the engine flashes words sequentially with a highlighted Optimal Recognition Point (ORP) to accelerate reading.

## Features

* **RSVP Reading Engine**: Customizable speeds up to 1000 WPM with alignment guides.
* **Document Parsers**: Support for EPUB, PDF, TXT, and clipboard imports.
* **Theme Support**: Light, Dark, and Sepia themes.
* **Responsive Layout**: Works on mobile and desktop viewports.
* **Keyboard Navigation**: Playback and speed control hotkeys.

## Project Structure

* `src/app/` - Route pages and page layouts.
* `src/components/` - Reusable UI elements, error handlers, and sidebars.
* `src/features/` - Reader, library, and settings modules.
* `src/services/` - Text parser, IndexedDB storage, and reading progress tracking.
* `src/providers/` - Theme and settings contexts.
* `src/styles/` - Global CSS styles.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment settings:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Do not commit `.env.local` to public repositories.

3. Run the development server:
   ```bash
   npm run dev
   ```

## CLI Commands

* `npm run dev` - Starts the Next.js dev server.
* `npm run build` - Compiles the application for production.
* `npm run start` - Starts the compiled production application.
* `npm run lint` - Runs eslint check.
* `npm run format` - Formats code using Prettier.
* `npm run typecheck` - Compiles TypeScript to check for errors.