import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Surfaces (themeable)
        background: "var(--background)",
        "on-background": "var(--on-background)",
        surface: "var(--surface)",
        "surface-dim": "var(--surface-dim)",
        "surface-bright": "var(--surface-bright)",
        "surface-variant": "var(--surface-variant)",
        "surface-tint": "#0053db",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        // Back-compat alias (legacy chrome used bg-surface-dark)
        "surface-dark": "var(--surface-container-lowest)",
        // Foreground / structure
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        "inverse-surface": "var(--inverse-surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",
        "inverse-primary": "var(--inverse-primary)",
        "border-subtle": "var(--border-subtle)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        // Primary
        primary: "var(--primary)",
        "on-primary": "var(--on-primary)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",
        "primary-fixed": "#dbe1ff",
        "primary-fixed-dim": "#b4c5ff",
        "on-primary-fixed": "#00174b",
        "on-primary-fixed-variant": "#003ea8",
        // Secondary
        secondary: "var(--secondary)",
        "on-secondary": "var(--on-secondary)",
        "secondary-container": "var(--secondary-container)",
        "on-secondary-container": "var(--on-secondary-container)",
        "secondary-fixed": "#d3e4fe",
        "secondary-fixed-dim": "#b7c8e1",
        "on-secondary-fixed": "#0b1c30",
        "on-secondary-fixed-variant": "#38485d",
        // Tertiary
        tertiary: "var(--tertiary)",
        "on-tertiary": "var(--on-tertiary)",
        "tertiary-container": "var(--tertiary-container)",
        "on-tertiary-container": "var(--on-tertiary-container)",
        "tertiary-fixed": "#ffdbcd",
        "tertiary-fixed-dim": "#ffb596",
        "on-tertiary-fixed": "#360f00",
        "on-tertiary-fixed-variant": "#7d2d00",
        // Error
        error: "var(--error)",
        "on-error": "var(--on-error)",
        "error-container": "var(--error-container)",
        "on-error-container": "var(--on-error-container)",
        // App-specific
        "orp-highlight": "#EF4444",
        "reader-sepia": "#F4ECD8",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.375rem",
        xl: "0.5rem",
        "2xl": "0.75rem",
        full: "9999px",
      },
      spacing: {
        // Short aliases (Kinetic Clarity spec)
        unit: "4px",
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        gutter: "24px",
        "margin-mobile": "16px",
        "container-max": "1280px",
        "reader-width": "680px",
        // Legacy space-* aliases (back-compat)
        "space-xs": "4px",
        "space-sm": "8px",
        "space-md": "16px",
        "space-lg": "24px",
        "space-xl": "40px",
      },
      fontFamily: {
        // Kinetic Clarity scale — Geist primary, JetBrains Mono for labels
        "headline-xl": ["Geist", "Inter", "sans-serif"],
        "headline-lg": ["Geist", "Inter", "sans-serif"],
        "headline-lg-mobile": ["Geist", "Inter", "sans-serif"],
        "headline-md": ["Geist", "Inter", "sans-serif"],
        "body-lg": ["Geist", "Inter", "sans-serif"],
        "body-md": ["Geist", "Inter", "sans-serif"],
        "label-md": ["JetBrains Mono", "monospace"],
        "label-sm": ["JetBrains Mono", "monospace"],
        // Legacy aliases (back-compat)
        "label-mono": ["JetBrains Mono", "monospace"],
        "display-rsvp": ["Geist", "Inter", "sans-serif"],
        "display-rsvp-mobile": ["Geist", "Inter", "sans-serif"],
      },
      fontSize: {
        "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-lg": ["30px", { lineHeight: "38px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md": ["20px", { lineHeight: "28px", letterSpacing: "0em", fontWeight: "500" }],
        "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
        "label-sm": ["10px", { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "500" }],
        // Legacy aliases
        "label-mono": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
        "display-rsvp": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-rsvp-mobile": ["36px", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
    },
  },
  plugins: [],
};

export default config;
