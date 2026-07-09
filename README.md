# FlashRead

FlashRead is a speed-reading web application built with Next.js, React, Tailwind CSS, and TypeScript. It uses the Rapid Serial Visual Presentation (RSVP) method to display words sequentially with an Optimal Recognition Point (ORP) highlight guide.

## Features

* **RSVP Reading Engine**: Customizable speeds up to 1000 WPM with character alignment guides.
* **Document Parsers**: Support for EPUB, PDF, TXT, and clipboard import.
* **Theme Support**: Integrated Light, Dark, and Sepia reading themes.
* **Responsive Design**: Designed for both mobile and desktop screens.
* **Keyboard Navigation**: Complete keyboard shortcut support for playback and speed controls.

## Project Structure

```
├── src/
│   ├── app/                      # Route pages and composition
│   ├── components/
│   │   ├── errors/               # Error handlers
│   │   ├── layout/               # Sidebar and navigation
│   │   ├── shared/               # Reusable elements (BookCard, ProgressBar)
│   │   └── ui/                   # Primitive inputs and toggles (Button, Switch)
│   ├── features/                 # Domain components (reader, library, settings)
│   ├── services/                 # Parser, storage, and progress logic
│   ├── providers/                # Theme and settings contexts
│   └── styles/                   # Global CSS
```

## Setup & Secrets Management

1. Install dependencies:
   ```bash
   npm install
   ```

2. Manage Environment Variables:
   Copy `.env.example` to `.env.local` to configure environment settings:
   ```bash
   cp .env.example .env.local
   ```
   Do not commit `.env.local` or any environment configurations containing API keys or private credentials. The `.gitignore` is configured to block these files.

3. Run the development server:
   ```bash
   npm run dev
   ```

## Available Commands

* `npm run dev`: Start development server on port 3000.
* `npm run build`: Compile the production application.
* `npm run start`: Run the compiled production application.
* `npm run lint`: Run ESLint rules.
* `npm run format`: Format code with Prettier.
* `npm run typecheck`: Run TypeScript compilation check.