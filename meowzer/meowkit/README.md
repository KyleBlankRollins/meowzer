# Meowkit

Character creation library for building customizable cat sprites.

## Overview

Meowkit transforms user-defined settings into a structured `ProtoCat` object that contains all the data needed to render and animate a cat character. This library focuses purely on data transformation and validation - it does not handle rendering or animation.

## Core Concepts

### CatSettings (Input)

User-facing configuration object created by frontend code:

```typescript
interface CatSettings {
  color: string; // Primary fur color (hex or named color)
  eyeColor: string; // Eye color (hex or named color)
  pattern: CatPattern; // Fur pattern type
  size: CatSize; // Overall size category
  furLength: FurLength; // Fur length style
}

type CatPattern = "solid" | "tabby" | "calico" | "tuxedo" | "spotted";
type CatSize = "small" | "medium" | "large";
type FurLength = "short" | "medium" | "long";
```

### ProtoCat (Output)

Complete data structure containing all information needed for rendering and animation:

```typescript
interface ProtoCat {
  id: string; // Unique identifier
  seed: string; // Compact seed for regeneration
  appearance: AppearanceData; // Visual properties
  dimensions: DimensionData; // Size and hitbox information
  spriteData: SpriteData; // Generated SVG data (not persisted)
  metadata: MetadataInfo; // Creation timestamp, version, etc.
}

interface AppearanceData {
  color: string;
  eyeColor: string;
  pattern: CatPattern;
  furLength: FurLength;
  // Derived colors for shading/highlights
  shadingColor: string;
  highlightColor: string;
}

interface DimensionData {
  size: CatSize;
  width: number; // Base width in viewBox units
  height: number; // Base height in viewBox units
  scale: number; // Display scale multiplier
  hitbox: {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  };
}

interface SpriteData {
  svg: string; // Complete SVG markup
  elements: SVGElements; // Named SVG elements for animation
  viewBox: ViewBox; // SVG coordinate system
}

interface SVGElements {
  body: string; // Body shape element ID
  head: string; // Head shape element ID
  ears: string[]; // Ear element IDs
  eyes: string[]; // Eye element IDs
  tail: string; // Tail element ID
  pattern?: string[]; // Pattern overlay element IDs (if applicable)
}

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MetadataInfo {
  createdAt: Date;
  version: string; // Meowkit version used to create
}
```

## API Design

### Primary Builder Function

```typescript
/**
 * Creates a complete ProtoCat from user settings
 */
function buildCat(settings: CatSettings): ProtoCat;
```

### Optional Builder Pattern

For more control:

```typescript
class CatBuilder {
  withColor(color: string): CatBuilder;
  withEyeColor(color: string): CatBuilder;
  withPattern(pattern: CatPattern): CatBuilder;
  withSize(size: CatSize): CatBuilder;
  withFurLength(length: FurLength): CatBuilder;
  build(): ProtoCat;
}

// Usage
const cat = new CatBuilder()
  .withColor("#FF9500")
  .withEyeColor("green")
  .withPattern("tabby")
  .withSize("medium")
  .withFurLength("short")
  .build();
```

### Validation

```typescript
/**
 * Validates CatSettings before building
 * @throws ValidationError if settings are invalid
 */
function validateSettings(settings: CatSettings): ValidationResult;

interface ValidationResult {
  valid: boolean;
  errors: string[];
}
```

### Seed Generation

```typescript
/**
 * Generates a compact seed string from CatSettings
 * Format: pattern-color-eyeColor-size-furLength-v1
 * Example: "tabby-FF9500-00FF00-m-short-v1"
 */
function generateSeed(settings: CatSettings): string;

/**
 * Parses a seed string back into CatSettings
 * @throws ParseError if seed is invalid or version unsupported
 */
function parseSeed(seed: string): CatSettings;

/**
 * Generates a ProtoCat from a seed string
 * This is the primary way to recreate cats from storage
 */
function buildCatFromSeed(seed: string): ProtoCat;
```

### Serialization

```typescript
/**
 * Converts ProtoCat to minimal JSON for storage (seed + metadata only)
 */
function serializeCat(cat: ProtoCat): string;

/**
 * Reconstructs ProtoCat from stored JSON by regenerating from seed
 */
function deserializeCat(json: string): ProtoCat;
```

## Implementation Considerations

### SVG Generation

The library should procedurally generate SVG markup based on settings:

1. **Base Template**: Start with a base cat SVG structure using simple shapes
2. **Color Application**: Apply `fill` attributes for colors based on settings
3. **Pattern Overlay**: Add pattern-specific elements (stripes, spots, etc.)
4. **Shading**: Generate additional shapes with darker colors for depth
5. **Details**: Add eyes, nose, whiskers using configured colors
6. **Element IDs**: Assign unique IDs to each element for animation targeting

### Size Variants

Different size settings should affect the display scale:

- Small: scale 0.5-0.75
- Medium: scale 1.0
- Large: scale 1.5-2.0

Base viewBox should be consistent (e.g., `0 0 100 100`) with scaling applied at render time.

### Seed Format

Seeds should be:

- **Deterministic**: Same settings = same seed
- **Compact**: URL-safe, short strings
- **Versioned**: Include version marker for future compatibility
- **Readable**: Human-parseable for debugging

Example seed formats:

```
// Delimited format (readable)
"tabby-FF9500-00FF00-m-short-v1"

// Base64 encoded (compact)
"dGFiYnkjRkY5NTAwIzAwRkYwMCNtI3Nob3J0I3Yx"

// Hash-based (shortest)
"a3f9c2e8b1d4"
```

Recommended: **Delimited format** for balance of readability and size.

### Performance

- Regenerate SVG from seed on demand (cheap operation)
- Cache generated sprites in memory during runtime if needed
- Pre-compute derived colors (shading, highlights)
- No need to persist large SVG strings

### Zero Dependencies

This library should have no external dependencies for sprite generation. Use:

- Native JavaScript for color manipulation
- Template literals for SVG generation
- Simple algorithms for pattern generation
- Pure functions for data transformation

### SVG Structure

Generated SVG should:

- Use semantic grouping with `<g>` elements
- Include unique IDs for animatable parts
- Use `shape-rendering="geometricPrecision"` for crisp edges
- Embed pattern definitions when applicable
- Be valid, parseable SVG markup

## Usage Example

### Creating a New Cat

```typescript
import { buildCat, generateSeed } from "meowkit";

const settings = {
  color: "#FF9500",
  eyeColor: "#00FF00",
  pattern: "tabby",
  size: "medium",
  furLength: "short",
};

const protoCat = buildCat(settings);

// Store only the seed (tiny!)
const seed = protoCat.seed;
// Example seed: "tabby-FF9500-00FF00-m-short-v1"
```

### Recreating a Cat from Seed

```typescript
import { buildCatFromSeed } from "meowkit";

// Retrieve stored seed
const protoCat = buildCatFromSeed(seed);

// Same cat, freshly generated
document.body.innerHTML = protoCat.spriteData.svg;
```

### Sharing Cats

```typescript
// User can share their cat code
const sharableCode = protoCat.seed;
console.log(`My cat code: ${sharableCode}`);

// Another user enters the code
const friendsCat = buildCatFromSeed("tabby-FF9500-00FF00-m-short-v1");
```

### Full Serialization (with metadata)

```typescript
// If you need to store additional metadata
const json = serializeCat(protoCat);

// Store or transmit the JSON string
// ...

// Recreate later
const restoredCat = deserializeCat(json);
```

## Future Enhancements

- Additional patterns (bicolor, tortoiseshell, etc.)
- Accessory system (collars, hats, etc.)
- Breed-specific variations (ear shapes, tail lengths)
- Animation hint data (personality traits affecting movement)
- Export to various formats (standalone SVG file, data URL, etc.)
- Optional pixelated aesthetic mode using geometric shapes only
