# Quiet UI Dependency Audit

**Date:** November 20, 2025  
**Status:** ⚠️ CRITICAL - Package no longer available on npm  
**Impact:** High - Blocking development and deployment

---

## Summary

Quiet UI (`@quietui/quiet`) has been removed from npm and is no longer available. This affects multiple parts of the Meowzer project across documentation, UI components, and demo sites.

**Total References Found:** 132 matches across the codebase

---

## Impact Assessment

### Critical (Blocking)

#### 1. Documentation Site (`/docs/`)

**Status:** Cannot build or run  
**Files Affected:** 5 files

- `docs/package.json` - Dependency declaration
- `docs/source/main.ts` - 17 component imports
- `docs/source/style.css` - 2 theme imports
- `docs/source/templates.ts` - No direct imports, but uses Quiet UI class names
- `package-lock.json` - Lockfile references

**Components Used:**

- `allDefined` utility function
- `card`
- `button`
- `text-field`
- `badge`
- `callout`
- `empty-state`
- `icon`
- `color-picker`
- `popover`
- `select`
- `checkbox`
- `text-area`
- `spinner`
- `button-group`
- `divider`

**Themes Used:**

- `quiet.css` - Main theme
- `restyle.css` - Base styles

---

#### 2. UI Package (`/meowzer/ui/`)

**Status:** Builds currently work (has cached node_modules), but cannot reinstall  
**Files Affected:** 9 files

**package.json:**

- Line 57: `dependencies`
- Line 65: `peerDependencies` declaration
- Line 73: `devDependencies`

**scripts/setup.ts:**

- Lines 18-37: 20 component imports
- Line 43: `setLibraryPath` import
- Line 51: `initializeQuietUI()` function
- Line 54: CDN URL reference
- Line 63: `loadQuietUIStyles()` function
- Lines 70-71: Path references
- Lines 96, 101, 104: Function calls

**scripts/copy-assets.ts:**

- Line 9: Documentation comment
- Lines 25-65: Asset path references (themes + 8 icons)
- Line 168: Console output reference

**README.md:**

- Lines 9, 52: Installation instructions
- Line 15: Dependencies list
- Lines 29, 33: CDN URLs
- Lines 57-58: Import statements

**.storybook/preview.ts:**

- Line 2: `setLibraryPath` import
- Lines 8-9: Theme imports
- Lines 12-27: 16 component imports

**Components Used (Total: 23):**

- button
- card
- icon
- select
- spinner
- badge
- toolbar
- dialog
- tooltip
- callout
- checkbox
- text-field
- text-area
- empty-state
- expander
- color-picker
- popover
- divider
- dropdown
- dropdown-item

**Icons Used:**

- search.svg
- cat.svg
- plus.svg
- edit.svg
- player-pause.svg
- player-play.svg
- chart-bar.svg
- trash.svg

---

#### 3. Demo Site (`/demo/`)

**Status:** Builds currently work, cannot reinstall  
**Files Affected:** 4 files

- `demo/package.json` - Dependency declaration
- `demo/astro.config.mjs` - NoExternal config
- `demo/src/pages/about.astro` - Attribution link (line 36)
- `demo/package-lock.json` - Lockfile references

---

### Medium Priority

#### 4. Documentation & Instructions

**`.github/copilot-instructions.md`:**

- Line 22: Reference to Quiet UI `llms.txt` file for AI assistance

**`docs/source/content/credits.md`:**

- Line 13: Attribution and link to Quiet UI website

---

## File-by-File Breakdown

### Configuration Files

```
docs/package.json (1 reference)
├── dependencies: "@quietui/quiet": "^1.3.0"

meowzer/ui/package.json (3 references)
├── dependencies: "@quietui/quiet": "^1.3.0"
├── peerDependencies: "@quietui/quiet": "^1.3.0"
└── devDependencies: "@quietui/quiet": "^1.3.0"

demo/package.json (1 reference)
└── dependencies: "@quietui/quiet": "^1.3.0"

demo/astro.config.mjs (1 reference)
└── noExternal: ["@quietui/quiet"]
```

### Source Files

```
docs/source/main.ts (18 references)
├── import { allDefined } from "@quietui/quiet"
└── 17 component imports

docs/source/style.css (2 references)
├── @import "@quietui/quiet/themes/quiet.css"
└── @import "@quietui/quiet/themes/restyle.css"

meowzer/ui/scripts/setup.ts (13 references)
├── 20 component imports (lines 18-37)
├── import { setLibraryPath } (line 43)
├── initializeQuietUI() function (line 51)
├── loadQuietUIStyles() function (line 63)
└── CDN URLs and paths (lines 54, 70-71, 96, 101, 104)

meowzer/ui/scripts/copy-assets.ts (10 references)
├── Theme paths (lines 25, 29)
└── Icon paths (lines 37-65)

meowzer/ui/.storybook/preview.ts (18 references)
├── import { setLibraryPath } (line 2)
├── Theme imports (lines 8-9)
└── 16 component imports (lines 12-27)
```

### Documentation Files

```
meowzer/ui/README.md (6 references)
├── Installation examples (lines 9, 52)
├── Dependencies list (line 15)
├── CDN URLs (lines 29, 33)
└── Import examples (lines 57-58)

docs/source/content/credits.md (1 reference)
└── Attribution link

demo/src/pages/about.astro (1 reference)
└── Attribution link

.github/copilot-instructions.md (1 reference)
└── Reference to llms.txt
```

### Lock Files

```
package-lock.json (9 references)
├── Workspace references
└── Dependency tree entries

meowzer/ui/package-lock.json (8 references)
├── Direct dependency
├── @quietui/scurry
└── @quietui/squeak

demo/package-lock.json (15 references)
├── Direct dependency
├── @quietui/scurry
└── @quietui/squeak
```

---

## Dependencies

Quiet UI has its own dependencies that are also affected:

- `@quietui/scurry` ^5.0.1
- `@quietui/squeak` ^1.1.0
- Various other transitive dependencies

These will need to be replaced or removed along with the main package.

---

## HTML/Template Usage

**Good news:** No direct HTML element usage found (e.g., `<q-button>`, `<qu-card>`, etc.)

All Quiet UI components are imported in TypeScript/JavaScript files, making migration cleaner.

---

## Replacement Strategy

### Selected: Carbon Web Components

**Package:** `@carbon/web-components`  
**Repository:** https://github.com/carbon-design-system/carbon/tree/main/packages/web-components

**Benefits:**

- IBM's Carbon Design System - enterprise-grade
- Built with Lit (same foundation as Quiet UI)
- Active maintenance and long-term support
- Comprehensive component library
- Excellent accessibility
- Strong TypeScript support
- Well-documented
- Used in production by major companies

**Migration Effort:** Medium (2-3 days)

- Replace imports
- Update component names (use `cds-` prefix)
- Adjust theme references
- Update documentation

### Alternative Options (Not Chosen)

**Option 2: Build Custom Components**

- Full control, no external dependencies
- Effort: High (1-2 weeks)
- Rejected: Too time-consuming, reinventing the wheel

**Option 3: Shoelace/Web Awesome**

- Popular Lit-based library
- Rejected: Now owned by company we don't want to support

**Option 4: Mix of Libraries**

- Flexibility to use best tool for each job
- Effort: Medium-High
- Rejected: Potential inconsistency, multiple APIs to learn

---

## Recommended Next Steps

1. **Immediate (Today):**

   - ✅ Choose replacement library: **Carbon Web Components**
   - Create Carbon component mapping
   - Update todo list with migration tasks

2. **Phase 1 (Day 1-2):**

   - Install `@carbon/web-components` in docs site
   - Replace Quiet UI imports with Carbon imports
   - Update component usage (Quiet UI → `cds-` prefix)
   - Get docs building and running
   - Verify basic functionality

3. **Phase 2 (Day 2-3):**

   - Install `@carbon/web-components` in UI package
   - Update setup scripts
   - Update copy-assets script (use Carbon icons)
   - Replace Storybook imports
   - Test Storybook

4. **Phase 3 (Day 3-4):**

   - Install `@carbon/web-components` in demo site
   - Update component references
   - Update documentation (README files)
   - Update copilot instructions
   - Clean up package-lock files

5. **Phase 4 (Day 4-5):**
   - Theme customization (Carbon themes)
   - Final testing across all packages
   - Documentation updates
   - Commit and deploy

---

## Risk Assessment

### High Risk

- ⚠️ Cannot install dependencies on new machines
- ⚠️ Cannot onboard new developers
- ⚠️ CI/CD pipelines will fail
- ⚠️ Deployments blocked

### Medium Risk

- ⚠️ Existing node_modules will eventually need updating
- ⚠️ Security vulnerabilities cannot be patched
- ⚠️ Cannot update other dependencies that conflict

### Low Risk

- Current builds work (for now)
- No runtime errors in production (yet)

---

## Component Mapping Reference

For migration, here's what needs replacement:

| Quiet UI Component | Count | Used In        |
| ------------------ | ----- | -------------- |
| button             | 3     | docs, ui, demo |
| card               | 3     | docs, ui, demo |
| icon               | 3     | docs, ui, demo |
| text-field         | 3     | docs, ui, demo |
| badge              | 3     | docs, ui, demo |
| select             | 3     | docs, ui, demo |
| checkbox           | 3     | docs, ui, demo |
| spinner            | 3     | docs, ui, demo |
| callout            | 3     | docs, ui, demo |
| divider            | 3     | docs, ui, demo |
| color-picker       | 2     | docs, ui       |
| popover            | 2     | docs, ui       |
| text-area          | 2     | docs, ui       |
| empty-state        | 2     | docs, ui       |
| button-group       | 2     | docs, ui       |
| dialog             | 2     | ui, demo       |
| toolbar            | 1     | ui             |
| tooltip            | 1     | ui             |
| expander           | 1     | ui             |
| dropdown           | 1     | ui             |
| dropdown-item      | 1     | ui             |

**Total Unique Components:** 23

---

## Conclusion

This is a **critical issue** that needs immediate attention. We will migrate to **Carbon Web Components** (`@carbon/web-components`) because:

1. ✅ Enterprise-grade quality from IBM
2. ✅ Built with Lit (same technology as Quiet UI)
3. ✅ Active maintenance and long-term support
4. ✅ Comprehensive component library
5. ✅ Excellent documentation and TypeScript support
6. ✅ Strong accessibility built-in
7. ✅ Not owned by companies we're avoiding

Estimated total migration time: **3-5 days** for full migration across all packages.

**Next Action:** Create Carbon component mapping and begin Phase 1 migration of docs site.
