/**
 * Kinetic Clarity Minimalist — design tokens (JS mirror of globals.css / tailwind config).
 * Keep in sync with `src/styles/globals.css` and `tailwind.config.ts`.
 */
export const SPACING = {
  unit: "4px",
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "40px",
  gutter: "24px",
  marginMobile: "16px",
  containerMax: "1280px",
  readerWidth: "680px",
};

export const ROUNDING = {
  sm: "0.125rem",
  default: "0.125rem",
  md: "0.25rem",
  lg: "0.375rem",
  xl: "0.5rem",
  "2xl": "0.75rem",
  full: "9999px",
};

export const TYPE_SCALE = {
  headlineXl: { size: 40, weight: 600, lineHeight: 48, letterSpacing: "-0.02em" },
  headlineLg: { size: 30, weight: 600, lineHeight: 38, letterSpacing: "-0.01em" },
  headlineLgMobile: { size: 24, weight: 600, lineHeight: 32, letterSpacing: "-0.01em" },
  headlineMd: { size: 20, weight: 500, lineHeight: 28, letterSpacing: "0em" },
  bodyLg: { size: 16, weight: 400, lineHeight: 24, letterSpacing: "0em" },
  bodyMd: { size: 14, weight: 400, lineHeight: 20, letterSpacing: "0em" },
  labelMd: { size: 12, weight: 500, lineHeight: 16, letterSpacing: "0.05em" },
  labelSm: { size: 10, weight: 500, lineHeight: 14, letterSpacing: "0.05em" },
} as const;
