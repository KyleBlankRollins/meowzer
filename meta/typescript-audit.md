# Meowzer TypeScript Audit

## Overview

This audit identifies shared TypeScript types across the Meowzer project and creates a centralized type definitions file.

## Current State

### Meowbase Project (`/meowbase`)

- **Purpose**: Cat database/collection management
- **Types file**: `meowbase/types.ts`
- **Contains**: Collection, Cat (database entity), Toy, Human, Emotion, MeowbaseConfig, MeowbaseResult
- **Note**: This is a DIFFERENT "Cat" than Meowzer's animated cat - it's a database record

### Meowzer Project (`/meowzer`)

- **Purpose**: Autonomous animated cat sprites
- **Current state**: Spec files only, no implementation yet
- **Subdirectories**:
  - `meowkit/` - Cat creation library (spec only)
  - `meowtion/` - Animation library (spec only)
  - `meowbrain/` - AI library (spec only)

### Docs Project (`/docs`)

- **Purpose**: Documentation site
- **Contains**: LitElement components, utilities
- **Dependencies**: Uses Meowbase for demos

## Type Conflicts

### ⚠️ NAMING COLLISION: "Cat"

There are **TWO different "Cat" interfaces**:

1. **Meowbase Cat** (`meowbase/types.ts`):

   ```typescript
   interface Cat {
     id: string;
     name: string;
     image: string;
     birthday: Date;
     favoriteToy: Toy;
     // ... database fields
   }
   ```

   - Purpose: Database entity for storing cat information
   - Used by: Meowbase library

2. **Meowzer Cat** (`meowzer/types.ts`):
   ```typescript
   interface Cat {
     id: string;
     element: HTMLElement;
     state: CatState;
     position: Position;
     moveTo(x: number, y: number): Promise<void>;
     // ... animation methods
   }
   ```
   - Purpose: Animated sprite instance
   - Used by: Meowtion/Meowbrain/Meowzer libraries

### Recommendation

**Keep them separate** - they serve completely different purposes:

- Meowbase deals with **data storage** (cat profiles, collections)
- Meowzer deals with **visual animation** (sprites, movement, AI)

If both are used together in the future:

- Import with aliases: `import { Cat as DatabaseCat } from 'meowbase'`
- Import with aliases: `import { Cat as AnimatedCat } from 'meowzer'`

## Shared Types Created

Created `/meowzer/types.ts` containing ALL type definitions for the Meowzer ecosystem:

### Shared Primitives

- `Position` - x/y coordinates
- `Velocity` - movement speed
- `Boundaries` - rectangular constraints

### Meowkit Types (Cat Creation)

- `CatSettings` - User input for appearance
- `CatPattern`, `CatSize`, `FurLength` - Enums
- `ProtoCat` - Complete cat definition
- `AppearanceData`, `DimensionData`, `SpriteData` - Sub-structures
- `SVGElements`, `ViewBox`, `MetadataInfo` - SVG-related
- `ValidationResult` - Settings validation

### Meowtion Types (Animation)

- `Cat` - Animated instance
- `CatStateType`, `CatState` - Animation states
- `CatEvent` - Events emitted by cats
- `AnimationOptions`, `PhysicsOptions` - Configuration
- `StateTransition`, `EasingFunction` - Animation mechanics

### Meowbrain Types (AI)

- `Brain` - AI controller
- `Personality`, `PersonalityPreset` - Behavioral traits
- `BehaviorType`, `BrainState` - Current behavior
- `Motivation`, `Memory` - Decision-making data
- `Environment`, `Obstacle`, `Attractor` - Environmental context
- `BrainEvent`, `BrainOptions`, `MotivationDecay` - Configuration
- `BehaviorWeights` - Decision weights

### Meowzer Types (Public API)

- `MeowzerCat` - Public-facing cat instance
- `MeowzerEvent`, `MeowzerOptions` - Public API types

### Utility Types

- `EventHandler` - Generic event callback

## Usage Recommendations

### For Meowzer Implementation

All three libraries (Meowkit, Meowtion, Meowbrain) should import from the shared types file:

```typescript
// meowkit/meowkit.ts
import type {
  CatSettings,
  ProtoCat,
  ValidationResult,
} from "../types.js";

// meowtion/meowtion.ts
import type { ProtoCat, Cat, AnimationOptions } from "../types.js";

// meowbrain/meowbrain.ts
import type {
  Cat,
  Brain,
  BrainOptions,
  Personality,
} from "../types.js";

// meowzer.ts (wrapper)
import type { MeowzerCat, MeowzerOptions } from "./types.js";
```

### For Docs Project

The docs can import types from both ecosystems:

```typescript
import type {
  Cat as DatabaseCat,
  Collection,
} from "../meowbase/types.js";
import type { MeowzerCat, CatSettings } from "../meowzer/types.js";
```

### For External Consumers

When publishing packages, the types file should be exported:

```json
// package.json
{
  "exports": {
    ".": "./dist/meowzer.js",
    "./types": "./dist/types.js"
  }
}
```

## Benefits of Centralized Types

1. **Single source of truth** - No duplicate definitions
2. **Easy refactoring** - Change once, updates everywhere
3. **Better IntelliSense** - IDEs can autocomplete across libraries
4. **Type safety** - Catch incompatibilities at compile time
5. **Documentation** - Types serve as living documentation

## Next Steps

1. ✅ Create `/meowzer/types.ts` with all shared types
2. ⏳ Implement Meowkit using shared types
3. ⏳ Implement Meowtion using shared types
4. ⏳ Implement Meowbrain using shared types
5. ⏳ Implement Meowzer wrapper using shared types
6. ⏳ Update docs to demonstrate both Meowbase and Meowzer
7. ⏳ Consider renaming one "Cat" interface if confusion arises

## File Structure

```
meowbase/
├── types.ts                    # Database types (Cat, Collection, etc.)
├── meowbase.ts
└── ...

meowzer/
├── types.ts                    # NEW - All Meowzer types
├── README.md                   # Wrapper spec
├── meowkit/
│   ├── README.md              # Spec
│   └── meowkit.ts             # To be implemented
├── meowtion/
│   ├── README.md              # Spec
│   └── meowtion.ts            # To be implemented
├── meowbrain/
│   ├── README.md              # Spec
│   └── meowbrain.ts           # To be implemented
└── meowzer.ts                 # To be implemented (wrapper)

docs/
├── source/
│   └── components/            # Uses both Meowbase and (eventually) Meowzer
└── ...
```
