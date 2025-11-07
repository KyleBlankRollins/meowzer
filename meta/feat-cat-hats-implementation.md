# Cat Hats - Implementation Plan

Implementation plan for the cat hats feature based on `feat-cat-hats.md`.

## Overview

This feature adds customizable hats to cats with three templates (beanie, cowboy, baseball cap), accessed through a context menu dialog interface.

## Implementation Phases

### Phase 1: Type Definitions & Data Model

**Goal:** Establish the foundational types across all packages.

**Tasks:**

1. **Update `meowzer/types/cat/index.ts`**

   - Add `AccessorySettings` interface
   - Add `HatAccessory` interface
   - Add `BaseAccessory` interface
   - Add `HatType` type
   - Add `HatData` interface

2. **Update `meowzer/types/primitives.ts`**

   - Add `AppearanceData.accessories` optional field
   - Add `SVGElements.hat` optional field

3. **Verify type exports**
   - Ensure new types are exported from `meowzer/types/index.ts`
   - Confirm types are available in dependent packages

**Acceptance Criteria:**

- [ ] All hat-related types defined
- [ ] `AppearanceData` includes optional `accessories` field
- [ ] `SVGElements` includes optional `hat` field
- [ ] Types compile without errors
- [ ] Types are properly exported and accessible

---

### Phase 2: Meowkit - Hat SVG Generation

**Goal:** Create the hat templates and SVG generation system.

**Tasks:**

1. **Create `meowzer/meowkit/accessories.ts`**

   - Implement `generateBeanieHat(baseColor, accentColor): string`
   - Implement `generateCowboyHat(baseColor, accentColor): string`
   - Implement `generateBaseballCapHat(baseColor, accentColor): string`
   - Implement `generateHatSVG(type, baseColor, accentColor): string` (dispatcher function)
   - Each hat template:
     - Uses pixel-art blocky style matching cat aesthetic
     - 30x30 viewBox units
     - Applies baseColor and accentColor to correct elements
     - Returns SVG string with proper element IDs

2. **Update `meowzer/meowkit/svg-generator.ts`**

   - Import hat generation functions
   - Check for `appearance.accessories?.hat` in `generateCatSVG()`
   - If hat exists:
     - Generate hat SVG using `generateHatSVG()`
     - Insert hat into SVG after head group, before pattern overlay
     - Position at `x="54" y="13"` (adjust based on actual testing)
     - Apply scale based on `dimensions.scale`
   - Add hat element ID to `SVGElements.hat` if hat exists

3. **Update `meowzer/meowkit/builder.ts`**

   - Modify `buildCat()` to accept optional `accessories` parameter
   - Pass accessories to appearance data creation
   - Ensure accessories are included in `ProtoCat` output
   - Create `buildCatWithAccessories()` convenience function

4. **Update `meowzer/meowkit/serialization.ts`**

   - Extend `generateSeed()` to include hat data if present
   - Format: `pattern-color-eyeColor-size-furLength-hatType-hatBase-hatAccent-version`
   - Update `parseSeed()` to handle hat data
   - Maintain backwards compatibility (seeds without hats still work)
   - Update `serializeCat()` to include accessories

5. **Export new functions from `meowzer/meowkit/index.ts`**
   - Export hat generation functions
   - Export updated builder functions

**Acceptance Criteria:**

- [ ] Three hat templates implemented with pixel-art style
- [ ] Hats apply colors correctly to base and accent elements
- [ ] Hats render on cats at correct position and scale
- [ ] Hat element IDs added to SVGElements
- [ ] Seeds include hat data when present
- [ ] Seeds without hats parse correctly (backwards compatible)
- [ ] Visual inspection: hats look good on small/medium/large cats

---

### Phase 3: SDK - MeowzerCat Hat API

**Goal:** Add hat management methods to MeowzerCat class.

**Tasks:**

1. **Update `meowzer/sdk/meowzer-cat.ts`**

   - Add `addHat(type: HatType, baseColor: string, accentColor: string): void`
     - Validate colors using existing `isValidColor()`
     - Update cat's `appearance.accessories.hat`
     - Trigger re-render with new hat
     - Dispatch `hat-applied` event
   - Add `removeHat(): void`
     - Remove hat from appearance data
     - Trigger re-render without hat
     - Dispatch `hat-removed` event
   - Add `updateHatColors(baseColor: string, accentColor: string): void`
     - Validate colors
     - Update existing hat colors
     - Trigger re-render
     - Dispatch `hat-updated` event
   - Add `hasHat(): boolean`
     - Returns true if cat has a hat
   - Add `getHat(): HatData | undefined`
     - Returns current hat data or undefined

2. **Define custom events in `meowzer/sdk/types.ts`**

   - Define `HatAppliedEvent` interface
   - Define `HatRemovedEvent` interface
   - Define `HatUpdatedEvent` interface

3. **Update SDK exports**
   - Export new types and interfaces
   - Ensure hat-related types are available to consumers

**Acceptance Criteria:**

- [ ] `addHat()` adds hat and triggers re-render
- [ ] `removeHat()` removes hat and triggers re-render
- [ ] `updateHatColors()` updates colors and triggers re-render
- [ ] `hasHat()` returns correct boolean
- [ ] `getHat()` returns correct data or undefined
- [ ] All methods validate input colors
- [ ] Events dispatched correctly with proper detail objects
- [ ] Hat persists through MeowBase save/load

---

### Phase 4: UI - Wardrobe Dialog Component

**Goal:** Create the wardrobe dialog component with hat selection and customization.

**Tasks:**

1. **Create `meowzer/ui/components/mb-wardrobe-dialog/` directory structure**

   - `mb-wardrobe-dialog.ts` - Component logic
   - `mb-wardrobe-dialog.style.ts` - Component styles

2. **Implement `mb-wardrobe-dialog.ts`**

   - Component properties:

     - `@property() targetCat?: MeowzerCat` - Cat to apply hat to
     - `@state() selectedHat: HatType` - Currently selected hat template
     - `@state() baseColor: string` - Base color value
     - `@state() accentColor: string` - Accent color value
     - `@state() isOpen: boolean` - Dialog open state

   - Component methods:

     - `open(cat: MeowzerCat)` - Opens dialog for specific cat
     - `close()` - Closes dialog
     - `handleHatSelect(type: HatType)` - Updates selected hat
     - `handleBaseColorChange(color: string)` - Updates base color
     - `handleAccentColorChange(color: string)` - Updates accent color
     - `handleApply()` - Applies hat to cat and closes
     - `handleCancel()` - Closes without applying
     - `renderHatPreview()` - Renders live preview of selected hat

   - Render layout:
     - Dialog header with cat name and close button
     - Hat template selection buttons (3 buttons in grid)
     - Base color picker (Quiet UI `<quiet-color-picker>`)
     - Accent color picker (Quiet UI `<quiet-color-picker>`)
     - Preview area (160x160px with rendered hat SVG)
     - Cancel and Apply buttons

3. **Implement `mb-wardrobe-dialog.style.ts`**

   - Dialog layout styles
   - Hat selection button grid
   - Selected hat highlighting
   - Color picker section layout
   - Preview area styling
   - Button layout and spacing
   - Responsive adjustments

4. **Initialize state correctly**

   - When dialog opens:
     - If cat has hat: Pre-select type, pre-fill colors
     - If no hat: Default to 'beanie', base=#FF0000, accent=#FFFF00
   - Update preview in real-time as user changes selections

5. **Export component**
   - Add to `meowzer/ui/components/index.ts`
   - Add to `meowzer/ui/index.ts`

**Acceptance Criteria:**

- [ ] Dialog opens and closes correctly
- [ ] Hat template buttons display and select properly
- [ ] Color pickers work and update preview in real-time
- [ ] Preview shows accurate hat rendering with current colors
- [ ] Apply button adds/updates hat on target cat
- [ ] Cancel button closes without changes
- [ ] Dialog pre-fills current hat data if cat has hat
- [ ] ESC key closes dialog
- [ ] Clicking backdrop closes dialog

---

### Phase 5: UI - Context Menu Integration

**Goal:** Add hat options to cat context menu in playground.

**Tasks:**

1. **Update `meowzer/ui/components/mb-cat-playground/mb-cat-playground.ts`**
   - Add wardrobe dialog to component template
   - Add "Change Hat" menu item after "Rename"
     - Icon: `<quiet-icon family="outline" name="shirt">`
     - Click handler: Opens wardrobe dialog with selected cat
   - Add "Remove Hat" menu item after "Change Hat"
     - Icon: `<quiet-icon family="outline" name="trash">`
     - Variant: "destructive"
     - Only show if `cat.hasHat()` returns true
     - Click handler: Calls `cat.removeHat()` directly
   - Add divider after hat options (before disabled items)
2. **Implement wardrobe dialog handlers**

   - `handleChangeHat(cat: MeowzerCat)` - Opens dialog
   - `handleRemoveHat(cat: MeowzerCat)` - Removes hat
   - Store reference to wardrobe dialog component
   - Pass cat to dialog when opening

3. **Update context menu structure in `injectMenuIntoCat()`**
   ```
   Remove
   Rename
   ─────────── (existing divider)
   Change Hat
   Remove Hat (conditional)
   ─────────── (new divider)
   Pick Up (disabled)
   Pet (disabled)
   ```

**Acceptance Criteria:**

- [ ] "Change Hat" appears in all cat context menus
- [ ] "Remove Hat" only appears if cat has a hat
- [ ] Clicking "Change Hat" opens wardrobe dialog
- [ ] Clicking "Remove Hat" removes hat immediately
- [ ] Dialog receives correct target cat
- [ ] Menu items have correct icons and styling
- [ ] Dividers positioned correctly

---

### Phase 6: Register Components Globally

**Goal:** Ensure wardrobe dialog is available in docs/demo sites.

**Tasks:**

1. **Update `docs/source/main.ts`**

   - Import `mb-wardrobe-dialog`
   - Component auto-registers via `@customElement` decorator

2. **Update `demo/src/layouts/Layout.astro`** (if needed)
   - Import component if used in demo site

**Acceptance Criteria:**

- [ ] Wardrobe dialog available in docs playground
- [ ] No import errors in browser console
- [ ] Component renders correctly

---

### Phase 7: Testing & Refinement

**Goal:** Manual testing and visual refinement.

**Tasks:**

1. **Visual Testing**

   - Test each hat type on small/medium/large cats
   - Verify positioning and scaling
   - Test various color combinations
   - Ensure hats look good with all cat patterns
   - Check hat rendering during animations (idle, walking, running, etc.)

2. **Interaction Testing**

   - Test opening dialog from context menu
   - Test hat selection and color customization
   - Test applying hats to cats
   - Test removing hats from cats
   - Test editing existing hats
   - Test dialog close methods (Cancel, ESC, backdrop)

3. **Persistence Testing**

   - Create cat with hat, verify it saves
   - Reload page, verify hat persists
   - Export cat with hat, import, verify hat preserved
   - Test seed serialization/deserialization

4. **Edge Cases**

   - Apply hat to cat multiple times
   - Remove hat from cat without hat (should be no-op)
   - Rapidly open/close dialog
   - Change colors rapidly
   - Switch between hat types rapidly

5. **Visual Refinement**
   - Adjust hat SVG templates if needed
   - Adjust positioning/scaling if needed
   - Refine dialog layout and spacing
   - Improve preview rendering
   - Polish animations and transitions

**Acceptance Criteria:**

- [ ] All hat types look good on all cat sizes
- [ ] Hats positioned correctly on all cats
- [ ] Colors apply correctly to all templates
- [ ] Dialog UX is smooth and intuitive
- [ ] No visual glitches during animations
- [ ] Hats persist correctly through save/load
- [ ] Seeds work correctly with hats
- [ ] No console errors or warnings

---

## Implementation Order

Follow phases sequentially:

1. **Phase 1** - Types (foundation for everything)
2. **Phase 2** - Meowkit (SVG generation)
3. **Phase 3** - SDK (cat API)
4. **Phase 4** - UI Dialog (wardrobe component)
5. **Phase 5** - UI Integration (context menu)
6. **Phase 6** - Registration (global availability)
7. **Phase 7** - Testing (validation and polish)

## Key Files to Modify

### Types Package

- `meowzer/types/cat/index.ts`
- `meowzer/types/primitives.ts`
- `meowzer/types/index.ts`

### Meowkit Package

- `meowzer/meowkit/accessories.ts` (new)
- `meowzer/meowkit/svg-generator.ts`
- `meowzer/meowkit/builder.ts`
- `meowzer/meowkit/serialization.ts`
- `meowzer/meowkit/index.ts`

### SDK Package

- `meowzer/sdk/meowzer-cat.ts`
- `meowzer/sdk/types.ts`
- `meowzer/sdk/index.ts`

### UI Package

- `meowzer/ui/components/mb-wardrobe-dialog/mb-wardrobe-dialog.ts` (new)
- `meowzer/ui/components/mb-wardrobe-dialog/mb-wardrobe-dialog.style.ts` (new)
- `meowzer/ui/components/mb-cat-playground/mb-cat-playground.ts`
- `meowzer/ui/components/index.ts`
- `meowzer/ui/index.ts`

### Docs

- `docs/source/main.ts`

## Development Tips

1. **Start with one hat:** Implement beanie fully before adding cowboy and baseball
2. **Test incrementally:** Test each phase before moving to next
3. **Use browser devtools:** Inspect SVG output to debug positioning
4. **Iterate on visuals:** Hat templates may need adjustment after seeing them on cats
5. **Check all cat sizes:** Small cats are easy to overlook
6. **Test with animations:** Ensure hats stay positioned during movement

## Success Criteria

Feature is complete when:

- [ ] All three hat types implemented and working
- [ ] Hats can be applied via context menu dialog
- [ ] Hats can be removed via context menu
- [ ] Colors customizable via color pickers
- [ ] Live preview shows accurate rendering
- [ ] Hats persist through save/load
- [ ] Hats serialize/deserialize in seeds
- [ ] Visual quality matches existing cat aesthetic
- [ ] No console errors or warnings
- [ ] Feature works in both docs playground and demo site

## Future Enhancements (Not in Scope)

- Additional hat types (wizard, top hat, etc.)
- Other accessory categories (collars, glasses)
- Hat animations (tip hat, wobble)
- User-created custom hats
- Hat marketplace/library
