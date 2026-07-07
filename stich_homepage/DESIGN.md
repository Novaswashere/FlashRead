---
name: Kinetic Clarity
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  orp-highlight: '#EF4444'
  surface-dark: '#0B0E14'
  border-subtle: '#E2E8F0'
  reader-sepia: '#F4ECD8'
typography:
  display-rsvp:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-rsvp-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  space-xs: 4px
  space-sm: 8px
  space-md: 16px
  space-lg: 24px
  space-xl: 48px
  container-max: 1200px
  reader-width: 680px
---

## Brand & Style

The design system is built on the intersection of high-performance utility and literary immersion. Drawing inspiration from the precision of developer tools and the quiet focus of e-readers, the aesthetic is **Modern Minimalist** with a "functionalist" edge. 

The experience should feel invisible yet supportive, reducing cognitive load to allow the user's focus to remain entirely on the text. The UI utilizes heavy whitespace, crisp borders, and a rigorous adherence to a mathematical grid to evoke feelings of efficiency, speed, and intellectual growth. The personality is professional, sophisticated, and distraction-free.

## Colors

The palette is anchored by a "Calm Action" Blue for primary interactions, ensuring clear affordance without visual fatigue. 

- **Light Mode:** Uses a "Paper White" (#FFFFFF) background with high-contrast text (#0F172A). Neutrals are cool-toned to maintain a digital-native feel.
- **Dark Mode:** Transitions to a "Deep Slate" (#0B0E14), prioritizing reduced glow. Borders in dark mode shift to low-opacity whites to maintain structural clarity without creating "light leaks."
- **ORP Highlight:** A specific high-visibility Red (#EF4444) is reserved exclusively for the Optimal Recognition Point in the RSVP engine to guide the eye's focus instantly.
- **Reader Themes:** Includes a dedicated Sepia mode for traditional reading to reduce eye strain during long sessions.

## Typography

The system uses **Inter** for its exceptional legibility at variable sizes and neutral character. A secondary monospaced font, **JetBrains Mono**, is used for technical metadata (WPM counts, progress percentages, and file sizes) to reinforce the precision-tool aesthetic.

- **RSVP Core:** The central reading word uses `display-rsvp` with tight letter spacing to keep the word "cluster" unified for rapid recognition.
- **Body Text:** Standard reading mode utilizes a generous `1.75x` line height to ensure comfortable tracking.
- **Hierarchy:** Contrast is achieved through weight (Semibold for headers) rather than drastic size changes, maintaining a "flat" and modern information architecture.

## Layout & Spacing

The layout follows a strict **8px soft grid** with a 4px baseline for micro-adjustments. 

- **Reader Focus:** The RSVP engine and traditional reader are centered with a constrained max-width (`680px`) to mimic the optimal line length of physical books and prevent eye travel fatigue.
- **Library Grid:** Uses a fluid layout for book covers, maintaining 24px gutters.
- **Margins:** Desktop views employ generous 48px outer margins (Whitespace-first) to create a "gallery" feel for the library. Mobile views collapse margins to 16px to maximize reading surface area.
- **Alignment:** All controls (Play/Pause, Speed) are grouped in a persistent "Dock" at the bottom of the screen, floating slightly above the content.

## Elevation & Depth

This design system avoids heavy drop shadows in favor of **Tonal Layering** and **Subtle Outlines**.

- **Surface Levels:** 
  - Level 0 (Background): The primary canvas.
  - Level 1 (Cards/Sidebar): 1px subtle border (#E2E8F0) with no shadow.
  - Level 2 (Modals/Popovers): A soft 8px blur shadow with 4% opacity to indicate temporary focus.
- **Active State:** Buttons and interactive elements use a 1px inset shadow on press to provide tactile feedback without looking skeuomorphic.
- **Glassmorphism:** Navigation bars and the RSVP Dock use a backdrop-filter blur (12px) to provide context of the content underneath while maintaining legibility.

## Shapes

The shape language is **Soft (0.25rem)**. This subtle rounding provides a friendly touch to an otherwise clinical, grid-heavy layout.

- **Standard Elements:** Buttons, inputs, and card containers use the 4px (`rounded`) radius.
- **Book Covers:** Use the 8px (`rounded-lg`) radius to mimic the slightly softened corners of a physical book binding.
- **RSVP ORP Indicator:** Uses a sharp vertical line or a small 2px tick to maintain mathematical precision in the reading engine.

## Components

### Buttons
Primary buttons are solid Blue (#2563EB) with white text. Secondary buttons use a subtle gray border with no background. Interaction states (hover) should be a simple 10% darken/lighten of the base color.

### The RSVP Engine
The core component. The word is centered both horizontally and vertically. The ORP (Optimal Recognition Point) is highlighted in Red. Use a monospaced font for the WPM counter below the word to prevent "jitter" when numbers change.

### Cards (Library)
Minimalist containers. No heavy shadows. The title and author are placed directly below the book cover rather than inside the card. Progress is shown as a thin 2px bar at the bottom edge of the cover image.

### Controls (The Dock)
A floating horizontal bar containing playback and speed controls. It uses a "frosted glass" effect. Icons are 20px, stroke-based (2px weight) to match the typography's clean lines.

### Inputs
Search and WPM inputs use a fixed-width mono font. They feature a 1px border that turns Blue on focus. Labels always sit above the input in `label-mono` style.

### Progress Bar
A full-width, 4px height bar. The "track" is low-opacity gray; the "fill" is the primary blue. On hover, the bar expands to 8px to allow for easier scrubbing/seeking through chapters.