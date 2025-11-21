# UI Components Migration Plan: Quiet UI → Carbon Web Components

## Migration Overview

This document outlines the detailed plan for migrating all 14 UI components from Quiet UI to Carbon Web Components.

**Status**: Ready to execute
**Scope**: 14 components, 76 Quiet UI element references, CSS variable updates
**Estimated Effort**: Medium (mostly straightforward replacements)

---

## Components Inventory

### Components Requiring Migration (Ordered by Complexity)

#### 1. **Simple Components** (Low Complexity)

- `cat-statistics` - Stats display with cards
- `mb-need-visual` - Need indicator
- `mb-laser-visual` - Laser pointer visualization
- `mb-yarn-visual` - Yarn ball visualization
- `cat-preview` - Cat preview display

#### 2. **Medium Components** (Medium Complexity)

- `cat-color-picker` - Color selection UI with button + input
- `cat-personality-picker` - Personality card selection
- `mb-playground-toolbar` - Toolbar with multiple buttons + icons
- `cat-creator/partials/basic-info-section` - Name + description inputs
- `cat-creator/partials/appearance-section` - Appearance customization

#### 3. **Complex Components** (High Complexity)

- `cat-creator` - Multi-step wizard with buttons, callouts, checkbox
- `mb-wardrobe-dialog` - Modal dialog with buttons
- `cat-context-menu` - Dynamic dropdown menu
- `mb-cat-playground` - Complete playground with dialogs, toolbars, dynamic menus

---

## Migration Mapping

### Quiet UI → Carbon Equivalents

| Quiet UI Element        | Carbon Element              | Notes                               |
| ----------------------- | --------------------------- | ----------------------------------- |
| `<quiet-button>`        | `<cds-button>`              | Change `variant` → `kind`           |
| `<quiet-icon>`          | `@carbon/icons` SVG         | Import individual icons             |
| `<quiet-dialog>`        | `<cds-modal>`               | Different API, requires restructure |
| `<quiet-callout>`       | `<cds-inline-notification>` | Change `variant` → `kind`           |
| `<quiet-input>`         | `<cds-text-input>`          | Event: `@quiet-input` → `@input`    |
| `<quiet-checkbox>`      | `<cds-checkbox>`            | Similar API                         |
| `<quiet-dropdown>`      | `<cds-dropdown>`            | Requires restructure                |
| `<quiet-dropdown-item>` | `<cds-dropdown-item>`       | Similar pattern                     |
| `<quiet-badge>`         | `<cds-tag>`                 | Use `type` prop for styling         |
| `<quiet-toolbar>`       | Custom/Native               | No direct equivalent                |
| `<quiet-label>`         | Native `<label>`            | Or Carbon field labels              |

### CSS Variables Mapping

| Quiet UI Variable                    | Carbon Variable            | Component Usage     |
| ------------------------------------ | -------------------------- | ------------------- |
| `--quiet-neutral-background-softest` | `--cds-layer-01`           | Backgrounds         |
| `--quiet-neutral-stroke-soft`        | `--cds-border-subtle-01`   | Borders             |
| `--quiet-neutral-text-loud`          | `--cds-text-primary`       | Primary text        |
| `--quiet-neutral-text-mid`           | `--cds-text-secondary`     | Secondary text      |
| `--quiet-neutral-text-soft`          | `--cds-text-helper`        | Helper text         |
| `--quiet-primary-background-soft`    | `--cds-layer-accent-01`    | Accent backgrounds  |
| `--quiet-primary-text-loud`          | `--cds-text-on-color`      | Text on colored bg  |
| `--quiet-primary-stroke-soft`        | `--cds-border-interactive` | Interactive borders |
| `--quiet-primary-fill-loud`          | `--cds-background-brand`   | Primary fills       |
| `--quiet-destructive-text`           | `--cds-text-error`         | Error text          |
| `--quiet-border-radius-sm`           | `4px` (hardcoded)          | Small radius        |
| `--quiet-border-radius-md`           | `8px` (hardcoded)          | Medium radius       |

---

## Component-by-Component Changes

### 1. cat-statistics ✓ Simple

**Files:**

- `cat-statistics.ts` - No HTML changes needed
- `cat-statistics.style.ts` - 6 CSS variable replacements

**Changes:**

```typescript
// cat-statistics.style.ts
- background: var(--quiet-neutral-background-softest);
+ background: var(--cds-layer-01);

- border: 1px solid var(--quiet-neutral-stroke-soft);
+ border: 1px solid var(--cds-border-subtle-01);

- border-radius: var(--quiet-border-radius-md);
+ border-radius: 8px;

- color: var(--quiet-neutral-text-soft);
+ color: var(--cds-text-helper);

- color: var(--quiet-neutral-text-loud);
+ color: var(--cds-text-primary);

- color: var(--quiet-neutral-text-mid);
+ color: var(--cds-text-secondary);
```

---

### 2. mb-need-visual ✓ Simple

**Files:**

- `mb-need-visual.ts` - No HTML changes needed
- `mb-need-visual.style.ts` - 4 CSS variable replacements

**Changes:**

```typescript
// mb-need-visual.style.ts
- background: var(--quiet-primary-background-soft);
+ background: var(--cds-layer-accent-01);

- color: var(--quiet-primary-text-loud);
+ color: var(--cds-text-on-color);

- border: 1px solid var(--quiet-primary-stroke-soft);
+ border: 1px solid var(--cds-border-interactive);

- border-radius: var(--quiet-border-radius-sm);
+ border-radius: 4px;
```

---

### 3. cat-color-picker ⚠️ Medium

**Files:**

- `cat-color-picker.ts` - 1 HTML element, 1 event
- `cat-color-picker.styles.ts` - 2 CSS selectors

**Changes:**

```typescript
// cat-color-picker.ts
- <quiet-button id=${this.buttonId} variant="neutral">
+ <cds-button id=${this.buttonId} kind="tertiary">

- </quiet-button>
+ </cds-button>

- @quiet-input=${this.handleColorChange}
+ @input=${this.handleColorChange}

// cat-color-picker.styles.ts
- quiet-button {
+ cds-button {

- quiet-button span {
+ cds-button span {
```

---

### 4. cat-personality-picker ⚠️ Medium

**Files:**

- `cat-personality-picker.ts` - Multiple quiet-button elements

**Changes:**

```typescript
// cat-personality-picker.ts
- <quiet-button
+ <cds-button
    class="personality-card"
-   variant=${isSelected ? "primary" : "neutral"}
+   kind=${isSelected ? "primary" : "tertiary"}
    appearance="outline"
    @click=${() => this.selectPersonality(preset.id)}
  >
    <!-- Card content -->
- </quiet-button>
+ </cds-button>
```

**Note:** Carbon buttons may need restructuring. Consider using `<cds-tile>` with `selectable` prop instead.

---

### 5. mb-playground-toolbar ⚠️ Medium

**Files:**

- `mb-playground-toolbar.ts` - 7 quiet-button instances, 7 quiet-icon instances
- `mb-playground-toolbar.style.ts` - CSS selectors + variables

**Changes:**

```typescript
// mb-playground-toolbar.ts
import { Add, ChartBar, Laser, Ball, Fish, Mouse, Pause } from '@carbon/icons';

// Replace all buttons:
- <quiet-button variant="primary" @click=${this.handleCreate}>
+ <cds-button kind="primary" @click=${this.handleCreate}>
-   <quiet-icon family="outline" name="plus"></quiet-icon>
+   ${Add({ size: 20 })}
    Create Cat
- </quiet-button>
+ </cds-button>

// Repeat for all 7 buttons with appropriate icons

// mb-playground-toolbar.style.ts
- quiet-button {
+ cds-button {

- quiet-button svg {
+ cds-button svg {

- quiet-button[data-active] {
+ cds-button[data-active] {

- background: var(--quiet-primary-background-soft);
+ background: var(--cds-layer-accent-01);

- border-color: var(--quiet-primary-stroke-loud);
+ border-color: var(--cds-border-interactive);

- quiet-button::part(base) {
+ cds-button::part(button) {
```

---

### 6. cat-creator/partials/basic-info-section ⚠️ Medium

**Files:**

- `basic-info-section.ts` - 2 quiet-input instances

**Changes:**

```typescript
// basic-info-section.ts
- <quiet-input
+ <cds-text-input
    name="cat-name"
    label="Name"
    placeholder="Enter a name for your cat"
    value=${this.name}
    required
-   @quiet-input=${this.handleNameChange}
+   @input=${this.handleNameChange}
- ></quiet-input>
+ ></cds-text-input>

// Repeat for description (use cds-textarea for multi-line)
- <quiet-input
+ <cds-textarea
    name="cat-description"
    label="Description (Optional)"
    placeholder="Describe your cat's unique traits"
    value=${this.description}
-   @quiet-input=${this.handleDescriptionChange}
+   @input=${this.handleDescriptionChange}
- ></quiet-input>
+ ></cds-textarea>
```

---

### 7. cat-creator ⚠️ Complex

**Files:**

- `cat-creator.ts` - 6 quiet-button, 3 quiet-callout, 1 quiet-checkbox
- `cat-creator.style.ts` - 6 CSS variable replacements

**Changes:**

**Templates:**

```typescript
// Navigation buttons
- <quiet-button @click=${this.previousStep} appearance="outline">
+ <cds-button @click=${this.previousStep} kind="secondary">
    Previous
- </quiet-button>
+ </cds-button>

- <quiet-button @click=${this.nextStep} variant="primary">
+ <cds-button @click=${this.nextStep} kind="primary">
    Next
- </quiet-button>
+ </cds-button>

- <quiet-button @click=${this.handleCreate} variant="primary" ?disabled=${this.creating}>
+ <cds-button @click=${this.handleCreate} kind="primary" ?disabled=${this.creating}>
    ${this.creating ? "Creating..." : "Create Cat"}
- </quiet-button>
+ </cds-button>

// Error callout
- <quiet-callout variant="destructive">
+ <cds-inline-notification kind="error" hideCloseButton>
    <strong>No Meowzer SDK</strong>
    <p>Please wrap this component in a <code>&lt;meowzer-provider&gt;</code>.</p>
- </quiet-callout>
+ </cds-inline-notification>

// Message callout
- <quiet-callout variant="primary" class="message">
+ <cds-inline-notification kind="info" hideCloseButton>
    ${this.message}
- </quiet-callout>
+ </cds-inline-notification>

// Step errors
- <quiet-callout variant="destructive" class="step-errors">
+ <cds-inline-notification kind="error" hideCloseButton>
    ${this.stepErrors.map(err => html`<p>${err}</p>`)}
- </quiet-callout>
+ </cds-inline-notification>

// Checkbox
- <quiet-checkbox
+ <cds-checkbox
    ?checked=${this.makeRoaming}
-   @quiet-change=${(e: CustomEvent) => {
+   @change=${(e: Event) => {
      this.makeRoaming = (e.target as HTMLInputElement).checked;
    }}
  >
    Make cat roaming (moves around the page)
- </quiet-checkbox>
+ </cds-checkbox>
```

**Styles:**

```typescript
// cat-creator.style.ts
- color: var(--quiet-neutral-text-loud);
+ color: var(--cds-text-primary);

- border-bottom: 1px solid var(--quiet-neutral-stroke-soft);
+ border-bottom: 1px solid var(--cds-border-subtle-01);

- border-top: 1px solid var(--quiet-neutral-stroke-soft);
+ border-top: 1px solid var(--cds-border-subtle-01);

- background: var(--quiet-neutral-stroke-soft);
+ background: var(--cds-border-subtle-01);

- background: var(--quiet-primary-fill-loud);
+ background: var(--cds-background-brand);
```

---

### 8. mb-wardrobe-dialog ⚠️ Complex

**Files:**

- `mb-wardrobe-dialog.ts` - 1 quiet-dialog, multiple quiet-button

**Changes:**

```typescript
// mb-wardrobe-dialog.ts

// Check if dialog is clicked
- if (target.tagName.toLowerCase() === "quiet-dialog") {
+ if (target.tagName.toLowerCase() === "cds-modal") {

// Dialog structure (major change)
- <quiet-dialog
+ <cds-modal
    .open=${this.isOpen}
-   @quiet-close=${this.handleCancel}
+   @cds-modal-closed=${this.handleCancel}
    size="large"
  >
-   <div slot="header">Choose a Hat</div>
+   <cds-modal-header>
+     <cds-modal-heading>Choose a Hat</cds-modal-heading>
+   </cds-modal-header>

-   <div slot="body">
+   <cds-modal-body>
      <!-- Hat grid -->
-   </div>
+   </cds-modal-body>

-   <div slot="footer">
-     <quiet-button @click=${this.handleCancel}>
+   <cds-modal-footer>
+     <cds-button @click=${this.handleCancel} kind="secondary">
        Cancel
-     </quiet-button>
-     <quiet-button variant="primary" @click=${this.handleApply}>
+     </cds-button>
+     <cds-button @click=${this.handleApply} kind="primary">
        Apply
-     </quiet-button>
-   </div>
- </quiet-dialog>
+     </cds-button>
+   </cds-modal-footer>
+ </cds-modal>

// Hat selection buttons
- <quiet-button
+ <cds-button
    class="hat-option"
    variant=${isSelected ? "primary" : "neutral"}
    @click=${() => this.selectHat(hat)}
  >
    <!-- SVG content -->
- </quiet-button>
+ </cds-button>
```

---

### 9. mb-cat-playground ⚠️ Most Complex

**Files:**

- `mb-cat-playground.ts` - 3 quiet-dialog, 2 quiet-button, dynamic quiet-dropdown creation
- `mb-cat-playground.style.ts` - CSS selectors + variables

**Changes:**

**Dynamic Menu Creation:**

```typescript
// mb-cat-playground.ts - createContextMenu()
- const dropdown = document.createElement("quiet-dropdown") as any;
+ const dropdown = document.createElement("cds-dropdown") as any;

- const item = document.createElement("quiet-dropdown-item") as any;
+ const item = document.createElement("cds-dropdown-item") as any;

- const iconEl = document.createElement("quiet-icon") as any;
- iconEl.family = "outline";
- iconEl.name = icon;
+ // Import Carbon icons and use SVG templates instead
+ import { TrashCan, Edit, Hat } from '@carbon/icons';
+ // Then conditionally render based on action type

- const badge = document.createElement("quiet-badge") as any;
+ const badge = document.createElement("cds-tag") as any;
- badge.variant = "primary";
- badge.appearance = "outline";
+ badge.type = "blue";
```

**Dialogs:**

```typescript
// Rename dialog
- <quiet-dialog
+ <cds-modal
    ?open=${this.showRenameDialog}
-   @quiet-close=${() => { this.showRenameDialog = false; }}
+   @cds-modal-closed=${() => { this.showRenameDialog = false; }}
  >
-   <div slot="header">Rename Cat</div>
-   <div slot="body">
+   <cds-modal-header>
+     <cds-modal-heading>Rename Cat</cds-modal-heading>
+   </cds-modal-header>
+   <cds-modal-body>
      <input
        type="text"
        value=${this.newName}
-       @quiet-input=${(e: CustomEvent) => {
+       @input=${(e: Event) => {
          this.newName = (e.target as HTMLInputElement).value;
        }}
      />
-   </div>
-   <div slot="footer">
-     <quiet-button @click=${() => { this.showRenameDialog = false; }}>
+   </cds-modal-body>
+   <cds-modal-footer>
+     <cds-button @click=${() => { this.showRenameDialog = false; }} kind="secondary">
        Cancel
-     </quiet-button>
-     <quiet-button variant="primary" @click=${this.handleRenameSubmit}>
+     </cds-button>
+     <cds-button @click=${this.handleRenameSubmit} kind="primary">
        Rename
-     </quiet-button>
-   </div>
- </quiet-dialog>
+     </cds-button>
+   </cds-modal-footer>
+ </cds-modal>

// Creator dialog
- <quiet-dialog id="creator-dialog" size="large">
+ <cds-modal id="creator-dialog" size="lg">
-   <div slot="header">Create a Cat</div>
-   <div slot="body">
+   <cds-modal-header>
+     <cds-modal-heading>Create a Cat</cds-modal-heading>
+   </cds-modal-header>
+   <cds-modal-body>
      <cat-creator @cat-created=${this.closeCreatorDialog}></cat-creator>
-   </div>
- </quiet-dialog>
+   </cds-modal-body>
+ </cds-modal>

// Stats dialog
- <quiet-dialog id="stats-dialog">
+ <cds-modal id="stats-dialog">
-   <div slot="header">Statistics</div>
-   <div slot="body">
+   <cds-modal-header>
+     <cds-modal-heading>Statistics</cds-modal-heading>
+   </cds-modal-header>
+   <cds-modal-body>
      <cat-statistics></cat-statistics>
-   </div>
- </quiet-dialog>
+   </cds-modal-body>
+ </cds-modal>
```

**Styles:**

```typescript
// mb-cat-playground.style.ts
- background: var(--quiet-neutral-background-softest);
+ background: var(--cds-layer-01);

- border-left: 1px solid var(--quiet-neutral-stroke-soft);
+ border-left: 1px solid var(--cds-border-subtle-01);

- color: var(--quiet-destructive-text);
+ color: var(--cds-text-error);

- color: var(--quiet-neutral-text-mid);
+ color: var(--cds-text-secondary);

- .preview-empty quiet-icon {
+ .preview-empty svg {

- quiet-toolbar quiet-button {
+ /* Remove if toolbar is custom */

- quiet-dialog {
+ cds-modal {

- quiet-dialog::part(panel) {
+ cds-modal::part(dialog) {

- quiet-dialog::part(body) {
+ cds-modal::part(body) {
```

---

### 10-14. Visual Components ✓ Simple

**Components:**

- `mb-laser-visual`
- `mb-yarn-visual`
- `cat-preview`
- `cat-context-menu` (if no Quiet UI found)
- `meowzer-cat-element` (if no Quiet UI found)

**Status:** Likely no Quiet UI usage (need verification)

---

## Execution Strategy

### Phase 1: Simple Components (Low Risk)

**Estimated Time:** 30 minutes

1. ✅ cat-statistics - CSS only
2. ✅ mb-need-visual - CSS only
3. ✅ mb-laser-visual - Verify no changes
4. ✅ mb-yarn-visual - Verify no changes
5. ✅ cat-preview - Verify no changes

**Success Criteria:**

- All styles render correctly
- No console errors
- Storybook stories work

---

### Phase 2: Medium Components (Moderate Risk)

**Estimated Time:** 1 hour

6. ✅ cat-color-picker - Button + event handler
7. ✅ cat-personality-picker - Multiple buttons (consider tiles)
8. ✅ mb-playground-toolbar - Buttons + icons
9. ✅ cat-creator/partials/basic-info-section - Text inputs
10. ✅ cat-creator/partials/appearance-section - Verify

**Success Criteria:**

- All interactions work
- Icons display correctly
- Events fire properly
- Form inputs capture values

---

### Phase 3: Complex Components (High Risk)

**Estimated Time:** 2 hours

11. ✅ cat-creator - Wizard with multiple element types
12. ✅ mb-wardrobe-dialog - Modal dialog restructure
13. ✅ mb-cat-playground - Dynamic menus + dialogs

**Success Criteria:**

- Wizards navigate correctly
- Dialogs open/close properly
- Dynamic menus work
- All workflows complete successfully

---

### Phase 4: Testing & Refinement

**Estimated Time:** 1 hour

- Run all Storybook stories
- Test end-to-end workflows
- Verify dark/light theme switching
- Check responsive behavior
- Fix any styling inconsistencies

**Success Criteria:**

- All tests pass
- No visual regressions
- All features functional
- Themes work correctly

---

## Breaking Changes & Risks

### API Differences

1. **Dialog/Modal Structure**

   - Quiet: `<quiet-dialog>` with `slot="header|body|footer"`
   - Carbon: `<cds-modal>` with `<cds-modal-header>`, `<cds-modal-body>`, `<cds-modal-footer>`
   - **Risk:** High - Requires significant restructure

2. **Button Variants**

   - Quiet: `variant="primary|neutral|destructive"`
   - Carbon: `kind="primary|secondary|tertiary|danger"`
   - **Risk:** Low - Simple property rename

3. **Icon System**

   - Quiet: `<quiet-icon family="outline" name="plus">`
   - Carbon: Import individual SVG components
   - **Risk:** Medium - Requires icon imports and template changes

4. **Events**

   - Quiet: Custom events (`@quiet-input`, `@quiet-change`, `@quiet-close`)
   - Carbon: Standard events (`@input`, `@change`, `@cds-modal-closed`)
   - **Risk:** Medium - Event handler updates needed

5. **Dropdown/Menu**
   - Quiet: `<quiet-dropdown>` + `<quiet-dropdown-item>`
   - Carbon: `<cds-dropdown>` + `<cds-dropdown-item>`
   - **Risk:** Medium - Similar API but dynamic creation needs testing

### Testing Requirements

**Unit Tests:**

- Update event handler tests (quiet-input → input)
- Update component snapshots
- Test dialog open/close states

**Integration Tests:**

- Cat creation flow (multi-step wizard)
- Hat selection (wardrobe dialog)
- Context menu interactions
- Playground toolbar actions

**Visual Tests:**

- Storybook visual regression tests
- Theme switching (g10 light / g90 dark)
- Responsive layouts

---

## Rollback Plan

If migration causes critical issues:

1. **Git Reset:** All changes are tracked, can revert per-component
2. **Feature Flag:** Could add runtime switch between Quiet/Carbon
3. **Incremental:** Deploy simple components first, complex later

---

## Success Metrics

- ✅ Zero Quiet UI references in component files
- ✅ All Storybook stories render without errors
- ✅ All interactive features work (clicks, inputs, dialogs)
- ✅ Themes apply correctly (light/dark)
- ✅ No console errors or warnings
- ✅ Visual consistency maintained (or improved)

---

## Next Steps

1. **Immediate:** Start with Phase 1 (simple CSS-only components)
2. **After Phase 1:** Review and validate before proceeding
3. **Iterative:** Complete one phase, test, then move to next
4. **Documentation:** Update component docs with Carbon examples

---

## Notes

- **No Backwards Compatibility:** Per project guidelines, remove all Quiet UI code completely
- **Lit Element Patterns:** All components already use Lit, no framework migration needed
- **Shadow DOM:** All components use Shadow DOM, styles are isolated
- **Carbon Theme:** Already configured globally via `setup.ts`

---

**Migration Ready:** All components mapped, changes documented, ready to execute.
