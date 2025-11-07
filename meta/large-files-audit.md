# Large Files Audit

Files with more than 300 lines of code in the workspace.

**Audit Date:** November 7, 2025  
**Previous Audit:** January 2025

**Criteria:**

- Excluded directories: docs, meta, node_modules, dist, dist-ssr
- Excluded file extensions: .vscode, .idea, .md
- Threshold: > 300 lines

## Results

| Lines | File Path                                                                | Category    |
| ----- | ------------------------------------------------------------------------ | ----------- |
| 1018  | `./meowzer/meowbrain/brain.ts`                                           | Source Code |
| 1001  | `./meowzer/sdk/meowzer-cat.ts`                                           | Source Code |
| 912   | `./meowzer/sdk/__tests__/storage-manager.test.ts`                        | Test File   |
| 908   | `./meowzer/sdk/__tests__/errors.test.ts`                                 | Test File   |
| 774   | `./meowzer/ui/components/mb-cat-playground/mb-cat-playground.ts`         | Component   |
| 683   | `./meowzer/sdk/__tests__/integration.test.ts`                            | Test File   |
| 663   | `./meowzer/sdk/managers/storage-manager.ts`                              | Source Code |
| 459   | `./meowzer/sdk/errors.ts`                                                | Source Code |
| 439   | `./meowzer/meowtion/cat/movement.ts`                                     | Source Code |
| 438   | `./meowzer/ui/components/cat-creator/cat-creator.ts`                     | Component   |
| 429   | `./meowzer/meowbrain/behaviors.ts`                                       | Source Code |
| 422   | `./meowzer/meowbrain/__tests__/meowbrain.test.ts`                        | Test File   |
| 416   | `./meowzer/meowbase/storage/indexeddb-adapter.ts`                        | Source Code |
| 403   | `./meowzer/meowtion/__tests__/meowtion.test.ts`                          | Test File   |
| 402   | `./meowzer/sdk/managers/interaction-manager.ts`                          | Source Code |
| 398   | `./meowzer/sdk/managers/cat-manager.ts`                                  | Source Code |
| 397   | `./meowzer/sdk/managers/hook-manager.ts`                                 | Source Code |
| 395   | `./meowzer/sdk/__tests__/utils.test.ts`                                  | Test File   |
| 388   | `./meowzer/meowtion/cat.ts`                                              | Source Code |
| 363   | `./meowzer/sdk/__tests__/hook-manager.test.ts`                           | Test File   |
| 351   | `./meowzer/sdk/__tests__/plugin-manager.test.ts`                         | Test File   |
| 347   | `./meowzer/sdk/utils.ts`                                                 | Source Code |
| 337   | `./meowzer/meowbrain/decision-engine.ts`                                 | Source Code |
| 331   | `./meowzer/ui/components/mb-playground-toolbar/mb-playground-toolbar.ts` | Component   |
| 331   | `./meowzer/ui/components/mb-cat-overlay/mb-cat-overlay.ts`               | Component   |
| 329   | `./meowzer/ui/controllers/reactive-controllers.ts`                       | Source Code |
| 324   | `./meowzer/ui/components/mb-wardrobe-dialog/mb-wardrobe-dialog.ts`       | Component   |
| 323   | `./meowzer/meowbase/collections/operations.ts`                           | Source Code |
| 321   | `./meowzer/meowbase/core/sample-data.ts`                                 | Data File   |
| 314   | `./meowzer/sdk/plugin.ts`                                                | Source Code |
| 313   | `./meowzer/meowbase/meowbase.ts`                                         | Source Code |
| 311   | `./meowzer/ui/components/cat-importer/cat-importer.ts`                   | Component   |
| 301   | `./meowzer/meowkit/__tests__/meowkit.test.ts`                            | Test File   |

## Summary

**Total files > 300 lines:** 33 (+15 from previous audit)

### By Category

- **Source Code:** 17 files (+9 from previous)
- **Test Files:** 9 files (+5 from previous)
- **Components:** 6 files (+4 from previous)
- **Data Files:** 1 file (unchanged)

### Largest Source Code Files

1. `meowzer/meowbrain/brain.ts` - 1018 lines (+640)
2. `meowzer/sdk/meowzer-cat.ts` - 1001 lines (**NEW**)
3. `meowzer/sdk/managers/storage-manager.ts` - 663 lines (**NEW**)
4. `meowzer/sdk/errors.ts` - 459 lines (**NEW**)
5. `meowzer/meowtion/cat/movement.ts` - 439 lines (**NEW**)

### Changes Since Last Audit

#### Major Growth Areas

The codebase has seen significant expansion, particularly in the SDK package:

- **SDK Package**: New 1000+ line files (`meowzer-cat.ts`, `brain.ts`)
- **SDK Managers**: Multiple new manager files (storage, interaction, cat, hook)
- **UI Components**: New components for playground, creator, and wardrobe functionality
- **Test Coverage**: Substantial increase in test files, particularly for SDK

#### New Files > 300 Lines

**SDK Package (10 new files):**

1. `meowzer-cat.ts` (1001 lines) - Main SDK cat implementation
2. `storage-manager.ts` (663 lines) - Storage management
3. `errors.ts` (459 lines) - Error handling
4. `interaction-manager.ts` (402 lines) - Interaction management
5. `cat-manager.ts` (398 lines) - Cat management
6. `hook-manager.ts` (397 lines) - Hook system
7. `utils.ts` (347 lines) - Utility functions
8. `plugin.ts` (314 lines) - Plugin system
9. Plus 3 new test files (storage-manager, errors, integration)

**UI Package (6 new files):**

1. `mb-cat-playground.ts` (774 lines) - Main playground component
2. `cat-creator.ts` (438 lines) - Cat creation UI
3. `mb-playground-toolbar.ts` (331 lines) - Playground toolbar
4. `mb-cat-overlay.ts` (331 lines) - Cat overlay UI
5. `mb-wardrobe-dialog.ts` (324 lines) - Wardrobe functionality
6. `cat-importer.ts` (311 lines) - Cat import UI

**Meowtion Package (1 new file):**

1. `movement.ts` (439 lines) - Cat movement logic (refactored from `cat.ts`)

**Controllers:**

1. `reactive-controllers.ts` (329 lines) - Reactive controller implementations

#### Removed/Refactored Files

Files no longer appearing in the audit (either removed or reduced below 300 lines):

- `meowzer/__tests__/meowzer.test.ts` (was 695 lines) - **REMOVED**
- `meowtion/animations.ts` (was 566 lines) - likely refactored
- `meowkit/meowkit.ts` (was 381 lines) - reduced in size
- `types.ts` (was 363 lines) - likely split up
- Former docs components (moved to UI package)

#### Significant Size Changes

- `meowbrain/brain.ts`: 378 → 1018 lines (+640) ⚠️ **Major growth**
- `meowtion/cat.ts`: 763 → 388 lines (-375) - refactored with movement extracted
- `meowbrain/behaviors.ts`: 351 → 429 lines (+78)
- `meowbase/operations.ts`: 323 → 323 lines (unchanged)
- `meowbase/sample-data.ts`: 337 → 321 lines (-16)

### Notes

- **Dramatic increase in large files**: From 18 to 33 files (+83% growth)
- **SDK package dominates**: Most new large files are in the SDK package
- **Brain.ts is now the largest file**: At 1018 lines, significantly larger than any previous file
- **Good refactoring in Meowtion**: `cat.ts` reduced by splitting out `movement.ts`
- **UI package maturity**: Multiple substantial UI components added
- **Test coverage growth**: 9 test files now over 300 lines (vs 4 previously)
- **Concerns**: `brain.ts` and `meowzer-cat.ts` both exceeding 1000 lines may need refactoring consideration
