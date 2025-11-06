# Food & Water Implementation Audit

**Generated:** November 6, 2025  
**Scope:** Basic Food, Fancy Food, and Water interactions across SDK and UI

---

## Summary

| Component                   | Status      | Implementation % |
| --------------------------- | ----------- | ---------------- |
| **SDK - Core Logic**        | ✅ Complete | 100%             |
| **SDK - Brain AI**          | ✅ Complete | 100%             |
| **UI - Placement Controls** | ✅ Complete | 100%             |
| **UI - Visual Components**  | ❌ Missing  | 0%               |
| **UI - Event Handling**     | ✅ Complete | 100%             |
| **Assets**                  | ✅ Complete | 100%             |

**Overall Status:** ~67% Complete - Core SDK is fully implemented, UI controls work, but visual rendering is missing.

---

## 1. SDK Implementation Status

### ✅ Core Classes & Types

**Location:** `meowzer/sdk/interactions/need.ts`

**Status:** Fully implemented

**Features:**

- `Need` class with lifecycle management
- Event emission for consumed/removed states
- Auto-removal with configurable duration
- Tracking of consuming cats
- Type-safe `NeedTypeIdentifier` ("food:basic" | "food:fancy" | "water")

**Key Methods:**

```typescript
- constructor(id, type, position, options)
- isActive(): boolean
- getConsumingCats(): string[]
- _addConsumingCat(catId): void
- _removeConsumingCat(catId): void
- remove(): void
- on(event, handler): void
- toJSON()
```

---

### ✅ Interaction Manager

**Location:** `meowzer/sdk/managers/interaction-manager.ts`

**Status:** Fully implemented

**Features:**

- Place needs at specific positions
- Remove needs from environment
- Query needs by ID, type, or proximity
- Track cat responses (interested, approaching, consuming, satisfied, ignoring, interrupted)
- Event emission (needPlaced, needRemoved, needResponse)
- Hook integration (beforeNeedPlace, afterNeedPlace, beforeNeedRemove, afterNeedRemove)

**Key Methods:**

```typescript
- async placeNeed(type, position, options): Promise<Need>
- async removeNeed(needId): Promise<boolean>
- getNeed(needId): Need | undefined
- getAllNeeds(): Need[]
- getNeedsByType(type): Need[]
- getNeedsNearPosition(position, radius): Need[]
- _registerCatResponse(catId, needId, responseType): void
```

**Response Types Tracked:**

1. `interested` - Cat shows initial interest
2. `approaching` - Cat moving toward need
3. `consuming` - Cat actively eating/drinking
4. `satisfied` - Cat finished consuming
5. `ignoring` - Cat not interested
6. `interrupted` - Consumption interrupted

---

### ✅ Brain AI Integration

**Location:** `meowzer/meowbrain/brain.ts`

**Status:** Fully implemented

**Features:**

- Interest evaluation based on personality traits
- Event detection for placed needs
- Immediate reaction for highly interested cats
- Personality-based decision making

**Interest Calculation Logic:**

**Basic Food (`food:basic`):**

```typescript
base = 0.5 + (1 - energy) * 0.3; // Low energy cats more interested
multiplier = 1 - independence * 0.3; // Independent cats less interested
```

**Fancy Food (`food:fancy`):**

```typescript
base = 0.7 + curiosity * 0.2; // Higher base appeal
multiplier = 1 + curiosity * 0.3; // Curious cats love fancy food
```

**Water (`water`):**

```typescript
base = 0.3; // Lower base interest
// Increases after playing/exploring behaviors
```

**Reaction Threshold:**

- Interest > 0.7 AND independence < 0.5 → Immediate reaction
- Otherwise: Passive detection, may respond if prompted

---

### ✅ Cat Response Behavior

**Location:** `meowzer/sdk/meowzer-cat.ts`

**Status:** Fully implemented

**Method:** `async respondToNeed(needId: string): Promise<void>`

**Flow:**

1. Evaluate interest using brain AI
2. If interest > 0.5:
   - Calculate personality-based delay (0-2s based on independence)
   - Register "interested" response
   - Register "approaching" response
   - Navigate to need position
   - Register "consuming" response
   - Add cat to need's consuming list
   - Wait for consumption duration
   - Remove cat from consuming list
   - Register "satisfied" response
   - Trigger lifecycle hooks
3. If interest ≤ 0.5:
   - Register "ignoring" response

**Hook Integration:**

- `beforeInteractionStart` - Before approaching need
- `afterInteractionEnd` - After consumption complete

---

### ✅ Configuration

**Location:** `meowzer/sdk/config.ts`

**Status:** Fully implemented

**Satisfaction Multipliers:**

```typescript
basicFood: 0.7; // 70% satisfaction per unit
fancyFood: 0.9; // 90% satisfaction per unit
water: 0.5; // 50% satisfaction per unit
```

**Detection Range:**

- Configurable via `config.interactions.detectionRanges.need`
- Used by `getNeedsNearPosition()` for proximity queries

---

## 2. UI Implementation Status

### ✅ Placement Controls - Toolbar

**Location:** `meowzer/ui/components/mb-playground-toolbar/mb-playground-toolbar.ts`

**Status:** Fully implemented

**Features:**

- Button UI for basic food (🥫)
- Button UI for fancy food (🍖)
- Button UI for water (💧)
- Placement mode with crosshair cursor
- Click-to-place interaction
- Active state visualization
- Integration with Meowzer context

**User Flow:**

1. User clicks food/water button
2. Cursor changes to crosshair
3. User clicks playground to place
4. Need created at click position
5. Mode automatically cancels

---

### ✅ Placement Controls - Interactions Panel

**Location:** `meowzer/ui/components/mb-interactions-panel/mb-interactions-panel.ts`

**Status:** Fully implemented

**Features:**

- Same functionality as toolbar
- Grid layout for needs section
- Visual active state indicators
- Mode notice with cancel button
- Organized into "🍽️ Needs" section

---

### ❌ Visual Components - MISSING

**Expected Locations:**

- `meowzer/ui/components/mb-food-visual/` - **Does not exist**
- `meowzer/ui/components/mb-water-visual/` - **Does not exist**
- `meowzer/ui/components/mb-need-visual/` - **Does not exist**

**Current State:**

- No visual rendering components for placed needs
- Needs are tracked in state but not displayed
- Users can place food/water but cannot see them

**Required Implementation:**

**Option A: Generic Need Visual**

```typescript
// meowzer/ui/components/mb-need-visual/mb-need-visual.ts
@customElement("mb-need-visual")
export class MbNeedVisual extends LitElement {
  @property() needId!: string;
  @property() type!: "food:basic" | "food:fancy" | "water";
  @property() interactive: boolean = true;

  // Render SVG or image based on type
  // Listen for need consumed/removed events
  // Handle click/drag if interactive
  // Show consuming cats animation
}
```

**Option B: Separate Components**

```typescript
// mb-food-visual.ts - For both basic and fancy food
// mb-water-visual.ts - For water
```

---

### ❌ Playground Integration - MISSING

**Location:** `meowzer/ui/components/mb-cat-playground/mb-cat-playground.ts`

**Current State:**

- Playground has yarn tracking (`activeYarns: Map`)
- No need tracking equivalent

**Required Implementation:**

```typescript
@state() private activeNeeds: Map<string, Need> = new Map();

private setupNeedListeners() {
  const interactions = this.meowzer?.interactions;
  if (!interactions) return;

  interactions.on("needPlaced", (event) => {
    const need = interactions.getNeed(event.id);
    if (need) {
      this.activeNeeds.set(event.id, need);
      this.requestUpdate();
    }
  });

  interactions.on("needRemoved", (event) => {
    this.activeNeeds.delete(event.id);
    this.requestUpdate();
  });
}

// In render():
${Array.from(this.activeNeeds.values()).map(
  (need) => html`
    <mb-need-visual
      .needId=${need.id}
      .type=${need.type}
      .interactive=${true}
    ></mb-need-visual>
  `
)}
```

---

### ✅ Assets

**Location:** `meowzer/ui/assets/interactions/`

**Status:** Complete - All SVG assets present

**Files:**

- ✅ `food/basic-default.svg` - Basic food default state
- ✅ `food/basic-active.svg` - Basic food active/consuming state
- ✅ `food/fancy-default.svg` - Fancy food default state
- ✅ `food/fancy-active.svg` - Fancy food active/consuming state
- ✅ `water/default.svg` - Water default state
- ✅ `water/active.svg` - Water active/consuming state

**Build Integration:**

- ✅ Assets copied to `dist/assets/` via `copy-assets.ts`
- ✅ All 6 need assets included in build output

---

## 3. Comparison with Yarn Implementation

### Yarn (Reference Implementation)

**SDK:**

- ✅ `Yarn` class with physics (`interactions/yarn.ts`)
- ✅ InteractionManager integration
- ✅ Brain detection and reaction
- ✅ Cat playWithYarn() method

**UI:**

- ✅ `mb-yarn-visual` component renders yarn
- ✅ Playground tracks activeYarns Map
- ✅ Event listeners for placed/removed/moved
- ✅ Visual rendering in playground

### Food/Water Current State

**SDK:**

- ✅ `Need` class (`interactions/need.ts`)
- ✅ InteractionManager integration
- ✅ Brain detection and reaction
- ✅ Cat respondToNeed() method

**UI:**

- ❌ No visual component
- ❌ No playground tracking
- ❌ No event listener setup
- ❌ No visual rendering

**Gap:** UI visual components are missing, SDK is complete.

---

## 4. Implementation Roadmap

### Phase 1: Create Visual Component (High Priority)

**File:** `meowzer/ui/components/mb-need-visual/mb-need-visual.ts`

**Requirements:**

1. Accept needId, type, and interactive props
2. Fetch Need instance from Meowzer context
3. Render appropriate SVG based on type and state
4. Show default vs active state based on consuming cats
5. Listen to need events (consumed, removed)
6. Support drag interaction (optional, follow yarn pattern)
7. Auto-remove when need is consumed/removed

**Estimated Effort:** 2-3 hours

**Reference:** Follow `mb-yarn-visual.ts` pattern

---

### Phase 2: Integrate into Playground (High Priority)

**File:** `meowzer/ui/components/mb-cat-playground/mb-cat-playground.ts`

**Requirements:**

1. Add `activeNeeds: Map<string, Need>` state
2. Add `setupNeedListeners()` method
3. Render `mb-need-visual` components in main area
4. Call setupNeedListeners() in connectedCallback
5. Clean up listeners in disconnectedCallback

**Estimated Effort:** 1 hour

---

### Phase 3: Cat Visual Feedback (Medium Priority)

**Requirements:**

1. Show animation when cat approaches need
2. Show eating/drinking animation during consumption
3. Update cat state visualization
4. Add satisfaction indicators

**Estimated Effort:** 3-4 hours

**Dependency:** Requires meowtion animation system integration

---

### Phase 4: Advanced Features (Low Priority)

**Requirements:**

1. Drag-and-drop need repositioning
2. Need inventory/storage system
3. Bulk placement mode
4. Need configuration dialog (duration, satisfaction)
5. Visual consumption progress bar

**Estimated Effort:** 4-6 hours

---

## 5. Testing Checklist

### SDK Tests (All Passing)

- ✅ Need creation and lifecycle
- ✅ InteractionManager placeNeed/removeNeed
- ✅ Cat interest evaluation
- ✅ Cat respondToNeed flow
- ✅ Event emission and handling

### UI Tests (Cannot Test - Visuals Missing)

- ⏸️ Need visual rendering
- ⏸️ Placement mode activation
- ⏸️ Click-to-place interaction
- ⏸️ Need state updates (default ↔ active)
- ⏸️ Removal on consumption
- ⏸️ Multiple simultaneous needs

---

## 6. Known Issues & Limitations

### No Visual Feedback

- **Issue:** Users can place food/water but cannot see it
- **Impact:** Critical - Feature appears broken
- **Priority:** P0 - Blocks user testing

### No Consumption Animation

- **Issue:** No visual feedback when cats eat/drink
- **Impact:** High - Reduces engagement
- **Priority:** P1 - Important for UX

### No Need Persistence

- **Issue:** Needs not saved in storage
- **Impact:** Medium - Lost on page reload
- **Priority:** P2 - Phase 2 feature

### No Multi-Cat Consumption

- **Issue:** Visual doesn't show multiple cats eating same food
- **Impact:** Low - Edge case
- **Priority:** P3 - Nice to have

---

## 7. Conclusion

### What Works

- ✅ Complete SDK implementation with robust Need class
- ✅ Full InteractionManager integration
- ✅ Sophisticated brain AI for interest evaluation
- ✅ Personality-based cat responses
- ✅ UI controls for placement (toolbar + panel)
- ✅ All visual assets present

### What's Missing

- ❌ Visual components to render placed needs
- ❌ Playground integration to track and display needs
- ❌ Cat animations for eating/drinking

### Next Steps

1. **Immediate:** Create `mb-need-visual` component following yarn pattern
2. **Immediate:** Integrate need tracking into playground
3. **Soon:** Add cat consumption animations

### Comparison to Other Interactions

- **Laser:** 100% complete (SDK + UI + visuals)
- **Yarn:** 100% complete (SDK + UI + visuals + physics)
- **Food/Water:** 67% complete (SDK + UI controls, missing visuals)

The food and water system has a solid foundation in the SDK with sophisticated AI and event handling, but needs UI visual components to be user-facing complete.
