# FlashRead

FlashRead is a high-performance speed-reading web application built with Next.js, React, Tailwind CSS, and TypeScript. It utilizes the **RSVP (Rapid Serial Visual Presentation)** methodology, displaying words sequentially at user-selected speeds (Words Per Minute) with visual markers highlighting the **ORP (Optimal Recognition Point)**.

---

## 🚀 Key Features

* **RSVP Speed Reading Engine**: Read up to 1000 WPM with red ORP character alignment guides.
* **Format Agnostic Parsing**: Modular stubs ready to parse `EPUB`, `PDF`, `TXT`, and raw clipboard content.
* **Unified Design System**: Centralized design tokens supporting Light, Dark, and Sepia reading environments.
* **Domain-Driven Modular Folders**: Isolated structures separating presentation primitives, domain components, feature sections, and data services.
* **Accessibility Focused**: Screen reader hints, prefers-reduced-motion media query respect, high-contrast outline highlights, and complete keyboard shortcuts navigation.

---

## 📂 Project Architecture

The codebase follows a strict separation of concerns, divided into three key tiers:

```
c:/Users/ameen/Desktop/FlashRead-v1/
├── src/
│   ├── app/                      # Route Pages (Composition Layers)
│   ├── config/                   # Configuration Layers
│   ├── design-system/            # Themes, Spacing, Typography & Icon Mappings
│   ├── components/
│   │   ├── errors/               # Global Error Handlers (ErrorBoundary)
│   │   ├── layout/               # Global Shell Wrappers (Navigation Sidebar & Dock)
│   │   ├── shared/               # Domain-Agnostic Reusable Elements (BookCard, ProgressBar)
│   │   └── ui/                   # Generic UI Primitives (Button, Slider, Switch, Toast)
│   ├── features/                 # Domain Feature Components & Hooks
│   │   ├── home/
│   │   ├── library/
│   │   ├── import/
│   │   ├── reader/               # RSVP presentation components
│   │   ├── settings/
│   │   └── auth/
│   ├── services/                 # Central Business Logic Services & Parsers
│   │   ├── parser/               # epub, pdf, txt, and clipboard parsers
│   │   ├── auth.ts
│   │   ├── storage.ts
│   │   └── progress.ts
│   ├── providers/                # Global Application State Contexts
│   ├── mocks/                    # Decoupled Mock Database Layer
│   ├── hooks/                    # Reusable Custom React Hooks
│   ├── lib/                      # Shared helper functions (formatters, validators)
│   └── styles/                   # Core Global Tailwinds & RSVP custom guides
```

### 1. Presentation Components (`src/components/`)
* **UI Primitives (`ui/`)**: Basic controls (`Button`, `Input`, `Card`, `Slider`, `Modal`, `Switch`, `Toast`) that receive data and callbacks via props only.
* **Shared Components (`shared/`)**: Domain-agnostic components (`BookCard`, `BookCover`, `ProgressBar`, `EmptyState`, `SearchBar`) reused across pages.
* **No Side-Effects**: These contain no business logic, state orchestration, mock data imports, or provider access.

### 2. Feature Components (`src/features/`)
* Feature components live inside their domain folder (`src/features/<feature>/components/`).
* They coordinate layout blocks and map actions. They do not directly import mock database files.

### 3. Pages Composition Layer (`src/app/`)
* Routes pages (`page.tsx`) remain thin composition layers containing minimal JSX.
* They import static mock databases from the data layer (`src/mocks/`) and wire them down into the feature components.

---

## 🛠️ Tech Stack & Scripts

* **Framework**: Next.js (App Router)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS, PostCSS
* **Code Quality**: ESLint, Prettier

### Available Commands

* `npm run dev`: Starts the Next.js development server.
* `npm run build`: Compiles the application for production.
* `npm run start`: Starts a built Next.js server.
* `npm run lint`: Runs ESLint checks.
* `npm run format`: Formats code files using Prettier.
* `npm run typecheck`: Runs strict compiler type validation.