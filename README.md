# FlashRead ⚡

FlashRead is a modern, high-performance Rapid Serial Visual Presentation (RSVP) speed-reading web application. Designed for visual comfort and high-speed comprehension, it parses documents locally and streams words sequentially, highlighting the Optimal Recognition Point (ORP) to accelerate reading speed and minimize vocalization.

---

## ✨ Features

* **⚡ RSVP Speed-Reading Engine**: Customize reading speeds dynamically from 100 to 1000 WPM with real-time progress seeking.
* **🎯 Optimal Recognition Point (ORP)**: Center-aligned target visualization to decrease eye movement fatigue.
* **📂 Local Document Parser**: Support for EPUB, PDF, TXT, and raw clipboard text ingestion.
* **💾 Zero-Server Local Storage**: Secure, private, client-side database persistence using IndexedDB via standard storage wrappers.
* **🎨 Modern Responsive UI**: Built with beautiful glassmorphism cues, interactive layouts, loading skeletons, and fluid theme configurations (Light, Sepia, and Dark modes).
* **📋 Onboarding Checklist**: Clean, empty-state onboarding assistant that guides new users through importing their first book and configuration checks.
* **⌨️ Accessibility & Hotkeys**: Full keyboard-driven shortcuts for playing, pausing, adjusting speeds, and navigating chapters.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js (App Router)](https://nextjs.org)
* **Styling**: Vanilla Tailwind CSS with custom HSL theme tokens
* **Icons**: [Lucide React](https://lucide.dev)
* **Database**: Browser-native IndexedDB (local-only, private)
* **Testing**: Playwright End-to-End browser integration framework

---

## 🚀 Getting Started

Follow these instructions to clone the repository and run the website locally.

### 📋 Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18.x or higher) and `npm` installed.

### 📥 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/flashread.git
   cd flashread
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a local environment file. A template `.env.example` is provided:
   ```bash
   cp .env.example .env.local
   ```
   *(Note: No server-side API keys are required for the standard client-side features).*

4. **Start the Local Development Server**
   ```bash
   npm run dev
   ```
   Now, open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Developer Scripts

Here is a list of available command-line utilities:

* `npm run dev` - Starts the hot-reloading Next.js local development server.
* `npm run build` - Compiles and optimizes the web application for production.
* `npm run start` - Runs the compiled production build locally.
* `npm run lint` - Validates codebase formatting rules via ESLint.
* `npm run typecheck` - Compiles TypeScript files to verify type-safety.
* `npm run format` - Automatically formats all files using Prettier.

### 🧪 Running End-to-End Tests
To run the automated Playwright E2E integration test suite:
1. Ensure the development server is active on `http://localhost:3000`.
2. Run the tests:
   ```bash
   npx playwright test
   ```
   *(Or run our local execution runner: `node tests/e2e/e2e.spec.js`)*

---

## 📁 Repository Overview

* `src/app/` - Application routes, layout wrappers, and view pages.
* `src/components/` - Global components (navigation, layouts, modals).
* `src/features/` - Core domain feature modules:
  * `home/` - Dashboard layout, empty states, and onboarding checklist.
  * `library/` - Book grids, searching utilities, and card listings.
  * `reader/` - RSVP player view, ORP highlight canvas, and reading progress sliders.
  * `settings/` - Customization options, WPM defaults, and font styling controls.
* `src/providers/` - React Contexts for settings, libraries, and toasts.
* `src/services/` - Parsing services (PDF, EPUB, TXT) and IndexedDB storage handlers.
* `tests/` - Playwright automation scripts and upload fixture suites.