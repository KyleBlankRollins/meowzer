# Large Files Audit

Files with more than 300 lines of code in the workspace.

**Audit Date:** October 23, 2025

**Criteria:**

- Excludes: node_modules, dist, dist-ssr, .vscode, .idea directories
- Excludes: Markdown files
- Threshold: > 300 lines

## Results

| Lines | File Path                                         | Category         |
| ----- | ------------------------------------------------- | ---------------- |
| 757   | `./meowzer/meowtion/cat.ts`                       | Source Code      |
| 695   | `./meowzer/meowzer/__tests__/meowzer.test.ts`     | Test File        |
| 549   | `./meowzer/meowtion/animations.ts`                | Source Code      |
| 433   | `./docs/vite-plugin-meowbase-docs.ts`             | Build Tool       |
| 422   | `./meowzer/meowbrain/__tests__/meowbrain.test.ts` | Test File        |
| 403   | `./meowzer/meowtion/__tests__/meowtion.test.ts`   | Test File        |
| 381   | `./meowzer/meowkit/meowkit.ts`                    | Source Code      |
| 378   | `./meowzer/meowbrain/brain.ts`                    | Source Code      |
| 361   | `./meowzer/types.ts`                              | Type Definitions |
| 351   | `./meowzer/meowbrain/behaviors.ts`                | Source Code      |
| 317   | `./meowzer/meowbase/core/sample-data.ts`          | Data File        |
| 313   | `./meowzer/meowbase/collections/operations.ts`    | Source Code      |
| 301   | `./meowzer/meowkit/__tests__/meowkit.test.ts`     | Test File        |

## Summary

**Total files > 300 lines:** 18

### By Category

- **Source Code:** 7 files
- **Test Files:** 4 files
- **Build Tools:** 1 file
- **Type Definitions:** 1 file
- **Data Files:** 1 file

### Largest Source Code Files

1. `meowzer/meowtion/cat.ts` - 757 lines
2. `meowzer/meowtion/animations.ts` - 549 lines
3. `meowzer/meowkit/meowkit.ts` - 381 lines
4. `meowzer/meowbrain/brain.ts` - 378 lines
5. `meowzer/meowbrain/behaviors.ts` - 351 lines

### Notes

- The largest actual source code file is `cat.ts` at 757 lines
- Most large files are concentrated in the meowzer package (meowtion, meowbrain, meowkit)
- Test files are appropriately sized relative to their corresponding source files
