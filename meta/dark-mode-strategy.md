# Dark Mode Color Strategy

## Overview

Our design token system now includes **separate primitives for light and dark modes**, both using HSL color format for consistency and easier manipulation.

## Architecture

```
primitivesLight (default)
  ↓
tokens (light mode semantic tokens)

primitivesDark
  ↓
tokensDark (dark mode semantic tokens)
```

## Color Adjustments for Dark Mode

### Brand Colors

**Light Mode**: High lightness (86-96%), high saturation (70-100%)
**Dark Mode**: Medium lightness (65-75%), reduced saturation (50-80%)

| Color  | Light Mode HSL                | Dark Mode HSL           | Change                    |
| ------ | ----------------------------- | ----------------------- | ------------------------- |
| Blue   | `hsl(210.57, 76.81%, 86.47%)` | `hsl(210.57, 60%, 65%)` | ↓ Lightness, ↓ Saturation |
| Cyan   | `hsl(180, 100%, 95.88%)`      | `hsl(180, 80%, 70%)`    | ↓ Lightness, ↓ Saturation |
| Green  | `hsl(103.5, 68.97%, 88.63%)`  | `hsl(103.5, 50%, 65%)`  | ↓ Lightness, ↓ Saturation |
| Yellow | `hsl(60, 100%, 96.47%)`       | `hsl(60, 80%, 75%)`     | ↓ Lightness, ↓ Saturation |
| Pink   | `hsl(327.39, 69.7%, 87.06%)`  | `hsl(327.39, 55%, 70%)` | ↓ Lightness, ↓ Saturation |
| Purple | `hsl(300, 100%, 96.08%)`      | `hsl(300, 75%, 75%)`    | ↓ Lightness, ↓ Saturation |

**Rationale**: Pastel colors at full brightness are too harsh on dark backgrounds. We reduce both lightness and saturation to create muted, pleasant versions that maintain color identity while being easier on the eyes.

### Neutral Scale (Inverted)

The neutral scale is **inverted** in dark mode - what was light becomes dark and vice versa:

| Semantic Meaning     | Light Mode (neutral)     | Dark Mode (neutral)      | Usage                      |
| -------------------- | ------------------------ | ------------------------ | -------------------------- |
| **Surface Default**  | 100 `hsl(210, 30%, 99%)` | 100 `hsl(210, 15%, 12%)` | Main background            |
| **Surface Subtle**   | 200 `hsl(210, 30%, 98%)` | 200 `hsl(210, 15%, 16%)` | Secondary background       |
| **Surface Hover**    | 300 `hsl(210, 25%, 94%)` | 300 `hsl(210, 15%, 22%)` | Hover states               |
| **Borders/Disabled** | 400 `hsl(210, 20%, 85%)` | 400 `hsl(210, 12%, 32%)` | Borders, disabled elements |
| **Mid-tone**         | 500 `hsl(210, 15%, 65%)` | 500 `hsl(210, 10%, 50%)` | Dividers                   |
| **Secondary Text**   | 600 `hsl(210, 12%, 45%)` | 600 `hsl(210, 8%, 65%)`  | Secondary text             |
| **Emphasis**         | 700 `hsl(210, 10%, 30%)` | 700 `hsl(210, 10%, 75%)` | Emphasized text            |
| **High Emphasis**    | 800 `hsl(210, 8%, 20%)`  | 800 `hsl(210, 15%, 88%)` | High emphasis              |
| **Primary Text**     | 900 `hsl(210, 8%, 12%)`  | 900 `hsl(210, 20%, 95%)` | Primary text               |

**Key Pattern**:

- Light mode: 100 = lightest, 900 = darkest
- Dark mode: 100 = darkest, 900 = lightest
- Semantic tokens automatically map to correct values per theme

### Shadows

**Light Mode**: Black shadows with low opacity (8-16%)

- Small: `0 2px 8px rgba(0, 0, 0, 0.08)`
- Medium: `0 4px 16px rgba(0, 0, 0, 0.12)`
- Large: `0 8px 32px rgba(0, 0, 0, 0.16)`

**Dark Mode**: Black shadows with higher opacity (30-50%)

- Small: `0 2px 8px rgba(0, 0, 0, 0.3)`
- Medium: `0 4px 16px rgba(0, 0, 0, 0.4)`
- Large: `0 8px 32px rgba(0, 0, 0, 0.5)`

**Rationale**: Dark mode needs stronger shadows to create depth since we're working with less contrast between elements.

## Semantic Token Mapping

The beauty of this system is that **components never reference primitives directly**. They only use semantic tokens:

```typescript
// Component code (theme-agnostic)
color: var(--mb-color-text-primary);
background: var(--mb-color-surface-default);

// Light mode:
// --mb-color-text-primary = neutral900 (dark text)
// --mb-color-surface-default = neutral100 (light bg)

// Dark mode:
// --mb-color-text-primary = neutral900 (light text!)
// --mb-color-surface-default = neutral100 (dark bg!)
```

The semantic tokens point to different primitive values depending on the theme, but the **semantic meaning stays the same**.

## Benefits of HSL for Dark Mode

1. **Predictable Adjustments**: Easy to reduce lightness/saturation systematically
2. **Maintains Hue**: Colors stay recognizable across themes
3. **Fine Control**: Can tweak each channel independently
4. **Accessibility**: Easier to ensure proper contrast ratios
5. **Consistency**: All colors follow the same format

## Implementation (Future)

When implementing theme switching:

```typescript
// Option 1: CSS class toggle
:root { /* primitivesLight */ }
:root.dark { /* primitivesDark */ }

// Option 2: Data attribute
:root[data-theme="light"] { /* primitivesLight */ }
:root[data-theme="dark"] { /* primitivesDark */ }

// Option 3: Prefers color scheme
@media (prefers-color-scheme: dark) {
  :root { /* primitivesDark */ }
}
```

Components remain unchanged - they just use semantic token CSS variables which automatically update when primitives change.

## Color Philosophy

**Light Mode**: Bright, cheerful, playful pastels

- High saturation for vibrant feel
- Very light backgrounds (99% lightness)
- Dark text for contrast

**Dark Mode**: Muted, calming, sophisticated

- Reduced saturation to prevent eye strain
- Dark backgrounds (12-22% lightness)
- Light text for readability
- Stronger shadows for depth

Both maintain the **playful, cat-themed aesthetic** while being appropriate for their respective contexts.
