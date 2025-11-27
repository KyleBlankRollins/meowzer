# Token System Implementation Audit

## ✅ What's Working

1. **Token Architecture**: Properly separated primitives (light/dark) and semantic tokens
2. **Component Styles**: All 14 component `.style.ts` files correctly import and use `designTokens`
3. **TypeScript**: No compilation errors, full type safety with `TokenName` type
4. **Shadow DOM**: Design tokens work correctly within web components via `:host` selector
5. **Dark Mode Logic**: Proper CSS selectors for `data-theme` attribute and `prefers-color-scheme`

## ❌ Issues Found

### 1. **Missing Global Stylesheet for :root**

**Problem**: The `designTokens` export includes `:root` selector, but it only applies within shadow DOM when included in component styles. Regular HTML elements outside shadow DOM don't get the tokens.

**Impact**:

- Page backgrounds/text won't use tokens
- Regular HTML elements in demo won't have access to CSS custom properties
- Storybook backgrounds won't respect themes

**Solution**: Created `meowzer/ui/global-tokens.css` that must be imported/linked separately for :root support.

### 2. **Demo Still Uses Carbon Design System**

**Location**: `demo/src/layouts/Layout.astro`

**Problem**:

```html
<html lang="en" class="cds-theme-g10">
  <!-- Carbon theme class -->
  ...
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@carbon/styles@1.95.0/css/styles.min.css"
  />
</html>
```

**Impact**: Loading 500KB+ of unused Carbon CSS, conflicts with custom tokens

**Fix Needed**:

```diff
- <html lang="en" class="cds-theme-g10">
+ <html lang="en">
  <head>
-   <!-- Carbon Design System styles -->
-   <link rel="stylesheet"
-     href="https://cdn.jsdelivr.net/npm/@carbon/styles@1.95.0/css/styles.min.css" />
+   <!-- Meowzer Design Tokens -->
+   <link rel="stylesheet" href="/path/to/global-tokens.css" />
```

### 3. **Storybook Still Loads Carbon**

**Location**: `meowzer/ui/.storybook/preview.ts`

**Problem**:

```typescript
import "@carbon/styles/css/styles.css";
// ... 15+ Carbon component imports
```

**Impact**: Storybook previews show Carbon styles instead of custom design system

**Fix Needed**:

```diff
- import "@carbon/styles/css/styles.css";
- import "@carbon/web-components/es/components/tile/index.js";
- // ... remove all Carbon imports
+ import "../global-tokens.css";
```

### 4. **setup.ts Still Imports Carbon Components**

**Location**: `meowzer/ui/scripts/setup.ts`

**Problem**:

```typescript
/**
 * This module handles:
 * - Loading Carbon Web Components stylesheets  ← OUTDATED
 * - Registering all Carbon components           ← OUTDATED
 */

import "@carbon/web-components/es/components/button/index.js";
// ... 15+ more Carbon imports
```

**Impact**: Bundle includes unused Carbon components (several MB)

**Fix Needed**: Remove all Carbon imports or create new setup that doesn't reference Carbon

### 5. **No Way to Inject Global Tokens Programmatically**

**Problem**: Users have to manually add `<link>` tag or import CSS file

**Impact**: Not developer-friendly for quick setup

**Potential Solution**: Add a `injectGlobalTokens()` function:

```typescript
// meowzer/ui/shared/inject-tokens.ts
export function injectGlobalTokens() {
  if (typeof document === "undefined") return; // SSR safety

  const existing = document.getElementById("mb-global-tokens");
  if (existing) return; // Already injected

  const style = document.createElement("style");
  style.id = "mb-global-tokens";
  style.textContent = `/* CSS from global-tokens.css */`;
  document.head.appendChild(style);
}
```

## 📋 Action Items

### High Priority

- [ ] **Remove Carbon from demo** (`demo/src/layouts/Layout.astro`)

  - Remove `class="cds-theme-g10"` from `<html>`
  - Remove Carbon CSS `<link>` tag
  - Add Meowzer global tokens CSS

- [ ] **Remove Carbon from Storybook** (`meowzer/ui/.storybook/preview.ts`)

  - Remove `@carbon/styles` import
  - Remove all `@carbon/web-components` imports
  - Import `global-tokens.css`

- [ ] **Update/remove setup.ts** (`meowzer/ui/scripts/setup.ts`)
  - Remove Carbon references from docs
  - Remove Carbon component imports
  - Only keep Shoelace and Meowzer component imports

### Medium Priority

- [ ] **Add global tokens to package.json exports**

  ```json
  {
    "exports": {
      ".": "./index.ts",
      "./setup": "./scripts/setup.ts",
      "./global-tokens.css": "./global-tokens.css"  ← Add this
    }
  }
  ```

- [ ] **Create programmatic injection function** (optional, for DX)
- [ ] **Update Storybook backgrounds** to use design tokens
  ```typescript
  backgrounds: {
    default: "light",
    values: [
      { name: "light", value: "hsl(210, 30%, 99%)" },  // Use token values
      { name: "dark", value: "hsl(210, 15%, 12%)" },
    ],
  }
  ```

### Low Priority

- [ ] **Add theme toggle to Storybook** (addon or toolbar)
- [ ] **Create demo page showing theme switching**
- [ ] **Document global token usage** in main README

## 🔧 Quick Fix Commands

### Remove Carbon from Demo

```bash
# Update demo layout
sed -i '' 's/class="cds-theme-g10"//' demo/src/layouts/Layout.astro
sed -i '' '/Carbon Design System/,+3d' demo/src/layouts/Layout.astro
```

### Remove Carbon from Storybook

```typescript
// .storybook/preview.ts - replace entire Carbon section with:
import "../global-tokens.css";
```

## 💡 Recommendations

### For Immediate Use

**Option A: Manual CSS Link** (simplest)

```html
<link
  rel="stylesheet"
  href="node_modules/@meowzer/ui/global-tokens.css"
/>
```

**Option B: Import in Build Tool** (recommended)

```typescript
import "@meowzer/ui/global-tokens.css";
```

### For Future Enhancement

Create a provider component that auto-injects tokens:

```typescript
@customElement("meowzer-theme-provider")
export class MeowzerThemeProvider extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    injectGlobalTokens();
  }

  render() {
    return html`<slot></slot>`;
  }
}

// Usage:
<meowzer-theme-provider>
  <your-app></your-app>
</meowzer-theme-provider>;
```

## Summary

The token system itself is **architecturally sound and works correctly within components**. The main issues are:

1. **Legacy Carbon dependencies not removed** (demo, Storybook, setup.ts)
2. **No easy way to apply tokens to :root** for non-shadow DOM usage

Once Carbon is fully removed and global tokens are properly loaded, the system will work perfectly for both:

- ✅ Web components (via shadow DOM)
- ✅ Regular HTML (via :root CSS custom properties)
- ✅ Light/dark mode switching
- ✅ System preference detection
