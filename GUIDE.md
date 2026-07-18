
# ⚡ The Master Guide: UI/UX & Design Skills Like a Pro

This handbook outlines how to utilize the local UI/UX and styling skills located in your `.agents/skills/` directory like an expert designer and engineer. These unified tools cover brand voice, design token hierarchies, Tailwind components, and micro-interaction timings.

---

## 🗺️ Visual Map of the Design Skill Ecosystem

Before writing code, understand how these four skills relate to each other:

```
                  ┌──────────────┐
                  │    design    │  ◄── Brand brief, logos, assets, and presentation layouts
                  └──────┬───────┘
                         │ (Extract primitives)
                         ▼
                  ┌──────────────┐
                  │design-system │  ◄── Token layers (Primitive → Semantic → Component CSS)
                  └──────┬───────┘
                         │ (Implement variables)
                         ▼
                  ┌──────────────┐
                  │  ui-styling  │  ◄── Tailwind utilities, base stylesheets, and shadcn/ui
                  └──────┬───────┘
                         │ (Refine and audit)
                         ▼
                  ┌──────────────┐
                  │  ui-ux-pro   │  ◄── Design checks, micro-interaction timing, mobile-first
                  └──────────────┘
```

---

## 💎 The Four Core UI/UX Skills

### 1. `ui-ux-pro`
**Used For:** Visual checks, accessibility (WCAG), micro-interaction timings, layout density scaling, and platform-specific interface guidelines.

*   **Key Guidelines:**
    *   **Touch Targets:** Minimum 44×44pt for interactive areas (using `hitSlop` paddings when visual elements are smaller).
    *   **Interaction Feedback:** Interactive components must provide clear press states (ripple, opacity, or elevation shifts) within 80-150ms without shifting layout bounds.
    *   **Animations:** Micro-interactions should follow spring physics and be completed within 150-300ms, using exit timings that are faster than enter timings.
    *   **Strict Icon Rule:** **Never** use raw Emojis as structural or navigation icons. Icons should come from a vector family (like Phosphor `@phosphor-icons/react` or Heroicons) to preserve dark mode scaling and crisp rendering.
*   **Pro CLI Command:**
    ```bash
    # Search recommendations based on product keyword density and motion levels
    python .agents/skills/ui-ux-pro/scripts/search.py "dashboard productivity minimal" --design-system --motion 5 --density 8 -p "MyProject"
    ```

### 2. `ui-styling`
**Used For:** Building responsive visual interfaces, Radix UI primitives, shadcn/ui configuration, and systematic layout spacing.

*   **Key Guidelines:**
    *   **Utility-First Styling:** Use utility classes directly in the markup. Extract CSS files only for base variables or global typography overrides.
    *   **Mobile-First Design:** Write styling for small screen viewports by default, layering responsive utility breakpoints (`md:`, `lg:`) for desktop views.
    *   **Canvas Design Layer:** Approach layouts with a systematic, museum-like spatial grid. Use high-contrast margins, elegant borders, and subtle glassmorphic backdrops to emphasize content.
*   **Pro CLI Command:**
    ```bash
    # Add pre-configured accessible components to your workspace
    python .agents/skills/ui-styling/scripts/shadcn_add.py button card dialog
    ```

### 3. `design-system`
**Used For:** Translating design details into a three-layer CSS token architecture, configuring custom Tailwind extensions, and generating presentation components.

*   **Key Guidelines:**
    *   **The Three-Layer Architecture:**
        1.  *Primitive Tokens*: Raw parameters (`--color-blue-500: #3b82f6;`).
        2.  *Semantic Tokens*: Purpose-based aliases (`--color-primary: var(--color-blue-500);`).
        3.  *Component Tokens*: Component-specific overrides (`--button-bg: var(--color-primary);`).
    *   **No Raw Hex Values:** Never hardcode colors directly in UI layout classes. Always map surfaces and typography colors to semantic theme tokens.
*   **Pro CLI Command:**
    ```bash
    # Generate static CSS style tokens from a JSON configuration file
    node .agents/skills/design-system/scripts/generate-tokens.cjs --config tokens.json -o tokens.css
    ```

### 4. `design`
**Used For:** Brand identity design, corporate identity programs (CIP), presentations (pitch decks), AI logos, and platform banner exports.

*   **Key Guidelines:**
    *   **Unified Brand Voice:** Ensure all logo, typography, and color rules map contextually to the brand's core demographic.
    *   **Duarte Sparkline Emotion Beats:** Premium presentation slide strategies should alternate between "What Is" (frustration) and "What Could Be" (hope) states, applying pattern breaks at 1/3 and 2/3 deck positions.
*   **Pro CLI Command:**
    ```bash
    # Generate SVG logo vector configurations with AI
    python .agents/skills/design/scripts/logo/generate.py --brand "FlashRead" --style minimalist --industry tech
    ```

---

## 🚀 Pro Workflow: Building a Page From Scratch

Follow this workflow to execute a high-fidelity page implementation:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 1. ANALYZE (design)                                                         │
│    Define product type, keywords, and target audience.                     │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 2. DEFINE TOKENS (design-system)                                           │
│    Create custom CSS variables using the Primitive -> Semantic structure.   │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 3. CONFIGURE STYLING (ui-styling)                                          │
│    Setup Tailwind theme overrides and install shadcn components.           │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 4. INTEGRATE INTERACTIONS (ui-ux-pro)                                       │
│    Apply micro-interaction timing, gesture clearances, and tap feedback.   │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 5. AUDIT & DELIVER                                                         │
│    Run the E2E verification test suite and inspect on multiple screens.    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔎 Pre-Delivery Checklist (The Expert Standard)

Before staging and pushing any visual edits, verify these standards:

### 🎨 Visual & Theme Quality
* [ ] **No Raw Colors:** Check that no ad-hoc hex values (`#fff`, `#000`) are used in layouts. All colors must use design token variables.
* [ ] **Icon Consistency:** Verify icons are vector SVGs from the same library family. Check that no raw emojis are used as structural button content.
* [ ] **Theme Contrast:** Ensure primary text contrast is at least `4.5:1` in both Light and Dark modes.
* [ ] **Active & Selected States:** Verify buttons and navigation tabs look clearly focused or selected when clicked.

### ⚡ Interaction & Polish
* [ ] **Tap/Press Feedback:** Tappable controls must trigger immediate visual changes (opacity reduction, background tint, or ripple) to confirm input.
* [ ] **Interactive Targets:** Ensure interactive buttons have a tapping target area of at least `44x44pt` to satisfy accessibility standards.
* [ ] **Micro-Animations:** Ensure transitions (drawers sliding out, hover elevations, fade-ins) run between `150ms` and `300ms` with smooth ease curves.

### 📱 Layout & Breakpoints
* [ ] **Safe-Area Compliance:** Ensure fixed headers, tab navs, and floating cards clear notch cutouts, status bars, and home indicators.
* [ ] **Dense vs Spacious Gutters:** Apply compact spacing system on data-heavy settings pages, and generous scales on home dashboards.
* [ ] **Mobile-to-Desktop Scaling:** Test pages on different browser viewport dimensions to ensure layouts adapt cleanly.
