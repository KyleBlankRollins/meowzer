# Large Files Audit

Files with more than 300 lines of code in the workspace.

**Audit Date:** January 2025  
**Previous Audit:** October 23, 2025

**Criteria:**

- Excludes: node_modules, dist, dist-ssr, .vscode, .idea, meta directories
- Excludes: Markdown files
- Threshold: > 300 lines

## Results

| Lines | File Path                                                                    | Category         |
| ----- | ---------------------------------------------------------------------------- | ---------------- |
| 763   | `./meowzer/meowtion/cat.ts`                                                  | Source Code      |
| 695   | `./meowzer/meowzer/__tests__/meowzer.test.ts`                                | Test File        |
| 566   | `./meowzer/meowtion/animations.ts`                                           | Source Code      |
| 508   | `./docs/source/components/mb-cat-creator/mb-cat-creator.ts`                  | Component        |
| 495   | `./docs/source/components/mb-meowzer-controls/mb-meowzer-controls.ts`        | Component        |
| 433   | `./docs/vite-plugin-meowbase-docs.ts`                                        | Build Tool       |
| 422   | `./meowzer/meowbrain/__tests__/meowbrain.test.ts`                            | Test File        |
| 416   | `./meowzer/meowbase/storage/indexeddb-adapter.ts`                            | Source Code      |
| 403   | `./meowzer/meowtion/__tests__/meowtion.test.ts`                              | Test File        |
| 383   | `./docs/source/components/mb-meowzer-controls/mb-meowzer-controls.styles.ts` | Styles           |
| 381   | `./meowzer/meowkit/meowkit.ts`                                               | Source Code      |
| 378   | `./meowzer/meowbrain/brain.ts`                                               | Source Code      |
| 363   | `./meowzer/types.ts`                                                         | Type Definitions |
| 351   | `./meowzer/meowbrain/behaviors.ts`                                           | Source Code      |
| 337   | `./meowzer/meowbase/core/sample-data.ts`                                     | Data File        |
| 323   | `./meowzer/meowbase/collections/operations.ts`                               | Source Code      |
| 313   | `./meowzer/meowbase/meowbase.ts`                                             | Source Code      |
| 301   | `./meowzer/meowkit/__tests__/meowkit.test.ts`                                | Test File        |

## Summary

**Total files > 300 lines:** 18 (unchanged from previous audit)

### By Category

- **Source Code:** 8 files (+1 from previous)
- **Test Files:** 4 files (unchanged)
- **Components:** 2 files (new category)
- **Styles:** 1 file (new category)
- **Build Tools:** 1 file (unchanged)
- **Type Definitions:** 1 file (unchanged)
- **Data Files:** 1 file (unchanged)

### Largest Source Code Files

1. `meowzer/meowtion/cat.ts` - 763 lines (+6)
2. `meowzer/meowtion/animations.ts` - 566 lines (+17)
3. `meowzer/meowbase/storage/indexeddb-adapter.ts` - 416 lines (**NEW**)
4. `meowzer/meowkit/meowkit.ts` - 381 lines (unchanged)
5. `meowzer/meowbrain/brain.ts` - 378 lines (unchanged)

### Changes Since Last Audit

#### New Files > 300 Lines

1. **`indexeddb-adapter.ts` (416 lines)** - IndexedDB storage adapter implementation
2. **`mb-cat-creator.ts` (508 lines)** - Cat creator component for docs
3. **`mb-meowzer-controls.ts` (495 lines)** - Meowzer controls component for docs
4. **`mb-meowzer-controls.styles.ts` (383 lines)** - Styles for controls component
5. **`meowbase.ts` (313 lines)** - Main Meowbase class

#### Removed Files

- **`storage.ts`** - localStorage adapter (was 28 lines, deleted during cleanup)

#### Size Changes

- `cat.ts`: 757 → 763 lines (+6)
- `animations.ts`: 549 → 566 lines (+17)
- `sample-data.ts`: 317 → 337 lines (+20)
- `operations.ts`: 313 → 323 lines (+10)
- `types.ts`: 361 → 363 lines (+2)

### Notes

- The largest source code file remains `cat.ts` at 763 lines (slight growth)
- **IndexedDB adapter** now appears in top files after localStorage removal
- Documentation components (`mb-cat-creator`, `mb-meowzer-controls`) are substantial
- Most large files still concentrated in meowzer packages (meowtion, meowbrain, meowkit, meowbase)
- Test files remain appropriately sized relative to their corresponding source files
- Overall file count > 300 lines unchanged (18 files)
