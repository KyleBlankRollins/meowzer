# Dark Mode Implementation Guide

## How Dark Mode Works

The `designTokens` export now includes **automatic dark mode support** via CSS custom properties. Dark mode is exposed through two methods:

### Method 1: Manual Toggle (Recommended for User Control)

Set the `data-theme` attribute on the root element or individual components:

```typescript
// Enable dark mode globally
document.documentElement.setAttribute("data-theme", "dark");

// Enable light mode globally (override system preference)
document.documentElement.setAttribute("data-theme", "light");

// Remove attribute to use system preference
document.documentElement.removeAttribute("data-theme");
```

For individual web components:

```html
<mb-cat-playground data-theme="dark"></mb-cat-playground>
```

### Method 2: System Preference (Automatic)

If no `data-theme` attribute is set, the system automatically detects the user's OS preference via `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode tokens automatically applied */
}
```

**Override system preference:**

- `data-theme="light"` → Forces light mode even if OS is dark
- `data-theme="dark"` → Forces dark mode even if OS is light
- No attribute → Follows OS preference

## Implementation Pattern

### Priority Order

1. **Explicit data-theme attribute** (highest priority)
2. **System preference** via `prefers-color-scheme` (fallback)
3. **Default light mode** (if neither applies)

### CSS Selector Strategy

```css
/* Light mode (default) */
:root {
  --mb-color-surface-default: hsl(210, 30%, 99%);
}

/* Dark mode via explicit attribute */
:root[data-theme="dark"] {
  --mb-color-surface-default: hsl(210, 15%, 12%);
}

/* Dark mode via system preference (unless overridden) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --mb-color-surface-default: hsl(210, 15%, 12%);
  }
}
```

The `:not([data-theme="light"])` ensures that if a user explicitly sets light mode, it won't be overridden by system preference.

## Example: Theme Toggle Component

```typescript
import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("mb-theme-toggle")
export class MbThemeToggle extends LitElement {
  @state() private theme: "light" | "dark" | "auto" = "auto";

  connectedCallback() {
    super.connectedCallback();
    // Load saved preference
    const saved = localStorage.getItem("theme-preference");
    if (saved === "light" || saved === "dark") {
      this.theme = saved;
      this.applyTheme();
    }
  }

  private applyTheme() {
    if (this.theme === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", this.theme);
    }
    localStorage.setItem("theme-preference", this.theme);
  }

  private toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    this.applyTheme();
  }

  render() {
    return html`
      <button @click=${this.toggleTheme}>
        ${this.theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
    `;
  }
}
```

## Component Best Practices

### ✅ DO: Use Semantic Tokens

```typescript
const styles = css`
  .container {
    background: var(--mb-color-surface-default);
    color: var(--mb-color-text-primary);
    border: 1px solid var(--mb-color-border-subtle);
  }
`;
```

These automatically switch between light and dark values.

### ❌ DON'T: Hardcode Colors

```typescript
// BAD - doesn't respect theme
const styles = css`
  .container {
    background: #ffffff;
    color: #000000;
  }
`;
```

### ✅ DO: Test Both Themes

```typescript
export const MyComponent: Story = {
  render: () => html`<mb-my-component></mb-my-component>`,
  parameters: {
    // Storybook addon for theme switching
    backgrounds: {
      default: "dark",
    },
  },
};
```

## What's Exposed in `designTokens`

The `designTokens` CSS export includes:

1. **Default (Light Mode) Tokens**

   - Applied to `:root` and `:host`
   - Uses `primitivesLight`

2. **Dark Mode Override (Manual)**

   - Applied to `:root[data-theme="dark"]` and `:host([data-theme="dark"])`
   - Uses `primitivesDark`

3. **Dark Mode Override (System)**
   - Applied via `@media (prefers-color-scheme: dark)`
   - Only applies if no explicit `data-theme="light"` is set
   - Uses `primitivesDark`

## Token Coverage

All color-related tokens automatically switch:

- ✅ Brand colors (`--mb-color-brand-*`)
- ✅ Surface colors (`--mb-color-surface-*`)
- ✅ Interactive colors (`--mb-color-interactive-*`)
- ✅ Text colors (`--mb-color-text-*`)
- ✅ Border colors (`--mb-color-border-*`)
- ✅ Status colors (`--mb-color-status-*`)
- ✅ Shadows (`--mb-shadow-*`)

These remain constant across themes:

- ⚪ Typography (`--mb-font-*`, `--mb-line-height-*`)
- ⚪ Spacing (`--mb-space-*`)
- ⚪ Border radius (`--mb-radius-*`)

## Testing Dark Mode

### Browser DevTools

```javascript
// Force dark mode in console
document.documentElement.setAttribute("data-theme", "dark");

// Check system preference
window.matchMedia("(prefers-color-scheme: dark)").matches;
```

### Storybook

Add theme controls to your stories:

```typescript
export default {
  title: "Components/MyComponent",
  decorators: [
    (story) => html` <div data-theme="dark">${story()}</div> `,
  ],
};
```

### Unit Tests

```typescript
it("should render correctly in dark mode", () => {
  const el = document.createElement("mb-my-component");
  el.setAttribute("data-theme", "dark");
  document.body.appendChild(el);
  // assertions...
});
```

## Benefits of This Approach

1. **Zero JavaScript Required** - Pure CSS theming
2. **Respects User Preference** - Auto-detects system theme
3. **User Control** - Can override system preference
4. **Component-Level Theming** - Individual components can have different themes
5. **Backward Compatible** - Default light mode if nothing is set
6. **Performance** - CSS custom properties update instantly
7. **SSR-Safe** - Works with server-side rendering

## Future Enhancements

- Add more theme variants (high contrast, reduced motion)
- Theme transition animations
- Per-component theme customization
- Theme preview in Storybook
