# Cat Action Consolidation

This refactor moves the focus of UI cat interactions away from dedicated menu-style controls to context-sensitive controls. The main focus should be on the cats. So, each cat should always have some information visible, but more actions and information are shown depending on actions the user takes.

## Always visible features

### Gobal UI controls

These controls should be big buttons available in the lower-right corner of the window. They should always be available.

- Create new cat
- Statistics

### Individual cats

These UI elements should always be visible, but relative to each cat instance.

- Cat name
- Cat state/action under cat name
- Cat action menu button

## Context sensitive features

- on cat click, pick cat up. On next click, drop cat at mouse position.
- on menu button click, show Quiet UI dropdown component with these cat actions:
  - pause/resume
  - remove
  - rename (not implemented yet)
  - pet (not implemented yet)
  - change outfit (not implemented yet)

## Affected UI components

### Components to be significantly refactored

- **`mb-cat-playground`** - Remove toolbar buttons (pause all, resume all, destroy all). Remove cat-manager integration. Remove dialogs for creator and stats. Keep only the two global action buttons (create + statistics) positioned in lower-right corner.

- **`cat-card`** - Remove embedded `cat-controls` component. Add menu button that triggers dropdown with context-sensitive actions (pause/resume, remove, rename, pet, change outfit). Add cat name display always visible. Add state/action text under name. Make card clickable for pick-up/drop behavior.

- **`cat-list-item`** - Similar changes to cat-card. Remove embedded `cat-controls`. Add menu button with dropdown actions. Add always-visible name and state. Make clickable for pick-up/drop.

- **`cat-manager`** - Remove bulk selection/actions UI (checkboxes, bulk action buttons). Remove search/filter/sort controls. Simplify to just display cats with their individual context menus. Consider if this component is still needed at all.

- **`mb-cat-overlay`** - Simplify tabs. May no longer need "Manage" tab if cat-manager is removed or greatly simplified. Focus on "Create" and "Gallery" tabs.

### Components to be removed

- **`cat-controls`** - Obsolete. Actions moved to context menu dropdown on each cat card/list item.

- Possibly **`cat-manager`** - May be entirely replaced by simpler in-canvas interactions. Cats are visible on screen with their own menus, so a separate management panel may not be necessary.

### Components that need minor updates

- **`cat-creator`** - No major changes, but may need to ensure created cats spawn with proper interactive behavior.

- **`cat-statistics`** - Already minimal, keep as-is for the global statistics button.

- **`cat-gallery`** - Minimal changes. May need to ensure loaded cats have proper interactive behavior.

### Components that are unaffected

- **`cat-avatar`** - Purely presentational, no changes needed.

- **`cat-preview`** - Preview-only component, no changes needed.

- **`cat-thumbnail`** - Gallery component, no changes needed.

- **`cat-personality-picker`** - Creator sub-component, no changes needed.

- **`cat-color-picker`** - Creator sub-component, no changes needed.

- **`cat-exporter`** / **`cat-importer`** - Import/export utilities, no changes needed.

- **`collection-picker`** - Gallery utility, no changes needed.

- **`meowzer-provider`** - Context provider, no changes needed.

## Other Meowzer changes

### SDK (meowzer/sdk) changes needed

#### MeowzerCat class (`meowzer-cat.ts`)

**Existing APIs that work:**

- ✅ `setName(name: string)` - Already exists for rename functionality
- ✅ `pause()` / `resume()` - Already exists for pause/resume actions
- ✅ `destroy()` - Already exists for remove action

**New APIs needed:**

1. **Pick-up/Drop interaction**:

   ```typescript
   // Add to MeowzerCat class
   pickUp(): void
   drop(position?: Position): void
   get isBeingHeld(): boolean
   ```

   - When picked up, cat should pause movement and follow cursor
   - When dropped, cat should resume AI behavior at new position
   - Visual feedback needed (maybe slight transparency or scale change)

2. **Pet/affection interaction** (not implemented):

   ```typescript
   // Add to MeowzerCat class
   pet(): Promise<void>
   ```

   - Should trigger happy animation/state
   - Should emit "pet" event
   - Should update brain's affection/satisfaction metrics
   - Consider adding purr sound effect hook

3. **Outfit/appearance changes** (not implemented):
   ```typescript
   // Add to MeowzerCat class
   setOutfit(outfit: OutfitConfig): void
   removeOutfit(): void
   get currentOutfit(): OutfitConfig | undefined
   ```
   - Outfits are cosmetic overlays (hats, collars, accessories)
   - Should not regenerate base cat SVG
   - Need new outfit system in Meowkit

#### Event system updates

**Add new event types** (`types.ts`):

```typescript
export const MeowzerEvent = {
  // ... existing events
  PICK_UP: "pickUp",
  DROP: "drop",
  PET: "pet",
  OUTFIT_CHANGE: "outfitChange",
} as const;
```

### Meowtion (meowzer/meowtion) changes needed

#### Cat class (`cat.ts`)

**New interaction state handling**:

1. Add held state tracking:

   ```typescript
   private _isHeld: boolean = false
   get isHeld(): boolean
   ```

2. Add method to follow cursor when held:

   ```typescript
   startFollowingCursor(): void
   stopFollowingCursor(): void
   ```

3. Consider adding a "purring" or "happy" animation state for petting

#### DOM module (`cat/dom.ts`)

**Name label updates needed**:

- ✅ Name label already exists (`.meowtion-cat-name`)
- ✅ Already displays cat name below sprite
- Need to add **state/action text** below name (e.g., "Walking...", "Sleeping...", "Paused")
- Need to add **menu button** in cat DOM (small button overlay, top-right of cat)

**Suggested DOM structure**:

```html
<div class="meowtion-cat">
  <svg>...</svg>
  <button class="meowtion-cat-menu">⋮</button>
  <div class="meowtion-cat-info">
    <div class="meowtion-cat-name">Whiskers</div>
    <div class="meowtion-cat-state">Walking...</div>
  </div>
</div>
```

#### Style updates (`animations/styles.ts`)

**Add new CSS classes**:

```css
.meowtion-cat-menu {
  /* Small menu button (⋮) in top-right corner */
}

.meowtion-cat-state {
  /* State text below name, smaller and softer color */
}

.meowtion-cat.held {
  /* Visual feedback when picked up (opacity, scale, etc.) */
}

.meowtion-cat-info {
  /* Container for name + state labels */
}
```

### Meowkit (meowzer/meowkit) changes needed

#### New outfit system

**Not currently implemented - major new feature**:

1. Create `outfit.ts` with outfit types and configs:

   ```typescript
   export type OutfitType =
     | "hat"
     | "collar"
     | "bowtie"
     | "glasses"
     | "scarf";

   export interface OutfitConfig {
     type: OutfitType;
     color?: string;
     position?: "head" | "neck" | "body";
   }
   ```

2. Create outfit SVG generators for each type
3. Add outfit rendering to sprite generation
4. Store outfit info in cat metadata for persistence

### Meowbrain (meowzer/meowbrain) changes needed

#### Behavior updates for interactions

**Pet interaction behavior** (`behaviors.ts`):

1. Add new behavior type: `"affectionate"` or `"beingPetted"`
2. Implement behavior that:
   - Keeps cat stationary
   - Shows happy/purring animation
   - Increases satisfaction metrics
   - Auto-ends after duration

**Brain state updates** (`brain.ts`):

1. Add affection/satisfaction tracking to motivation
2. Add `handlePet()` method that temporarily boosts happiness
3. Consider pet action as positive reinforcement for personality

### Type definitions (meowzer/types) needed

#### New types to add:

**In `types/cat/metadata.ts`**:

```typescript
export interface OutfitConfig {
  type: OutfitType;
  color?: string;
  position?: "head" | "neck" | "body";
}

export interface InteractionState {
  isBeingHeld: boolean;
  lastPetTime?: Date;
  petCount: number;
  currentOutfit?: OutfitConfig;
}
```

**In `types/cat/animation.ts`**:

```typescript
// Add to CatStateType union:
export type CatStateType =
  | "idle"
  | "walking"
  | "running"
  | "sitting"
  | "sleeping"
  | "playing"
  | "purring" // NEW: for petting interaction
  | "held"; // NEW: for pick-up state
```

### Storage/Persistence updates

**In `types/storage/cat.ts`**:

- Add outfit info to `CatStorageRecord`
- Add interaction stats (pet count, etc.) to stored metadata

**In `sdk/managers/storage-manager.ts`**:

- Ensure outfit config is saved/loaded
- Ensure interaction state persists across sessions

### Summary of implementation priority

**Tier 1 - Required for refactor:**

1. ✅ Menu button in cat DOM (Meowtion)
2. ✅ State text display below name (Meowtion)
3. Pick-up/drop API and behavior (SDK + Meowtion)
4. Menu dropdown integration points (UI → SDK event bridge)

**Tier 2 - Rename already works:**

- ✅ `setName()` already exists, just needs UI hook

**Tier 3 - New features (can implement later):**

1. Pet interaction system (SDK + Meowbrain + Meowtion)
2. Outfit/costume system (Meowkit + SDK + Storage)
3. Additional animations (purring, happy states)
