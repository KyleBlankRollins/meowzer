# Cat hats

This Meowzer feature involves both Meowkit and the Moewzer UI.

## SVG hat templates

Users should have 3 base hat templates to choose from:

- A beanie
- A cowboy hat
- A baseball cap

Each should should have an adjustable base color and an adjustable accent color.

## UI integration

The wardrobe UI will be accessible from each cat's context menu. When a user clicks on a cat, the context menu will include a "Change Hat" option that opens the wardrobe dialog. This dialog shows all available hat templates and allows the user to customize colors before applying the hat directly to the selected cat.

---

## Technical Architecture

### Data Model

**Hat Storage:**

- Hats should be stored as part of the `ProtoCat` data structure
- Add a new optional `accessories` field to `AppearanceData`:
  ```typescript
  interface AppearanceData {
    color: string;
    eyeColor: string;
    pattern: CatPattern;
    furLength: FurLength;
    shadingColor: string;
    highlightColor: string;
    accessories?: {
      hat?: {
        type: "beanie" | "cowboy" | "baseball";
        baseColor: string;
        accentColor: string;
      };
    };
  }
  ```

**Seed Format:**

- Extend the seed to include hat data (optional)
- Format: `pattern-color-eyeColor-size-furLength-hatType-hatBase-hatAccent-version`
- Example: `tabby-FF9500-00FF00-m-short-beanie-FF0000-00FF00-v1`
- If no hat: seed remains unchanged for backwards compatibility

**Persistence:**

- Hat data persists automatically through MeowBase (since it's part of `ProtoCat`)
- Import/export includes hat data

### Meowkit Integration

**New Module: `meowzer/meowkit/accessories.ts`**

- `generateHatSVG(type, baseColor, accentColor): string`
- `addHatToSprite(catSVG, hatSVG, dimensions): string`
- Hat templates stored as functions that return SVG markup

**SVG Generator Updates:**

- Update `svg-generator.ts` to check for `appearance.accessories?.hat`
- If hat exists, generate and composite hat SVG onto cat SVG
- Hat should be layered above head but respect z-ordering

### Meowtion Integration

**Animation Considerations:**

- Hat SVG elements need IDs for potential animation
- Hat should move with head during state animations
- Add `hat` to `SVGElements` interface if animated:
  ```typescript
  interface SVGElements {
    body: string;
    head: string;
    ears: string[];
    eyes: string[];
    tail: string;
    legs: string[];
    hat?: string; // Optional hat element ID
    pattern?: string[];
  }
  ```

### UI Components

**New Component: `mb-wardrobe-dialog`**

- Location: `meowzer/ui/components/mb-wardrobe-dialog/`
- Displays hat templates in grid
- Color pickers for base and accent colors
- Live preview of selected hat with current colors
- Apply/Cancel buttons for direct application

**Context Menu Integration:**

- Add "Change Hat" menu item to cat context menu in `mb-cat-playground`
- Position: After "Rename", before any disabled items
- Icon: Use Quiet UI's "shirt" icon
- Opens `mb-wardrobe-dialog` with current cat as target
- If cat already has a hat, show "Remove Hat" option as separate menu item

## Hat SVG Specifications

### Dimensions and Positioning

- ViewBox: Each hat fits within 30x30 units
- Anchor Point: Bottom-center of hat aligns with top-center of cat head
- Cat head position: Approximately `x="58" y="28" width="18" height="18"`
- Hat offset: `x="54" y="13"` (centered above head, slight overlap)

### Hat Templates

#### Beanie

- **Base Color Elements:** Main knit portion
- **Accent Color Elements:** Folded brim, pom-pom on top
- **Style:** Blocky pixel-art style matching cat aesthetic
- **Key Features:** Rectangular body, circular pom-pom, folded edge

#### Cowboy Hat

- **Base Color Elements:** Hat crown and brim
- **Accent Color Elements:** Hat band around crown
- **Style:** Wide brim, tall crown, pixel-art western style
- **Key Features:** Curved brim edges, rectangular band

#### Baseball Cap

- **Base Color Elements:** Cap crown and bill
- **Accent Color Elements:** Button on top, optional logo area
- **Style:** Modern cap with forward-facing bill
- **Key Features:** Curved bill, segmented crown, top button

### Scaling

- Hats should scale proportionally with cat size
- Small cats: 0.8x scale
- Medium cats: 1.0x scale
- Large cats: 1.2x scale
- Apply same scale multiplier as `dimensions.scale`

### Z-Index/Layering

- Hat rendered after head but before pattern overlay
- Render order in SVG:
  1. Tail (background)
  2. Back legs
  3. Body
  4. Front legs
  5. Head
  6. **Hat (new)**
  7. Pattern overlay (if applicable)

## UI/UX Details

### Context Menu Integration

**Menu Items:**

- **"Change Hat"** - Opens wardrobe dialog
  - Position: After "Rename", before disabled items
  - Icon: `<quiet-icon family="outline" name="shirt">`
  - Always visible for all cats
- **"Remove Hat"** - Removes hat from cat
  - Position: After "Change Hat"
  - Icon: `<quiet-icon family="outline" name="trash">`
  - Only visible if cat currently has a hat
  - Destructive variant for styling

**Context Menu Structure:**

```
Right-click on cat:
├─ Remove
├─ Rename
├─ ─────────── (divider)
├─ Change Hat 👔
├─ Remove Hat 🗑️ (only if cat has hat)
├─ ─────────── (divider)
├─ Pick Up (disabled, "Soon")
├─ Pet (disabled, "Soon")
```

### Wardrobe Dialog

**Dialog Type:** Modal dialog using Quiet UI `<quiet-dialog>`

- **Trigger:** Clicking "Change Hat" in cat context menu
- **Width:** 400px
- **Modal:** True (blocks interaction with playground)
- **Close Methods:** Cancel button, ESC key, or clicking backdrop

**Dialog Layout:**

```
┌───────────────────────────────────┐
│  Change Hat for [Cat Name]    [×] │
├───────────────────────────────────┤
│                                   │
│  Select Hat Style:                │
│  ┌────────┐ ┌────────┐ ┌────────┐│
│  │ Beanie │ │Cowboy  │ │Baseball││
│  │   🧢   │ │   🤠   │ │   ⚾   ││
│  └────────┘ └────────┘ └────────┘│
│     [Selected with highlight]     │
│                                   │
│  Customize Colors:                │
│  ┌─────────────────────────────┐ │
│  │ Base Color:    [#FF0000] 🎨 │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │ Accent Color:  [#FFFF00] 🎨 │ │
│  └─────────────────────────────┘ │
│                                   │
│  Preview:                         │
│  ┌─────────────────────────────┐ │
│  │                             │ │
│  │         🎩                  │ │
│  │    (Live preview)           │ │
│  │                             │ │
│  └─────────────────────────────┘ │
│                                   │
│           [Cancel]  [Apply Hat]   │
└───────────────────────────────────┘
```

**Hat Template Selection:**

- 3 large buttons in horizontal grid layout
- Each button displays hat emoji/icon and name
- Selected hat has primary border and background highlight
- Click to select (selection updates preview immediately)
- Uses Quiet UI button components with custom styling

**Color Customization:**

- Two color picker inputs using Quiet UI `<quiet-color-picker>`
- **Base Color:** Primary color of the hat
- **Accent Color:** Secondary color for details (brim, band, etc.)
- Real-time updates to preview as user changes colors
- Default values:
  - If cat has a hat: Use current hat colors
  - If no hat: base=#FF0000, accent=#FFFF00

**Preview Section:**

- 160x160px preview area with light background
- Shows selected hat rendered with current colors
- Updates immediately when hat type or colors change
- Helps user visualize before applying to cat

**Action Buttons:**

- **Cancel:** Closes dialog without changes
  - Variant: "neutral"
  - Restores any temporary state
- **Apply Hat:** Applies selected hat with chosen colors to cat
  - Variant: "primary"
  - Closes dialog on success
  - Cat re-renders with new hat immediately

### User Flow

1. **Opening Wardrobe:**

   - User right-clicks on a cat
   - Context menu appears with cat's current options
   - User clicks "Change Hat"
   - Wardrobe dialog opens

2. **Selecting Hat:**

   - If cat has a hat: Current hat type is pre-selected, colors pre-filled
   - If no hat: First hat type (beanie) selected by default
   - User clicks different hat buttons to see options
   - Preview updates immediately

3. **Customizing Colors:**

   - User clicks color picker for base color
   - Quiet UI color picker opens
   - User selects color
   - Preview updates immediately
   - Repeat for accent color

4. **Applying Hat:**

   - User clicks "Apply Hat" button
   - Dialog closes
   - Cat's `addHat()` or `updateHatColors()` method called
   - Cat re-renders with new hat
   - `hat-applied` or `hat-updated` event dispatched

5. **Removing Hat:**
   - User right-clicks on cat with hat
   - User clicks "Remove Hat" in context menu
   - Hat removed immediately (no dialog)
   - Cat re-renders without hat
   - `hat-removed` event dispatched

## State Management

### Cat Hat State

- Hat data stored in `cat.appearance.accessories.hat`
- Accessed via `MeowzerCat` instance
- Persisted in MeowBase automatically

### UI State

- Active wardrobe dialog (open/closed)
- Target cat for wardrobe dialog (MeowzerCat instance)
- Selected hat template ('beanie' | 'cowboy' | 'baseball')
- Current base color (string)
- Current accent color (string)

### Events

```typescript
// Dispatched when hat applied to cat
new CustomEvent('hat-applied', {
  detail: {
    catId: string;
    hat: {
      type: 'beanie' | 'cowboy' | 'baseball';
      baseColor: string;
      accentColor: string;
    };
  }
});

// Dispatched when hat removed from cat
new CustomEvent('hat-removed', {
  detail: { catId: string }
});

// Dispatched when hat colors updated
new CustomEvent('hat-updated', {
  detail: {
    catId: string;
    hat: { /* ... */ }
  }
});
```

## Constraints & Validation

### Rules

- **One hat per cat:** Cats can only wear one hat at a time
- **Color validation:** Use existing `isValidColor()` from Meowkit
- **Unlimited combinations:** No preset limit on color combinations
- **Optional feature:** Hats are optional

### File Size

- Each hat template: ~500 bytes of SVG
- Hat data in seed: ~30 additional characters
- Negligible impact on storage/performance

### Backwards Compatibility

We DO NOT care about backwards compatibility.

## API Design

### Meowkit API

```typescript
// In builder.ts or new accessories.ts
export function buildCatWithAccessories(
  settings: CatSettings,
  accessories?: AccessorySettings
): ProtoCat;

export interface AccessorySettings {
  hat?: {
    type: "beanie" | "cowboy" | "baseball";
    baseColor: string;
    accentColor: string;
  };
}
```

### SDK API (MeowzerCat)

```typescript
class MeowzerCat {
  // Add hat to cat
  addHat(type: HatType, baseColor: string, accentColor: string): void;

  // Remove hat from cat
  removeHat(): void;

  // Update hat colors
  updateHatColors(baseColor: string, accentColor: string): void;

  // Check if cat has hat
  hasHat(): boolean;

  // Get hat data
  getHat(): HatData | undefined;
}

type HatType = "beanie" | "cowboy" | "baseball";

interface HatData {
  type: HatType;
  baseColor: string;
  accentColor: string;
}
```

### UI Component API

```typescript
// mb-wardrobe-dialog
<mb-wardrobe-dialog
  .targetCat=${catInstance}
  @apply-hat=${(e) => console.log(e.detail)}
  @dialog-close=${() => console.log('Dialog closed')}
></mb-wardrobe-dialog>

// Programmatic access
const dialog = document.querySelector('mb-wardrobe-dialog');
dialog.open(catInstance); // Opens dialog for specific cat
dialog.close(); // Closes dialog
```

## Animation Considerations

### State Animations

- Hat should follow head during all state transitions
- No independent hat animations initially (future: tip hat, bobble)
- Hat inherits head transforms (rotation, position)

### Implementation

- Group hat SVG with head group in SVG structure
- Hat elements get IDs for potential future animation
- Meowtion's head animations automatically affect hat

### Movement

- Hat stays positioned relative to head during walking/running
- No physics simulation for hat (future: wobble effect)

## Testing Strategy

Only manual testing.

## Migration Path

There is no migration path. We DO NOT care about backwards compatibility.

## Future Extensibility

### Additional Hat Types

- Easy to add new hat types to the system
- Pattern established for SVG templates
- Consistent API for all hat types
- Future hats: wizard hat, top hat, party hat, santa hat, etc.

### Other Accessories

- **Collars:** Similar system, positioned on neck
- **Bandanas:** Tied around neck
- **Glasses:** Positioned on face
- **Bow ties:** Small accessory on chest

### Accessory Framework

```typescript
interface AccessorySettings {
  hat?: HatAccessory;
  collar?: CollarAccessory;
  glasses?: GlassesAccessory;
  // Future accessories...
}

interface BaseAccessory {
  baseColor: string;
  accentColor: string;
}

interface HatAccessory extends BaseAccessory {
  type: "beanie" | "cowboy" | "baseball";
}

interface CollarAccessory extends BaseAccessory {
  type: "simple" | "studded" | "bell";
}
```

### Accessory Categories in UI

- Wardrobe dialog tabs: Hats | Collars | Accessories
- Each category shows relevant templates
- Consistent color customization pattern
- Same dialog-based workflow for all accessory types
