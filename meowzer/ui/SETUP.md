# Meowzer UI Setup

The `@meowzer/ui/setup` module automatically handles all the necessary configuration for Meowzer UI components.

## What it does

When you import `@meowzer/ui/setup`, it automatically:

1. ✅ Loads Quiet UI stylesheets (restyle.css and quiet.css)
2. ✅ Registers all required Quiet UI components
3. ✅ Configures the Quiet UI library path for icons
4. ✅ Works in both SSR and client-side environments

## Usage

### Simple Setup (Recommended)

Just import the setup module before using any Meowzer UI components:

```typescript
// Import setup first
import "@meowzer/ui/setup";

// Then import Meowzer UI
import "@meowzer/ui";
```

### In Astro

```astro
<script>
  import '@meowzer/ui/setup';
  import '@meowzer/ui';
</script>

<meowzer-provider auto-init>
  <mb-cat-playground></mb-cat-playground>
</meowzer-provider>
```

### In React

```tsx
import "@meowzer/ui/setup";
import "@meowzer/ui";

function App() {
  return (
    <meowzer-provider auto-init>
      <mb-cat-playground></mb-cat-playground>
    </meowzer-provider>
  );
}
```

### In Vue

```vue
<script setup>
import "@meowzer/ui/setup";
import "@meowzer/ui";
</script>

<template>
  <meowzer-provider auto-init>
    <mb-cat-playground></mb-cat-playground>
  </meowzer-provider>
</template>
```

### In Vanilla JS/HTML

```html
<script type="module">
  import "@meowzer/ui/setup";
  import "@meowzer/ui";
</script>

<meowzer-provider auto-init>
  <mb-cat-playground></mb-cat-playground>
</meowzer-provider>
```

## Advanced Configuration

### Custom Library Path

If you're hosting Quiet UI assets yourself:

```typescript
import { initializeQuietUI } from "@meowzer/ui/setup";

initializeQuietUI("/path/to/quiet-ui/dist");
```

### Manual Style Loading

If you prefer to load styles manually:

```typescript
import { loadQuietUIStyles } from "@meowzer/ui/setup";

// Use local assets instead of CDN
loadQuietUIStyles(false);
```

### Load Styles Only

If you only want to load the stylesheets without registering components:

```typescript
import {
  loadQuietUIStyles,
  initializeQuietUI,
} from "@meowzer/ui/setup";

loadQuietUIStyles();
initializeQuietUI();
```

## Without Setup Module

If you prefer manual setup, you can:

1. Add Quiet UI stylesheets to your HTML:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@quietui/quiet@1.3.0/dist/themes/restyle.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@quietui/quiet@1.3.0/dist/themes/quiet.css"
/>
```

2. Configure the library path:

```typescript
import { setLibraryPath } from "@quietui/quiet";
setLibraryPath(
  "https://cdn.jsdelivr.net/npm/@quietui/quiet@1.3.0/dist"
);
```

3. Import Quiet UI components manually:

```typescript
import "@quietui/quiet/components/button/button.js";
import "@quietui/quiet/components/card/card.js";
// ... etc
```

4. Import Meowzer UI:

```typescript
import "@meowzer/ui";
```

## SSR Considerations

The setup module is SSR-safe and will only run style loading in the browser. The module automatically detects the environment and:

- In SSR: Skips style injection, only registers components
- In Browser: Loads styles and configures library path

## Troubleshooting

### Styles not appearing

Make sure you import the setup module **before** any Meowzer UI components are rendered:

```typescript
// ✅ Correct
import "@meowzer/ui/setup";
import "@meowzer/ui";

// ❌ Wrong - setup imported too late
import "@meowzer/ui";
import "@meowzer/ui/setup";
```

### Icons not loading

The setup module automatically configures the library path. If icons still don't load:

1. Check browser console for errors
2. Verify network requests are reaching the CDN
3. Try setting a custom library path:

```typescript
import { initializeQuietUI } from "@meowzer/ui/setup";
initializeQuietUI(
  "https://cdn.jsdelivr.net/npm/@quietui/quiet@1.3.0/dist"
);
```

### Components not styled correctly

Ensure both stylesheets are loaded:

- `restyle.css` (CSS reset)
- `quiet.css` (Quiet UI theme)

You can verify in DevTools Network tab or Elements tab.
