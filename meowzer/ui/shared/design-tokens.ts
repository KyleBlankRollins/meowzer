import { css, unsafeCSS } from "lit";

/**
 * PRIMITIVE TOKENS - LIGHT MODE
 * Raw color values from our playful pastel palette.
 * These are the foundation that semantic tokens reference.
 */
const primitivesLight = {
  // Playful pastel palette
  blue100: "hsl(210.57, 76.81%, 86.47%)", // soft blue
  cyan100: "hsl(180, 100%, 95.88%)", // soft cyan
  green100: "hsl(103.5, 68.97%, 88.63%)", // soft green
  yellow100: "hsl(60, 100%, 96.47%)", // soft yellow
  pink100: "hsl(327.39, 69.7%, 87.06%)", // soft pink
  purple100: "hsl(300, 100%, 96.08%)", // soft purple

  // Neutral scale (blue-tinted for cohesion)
  neutral100: "hsl(210, 30%, 99%)", // lightest
  neutral200: "hsl(210, 30%, 98%)",
  neutral300: "hsl(210, 25%, 94%)",
  neutral400: "hsl(210, 20%, 85%)",
  neutral500: "hsl(210, 15%, 65%)",
  neutral600: "hsl(210, 12%, 45%)",
  neutral700: "hsl(210, 10%, 30%)",
  neutral800: "hsl(210, 8%, 20%)",
  neutral900: "hsl(210, 8%, 12%)", // darkest
} as const;

/**
 * PRIMITIVE TOKENS - DARK MODE
 * Darker, more muted versions of our color palette for dark mode.
 * Maintains the same hues but adjusted for dark backgrounds.
 */
const primitivesDark = {
  // Muted pastel palette for dark mode (reduced lightness, adjusted saturation)
  blue100: "hsl(210.57, 60%, 65%)", // deeper blue but still soft
  cyan100: "hsl(180, 80%, 70%)", // muted cyan
  green100: "hsl(103.5, 50%, 65%)", // muted green
  yellow100: "hsl(60, 80%, 75%)", // muted yellow
  pink100: "hsl(327.39, 55%, 70%)", // muted pink
  purple100: "hsl(300, 75%, 75%)", // muted purple

  // Dark neutral scale (inverted - darker is lighter in dark mode)
  neutral100: "hsl(210, 15%, 12%)", // darkest surface
  neutral200: "hsl(210, 15%, 16%)", // subtle surface
  neutral300: "hsl(210, 15%, 22%)", // hover surface
  neutral400: "hsl(210, 12%, 32%)", // borders/disabled
  neutral500: "hsl(210, 10%, 50%)", // mid-tone
  neutral600: "hsl(210, 8%, 65%)", // secondary text
  neutral700: "hsl(210, 10%, 75%)", // emphasis
  neutral800: "hsl(210, 15%, 88%)", // high emphasis
  neutral900: "hsl(210, 20%, 95%)", // primary text (lightest)
} as const;

/**
 * Active primitives - defaults to light mode
 */
const primitives = primitivesLight;

/**
 * SEMANTIC TOKENS
 * These describe the purpose/meaning rather than the appearance.
 * They reference primitive tokens and are what components should use.
 */
export const tokens = {
  // Brand colors
  colorBrandPrimary: primitives.blue100,
  colorBrandSecondary: primitives.cyan100,
  colorBrandAccent: primitives.pink100,

  // Surface colors (backgrounds)
  colorSurfaceDefault: primitives.neutral100,
  colorSurfaceSubtle: primitives.neutral200,
  colorSurfaceElevated: primitives.neutral100,
  colorSurfaceHover: primitives.neutral300,

  // Interactive states
  colorInteractivePrimary: primitives.blue100,
  colorInteractiveSecondary: primitives.cyan100,
  colorInteractiveHover: primitives.neutral300,
  colorInteractiveFocus: primitives.blue100,
  colorInteractiveDisabled: primitives.neutral400,

  // Text colors
  colorTextPrimary: primitives.neutral900,
  colorTextSecondary: primitives.neutral600,
  colorTextDisabled: primitives.neutral400,
  colorTextOnBrand: primitives.neutral900,

  // Border colors
  colorBorderSubtle: primitives.neutral300,
  colorBorderDefault: primitives.neutral400,
  colorBorderStrong: primitives.neutral600,
  colorBorderFocus: primitives.blue100,

  // Status/Feedback colors
  colorStatusSuccess: primitives.green100,
  colorStatusWarning: primitives.yellow100,
  colorStatusError: primitives.pink100,
  colorStatusInfo: primitives.blue100,

  // Typography
  fontFamily:
    '"Comic Neue", "Nunito", "Quicksand", system-ui, -apple-system, sans-serif',
  fontSize: "15px",
  fontSizeSmall: "13px",
  fontSizeMedium: "17px",
  fontSizeLarge: "22px",
  fontSizeXLarge: "28px",
  fontWeightNormal: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  lineHeight: "1.6",
  lineHeightTight: "1.3",
  lineHeightNormal: "1.6",
  lineHeightRelaxed: "1.8",

  // Spacing
  space1: "4px",
  space2: "8px",
  space3: "12px",
  space4: "16px",
  space5: "24px",
  space6: "32px",
  space7: "48px",
  space8: "64px",

  // Border Radius - rounded/playful
  radiusNone: "0",
  radiusSmall: "8px",
  radiusMedium: "12px",
  radiusLarge: "20px",
  radiusFull: "9999px",

  // Shadows - soft and playful
  shadowSmall: "0 2px 8px rgba(0, 0, 0, 0.08)",
  shadowMedium: "0 4px 16px rgba(0, 0, 0, 0.12)",
  shadowLarge: "0 8px 32px rgba(0, 0, 0, 0.16)",
} as const;

/**
 * Type-safe token names for autocomplete and validation
 */
export type TokenName = keyof typeof tokens;

/**
 * DARK THEME TOKENS
 * Override semantic tokens for dark mode using dark primitives
 */
export const tokensDark = {
  ...tokens,

  // Brand colors - use muted dark mode versions
  colorBrandPrimary: primitivesDark.blue100,
  colorBrandSecondary: primitivesDark.cyan100,
  colorBrandAccent: primitivesDark.pink100,

  // Surface colors - inverted scale
  colorSurfaceDefault: primitivesDark.neutral100,
  colorSurfaceSubtle: primitivesDark.neutral200,
  colorSurfaceElevated: primitivesDark.neutral300,
  colorSurfaceHover: primitivesDark.neutral300,

  // Interactive states
  colorInteractivePrimary: primitivesDark.blue100,
  colorInteractiveSecondary: primitivesDark.cyan100,
  colorInteractiveHover: primitivesDark.neutral300,
  colorInteractiveFocus: primitivesDark.blue100,
  colorInteractiveDisabled: primitivesDark.neutral400,

  // Text colors - inverted (lighter text on dark bg)
  colorTextPrimary: primitivesDark.neutral900,
  colorTextSecondary: primitivesDark.neutral600,
  colorTextDisabled: primitivesDark.neutral400,
  colorTextOnBrand: primitivesDark.neutral100,

  // Border colors
  colorBorderSubtle: primitivesDark.neutral300,
  colorBorderDefault: primitivesDark.neutral400,
  colorBorderStrong: primitivesDark.neutral600,
  colorBorderFocus: primitivesDark.blue100,

  // Status colors - use muted dark versions
  colorStatusSuccess: primitivesDark.green100,
  colorStatusWarning: primitivesDark.yellow100,
  colorStatusError: primitivesDark.pink100,
  colorStatusInfo: primitivesDark.blue100,

  // Shadows - lighter/more subtle for dark mode
  shadowSmall: "0 2px 8px rgba(0, 0, 0, 0.3)",
  shadowMedium: "0 4px 16px rgba(0, 0, 0, 0.4)",
  shadowLarge: "0 8px 32px rgba(0, 0, 0, 0.5)",
} as const;

// CSS Custom Properties for use in Lit components
export const designTokens = css`
  :host,
  :root {
    /* Colors - Brand */
    --mb-color-brand-primary: ${unsafeCSS(tokens.colorBrandPrimary)};
    --mb-color-brand-secondary: ${unsafeCSS(
      tokens.colorBrandSecondary
    )};
    --mb-color-brand-accent: ${unsafeCSS(tokens.colorBrandAccent)};

    /* Colors - Surface */
    --mb-color-surface-default: ${unsafeCSS(
      tokens.colorSurfaceDefault
    )};
    --mb-color-surface-subtle: ${unsafeCSS(
      tokens.colorSurfaceSubtle
    )};
    --mb-color-surface-elevated: ${unsafeCSS(
      tokens.colorSurfaceElevated
    )};
    --mb-color-surface-hover: ${unsafeCSS(tokens.colorSurfaceHover)};

    /* Colors - Interactive */
    --mb-color-interactive-primary: ${unsafeCSS(
      tokens.colorInteractivePrimary
    )};
    --mb-color-interactive-secondary: ${unsafeCSS(
      tokens.colorInteractiveSecondary
    )};
    --mb-color-interactive-hover: ${unsafeCSS(
      tokens.colorInteractiveHover
    )};
    --mb-color-interactive-focus: ${unsafeCSS(
      tokens.colorInteractiveFocus
    )};
    --mb-color-interactive-disabled: ${unsafeCSS(
      tokens.colorInteractiveDisabled
    )};

    /* Colors - Text */
    --mb-color-text-primary: ${unsafeCSS(tokens.colorTextPrimary)};
    --mb-color-text-secondary: ${unsafeCSS(
      tokens.colorTextSecondary
    )};
    --mb-color-text-disabled: ${unsafeCSS(tokens.colorTextDisabled)};
    --mb-color-text-on-brand: ${unsafeCSS(tokens.colorTextOnBrand)};

    /* Colors - Borders */
    --mb-color-border-subtle: ${unsafeCSS(tokens.colorBorderSubtle)};
    --mb-color-border-default: ${unsafeCSS(
      tokens.colorBorderDefault
    )};
    --mb-color-border-strong: ${unsafeCSS(tokens.colorBorderStrong)};
    --mb-color-border-focus: ${unsafeCSS(tokens.colorBorderFocus)};

    /* Colors - Status */
    --mb-color-status-success: ${unsafeCSS(
      tokens.colorStatusSuccess
    )};
    --mb-color-status-warning: ${unsafeCSS(
      tokens.colorStatusWarning
    )};
    --mb-color-status-error: ${unsafeCSS(tokens.colorStatusError)};
    --mb-color-status-info: ${unsafeCSS(tokens.colorStatusInfo)};

    /* Typography */
    --mb-font-family: ${unsafeCSS(tokens.fontFamily)};
    --mb-font-size: ${unsafeCSS(tokens.fontSize)};
    --mb-font-size-small: ${unsafeCSS(tokens.fontSizeSmall)};
    --mb-font-size-medium: ${unsafeCSS(tokens.fontSizeMedium)};
    --mb-font-size-large: ${unsafeCSS(tokens.fontSizeLarge)};
    --mb-font-size-xlarge: ${unsafeCSS(tokens.fontSizeXLarge)};
    --mb-font-weight-normal: ${unsafeCSS(tokens.fontWeightNormal)};
    --mb-font-weight-medium: ${unsafeCSS(tokens.fontWeightMedium)};
    --mb-font-weight-bold: ${unsafeCSS(tokens.fontWeightBold)};
    --mb-line-height: ${unsafeCSS(tokens.lineHeight)};
    --mb-line-height-tight: ${unsafeCSS(tokens.lineHeightTight)};
    --mb-line-height-normal: ${unsafeCSS(tokens.lineHeightNormal)};
    --mb-line-height-relaxed: ${unsafeCSS(tokens.lineHeightRelaxed)};

    /* Spacing */
    --mb-space-1: ${unsafeCSS(tokens.space1)};
    --mb-space-2: ${unsafeCSS(tokens.space2)};
    --mb-space-3: ${unsafeCSS(tokens.space3)};
    --mb-space-4: ${unsafeCSS(tokens.space4)};
    --mb-space-5: ${unsafeCSS(tokens.space5)};
    --mb-space-6: ${unsafeCSS(tokens.space6)};
    --mb-space-7: ${unsafeCSS(tokens.space7)};
    --mb-space-8: ${unsafeCSS(tokens.space8)};

    /* Border Radius */
    --mb-radius-none: ${unsafeCSS(tokens.radiusNone)};
    --mb-radius-small: ${unsafeCSS(tokens.radiusSmall)};
    --mb-radius-medium: ${unsafeCSS(tokens.radiusMedium)};
    --mb-radius-large: ${unsafeCSS(tokens.radiusLarge)};
    --mb-radius-full: ${unsafeCSS(tokens.radiusFull)};

    /* Shadows */
    --mb-shadow-small: ${unsafeCSS(tokens.shadowSmall)};
    --mb-shadow-medium: ${unsafeCSS(tokens.shadowMedium)};
    --mb-shadow-large: ${unsafeCSS(tokens.shadowLarge)};
  }

  /* Dark mode - activated via data-theme attribute */
  :host([data-theme="dark"]),
  :root[data-theme="dark"] {
    /* Colors - Brand */
    --mb-color-brand-primary: ${unsafeCSS(
      tokensDark.colorBrandPrimary
    )};
    --mb-color-brand-secondary: ${unsafeCSS(
      tokensDark.colorBrandSecondary
    )};
    --mb-color-brand-accent: ${unsafeCSS(
      tokensDark.colorBrandAccent
    )};

    /* Colors - Surface */
    --mb-color-surface-default: ${unsafeCSS(
      tokensDark.colorSurfaceDefault
    )};
    --mb-color-surface-subtle: ${unsafeCSS(
      tokensDark.colorSurfaceSubtle
    )};
    --mb-color-surface-elevated: ${unsafeCSS(
      tokensDark.colorSurfaceElevated
    )};
    --mb-color-surface-hover: ${unsafeCSS(
      tokensDark.colorSurfaceHover
    )};

    /* Colors - Interactive */
    --mb-color-interactive-primary: ${unsafeCSS(
      tokensDark.colorInteractivePrimary
    )};
    --mb-color-interactive-secondary: ${unsafeCSS(
      tokensDark.colorInteractiveSecondary
    )};
    --mb-color-interactive-hover: ${unsafeCSS(
      tokensDark.colorInteractiveHover
    )};
    --mb-color-interactive-focus: ${unsafeCSS(
      tokensDark.colorInteractiveFocus
    )};
    --mb-color-interactive-disabled: ${unsafeCSS(
      tokensDark.colorInteractiveDisabled
    )};

    /* Colors - Text */
    --mb-color-text-primary: ${unsafeCSS(
      tokensDark.colorTextPrimary
    )};
    --mb-color-text-secondary: ${unsafeCSS(
      tokensDark.colorTextSecondary
    )};
    --mb-color-text-disabled: ${unsafeCSS(
      tokensDark.colorTextDisabled
    )};
    --mb-color-text-on-brand: ${unsafeCSS(
      tokensDark.colorTextOnBrand
    )};

    /* Colors - Borders */
    --mb-color-border-subtle: ${unsafeCSS(
      tokensDark.colorBorderSubtle
    )};
    --mb-color-border-default: ${unsafeCSS(
      tokensDark.colorBorderDefault
    )};
    --mb-color-border-strong: ${unsafeCSS(
      tokensDark.colorBorderStrong
    )};
    --mb-color-border-focus: ${unsafeCSS(
      tokensDark.colorBorderFocus
    )};

    /* Colors - Status */
    --mb-color-status-success: ${unsafeCSS(
      tokensDark.colorStatusSuccess
    )};
    --mb-color-status-warning: ${unsafeCSS(
      tokensDark.colorStatusWarning
    )};
    --mb-color-status-error: ${unsafeCSS(
      tokensDark.colorStatusError
    )};
    --mb-color-status-info: ${unsafeCSS(tokensDark.colorStatusInfo)};

    /* Shadows */
    --mb-shadow-small: ${unsafeCSS(tokensDark.shadowSmall)};
    --mb-shadow-medium: ${unsafeCSS(tokensDark.shadowMedium)};
    --mb-shadow-large: ${unsafeCSS(tokensDark.shadowLarge)};
  }

  /* Dark mode - auto-detect system preference (unless explicitly overridden) */
  @media (prefers-color-scheme: dark) {
    :host:not([data-theme="light"]),
    :root:not([data-theme="light"]) {
      /* Colors - Brand */
      --mb-color-brand-primary: ${unsafeCSS(
        tokensDark.colorBrandPrimary
      )};
      --mb-color-brand-secondary: ${unsafeCSS(
        tokensDark.colorBrandSecondary
      )};
      --mb-color-brand-accent: ${unsafeCSS(
        tokensDark.colorBrandAccent
      )};

      /* Colors - Surface */
      --mb-color-surface-default: ${unsafeCSS(
        tokensDark.colorSurfaceDefault
      )};
      --mb-color-surface-subtle: ${unsafeCSS(
        tokensDark.colorSurfaceSubtle
      )};
      --mb-color-surface-elevated: ${unsafeCSS(
        tokensDark.colorSurfaceElevated
      )};
      --mb-color-surface-hover: ${unsafeCSS(
        tokensDark.colorSurfaceHover
      )};

      /* Colors - Interactive */
      --mb-color-interactive-primary: ${unsafeCSS(
        tokensDark.colorInteractivePrimary
      )};
      --mb-color-interactive-secondary: ${unsafeCSS(
        tokensDark.colorInteractiveSecondary
      )};
      --mb-color-interactive-hover: ${unsafeCSS(
        tokensDark.colorInteractiveHover
      )};
      --mb-color-interactive-focus: ${unsafeCSS(
        tokensDark.colorInteractiveFocus
      )};
      --mb-color-interactive-disabled: ${unsafeCSS(
        tokensDark.colorInteractiveDisabled
      )};

      /* Colors - Text */
      --mb-color-text-primary: ${unsafeCSS(
        tokensDark.colorTextPrimary
      )};
      --mb-color-text-secondary: ${unsafeCSS(
        tokensDark.colorTextSecondary
      )};
      --mb-color-text-disabled: ${unsafeCSS(
        tokensDark.colorTextDisabled
      )};
      --mb-color-text-on-brand: ${unsafeCSS(
        tokensDark.colorTextOnBrand
      )};

      /* Colors - Borders */
      --mb-color-border-subtle: ${unsafeCSS(
        tokensDark.colorBorderSubtle
      )};
      --mb-color-border-default: ${unsafeCSS(
        tokensDark.colorBorderDefault
      )};
      --mb-color-border-strong: ${unsafeCSS(
        tokensDark.colorBorderStrong
      )};
      --mb-color-border-focus: ${unsafeCSS(
        tokensDark.colorBorderFocus
      )};

      /* Colors - Status */
      --mb-color-status-success: ${unsafeCSS(
        tokensDark.colorStatusSuccess
      )};
      --mb-color-status-warning: ${unsafeCSS(
        tokensDark.colorStatusWarning
      )};
      --mb-color-status-error: ${unsafeCSS(
        tokensDark.colorStatusError
      )};
      --mb-color-status-info: ${unsafeCSS(
        tokensDark.colorStatusInfo
      )};

      /* Shadows */
      --mb-shadow-small: ${unsafeCSS(tokensDark.shadowSmall)};
      --mb-shadow-medium: ${unsafeCSS(tokensDark.shadowMedium)};
      --mb-shadow-large: ${unsafeCSS(tokensDark.shadowLarge)};
    }
  }
`;
