# Carbon Web Components Migration Mapping

**Date:** November 20, 2025  
**From:** Quiet UI (`@quietui/quiet`)  
**To:** Carbon Web Components (`@carbon/web-components`)

---

## Overview

This document maps Quiet UI components to their Carbon Web Components equivalents. All Carbon components use the `cds-` prefix.

**Carbon Documentation:**

- Components: https://web-components.carbondesignsystem.com/
- Repository: https://github.com/carbon-design-system/carbon/tree/main/packages/web-components
- NPM Package: `@carbon/web-components`

---

## Component Mapping

### ✅ Direct Equivalents

These Quiet UI components have direct Carbon equivalents:

| Quiet UI Component | Carbon Component    | Import Path                                                | Notes                         |
| ------------------ | ------------------- | ---------------------------------------------------------- | ----------------------------- |
| `button`           | `cds-button`        | `@carbon/web-components/es/components/button/index.js`     | ✅ Direct match               |
| `text-field`       | `cds-text-input`    | `@carbon/web-components/es/components/text-input/index.js` | Input field                   |
| `text-area`        | `cds-textarea`      | `@carbon/web-components/es/components/textarea/index.js`   | Multi-line input              |
| `checkbox`         | `cds-checkbox`      | `@carbon/web-components/es/components/checkbox/index.js`   | ✅ Direct match               |
| `select`           | `cds-select`        | `@carbon/web-components/es/components/select/index.js`     | Dropdown select               |
| `badge`            | `cds-tag`           | `@carbon/web-components/es/components/tag/index.js`        | Carbon uses "tag" terminology |
| `spinner`          | `cds-loading`       | `@carbon/web-components/es/components/loading/index.js`    | Loading indicator             |
| `divider`          | `cds-divider`       | `@carbon/web-components/es/components/divider/index.js`    | ✅ Direct match               |
| `icon`             | `cds-icon`          | `@carbon/web-components/es/components/icon/index.js`       | Icon component                |
| `dialog`           | `cds-modal`         | `@carbon/web-components/es/components/modal/index.js`      | Modal dialog                  |
| `tooltip`          | `cds-tooltip`       | `@carbon/web-components/es/components/tooltip/index.js`    | ✅ Direct match               |
| `popover`          | `cds-popover`       | `@carbon/web-components/es/components/popover/index.js`    | ✅ Direct match               |
| `dropdown`         | `cds-dropdown`      | `@carbon/web-components/es/components/dropdown/index.js`   | ✅ Direct match               |
| `dropdown-item`    | `cds-dropdown-item` | `@carbon/web-components/es/components/dropdown/index.js`   | Part of dropdown              |

### ⚠️ Close Equivalents (Different API)

These require some adaptation:

| Quiet UI Component | Carbon Component   | Import Path                                                  | Notes                                     |
| ------------------ | ------------------ | ------------------------------------------------------------ | ----------------------------------------- |
| `card`             | `cds-tile`         | `@carbon/web-components/es/components/tile/index.js`         | Carbon uses "tile" for card-like layouts  |
| `callout`          | `cds-notification` | `@carbon/web-components/es/components/notification/index.js` | Use inline or toast notification          |
| `empty-state`      | Custom             | N/A                                                          | Build with `cds-tile` + `cds-icon`        |
| `button-group`     | `cds-button-set`   | `@carbon/web-components/es/components/button/index.js`       | Button grouping                           |
| `toolbar`          | `cds-header`       | `@carbon/web-components/es/components/ui-shell/index.js`     | Use UI Shell header                       |
| `expander`         | `cds-accordion`    | `@carbon/web-components/es/components/accordion/index.js`    | Expandable sections                       |
| `color-picker`     | Custom             | N/A                                                          | Build with `cds-text-input` + color logic |

### 🔧 Custom Implementation Needed

These don't have direct Carbon equivalents and need custom solutions:

| Quiet UI Component   | Replacement Strategy                                                   | Priority |
| -------------------- | ---------------------------------------------------------------------- | -------- |
| `allDefined` utility | Remove or implement custom utility                                     | Low      |
| `color-picker`       | Use HTML `<input type="color">` or build custom with Carbon components | Medium   |
| `empty-state`        | Build custom component with `cds-tile`, `cds-icon`, and typography     | Medium   |

---

## Import Pattern Changes

### Before (Quiet UI)

```typescript
import "@quietui/quiet/components/button/button.js";
import "@quietui/quiet/components/card/card.js";
import { setLibraryPath } from "@quietui/quiet";
```

### After (Carbon)

```typescript
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/tile/index.js";
// No library path needed for Carbon
```

---

## Theme/Style Changes

### Before (Quiet UI)

```css
@import "@quietui/quiet/themes/quiet.css";
@import "@quietui/quiet/themes/restyle.css";
```

### After (Carbon)

```css
@import "@carbon/web-components/es/globals/styles.css";
/* Or use specific theme */
@import "@carbon/styles/css/styles.css";
```

**Carbon Theme Classes:**

- `cds-layer` - Layer tokens
- `cds-theme-g10` - Gray 10 theme (light)
- `cds-theme-g90` - Gray 90 theme (dark)
- `cds-theme-g100` - Gray 100 theme (darker)

---

## Icon Changes

Quiet UI icons need to be replaced with Carbon icons.

### Before (Quiet UI Icons)

```
node_modules/@quietui/quiet/dist/assets/icons/outline/search.svg
node_modules/@quietui/quiet/dist/assets/icons/outline/cat.svg
node_modules/@quietui/quiet/dist/assets/icons/outline/plus.svg
node_modules/@quietui/quiet/dist/assets/icons/outline/edit.svg
node_modules/@quietui/quiet/dist/assets/icons/outline/player-pause.svg
node_modules/@quietui/quiet/dist/assets/icons/outline/player-play.svg
node_modules/@quietui/quiet/dist/assets/icons/outline/chart-bar.svg
node_modules/@quietui/quiet/dist/assets/icons/outline/trash.svg
```

### After (Carbon Icons)

Use `@carbon/icons` package or Carbon's icon component:

```typescript
import "@carbon/web-components/es/components/icon/index.js";
import Search16 from "@carbon/icons/es/search/16";
import Add16 from "@carbon/icons/es/add/16";
import Edit16 from "@carbon/icons/es/edit/16";
import PauseFilled16 from "@carbon/icons/es/pause--filled/16";
import PlayFilled16 from "@carbon/icons/es/play--filled/16";
import ChartBar16 from "@carbon/icons/es/chart--bar/16";
import TrashCan16 from "@carbon/icons/es/trash-can/16";
```

**Icon Mapping:**
| Quiet UI Icon | Carbon Icon | Package |
|--------------|-------------|---------|
| `search.svg` | `Search16` | `@carbon/icons/es/search/16` |
| `cat.svg` | Custom SVG | (No cat icon in Carbon) |
| `plus.svg` | `Add16` | `@carbon/icons/es/add/16` |
| `edit.svg` | `Edit16` | `@carbon/icons/es/edit/16` |
| `player-pause.svg` | `PauseFilled16` | `@carbon/icons/es/pause--filled/16` |
| `player-play.svg` | `PlayFilled16` | `@carbon/icons/es/play--filled/16` |
| `chart-bar.svg` | `ChartBar16` | `@carbon/icons/es/chart--bar/16` |
| `trash.svg` | `TrashCan16` | `@carbon/icons/es/trash-can/16` |

---

## Package Dependencies

### Remove

```json
{
  "@quietui/quiet": "^1.3.0"
}
```

### Add

```json
{
  "@carbon/web-components": "^2.0.0",
  "@carbon/styles": "^1.0.0",
  "@carbon/icons": "^11.0.0"
}
```

---

## Class Name Changes

### Template Classes (docs/source/templates.ts)

**Before (Quiet UI):**

```html
<html class="quiet-teal">
  <script>
    document.documentElement.classList.add("quiet-dark");
  </script>
</html>
```

**After (Carbon):**

```html
<html>
  <body class="cds-theme-g10">
    <!-- Light theme by default -->
  </body>
</html>
```

For dark theme:

```html
<body class="cds-theme-g90">
  <!-- Dark theme -->
</body>
```

---

## Component-Specific Migration Notes

### Button

```typescript
// Before
import "@quietui/quiet/components/button/button.js";
// <qu-button>Click me</qu-button>

// After
import "@carbon/web-components/es/components/button/index.js";
// <cds-button>Click me</cds-button>
```

### Card → Tile

```typescript
// Before
import "@quietui/quiet/components/card/card.js";
// <qu-card>Content</qu-card>

// After
import "@carbon/web-components/es/components/tile/index.js";
// <cds-tile>Content</cds-tile>
```

### Text Field

```typescript
// Before
import "@quietui/quiet/components/text-field/text-field.js";
// <qu-text-field label="Name"></qu-text-field>

// After
import "@carbon/web-components/es/components/text-input/index.js";
// <cds-text-input label="Name"></cds-text-input>
```

### Badge → Tag

```typescript
// Before
import "@quietui/quiet/components/badge/badge.js";
// <qu-badge>New</qu-badge>

// After
import "@carbon/web-components/es/components/tag/index.js";
// <cds-tag>New</cds-tag>
```

### Callout → Notification

```typescript
// Before
import "@quietui/quiet/components/callout/callout.js";
// <qu-callout type="info">Message</qu-callout>

// After
import "@carbon/web-components/es/components/notification/index.js";
// <cds-inline-notification kind="info" title="Message">
//   Details here
// </cds-inline-notification>
```

### Spinner → Loading

```typescript
// Before
import "@quietui/quiet/components/spinner/spinner.js";
// <qu-spinner></qu-spinner>

// After
import "@carbon/web-components/es/components/loading/index.js";
// <cds-loading></cds-loading>
```

### Dialog → Modal

```typescript
// Before
import "@quietui/quiet/components/dialog/dialog.js";
// <qu-dialog>Content</qu-dialog>

// After
import "@carbon/web-components/es/components/modal/index.js";
// <cds-modal open>
//   <cds-modal-header>
//     <cds-modal-heading>Title</cds-modal-heading>
//   </cds-modal-header>
//   <cds-modal-body>Content</cds-modal-body>
// </cds-modal>
```

### Expander → Accordion

```typescript
// Before
import "@quietui/quiet/components/expander/expander.js";
// <qu-expander>Content</qu-expander>

// After
import "@carbon/web-components/es/components/accordion/index.js";
// <cds-accordion>
//   <cds-accordion-item title="Section">
//     Content
//   </cds-accordion-item>
// </cds-accordion>
```

---

## Migration Checklist by File

### `/docs/` Package

- [ ] `package.json` - Update dependencies
- [ ] `source/main.ts` - Replace all component imports
- [ ] `source/style.css` - Replace theme imports
- [ ] `source/templates.ts` - Update class names
- [ ] Remove `allDefined` utility usage
- [ ] Test dev server (`npm run dev`)
- [ ] Test build (`npm run build`)

### `/meowzer/ui/` Package

- [ ] `package.json` - Update all dependency references
- [ ] `scripts/setup.ts` - Replace imports and initialization
- [ ] `scripts/copy-assets.ts` - Update icon paths
- [ ] `.storybook/preview.ts` - Replace imports
- [ ] `README.md` - Update documentation
- [ ] Test Storybook
- [ ] Test build

### `/demo/` Package

- [ ] `package.json` - Update dependencies
- [ ] `astro.config.mjs` - Update noExternal config
- [ ] `src/pages/about.astro` - Update attribution
- [ ] Test dev server
- [ ] Test build

---

## Testing Strategy

### Phase 1: Visual Verification

1. Check that all components render
2. Verify theme applies correctly
3. Test dark/light mode switching

### Phase 2: Interaction Testing

1. Test all button clicks
2. Verify form inputs work
3. Test modals/dialogs open/close
4. Verify tooltips show on hover

### Phase 3: Build Verification

1. Run `npm run build` in each package
2. Verify no TypeScript errors
3. Check bundle sizes
4. Test production builds

---

## Estimated Effort

| Component                 | Complexity | Time Estimate         |
| ------------------------- | ---------- | --------------------- |
| button                    | Low        | 15 min                |
| text-field                | Low        | 15 min                |
| checkbox                  | Low        | 10 min                |
| select                    | Low        | 15 min                |
| card → tile               | Medium     | 30 min                |
| badge → tag               | Low        | 15 min                |
| spinner → loading         | Low        | 15 min                |
| divider                   | Low        | 10 min                |
| icon                      | Medium     | 45 min (icon mapping) |
| dialog → modal            | Medium     | 30 min                |
| tooltip                   | Low        | 10 min                |
| popover                   | Low        | 15 min                |
| callout → notification    | Medium     | 30 min                |
| text-area                 | Low        | 15 min                |
| empty-state               | High       | 1 hour (custom)       |
| button-group → button-set | Low        | 20 min                |
| toolbar → header          | Medium     | 45 min                |
| expander → accordion      | Medium     | 30 min                |
| dropdown                  | Low        | 15 min                |
| color-picker              | High       | 1 hour (custom)       |
| Theme setup               | Medium     | 45 min                |

**Total Estimated Time:** ~8-10 hours per package = ~24-30 hours total

---

## Notes

- Carbon has excellent TypeScript support - leverage it
- Carbon themes are robust - explore customization options
- Some components may need API adjustments (check docs)
- Icon library is comprehensive but may need custom SVGs for cat icon
- Empty state and color picker will need custom implementations
