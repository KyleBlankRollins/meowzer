# Meowzer UI Distribution Strategy

**Created:** October 26, 2025  
**Status:** Planning

## Overview

Strategy for making `@meowzer/ui` components available to end users who install Meowzer in their projects.

## Current Architecture

```
meowzer/
├── sdk/              # Main SDK: "meowzer" package
│   └── package.json  # Published as "meowzer"
└── ui/               # UI Components: "@meowzer/ui" package
    ├── package.json  # Published as "@meowzer/ui"
    ├── components/   # Web components (Lit Element)
    ├── providers/    # MeowzerProvider
    ├── contexts/     # Lit Context API
    └── controllers/  # Reactive controllers
```

## Distribution Options

### Option 1: Separate NPM Package (RECOMMENDED) ✅

**Approach:** Publish `@meowzer/ui` as a separate npm package.

**Installation:**

```bash
npm install meowzer @meowzer/ui @quietui/quiet
```

**Benefits:**

- ✅ Users only install UI if they need it
- ✅ Clear separation of concerns
- ✅ SDK stays zero-dependency
- ✅ Follows industry patterns (e.g., `@realm/react`, `@tanstack/react-query`)
- ✅ Better tree-shaking for users who only need SDK

**Drawbacks:**

- ⚠️ Users need to install 2+ packages
- ⚠️ Requires publishing to npm registry

**Usage:**

```typescript
// SDK only
import { Meowzer } from "meowzer";

// SDK + UI
import { Meowzer } from "meowzer";
import { MeowzerProvider, CatCreator } from "@meowzer/ui";
```

### Option 2: Bundled Export from Main Package

**Approach:** Build UI and export from main `meowzer` package at a subpath.

**Installation:**

```bash
npm install meowzer
```

**Package.json exports:**

```json
{
  "exports": {
    ".": "./dist/sdk/index.js",
    "./ui": "./dist/ui/index.js"
  }
}
```

**Benefits:**

- ✅ Single package install
- ✅ Simpler for users

**Drawbacks:**

- ❌ Breaks "zero-dependency" claim for SDK
- ❌ Larger package size even if UI not used
- ❌ Mixing concerns (SDK + UI)
- ❌ Harder to version independently

### Option 3: Peer Dependency Pattern

**Approach:** `@meowzer/ui` lists both `meowzer` and `@quietui/quiet` as peer dependencies.

**Installation:**

```bash
npm install meowzer @meowzer/ui
# npm will warn about missing peer dependency
npm install @quietui/quiet
```

**Benefits:**

- ✅ Clear dependency relationships
- ✅ Users control versions
- ✅ Works well with monorepos

**Drawbacks:**

- ⚠️ More complex installation
- ⚠️ Requires peer dependency documentation

## Recommended Solution

**Use Option 1 (Separate Package) + Option 3 (Peer Dependencies)**

### Implementation Plan

#### 1. Update UI package.json

```json
{
  "name": "@meowzer/ui",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./providers": {
      "import": "./dist/providers/index.js",
      "types": "./dist/providers/index.d.ts"
    },
    "./components": {
      "import": "./dist/components/index.js",
      "types": "./dist/components/index.d.ts"
    },
    "./controllers": {
      "import": "./dist/controllers/index.js",
      "types": "./dist/controllers/index.d.ts"
    },
    "./contexts": {
      "import": "./dist/contexts/index.js",
      "types": "./dist/contexts/index.d.ts"
    }
  },
  "peerDependencies": {
    "meowzer": "^1.0.0",
    "@quietui/quiet": "^1.3.0",
    "lit": "^3.0.0"
  },
  "dependencies": {
    "@lit/context": "^1.1.0",
    "gsap": "^3.13.0"
  }
}
```

#### 2. Create Build Script

Add post-build step to copy Quiet UI assets:

```json
{
  "scripts": {
    "build": "tsc && npm run copy-assets",
    "copy-assets": "node scripts/copy-assets.js"
  }
}
```

**scripts/copy-assets.js:**

```javascript
import { copyFileSync, mkdirSync } from "fs";
import { dirname } from "path";

// Copy Quiet UI themes to dist
const assets = [
  "node_modules/@quietui/quiet/dist/themes/quiet.css",
  "node_modules/@quietui/quiet/dist/themes/restyle.css",
];

assets.forEach((src) => {
  const dest = src.replace(
    "node_modules/@quietui/quiet/",
    "dist/assets/"
  );
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
});
```

#### 3. Update Documentation

**Quick Start (Simple):**

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Quiet UI theme -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@quietui/quiet@1.3.0/dist/themes/quiet.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@quietui/quiet@1.3.0/dist/themes/restyle.css"
    />
  </head>
  <body>
    <meowzer-provider auto-init>
      <mb-cat-playground></mb-cat-playground>
    </meowzer-provider>

    <script type="module">
      import "@meowzer/ui";
    </script>
  </body>
</html>
```

**NPM Installation (Recommended):**

```bash
# Install dependencies
npm install meowzer @meowzer/ui @quietui/quiet lit

# Or with one command
npm install meowzer @meowzer/ui
```

**Usage in frameworks:**

```typescript
// React
import { MeowzerProvider, CatCreator } from "@meowzer/ui/react";

// Vue
import { MeowzerProvider, CatCreator } from "@meowzer/ui/vue";

// Vanilla (Web Components)
import "@meowzer/ui";
```

#### 4. Publishing Checklist

Before publishing to npm:

- [ ] Run full build: `npm run build`
- [ ] Run tests: `npm test`
- [ ] Build Storybook: `npm run build-storybook`
- [ ] Generate TypeDoc: `npm run docs`
- [ ] Update README with installation instructions
- [ ] Update package.json version
- [ ] Create GitHub release with tag
- [ ] Publish to npm: `npm publish --access public`

#### 5. Asset Management

**For Quiet UI Icons:**

Current approach: Copy only needed icons

- ✅ Minimal bundle size
- ✅ Fast loading
- ✅ Easy to audit

**Options for users:**

1. **Use our bundled icons** (search.svg only):

   ```typescript
   import { setLibraryPath } from "@quietui/quiet";
   setLibraryPath("/node_modules/@meowzer/ui/dist/assets");
   ```

2. **Use full Quiet UI library**:

   ```typescript
   import { setLibraryPath } from "@quietui/quiet";
   setLibraryPath("/node_modules/@quietui/quiet/dist");
   ```

3. **Copy icons to public folder** (recommended for production):
   ```bash
   cp -r node_modules/@quietui/quiet/dist/assets/icons public/assets/
   ```
   ```typescript
   setLibraryPath("/assets");
   ```

## File Structure After Build

```
@meowzer/ui/
├── package.json
├── README.md
├── LICENSE
└── dist/
    ├── index.js
    ├── index.d.ts
    ├── components/
    │   ├── cat-creator/
    │   ├── cat-manager/
    │   └── ...
    ├── providers/
    ├── controllers/
    ├── contexts/
    └── assets/          # Optional: Quiet UI themes
        ├── quiet.css
        └── restyle.css
```

## Migration Path for Users

### Before (SDK only):

```bash
npm install meowzer
```

```typescript
import { Meowzer } from "meowzer";
const meowzer = new Meowzer();
```

### After (SDK + UI):

```bash
npm install meowzer @meowzer/ui @quietui/quiet
```

```html
<meowzer-provider auto-init>
  <cat-creator></cat-creator>
</meowzer-provider>
```

```typescript
import "@meowzer/ui";
```

## Benefits of This Approach

1. **Clean separation**: SDK stays lightweight and zero-dependency
2. **Optional UI**: Users choose if they want UI components
3. **Framework agnostic**: Works with any framework or vanilla JS
4. **Tree-shakeable**: Bundlers can remove unused components
5. **Independent versioning**: UI can update without SDK changes
6. **Clear dependencies**: Peer dependencies make requirements explicit
7. **Industry standard**: Follows patterns from successful libraries

## Next Steps

1. ✅ Set up package.json with peer dependencies
2. ✅ Create asset copy script
3. ⏳ Update README with installation instructions
4. ⏳ Add framework-specific guides (React, Vue, Angular)
5. ⏳ Create deployment documentation
6. ⏳ Set up npm publishing workflow
7. ⏳ Create demo repository showing usage
