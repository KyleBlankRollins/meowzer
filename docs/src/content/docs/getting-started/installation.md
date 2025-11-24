---
title: Installation
description: How to install Meowzer in your project
---

Learn how to install Meowzer in your project.

## Prerequisites

Before installing Meowzer, ensure you have:

- **Node.js** 18 or higher
- **Package manager** - npm, yarn, or pnpm
- **Modern browser** - Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

## Using npm

The recommended way to install Meowzer:

```bash
npm install meowzer
```

## Using yarn

```bash
yarn add meowzer
```

## Using pnpm

```bash
pnpm add meowzer
```

## CDN (ESM)

For quick experiments or non-bundled projects:

```html
<script type="module">
  import { Meowzer } from "https://esm.sh/meowzer";

  const meowzer = new Meowzer();
  await meowzer.init();
  // Your code here
</script>
```

:::note
CDN imports are convenient for prototyping but not recommended for production. Use a bundler for better performance and caching.
:::

## Verify Installation

After installing, verify it works:

```typescript
import { Meowzer } from "meowzer";

console.log(Meowzer); // Should log the Meowzer class
```

If you see the class logged, installation was successful! ✅

## TypeScript Configuration

Meowzer is TypeScript-first. If you're using TypeScript, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "types": ["vite/client"]
  }
}
```

## Dependencies

Meowzer has only one runtime dependency:

- **GSAP** (GreenSock Animation Platform) - For smooth animations

This is automatically installed when you install Meowzer.

### Peer Dependencies

None! Meowzer works standalone.

## Bundle Size

Meowzer is designed to be lightweight:

- **Core SDK**: ~45KB minified + gzipped
- **With GSAP**: ~70KB total minified + gzipped

Tree-shaking is supported if you only use specific managers.

## Browser Compatibility

Meowzer uses modern JavaScript features:

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 90+             |
| Firefox | 88+             |
| Safari  | 14+             |
| Edge    | 90+             |

**Required APIs:**

- ES6 Modules
- Async/Await
- IndexedDB (for persistence)
- RequestAnimationFrame
- Web Components (for UI library)

## Framework Compatibility

Meowzer works with all modern frameworks:

- ✅ **React** - Full support
- ✅ **Vue** - Full support
- ✅ **Svelte** - Full support
- ✅ **Astro** - Full support
- ✅ **Vanilla JS** - Full support

## Development Setup

For the best development experience:

### 1. Install Meowzer

```bash
npm install meowzer
```

### 2. Create a Basic HTML File

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Meowzer Test</title>
  </head>
  <body>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### 3. Create Your JavaScript File

```javascript
// src/main.js
import { Meowzer } from "meowzer";

async function init() {
  const meowzer = new Meowzer();
  await meowzer.init();

  const cat = await meowzer.cats.create({
    name: "Test Cat",
  });

  cat.place(document.body);
}

init();
```

### 4. Use a Development Server

We recommend using Vite:

```bash
npm install -D vite
npx vite
```

Or any other dev server that supports ES modules.

## Troubleshooting

### Module Not Found

**Error:** `Cannot find module 'meowzer'`

**Solution:** Ensure you installed Meowzer and your bundler is configured for ES modules.

### TypeScript Errors

**Error:** `Cannot find type definitions`

**Solution:** Meowzer includes TypeScript definitions. Ensure your `tsconfig.json` has proper module resolution.

### IndexedDB Not Supported

**Error:** `IndexedDB is not available`

**Solution:** Some browsers in private mode disable IndexedDB. Disable persistence or use memory adapter:

```typescript
const meowzer = new Meowzer({
  storage: {
    adapter: "memory",
  },
});
```

### GSAP License

Meowzer uses the free GSAP version. If you have a GreenSock license, you can use GSAP plugins with Meowzer.

## Next Steps

Now that Meowzer is installed:

1. [**Quick Start**](/getting-started/quick-start) - Create your first cat
2. [**First Cat Tutorial**](/getting-started/first-cat) - Detailed walkthrough
