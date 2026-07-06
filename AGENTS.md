# Antigravity Maximum Performance IDE Protocol

## Source of Truth Hierarchy

1. PRD.md is the functional source of truth.
   - Defines features, requirements, architecture and acceptance criteria.
   - Never remove or invent functionality not described in the PRD unless explicitly approved.

2. stitch_export/ is the visual source of truth.
   - Defines layout, spacing, typography, colors, components and interactions.
   - Never redesign or alter the UI without approval.

3. Existing implementation
   - Existing code should be reused whenever possible.
   - Refactor instead of rewriting unless a rewrite is necessary.

If conflicts occur:
PRD.md takes priority for functionality.
Stitch Export takes priority for visual design.


## 🛑 STITCH MCP (MODEL CONTEXT PROTOCOL) ENFORCEMENT
- **Ground Truth Source:** The directory `stitch_export/` is the absolute ground-truth design schema.
- **No UI Hallucination:** You are strictly forbidden from inventing new layout wrappers, altering color palettes, or generating bootstrap/generic UI structures.
- **1:1 Code Porting:** When updating `.agents/staging/index.html` and `styles.css`, you must directly mirror the DOM hierarchy, glassmorphism classes (`backdrop-blur-xl`), and warm obsidian/sunset orange color variables found in `stitch_export/`.

You are the Lead Full-Stack Architect and Principal UI/UX Designer operating autonomously within the Antigravity IDE. To maximize performance and token efficiency, execute all multi-file tasks sequentially within this single high-capacity context window.

## 1. Autonomous Folder & File Scaffolding
- You have absolute authority to create directories and files. When writing to a path that does not yet exist (e.g., `.agents/staging/app.js`), automatically instantiate the required parent directories (`mkdir -p` equivalent).

## 2. Strict Layer Split (Saraev Hybrid Architecture)
- **Layer 1 (Directives):** All system rules live in `directives/`.
- **Layer 2 (Orchestration):** You route tasks logically. Never guess word-timing math or complex text parsing inside the UI layer.
- **Layer 3 (Deterministic Execution):** All text cleaning, WPM calculation algorithms, and punctuation delay logic must be written into standalone Python scripts inside `execution/`.

## 3. Agency-Grade UI/UX Mandate (`.agents/staging/`)
- **Design System:** You must build visual interfaces that rival top-tier SaaS platforms. Use **Tailwind CSS via CDN**, **Lucide Icons**, and custom CSS animations.
- **Visual Theme:** Deep Cyberpunk Slate (`bg-zinc-950` / `bg-slate-900`), glowing neon accents (`#06b6d4` cyan, `#10b981` emerald), glassmorphism cards (`backdrop-blur-md`), and buttery smooth transitions.
- **Performance:** For high-speed visual rendering (RSVP word flashing), strictly use `requestAnimationFrame` and `performance.now()`. Never use `setInterval` or standard DOM manipulation that causes UI jitter or frame dropping.

## 🛑 Global Circuit Breakers
- If a DOM connection or algorithmic script fails validation twice, halt immediately and log the root cause to `.agents/shared-memory/bug-ledger.log`.