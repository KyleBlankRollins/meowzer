## 🚨 CRITICAL: Carbon Web Components Migration

**Status:** In Progress  
**Priority:** Blocking all other work  
**Docs:** See `meta/carbon-component-mapping.md` and `meta/quiet-ui-audit.md`

### Phase 1: Documentation Site (`/docs/`)

- [x] Install `@carbon/web-components`, `@carbon/styles`, `@carbon/icons`
- [x] Update `package.json` dependencies
- [x] Replace imports in `source/main.ts` (17 components)
- [x] Update theme imports in `source/style.css`
- [x] Update class names in `source/templates.ts` (quiet-dark → cds-theme-g90)
- [x] Remove `allDefined` utility usage
- [x] Test `npm run dev`
- [ ] Test `npm run build`
- [ ] Verify basic functionality

### Phase 2: UI Package (`/meowzer/ui/`)

- [x] Install Carbon dependencies
- [x] Update `package.json` (dependencies, peerDependencies, devDependencies)
- [x] Replace imports in `scripts/setup.ts` (20 components)
- [x] Update `scripts/copy-assets.ts` (icon paths)
- [x] Replace imports in `.storybook/preview.ts` (16 components)
- [x] Update `README.md` documentation
- [x] Rename functions: `initializeQuietUI` → removed (not needed for Carbon)
- [x] Rename functions: `loadQuietUIStyles` → `loadCarbonStyles`
- [ ] Test Storybook
- [x] Test `npm run build`

### Phase 3: Demo Site (`/demo/`)

- [x] Install Carbon dependencies
- [x] Update `package.json`
- [x] Update `astro.config.mjs` noExternal config
- [x] Update attribution in `src/pages/about.astro`
- [ ] Test `npm run dev`
- [x] Test `npm run build`

### Phase 4: Documentation & Cleanup

- [x] Update `docs/source/content/credits.md` (Carbon attribution)
- [x] Update all README files with Carbon examples
- [ ] Clean up package-lock.json files
- [ ] Remove Quiet UI references from documentation
- [ ] Test all builds end-to-end
- [ ] Commit and push changes

---

## General features

- Play with cats
  - rc car
- Cats can play with UI elements. Knock letters around, etc.

## Cat animations

- Implement SVG morphing effects (requires MorphSVG plugin)
- add audio for the cats (purrs, meows, jump/landing sounds)
- add jump animation
- add pawing animation
- add idle shifting animation
- add head swivel animation
- add back arching animation
- add standing animation for edges of viewport

## Meowkit

- feat: add different SVG templates for different fur lengths
- feat: add different SVG templates for hats

## UI

- feat: Create pick up/drop feature that applies to all objects in the playground
