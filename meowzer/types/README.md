# Meowzer Type Organization

This directory contains all shared TypeScript type definitions for the Meowzer project.

## Organization Strategy

Types are organized by **domain** rather than by package, making it easy to find related types and avoid duplication.

### Directory Structure

```
types/
├── primitives.ts          # Foundational types (Position, Boundaries, etc.)
├── cat/
│   ├── appearance.ts      # Visual properties (CatSettings, ProtoCat, etc.)
│   ├── behavior.ts        # AI/personality (Personality, BehaviorType, etc.)
│   ├── animation.ts       # Movement/states (CatStateType, AnimationOptions, etc.)
│   └── metadata.ts        # Persistence (CatMetadata, CatJSON, etc.)
├── sdk/
│   ├── events.ts          # Event system (MeowzerEvent, event handlers)
│   └── options.ts         # Configuration (CreateCatOptions, MeowzerConfig, etc.)
└── storage/
    └── collections.ts     # Storage types (CollectionInfo, StorageAdapter, etc.)
```

## Usage

All types are re-exported from the main index file:

```typescript
// ✅ PREFERRED: Import from shared types
import type {
  Position,
  CatSettings,
  Personality,
} from "@meowzer/types";

// ❌ AVOID: Importing from individual files (unless needed for tree-shaking)
import type { Position } from "@meowzer/types/primitives";
```

## Type Placement Rules

### Keep in Implementation File

Define types in the implementation file when:

- Used in **only that file**
- Private implementation details
- Not exported from the package

Example:

```typescript
// In cat-manager.ts
interface InternalCatCache {
  cats: Map<string, MeowzerCat>;
  lastCleanup: number;
}
```

### Move to Shared Types

Move types to this shared package when:

- Used by **2+ packages**
- Part of the **public API**
- **Primitive/foundational** type (Position, Boundaries, etc.)

Example:

```typescript
// In types/primitives.ts
export interface Position {
  x: number;
  y: number;
}
```

### Package-Specific Types

Keep in package's `types.ts` when:

- Only used **within that package**
- Package-specific implementation detail
- Not needed by package consumers

Example:

```typescript
// In meowtion/types.ts (if package-specific)
export interface InternalAnimationState {
  timeline: gsap.core.Timeline;
  isPlaying: boolean;
}
```

## Migration Guide

When refactoring code to use shared types:

1. **Import from shared types**:

   ```typescript
   import type { Position, CatSettings } from "../types/index.js";
   ```

2. **Remove duplicate definitions** from individual packages

3. **Update exports** in package index files to re-export shared types:
   ```typescript
   // In sdk/index.ts
   export type { Position, Boundaries } from "../types/index.js";
   ```

## Benefits

- ✅ **No duplication** - Single source of truth for each type
- ✅ **Easy to find** - Domain-based organization is intuitive
- ✅ **Type safety** - Changes propagate automatically
- ✅ **Better IDE support** - Centralized types improve autocomplete
- ✅ **Easier refactoring** - Update once, affects all packages

## Type Naming Conventions

- **Interfaces**: PascalCase, descriptive names (e.g., `CatSettings`, `BrainState`)
- **Type aliases**: PascalCase for unions/literals (e.g., `CatStateType`, `PersonalityPreset`)
- **Enums/Constants**: PascalCase for object, UPPER_CASE for keys (e.g., `MeowzerEvent.STATE_CHANGE`)
- **Generic types**: Single capital letter or descriptive name (e.g., `T`, `TData`)

## Avoiding Circular Dependencies

When types reference each other across domains:

1. **Use `any` temporarily** with a TODO comment
2. **Import the specific type** if needed
3. **Consider refactoring** if circular dependencies become complex

Example:

```typescript
// In cat/behavior.ts
export interface Environment {
  otherCats?: any[]; // TODO: Reference Cat interface without circular dependency
}
```
