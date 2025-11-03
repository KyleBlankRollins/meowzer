# UI Refactor Implementation Plan

This plan focuses on refactoring the UI components to support the new cat interaction model while using placeholders for features not yet implemented in the Meowzer SDK.

## Overview

**Goal**: Move from control-panel UI to direct cat interaction with context menus.

**Approach**: Implement UI changes immediately, use disabled menu items with tooltips for unimplemented SDK features (pick-up/drop, pet, outfit).

## Phase 1: Core DOM & Style Updates

### 1.1 Update Meowtion DOM structure

**File**: `meowzer/meowtion/cat/dom.ts`

**Changes**:

- Add menu button to cat DOM
- Add state text element below name
- Update `createElement()` method

```typescript
private createElement(protoCat: ProtoCat): HTMLElement {
  const div = document.createElement("div");
  div.className = "meowtion-cat";
  div.setAttribute("data-cat-id", protoCat.id);
  div.setAttribute("data-state", "idle");
  div.setAttribute("data-paused", "false");
  div.innerHTML = protoCat.spriteData.svg;

  // Add menu button (top-right corner)
  const menuButton = document.createElement("button");
  menuButton.className = "meowtion-cat-menu";
  menuButton.innerHTML = "⋮";
  menuButton.setAttribute("aria-label", "Cat menu");
  div.appendChild(menuButton);

  // Add info container
  const infoContainer = document.createElement("div");
  infoContainer.className = "meowtion-cat-info";

  // Add name label
  const nameLabel = document.createElement("div");
  nameLabel.className = "meowtion-cat-name";
  nameLabel.textContent = protoCat.name || "Unknown Cat";
  infoContainer.appendChild(nameLabel);

  // Add state label
  const stateLabel = document.createElement("div");
  stateLabel.className = "meowtion-cat-state";
  stateLabel.textContent = "Idle";
  infoContainer.appendChild(stateLabel);

  div.appendChild(infoContainer);

  // Set initial position
  div.style.left = `${this.position.x}px`;
  div.style.top = `${this.position.y}px`;

  // Apply scale
  const scale = protoCat.dimensions.scale;
  if (scale !== 1) {
    div.style.transform = `scale(${scale})`;
    div.style.transformOrigin = "top left";
  }

  return div;
}
```

**Add new method**:

```typescript
/**
 * Update the state text display
 */
updateStateText(text: string): void {
  const stateLabel = this.element.querySelector(".meowtion-cat-state");
  if (stateLabel) {
    stateLabel.textContent = text;
  }
}

/**
 * Update the cat name display
 */
updateNameText(name: string): void {
  const nameLabel = this.element.querySelector(".meowtion-cat-name");
  if (nameLabel) {
    nameLabel.textContent = name;
  }
}

/**
 * Get the menu button element
 */
getMenuButton(): HTMLButtonElement | null {
  return this.element.querySelector(".meowtion-cat-menu");
}
```

### 1.2 Update Meowtion styles

**File**: `meowzer/meowtion/animations/styles.ts`

**Add new CSS**:

```typescript
export const baseStyles = css`
  .meowtion-cat {
    position: absolute;
    pointer-events: auto;
    user-select: none;
    will-change: transform;
    cursor: pointer; /* NEW: indicate cats are clickable */
  }

  .meowtion-cat svg {
    display: block;
  }

  /* NEW: Menu button */
  .meowtion-cat-menu {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease, background 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;
    pointer-events: auto;
  }

  .meowtion-cat:hover .meowtion-cat-menu {
    opacity: 1;
  }

  .meowtion-cat-menu:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .meowtion-cat-menu:active {
    transform: scale(0.95);
  }

  /* NEW: Info container */
  .meowtion-cat-info {
    position: absolute;
    bottom: -48px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    pointer-events: none;
  }

  /* UPDATED: Name label */
  .meowtion-cat-name {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #333;
    background: rgba(255, 255, 255, 0.9);
    padding: 2px 8px;
    border-radius: 10px;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* NEW: State label */
  .meowtion-cat-state {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 10px;
    font-weight: 500;
    color: #666;
    background: rgba(255, 255, 255, 0.85);
    padding: 1px 6px;
    border-radius: 8px;
    white-space: nowrap;
  }

  /* NEW: Held state visual feedback (placeholder for future) */
  .meowtion-cat.held {
    opacity: 0.8;
    filter: brightness(1.1);
    z-index: 1000;
  }

  /* Paused state (existing, may need adjustment) */
  .meowtion-cat[data-paused="true"] {
    opacity: 0.6;
  }

  .meowtion-cat[data-paused="true"] .meowtion-cat-state {
    color: #f59e0b;
  }
`;
```

### 1.3 Update Cat class to expose state changes

**File**: `meowzer/meowtion/cat.ts`

**Add method**:

```typescript
/**
 * Get human-readable state text
 */
getStateText(): string {
  const stateTextMap: Record<CatStateType, string> = {
    idle: "Idle",
    walking: "Walking...",
    running: "Running...",
    sitting: "Sitting",
    sleeping: "Sleeping...",
    playing: "Playing...",
  };

  return this._paused
    ? "Paused"
    : stateTextMap[this._state.type] || this._state.type;
}
```

**Update setState() to update DOM**:

```typescript
setState(newState: CatStateType): void {
  if (this._destroyed) return;

  const oldState = this._state.type;
  if (oldState === newState) return;

  if (!isValidTransition(oldState, newState)) {
    console.warn(`Invalid state transition: ${oldState} -> ${newState}`);
    return;
  }

  this._state = {
    type: newState,
    startTime: Date.now(),
    loop: true,
  };

  // Update DOM
  this.dom.updateState(newState);
  this.dom.updateStateText(this.getStateText()); // NEW

  // Update GSAP animations
  this._animationManager?.startStateAnimations(newState);

  // Emit event
  this.events.emit("stateChange", { oldState, newState });
}
```

**Update pause/resume to update state text**:

```typescript
pause(): void {
  if (this._destroyed) return;
  this._paused = true;
  this.dom.updatePaused(true);
  this.dom.updateStateText("Paused"); // NEW
  this._animationManager?.pause();
}

resume(): void {
  if (this._destroyed) return;
  this._paused = false;
  this.dom.updatePaused(false);
  this.dom.updateStateText(this.getStateText()); // NEW
  this._animationManager?.resume();
}
```

## Phase 2: SDK Integration Hooks

### 2.1 Add menu button event handling to MeowzerCat

**File**: `meowzer/sdk/meowzer-cat.ts`

**Add in constructor**:

```typescript
constructor(config: MeowzerCatConfig) {
  // ... existing code ...

  // Setup menu button click handler
  this._setupMenuButton();
}
```

**Add new methods**:

```typescript
/**
 * Setup menu button click handler
 * @internal
 */
private _setupMenuButton(): void {
  const menuButton = this._cat._internalCat.dom?.getMenuButton();
  if (menuButton) {
    menuButton.addEventListener("click", this._handleMenuClick);
  }
}

/**
 * Handle menu button click
 * @internal
 */
private _handleMenuClick = (e: MouseEvent): void => {
  e.stopPropagation();
  this._emit("menuClick", {
    id: this.id,
    position: { x: e.clientX, y: e.clientY },
  });
};

/**
 * Update name display in DOM
 */
setName(name: string): void {
  this._name = name;
  this._cat._internalCat.dom?.updateNameText(name);
  this._updateTimestamp();
}
```

**Update event types** in `meowzer/sdk/types.ts`:

```typescript
export const MeowzerEvent = {
  STATE_CHANGE: "stateChange",
  MOVE: "move",
  BEHAVIOR_CHANGE: "behaviorChange",
  UPDATE: "update",
  PAUSE: "pause",
  RESUME: "resume",
  DESTROY: "destroy",
  MENU_CLICK: "menuClick", // NEW
  // Placeholders for future features:
  PICK_UP: "pickUp",
  DROP: "drop",
  PET: "pet",
  OUTFIT_CHANGE: "outfitChange",
} as const;
```

**Add placeholder methods** (disabled, for future use):

```typescript
/**
 * Pick up the cat (follows cursor)
 * @future Not yet implemented
 */
pickUp(): void {
  console.warn("pickUp() not yet implemented");
  // TODO: Implement in future SDK update
  // this._isHeld = true;
  // this._cat.startFollowingCursor();
  // this._emit("pickUp", { id: this.id });
}

/**
 * Drop the cat at current or specified position
 * @future Not yet implemented
 */
drop(position?: Position): void {
  console.warn("drop() not yet implemented");
  // TODO: Implement in future SDK update
  // this._isHeld = false;
  // this._cat.stopFollowingCursor();
  // if (position) this._cat.setPosition(position.x, position.y);
  // this._emit("drop", { id: this.id, position });
}

/**
 * Check if cat is being held
 * @future Not yet implemented
 */
get isBeingHeld(): boolean {
  return false; // TODO: Implement in future SDK update
}

/**
 * Pet the cat (shows affection)
 * @future Not yet implemented
 */
async pet(): Promise<void> {
  console.warn("pet() not yet implemented");
  // TODO: Implement in future SDK update
  // await this._brain.handlePet();
  // this._cat.setState("purring");
  // this._emit("pet", { id: this.id });
}

/**
 * Change cat's outfit
 * @future Not yet implemented
 */
setOutfit(outfit: any): void {
  console.warn("setOutfit() not yet implemented");
  // TODO: Implement in future SDK update
}

/**
 * Remove cat's outfit
 * @future Not yet implemented
 */
removeOutfit(): void {
  console.warn("removeOutfit() not yet implemented");
  // TODO: Implement in future SDK update
}
```

## Phase 3: UI Component Refactoring

**Key Principle**: Use Quiet UI components wherever possible instead of building custom components. This ensures accessibility, consistency, and reduces maintenance burden.

**Quiet UI Components Used**:

- `<quiet-dropdown>` + `<quiet-dropdown-item>` - Context menus
- `<quiet-badge>` - Status indicators and "Soon" labels
- `<quiet-icon>` - All icons throughout the UI
- `<quiet-divider>` - Visual separators in menus
- `<quiet-dialog>` - Modal dialogs (rename, create, etc.)
- `<quiet-text-field>` - Text inputs
- `<quiet-button>` - All buttons
- `<quiet-empty-state>` - Empty states (already in use)
- `<quiet-spinner>` - Loading indicators (already in use)

### 3.1 Implement context menu for on-screen cats

**Context**: The menu button is added directly to the animated cat sprite (Meowtion DOM). When clicked, it emits a `menuClick` event that we need to handle at the application level.

**Implementation**: Listen for `menuClick` events and display a Quiet UI dropdown menu positioned at the click location.

**No custom component needed!** Leverage Quiet UI's native components:

- **`<quiet-dropdown>` & `<quiet-dropdown-item>`** - Context menu structure
- **`<quiet-badge>`** - "Soon" labels for unimplemented features
- **`<quiet-icon>`** - All menu icons
- **`<quiet-divider>`** - Visual separation between menu sections
- **`<quiet-dialog>` & `<quiet-text-field>`** - Rename dialog

**Benefits**:

- Proper accessibility (keyboard navigation, ARIA, focus management)
- Consistent styling and behavior across the app
- Support for icons via `slot="icon"`, details via `slot="details"`
- Variants (`destructive` for remove, `primary` for badges, etc.)
- Built-in positioning and light-dismiss behavior

```typescript
// Example implementation in mb-cat-playground.ts or wherever you handle cat events

// Add state for context menu and rename dialog
@state() private contextMenuVisible = false;
@state() private contextMenuPosition = { x: 0, y: 0 };
@state() private selectedCat: MeowzerCat | null = null;
@state() private showRenameDialog = false;
@state() private newName = "";

// Listen for menuClick events from cats
private setupCatEventListeners(cat: MeowzerCat) {
  cat.on("menuClick", (event) => {
    this.selectedCat = cat;
    this.contextMenuPosition = event.position;
    this.contextMenuVisible = true;
  });
}

// Handle dropdown menu selections
private handleMenuSelect(e: CustomEvent) {
  const item = e.detail.item as HTMLElement;
  const action = item.getAttribute("value");

  if (!this.selectedCat) return;

  switch (action) {
    case "pause":
      this.selectedCat.pause();
      this.contextMenuVisible = false;
      break;
    case "resume":
      this.selectedCat.resume();
      this.contextMenuVisible = false;
      break;
    case "remove":
      this.handleRemove();
      break;
    case "rename":
      this.handleRename();
      break;
    case "pickup":
    case "pet":
    case "outfit":
      this.handlePlaceholder(action);
      this.contextMenuVisible = false;
      break;
  }
}

private async handleRemove() {
  if (!this.selectedCat) return;

  const confirmed = confirm(`Remove ${this.selectedCat.name || "this cat"}?`);
  if (confirmed) {
    await this.selectedCat.delete();
    this.contextMenuVisible = false;
    this.selectedCat = null;
  }
}

private handleRename() {
  if (!this.selectedCat) return;

  this.newName = this.selectedCat.name || "";
  this.showRenameDialog = true;
  this.contextMenuVisible = false;
}

private handleRenameSubmit() {
  if (!this.selectedCat) return;

  if (this.newName.trim()) {
    this.selectedCat.setName(this.newName.trim());
    this.showRenameDialog = false;
    this.selectedCat = null;
  }
}

private handleRenameCancel() {
  this.showRenameDialog = false;
  this.newName = "";
  this.selectedCat = null;
}

private handlePlaceholder(feature: string) {
  const messages = {
    pickup: "Pick-up feature coming soon!\n\nThis will let you drag cats around the screen.",
    pet: "Pet feature coming soon!\n\nThis will show an affectionate animation.",
    outfit: "Outfit feature coming soon!\n\nThis will let you dress up your cat."
  };
  alert(messages[feature as keyof typeof messages]);
}

// Render the context menu
render() {
  return html`
    <div class="playground-container">
      <!-- ...existing content... -->

      <!-- Context Menu (positioned absolutely at click location) -->
      ${this.contextMenuVisible && this.selectedCat ? html`
        <quiet-dropdown
          ?open=${this.contextMenuVisible}
          .anchorPosition=${{ x: this.contextMenuPosition.x, y: this.contextMenuPosition.y }}
          @quiet-select=${this.handleMenuSelect}
          @quiet-request-close=${() => { this.contextMenuVisible = false; }}
        >
          <!-- Implemented actions -->
          <quiet-dropdown-item value=${this.selectedCat.isActive ? "pause" : "resume"}>
            <quiet-icon
              slot="icon"
              family="outline"
              name=${this.selectedCat.isActive ? "player-pause" : "player-play"}
            ></quiet-icon>
            ${this.selectedCat.isActive ? "Pause" : "Resume"}
          </quiet-dropdown-item>

          <quiet-dropdown-item value="remove" variant="destructive">
            <quiet-icon slot="icon" family="outline" name="trash"></quiet-icon>
            Remove
          </quiet-dropdown-item>

          <quiet-dropdown-item value="rename">
            <quiet-icon slot="icon" family="outline" name="edit"></quiet-icon>
            Rename
          </quiet-dropdown-item>

          <quiet-divider></quiet-divider>

          <!-- Placeholder actions (disabled with "Soon" badge) -->
          <quiet-dropdown-item value="pickup" disabled>
            <quiet-icon slot="icon" family="outline" name="hand"></quiet-icon>
            Pick Up
            <quiet-badge slot="details" variant="primary" appearance="outline">Soon</quiet-badge>
          </quiet-dropdown-item>

          <quiet-dropdown-item value="pet" disabled>
            <quiet-icon slot="icon" family="outline" name="heart"></quiet-icon>
            Pet
            <quiet-badge slot="details" variant="primary" appearance="outline">Soon</quiet-badge>
          </quiet-dropdown-item>

          <quiet-dropdown-item value="outfit" disabled>
            <quiet-icon slot="icon" family="outline" name="shirt"></quiet-icon>
            Change Outfit
            <quiet-badge slot="details" variant="primary" appearance="outline">Soon</quiet-badge>
          </quiet-dropdown-item>
        </quiet-dropdown>
      ` : ""}

      <!-- Rename Dialog -->
      ${this.showRenameDialog ? html`
        <quiet-dialog ?open=${this.showRenameDialog} @quiet-request-close=${this.handleRenameCancel}>
          <div slot="header">Rename Cat</div>

          <quiet-text-field
            label="Cat Name"
            .value=${this.newName}
            @quiet-input=${(e: CustomEvent) => (this.newName = e.detail.value)}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === "Enter") this.handleRenameSubmit();
            }}
          ></quiet-text-field>

          <div slot="footer">
            <quiet-button appearance="outline" @click=${this.handleRenameCancel}>
              Cancel
            </quiet-button>
            <quiet-button
              variant="primary"
              @click=${this.handleRenameSubmit}
              ?disabled=${!this.newName.trim()}
            >
              Rename
            </quiet-button>
          </div>
        </quiet-dialog>
      ` : ""}
    </div>
  `;
}
```

### 3.2 Delete cat-card component

**File**: `meowzer/ui/components/cat-card/`

**Action**: Delete the entire component directory. This component is no longer needed - cat interactions happen directly on the animated sprites via the context menu.

### 3.3 Delete cat-list-item component

**File**: `meowzer/ui/components/cat-list-item/`

**Action**: Delete the entire component directory. This component is no longer needed - cat interactions happen directly on the animated sprites via the context menu.

### 3.4 Refactor mb-cat-playground

**File**: `meowzer/ui/components/mb-cat-playground/mb-cat-playground.ts`

**Remove**:

- Toolbar with pause all/resume all/destroy all buttons
- cat-manager integration

**Keep**:

- Two floating action buttons (Create + Statistics) in lower-right
- Creator and stats dialogs (globally available)

**Add**:

- Context menu handling for on-screen cats (see pattern from 3.1)
- Event listeners for `menuClick` events from cats

```typescript
// Simplified render
render() {
  if (this.error) return html`<div class="error">...</div>`;
  if (!this.initialized) return html`<div class="loading">...</div>`;

  return html`
    <div class="playground-container">
      <!-- Global Action Buttons (lower-right corner) -->
      <div class="global-actions">
        <quiet-button
          appearance="primary"
          size="lg"
          @click=${this.openCreatorDialog}
          title="Create New Cat"
        >
          <quiet-icon family="outline" name="plus"></quiet-icon>
        </quiet-button>

        <quiet-button
          appearance="normal"
          size="lg"
          @click=${this.openStatsDialog}
          title="View Statistics"
        >
          <quiet-icon family="outline" name="chart-bar"></quiet-icon>
        </quiet-button>
      </div>

      <!-- Dialogs -->
      <quiet-dialog id="creator-dialog" @quiet-request-close=${this.closeCreatorDialog}>
        <div slot="header">Create Cat</div>
        <cat-creator @cat-created=${this.closeCreatorDialog}></cat-creator>
      </quiet-dialog>

      <quiet-dialog id="stats-dialog" @quiet-request-close=${this.closeStatsDialog}>
        <div slot="header">Statistics</div>
        <cat-statistics></cat-statistics>
      </quiet-dialog>
    </div>
  `;
}
```

**Update styles**:

```css
.global-actions {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 1000;
}

.global-actions quiet-button {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
```

### 3.5 Simplify mb-cat-overlay

**File**: `meowzer/ui/components/mb-cat-overlay/mb-cat-overlay.ts`

**Remove**: "Manage" tab (or make it minimal)

**Keep**: "Create" and "Gallery" tabs

```typescript
// Update initialTab options
@property({ type: String })
initialTab: "create" | "gallery" = "create";

// Simplified tab navigation
private renderExpanded() {
  return html`
    <div class="overlay-container">
      <div class="overlay-header">
        <h2>Meowzer Cats</h2>
        <div class="header-controls">
          <quiet-button variant="neutral" size="sm" @click=${this.toggleMinimized}>
            <quiet-icon name="minus"></quiet-icon>
          </quiet-button>
          <quiet-button variant="neutral" size="sm" @click=${this.handleClose}>
            <quiet-icon name="x"></quiet-icon>
          </quiet-button>
        </div>
      </div>

      <div class="tab-nav">
        <button
          class="tab-button ${this.activeTab === "create" ? "active" : ""}"
          @click=${() => this.switchTab("create")}
        >
          Create
        </button>
        <button
          class="tab-button ${this.activeTab === "gallery" ? "active" : ""}"
          @click=${() => this.switchTab("gallery")}
        >
          Gallery
        </button>
      </div>

      <div class="overlay-tabs">
        <div class="tab-panel ${this.activeTab === "create" ? "active" : ""}">
          <cat-creator></cat-creator>
        </div>

        <div class="tab-panel ${this.activeTab === "gallery" ? "active" : ""}">
          <cat-gallery></cat-gallery>
        </div>
      </div>
    </div>
  `;
}
```

### 3.6 Delete cat-controls component

**File**: `meowzer/ui/components/cat-controls/`

**Action**: Delete the entire component directory and all related files. This component is obsolete in the new interaction model.

### 3.7 Delete cat-manager component

**File**: `meowzer/ui/components/cat-manager/`

**Action**: Delete the entire component directory. All cat management is now done via context menus directly on the animated sprites.

## Phase 4: Integration & Testing

### 4.1 Delete obsolete components

**Components to delete**:

- `meowzer/ui/components/cat-controls/` - Entire directory
- `meowzer/ui/components/cat-manager/` - Entire directory
- `meowzer/ui/components/cat-card/` - Entire directory
- `meowzer/ui/components/cat-list-item/` - Entire directory

**Files to update**:

- Remove from `meowzer/ui/components/index.ts` exports
- Remove any imports in other components
- Delete associated Storybook stories
- Remove from documentation

**Search and destroy**: Use grep to find any remaining references to deleted components and remove them.

### 4.2 Update component exports

**File**: `meowzer/ui/components/index.ts`

Remove exports for deleted components.

### 4.3 Update Storybook stories

Create stories for:

- Context menu pattern (using Quiet UI dropdown for on-screen cats)
- Updated `mb-cat-playground` with floating buttons and context menu

Delete stories for removed components:

- `cat-controls`
- `cat-manager`
- `cat-card`
- `cat-list-item`

### 4.4 Testing checklist

- [ ] Menu button appears on hover over cats
- [ ] Menu button click shows dropdown with actions
- [ ] Pause/Resume works from menu
- [ ] Remove works from menu
- [ ] Rename works from menu (with dialog)
- [ ] Placeholder items show "Coming soon" badge (using `<quiet-badge>`)
- [ ] Clicking placeholder items shows informative alert
- [ ] State text updates when cat changes state
- [ ] State text shows "Paused" when cat is paused
- [ ] Name updates in DOM when setName() is called
- [ ] Global action buttons positioned correctly
- [ ] Creator dialog works from global button
- [ ] Statistics dialog works from global button
- [ ] mb-cat-overlay simplified tabs work
- [ ] Context menu appears at correct position when cat menu button clicked
- [ ] No references to deleted components remain in codebase

## Phase 5: Documentation

### 5.1 Update component README files

Update documentation for:

- Context menu pattern (using Quiet UI components for on-screen cat interactions)
- `mb-cat-playground` (refactored with context menu handling)
- `mb-cat-overlay` (simplified tabs)

Remove documentation for deleted components:

- `cat-card`
- `cat-list-item`
- `cat-controls`
- `cat-manager`

### 5.2 Add "Future Features" section to docs

Document placeholder features:

- Pick-up/Drop interaction
- Pet/affection system
- Outfit/costume system

Explain that these will be enabled when SDK support is added.

## Implementation Order

**Week 1**: Phase 1 (DOM & Styles)

- Update Meowtion DOM structure
- Update Meowtion styles
- Update Cat class state text methods

**Week 2**: Phase 2 (SDK Hooks) + Phase 3.1 (Context Menu)

- Add menu button event handling
- Add placeholder methods to MeowzerCat
- Implement context menu pattern using Quiet UI

**Week 3**: Phase 3.2-3.7 (UI Component Refactoring)

- Delete cat-card
- Delete cat-list-item
- Refactor mb-cat-playground
- Simplify mb-cat-overlay
- Delete cat-controls
- Delete cat-manager

**Week 4**: Phase 4-5 (Integration, Testing, Documentation)

- Update exports (remove deleted components)
- Update Storybook (remove old stories)
- Testing
- Documentation

## Success Criteria

1. ✅ Cats display name and state text below sprite
2. ✅ Menu button appears on cat hover
3. ✅ Menu shows working actions (pause/resume/remove/rename)
4. ✅ Menu shows placeholder actions with "Coming soon" indicators
5. ✅ Placeholder actions show helpful alerts when clicked
6. ✅ Global action buttons positioned in lower-right
7. ✅ No console errors or warnings
8. ✅ All existing functionality preserved
9. ✅ Ready to integrate pick-up/drop when SDK adds support
10. ✅ Ready to integrate pet when SDK adds support
11. ✅ Ready to integrate outfit when SDK adds support

## Notes

- This plan prioritizes UI changes that can be implemented immediately
- SDK placeholder methods have console.warn() to indicate they're not yet implemented
- Users will see "Coming soon" indicators for unimplemented features
- When SDK features are added, we can simply remove the placeholders and hook up real functionality
- Obsolete components will be deleted - no deprecation period needed:
  - `cat-controls` - No longer needed with context menu
  - `cat-manager` - No longer needed with context menu
  - `cat-card` - No longer needed (cats only exist as animated sprites)
  - `cat-list-item` - No longer needed (cats only exist as animated sprites)
