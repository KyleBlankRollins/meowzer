# Carbon Web Components Removal - Project Plan

**Status**: 🟡 Planning  
**Start Date**: TBD  
**Target Completion**: 3-4 weeks  
**Branch**: `remove-carbon`  
**Goal**: Replace all Carbon Web Components with custom Lit Element components

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Scope & Objectives](#scope--objectives)
3. [Component Replacement Strategy](#component-replacement-strategy)
4. [Phase Breakdown](#phase-breakdown)
5. [Implementation Details](#implementation-details)
6. [Testing Strategy](#testing-strategy)
7. [Risk Management](#risk-management)
8. [Success Criteria](#success-criteria)

---

## Project Overview

### Current State

The Meowzer UI library currently depends on:

- **Carbon Web Components** (`@carbon/web-components` v2.43.0)
  - 17 different component types
  - 175+ instances across codebase
  - Foundational design system with 25+ CSS tokens
- **Shoelace** (`@shoelace-style/shoelace` v2.20.1)
  - 1 component (`sl-color-picker`)
  - Isolated usage in `cat-color-picker.ts`

### Target State

Replace all external UI framework dependencies with:

- **Custom Lit Element components** built in-house with unique visual design
- **Custom design system** with original design tokens, color palette, and visual language
- **Native HTML elements** where appropriate
- **No external UI framework dependencies**

### Why Remove Carbon?

- **Design Freedom**: Create a unique visual identity instead of IBM's design language
- **Bundle size**: Reduce external dependencies
- **Control**: Full ownership of component behavior and styling
- **Customization**: Easier to tailor components to exact needs
- **Simplicity**: Fewer layers of abstraction
- **Learning**: Better understanding of underlying web component patterns

---

## Scope & Objectives

### In Scope

✅ Replace all 17 Carbon component types with custom Lit components  
✅ Remove Shoelace color picker  
✅ Create custom design token system  
✅ **Design new visual identity and UI/UX** (move away from IBM's design language)  
✅ Preserve all existing functionality  
✅ Update all UI components using Carbon  
✅ Update Storybook stories  
✅ Maintain accessibility standards

### Out of Scope

❌ Adding new features to components (beyond visual/UX improvements)  
❌ Performance optimizations beyond component replacement  
❌ Changing component APIs (maintain existing interfaces)  
❌ Updating demo applications (handled separately)

---

## Component Replacement Strategy

### Design System Foundation

Before building individual components, establish the foundation:

#### 1. Design Tokens

Create `meowzer/ui/shared/design-tokens.ts`:

**Note**: These are example tokens. Replace with your custom design system values.

```typescript
export const tokens = {
  // Colors - Brand (CUSTOMIZE THESE)
  brandPrimary: "#YOUR_PRIMARY_COLOR",
  brandSecondary: "#YOUR_SECONDARY_COLOR",
  brandAccent: "#YOUR_ACCENT_COLOR",

  // Colors - Neutrals (CUSTOMIZE THESE)
  neutral100: "#FFFFFF",
  neutral200: "#F5F5F5",
  neutral300: "#E0E0E0",
  neutral400: "#C0C0C0",
  neutral500: "#909090",
  neutral600: "#606060",
  neutral700: "#404040",
  neutral800: "#202020",
  neutral900: "#000000",

  // Colors - Semantic
  success: "#YOUR_SUCCESS_COLOR",
  warning: "#YOUR_WARNING_COLOR",
  error: "#YOUR_ERROR_COLOR",
  info: "#YOUR_INFO_COLOR",

  // Typography (CUSTOMIZE THESE)
  fontFamily: "YOUR_FONT_FAMILY",
  fontSizeSmall: "12px",
  fontSizeBase: "14px",
  fontSizeMedium: "16px",
  fontSizeLarge: "20px",
  fontSizeXLarge: "24px",
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  lineHeightTight: "1.25",
  lineHeightNormal: "1.5",
  lineHeightRelaxed: "1.75",

  // Spacing (CUSTOMIZE THESE)
  space1: "4px",
  space2: "8px",
  space3: "12px",
  space4: "16px",
  space5: "24px",
  space6: "32px",
  space7: "48px",
  space8: "64px",

  // Border Radius (CUSTOMIZE THESE - sharp, rounded, or pill-like)
  radiusNone: "0",
  radiusSmall: "4px",
  radiusMedium: "8px",
  radiusLarge: "12px",
  radiusFull: "9999px",

  // Shadows (CUSTOMIZE THESE)
  shadowSmall: "0 1px 3px rgba(0, 0, 0, 0.12)",
  shadowMedium: "0 4px 6px rgba(0, 0, 0, 0.15)",
  shadowLarge: "0 10px 20px rgba(0, 0, 0, 0.2)",
};

// Dark theme tokens
export const tokensDark = {
  ...tokens,
  background: "#161616",
  backgroundBrand: "#0f62fe",
  layer01: "#262626",
  layer02: "#393939",
  layer03: "#525252",
  // ... etc
};
```

#### 2. Shared Styles

Create `meowzer/ui/shared/base-styles.ts`:

```typescript
import { css } from "lit";
import { tokens } from "./design-tokens.js";

export const baseStyles = css`
  :host {
    font-family: ${tokens.fontFamily};
    font-size: ${tokens.fontSize};
    line-height: ${tokens.lineHeight};
    color: ${tokens.textPrimary};
  }
`;

export const buttonBaseStyles = css`
  button {
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    border: none;
    transition: background-color 0.15s ease;
  }

  button:focus-visible {
    outline: 2px solid ${tokens.focus};
    outline-offset: 2px;
  }
`;

export const inputBaseStyles = css`
  input,
  textarea {
    font-family: inherit;
    font-size: inherit;
    border: 1px solid ${tokens.borderSubtle01};
    background: ${tokens.field01};
    color: ${tokens.textPrimary};
    transition: border-color 0.15s ease;
  }

  input:hover,
  textarea:hover {
    background: ${tokens.fieldHover01};
  }

  input:focus,
  textarea:focus {
    outline: 2px solid ${tokens.focus};
    outline-offset: -2px;
  }
`;
```

---

## Phase Breakdown

### Phase 0: Preparation (Week 0 - 5 days)

**Status**: ✅ **COMPLETE**  
**Goal**: Design new visual identity and set up foundation

#### Design Phase (Days 1-2)

- [x] Define color palette (primary, secondary, accent, neutrals)
- [x] Choose typography system (fonts, sizes, weights, line heights)
- [x] Define spacing scale
- [x] Define border radius values (sharp vs. rounded aesthetic)
- [x] Define shadow/elevation system
- [x] Create component visual direction (modern, playful, minimal, etc.)
- [x] Create dark mode color strategy

#### Technical Setup (Days 3-5)

- [x] Create design token system based on new design
- [x] Create shared base styles
- [x] Set up component scaffolding structure
- [x] Document component API patterns
- [x] Create testing utilities for components
- [x] Set up Storybook configuration for custom components

**Deliverables**:

- [x] Design specification document - `meta/dark-mode-strategy.md`
- [x] Component reference - `meowzer/ui/components/mb-button/SCAFFOLD-REFERENCE.md`
- [x] `shared/design-tokens.ts` reflecting new design system (primitive/semantic layers)
- [x] `shared/base-styles.ts` with semantic token usage
- [x] `shared/global-tokens.css` for :root support
- [x] Component template/boilerplate - See `mb-button/` folder structure
- [x] Migration documentation - `meta/token-migration-map.md`
- [x] Implementation audit - `meta/token-implementation-audit.md`
- [x] Dark mode usage guide - `meta/dark-mode-usage.md`

**Reference Component Created**:

- `mb-button` - Complete with .ts, .style.ts, .test.ts, .stories.ts, README.md
- 16 passing tests
- 9 Storybook stories
- Full API documentation
- Accessibility features
- Dark mode support ready

---

### Phase 1: Simple Components (Week 1) ✅ **COMPLETE**

**Goal**: Replace simple, stateless components first

#### 1.1 Button Component ✅ **DONE**

**Priority**: 🔴 **CRITICAL** (used in 7 components, 20+ instances)

Replace: `<cds-button>` → `<mb-button>`

**Status**: ✅ Complete - 16 tests passing

**File**: `components/mb-button/mb-button.ts`

**Features**:

- Primary, secondary, tertiary variants
- Small, medium, large sizes
- Disabled state
- Icon support
- Loading state

**API**:

```typescript
<mb-button
  variant="primary|secondary|tertiary"
  size="sm|md|lg"
  ?disabled=${false}
  ?loading=${false}
>
  Button Text
</mb-button>
```

**Affected Components**:

- `mb-playground-toolbar` (7 buttons)
- `mb-cat-playground` (dialog actions)
- `cat-creator` (wizard navigation)
- `cat-personality-picker` (6 preset buttons)

---

#### 1.2 Loading Spinner ✅ **DONE**

**Priority**: 🟡 **MODERATE** (used in 2 components)

Replace: `<cds-loading>` → `<mb-loading>`

**Status**: ✅ Complete - 11 tests passing

**File**: `components/mb-loading/mb-loading.ts`

**Features**:

- Small, medium, large sizes
- Overlay mode
- Custom text

**API**:

```typescript
<mb-loading
  size="sm|md|lg"
  ?overlay=${false}
  text="Loading..."
></mb-loading>
```

**Affected Components**:

- `mb-cat-playground` (loading state)
- `cat-preview` (rendering state)

---

#### 1.3 Tag Component ✅ **DONE**

**Priority**: 🟢 **LOW** (used in Storybook only)

Replace: `<cds-tag>` → `<mb-tag>`

**Status**: ✅ Complete - 13 tests passing

**File**: `components/mb-tag/mb-tag.ts`

**Features**:

- Color variants
- Removable option
- Size variants

**API**:

```typescript
<mb-tag
  variant="gray|red|blue|green"
  ?removable=${false}
  @remove=${handleRemove}
>
  Tag Text
</mb-tag>
```

---

### Phase 2: Form Controls (Week 2)

**Goal**: Replace all form input components

**Status**: ✅ COMPLETE (5/5 components - 100%)

#### 2.1 Text Input ✅ **DONE**

**Priority**: 🔴 **CRITICAL** (used in forms)

Replace: `<cds-text-input>` → `<mb-text-input>`

**Status**: ✅ Complete - 28 tests passing

**File**: `components/mb-text-input/mb-text-input.ts`

**Features**:

- Label support
- Helper text
- Error state
- Disabled state
- Placeholder
- Value binding

**API**:

```typescript
<mb-text-input
  label="Cat Name"
  helper="Enter a unique name"
  placeholder="e.g., Whiskers"
  ?disabled=${false}
  ?error=${false}
  error-message="Name is required"
  .value=${catName}
  @input=${handleInput}
></mb-text-input>
```

**Affected Components**:

- `mb-cat-playground` (name input in dialogs)
- `cat-creator` → `basic-info-section` (cat name)

---

#### 2.2 Textarea ✅ **DONE**

**Priority**: 🟡 **MODERATE**

Replace: `<cds-textarea>` → `<mb-textarea>`

**Status**: ✅ Complete - 33 tests passing

**File**: `components/mb-textarea/mb-textarea.ts`

**Features**:

- Same as text input
- Resizable option
- Row count

**API**:

```typescript
<mb-textarea
  label="Description"
  rows="4"
  ?resizable=${true}
  .value=${description}
  @input=${handleInput}
></mb-textarea>
```

**Affected Components**:

- `cat-creator` → `basic-info-section` (cat description)

---

#### 2.3 Checkbox ✅ **DONE**

**Priority**: 🟡 **MODERATE**

Replace: `<cds-checkbox>` → `<mb-checkbox>`

**Status**: ✅ Complete - 27 tests passing

**File**: `components/mb-checkbox/mb-checkbox.ts`

**Features**:

- Default slot for label
- Checked state
- Disabled state
- Indeterminate state
- Helper text and error states
- Form integration (name, value, required)
- Custom events (mb-change)

**API**:

```typescript
<mb-checkbox
  ?checked=${isRandom}
  ?disabled=${false}
  ?indeterminate=${partial}
  helper="Additional information"
  error-message="Error text"
  ?error=${hasError}
  name="field-name"
  value="field-value"
  ?required=${true}
  @mb-change=${(e: CustomEvent) => {
    console.log(e.detail.checked, e.detail.value);
  }}
>
  Random cat
</mb-checkbox>
```

**Affected Components**:

- `cat-creator` (random generation options)

---

#### 2.4 Slider ✅ **DONE**

**Priority**: 🔴 **CRITICAL** (used in personality picker - 5 instances)

Replace: `<cds-slider>` → `<mb-slider>`

**Status**: ✅ Complete - 24 tests passing

**File**: `components/mb-slider/mb-slider.ts`

**Features**:

- Min/max values
- Step increment
- Current value display
- Label support
- Value binding

**API**:

```typescript
<mb-slider
  label="Curiosity"
  min="0"
  max="100"
  step="1"
  .value=${curiosity}
  @input=${handleSliderChange}
></mb-slider>
```

**Affected Components**:

- `cat-personality-picker` (5 trait sliders: curiosity, energy, playfulness, sociability, independence)

---

#### 2.5 Select Dropdown ✅ **DONE**

**Priority**: 🟢 **LOW** (registered but rarely used)

Replace: `<cds-select>` → `<mb-select>`

**Status**: ✅ Complete - 27 tests passing

**File**: `components/mb-select/mb-select.ts`

**Features**:

- Native select element with slotted options
- Label support with required indicator
- Helper text and error states
- Disabled state
- Value binding
- Size variants (sm, md, lg)
- Placeholder option
- Form integration (name, value, required)
- Custom events (mb-change)

**API**:

```typescript
<mb-select
  label="Pattern"
  .value=${pattern}
  helper="Choose a pattern"
  error-message="Error text"
  ?error=${hasError}
  ?disabled=${false}
  ?required=${true}
  size="md"
  placeholder="Select an option"
  name="field-name"
  @mb-change=${(e: CustomEvent) => {
    console.log(e.detail.value);
  }}
>
  <option value="solid">Solid</option>
  <option value="tabby">Tabby</option>
  <option value="spotted">Spotted</option>
</mb-select>
```

**Note**: Uses native `<option>` elements in default slot for maximum compatibility and accessibility.

---

### Phase 3: Complex Components (Week 3) - **1/3 COMPLETE** (33%)

**Goal**: Replace modal system and notifications

#### 3.1 Modal/Dialog System ✅ **DONE**

**Priority**: 🔴 **CRITICAL** (used in playground for all dialogs)

Replace: `<cds-modal>`, `<cds-modal-header>`, `<cds-modal-heading>`, `<cds-modal-body>`, `<cds-modal-footer>` → `<mb-modal>`

**Status**: ✅ Complete - 30 tests passing

**File**: `components/mb-modal/mb-modal.ts`

**Features**:

- Open/close state with `open` property
- Backdrop click to close (configurable via `closeOnBackdrop`)
- ESC key to close (configurable via `closeOnEscape`)
- Prevent body scroll when open
- Focus trap with Tab/Shift+Tab cycling
- Restore focus on close
- Header/body/footer slots
- Size variants (sm: 400px, md: 600px, lg: 900px)
- Close button (configurable via `showClose`)
- Smooth animations (backdrop fade-in, modal slide-in)
- Accessibility (role="dialog", aria-modal="true")

**API**:

```typescript
<mb-modal
  ?open=${isOpen}
  size="sm|md|lg"
  heading="Modal Title"
  ?showClose=${true}
  ?closeOnBackdrop=${true}
  ?closeOnEscape=${true}
  @mb-close=${handleClose}
>
  <p>Modal content goes here</p>

  <div slot="footer">
    <mb-button variant="secondary" @click=${handleCancel}>Cancel</mb-button>
    <mb-button variant="primary" @click=${handleConfirm}>Confirm</mb-button>
  </div>
</mb-modal>
```

**Properties**:

- `open: boolean` - Controls visibility (default: false)
- `size: "sm" | "md" | "lg"` - Size variant (default: "md")
- `heading: string` - Optional heading text
- `showClose: boolean` - Show close button (default: true)
- `closeOnBackdrop: boolean` - Close on backdrop click (default: true)
- `closeOnEscape: boolean` - Close on ESC key (default: true)

**Events**:

- `mb-close` - Fired when modal is closed

**Slots**:

- `header` - Custom header content (overrides `heading` property)
- (default) - Modal body content
- `footer` - Footer content (typically action buttons)

**CSS Parts**:

- `backdrop`, `modal`, `header`, `body`, `footer`

**Affected Components**:

- `mb-cat-playground` (create cat dialog, edit cat dialog, delete confirmation)
- `mb-wardrobe-dialog` (hat selection dialog)

**Implementation Notes**:

- Uses native focus trap implementation (no external dependencies)
- Tab key cycling through focusable elements
- Restores focus to previously focused element on close
- Prevents body scroll with `overflow: hidden`
- Backdrop with blur effect and fade-in animation
- Modal with slide-in animation from center

---

#### 3.2 Notification/Toast

**Priority**: 🟡 **MODERATE**

Replace: `<cds-inline-notification>`

**File**: `components/mb-notification/mb-notification.ts`

**Features**:

- Info, success, warning, error variants
- Inline or toast positioning
- Dismissable
- Auto-dismiss timeout
- Icon support

**API**:

```typescript
<mb-notification
  variant="info|success|warning|error"
  ?dismissable=${true}
  timeout="5000"
  @dismiss=${handleDismiss}
>
  <span slot="title">Success!</span>
  <span slot="message">Cat created successfully</span>
</mb-notification>
```

**Affected Components**:

- `cat-creator` (validation errors, success messages)

---

#### 3.3 Icon Component

**Priority**: 🟢 **LOW** (registered but minimal usage)

Replace: `<cds-icon>`

**File**: `components/mb-icon/mb-icon.ts`

**Options**:

1. Use SVG sprites
2. Use inline SVG with data
3. Use icon font (not recommended)
4. Keep using `@carbon/icons` package directly

**Recommended**: Create simple wrapper for SVG icons

**API**:

```typescript
<mb-icon name="add" size="16"></mb-icon>
```

---

### Phase 4: Specialized Components (Week 4)

**Goal**: Replace remaining components and Shoelace

#### 4.1 Color Picker (Replace Shoelace)

**Priority**: 🔴 **CRITICAL** (only Shoelace dependency)

Replace: `<sl-color-picker>`

**File**: `components/mb-color-picker/mb-color-picker.ts` (refactor existing)

**Options**:

1. **Native HTML5**: `<input type="color">` + custom UI overlay
2. **Custom Implementation**: Build from scratch with Lit
3. **Lightweight Library**: Use `vanilla-colorful` (13KB)

**Recommended**: Option 1 (Native + Custom UI)

**Features**:

- Hex color format
- Inline display mode
- Portal rendering (keep existing pattern)
- Color swatch preview
- Text input for hex value

**API** (keep existing):

```typescript
<mb-color-picker
  .value=${'#ff9500'}
  @color-change=${handleColorChange}
></mb-color-picker>
```

**Implementation**:

```typescript
// Use native input as data layer
private nativeInput: HTMLInputElement;

// Custom UI overlay for better visuals
render() {
  return html`
    <div class="color-picker">
      <button @click=${this.togglePicker}>
        <span class="swatch" style="background: ${this.value}"></span>
        <span class="value">${this.value}</span>
      </button>

      <input
        type="color"
        .value=${this.value}
        @input=${this.handleNativeInput}
        style="position: absolute; opacity: 0; pointer-events: none;"
      >

      ${this.showPicker ? this.renderPicker() : ''}
    </div>
  `;
}
```

---

#### 4.2 Tooltip (Optional)

**Priority**: 🟢 **LOW**

Replace: `<cds-tooltip>`

**File**: `components/mb-tooltip/mb-tooltip.ts`

**Features**:

- Hover trigger
- Position: top, bottom, left, right
- Delay

**API**:

```typescript
<mb-tooltip text="Helpful hint" position="top">
  <mb-button>Hover me</mb-button>
</mb-tooltip>
```

---

#### 4.3 Accordion (Optional)

**Priority**: 🟢 **LOW**

Replace: `<cds-accordion>`

**File**: `components/mb-accordion/mb-accordion.ts`

Can defer to Phase 5 or skip if not actively used.

---

#### 4.4 Popover (Optional)

**Priority**: 🟢 **LOW**

Replace: `<cds-popover>`

**File**: `components/mb-popover/mb-popover.ts`

Can defer to Phase 5 or skip if not actively used.

---

### Phase 5: Integration & Polish (Week 4)

**Goal**: Update all consuming components and clean up

#### 5.1 Update Component Imports

Search and replace throughout codebase:

```typescript
// Old
import "@carbon/web-components/es/components/button/index.js";

// New
import "../mb-button/mb-button.js";
```

Update all consuming components:

- `mb-playground-toolbar.ts`
- `mb-cat-playground.ts`
- `cat-creator.ts`
- `cat-personality-picker.ts`
- `cat-preview.ts`
- `basic-info-section.ts`

---

#### 5.2 Update Component Templates

Replace Carbon element tags with custom elements:

```typescript
// Old
html`<cds-button @click=${this.handleClick}>Click me</cds-button>`;

// New
html`<mb-button @click=${this.handleClick}>Click me</mb-button>`;
```

---

#### 5.3 Update Styles

Replace Carbon CSS tokens with custom tokens:

```typescript
// Old
import "@carbon/styles/css/styles.css";

const styles = css`
  .toolbar {
    background: var(--cds-layer-01);
    border-bottom: 1px solid var(--cds-border-subtle-01);
  }
`;

// New
import { tokens } from "../../shared/design-tokens.js";

const styles = css`
  .toolbar {
    background: ${tokens.layer01};
    border-bottom: 1px solid ${tokens.borderSubtle01};
  }
`;
```

---

#### 5.4 Remove Dependencies

Update `package.json`:

```diff
  "dependencies": {
-   "@carbon/styles": "^1.95.0",
    "@lit/context": "^1.1.0",
-   "@shoelace-style/shoelace": "^2.20.1",
    "gsap": "^3.13.0"
  },
  "peerDependencies": {
-   "@carbon/web-components": "^2.43.0",
    "lit": "^3.0.0",
    "meowzer": "^1.0.0"
  },
  "devDependencies": {
    "@carbon/icons": "^11.70.0",
-   "@carbon/web-components": "^2.43.0",
```

Keep `@carbon/icons` if using their icon set, or replace with custom icons.

---

#### 5.5 Update Setup Script

Clean up `scripts/setup.ts`:

```typescript
// Remove all Carbon imports
// Remove Shoelace imports

// Add custom component registrations if using global registration
export function setupMeowzerUI() {
  // Register custom elements if not using auto-registration
  // Set up theme detection
  // Initialize design tokens
}
```

---

#### 5.6 Update Storybook

Update `.storybook/preview.ts`:

```typescript
// Remove Carbon imports
// Import custom components instead

import "../components/mb-button/mb-button.js";
import "../components/mb-modal/mb-modal.js";
// etc.

// Apply custom theme
import { tokens } from "../shared/design-tokens.js";

const preview = {
  parameters: {
    // Update theme configuration
  },
};
```

---

## Implementation Details

### Component Scaffolding Reference

**📖 See**: [`meowzer/ui/components/mb-button/SCAFFOLD-REFERENCE.md`](../meowzer/ui/components/mb-button/SCAFFOLD-REFERENCE.md)

The `mb-button` component serves as the **complete reference implementation** for all Phase 1+ components. This reference document includes:

- ✅ **File Structure**: 4 required files + README pattern
- ✅ **Code Patterns**: Component structure, style organization, test patterns, Storybook patterns
- ✅ **Design Token Usage**: How to properly use semantic tokens
- ✅ **Accessibility Standards**: ARIA attributes, focus indicators, keyboard support
- ✅ **Documentation Templates**: README structure, API documentation format
- ✅ **Testing Approach**: Unit tests (Vitest) + Visual tests (Storybook)

**When creating new components**, use `mb-button` as your template:

1. Copy the folder structure
2. Reference the code patterns
3. Follow the testing approach
4. Match the documentation style

### Component Architecture Pattern

All custom components should follow this structure:

```
components/
  mb-[component-name]/
    mb-[component-name].ts          # Component logic
    mb-[component-name].style.ts    # Component styles
    mb-[component-name].test.ts     # Unit tests
    mb-[component-name].stories.ts  # Storybook stories
    README.md                        # Component documentation
```

### Component Template

```typescript
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { componentStyles } from "./mb-component.style.js";
import { baseStyles } from "../../shared/base-styles.js";

@customElement("mb-component")
export class MbComponent extends LitElement {
  static styles = [baseStyles, componentStyles];

  @property({ type: String })
  variant: "primary" | "secondary" = "primary";

  @property({ type: Boolean })
  disabled = false;

  @state()
  private internalState = false;

  private handleClick(e: Event) {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent("mb-click", {
        detail: {
          /* event data */
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <button
        class="mb-component mb-component--${this.variant}"
        ?disabled=${this.disabled}
        @click=${this.handleClick}
      >
        <slot></slot>
      </button>
    `;
  }
}
```

### Accessibility Checklist

Every component must:

- [ ] Support keyboard navigation (Tab, Enter, Space, Arrow keys as appropriate)
- [ ] Have proper ARIA attributes
- [ ] Have focus indicators
- [ ] Work with screen readers
- [ ] Have sufficient color contrast (WCAG AA minimum)
- [ ] Support high contrast mode
- [ ] Have semantic HTML structure

---

## Testing Strategy

### Unit Tests (Vitest)

Each component should have:

```typescript
import { fixture, expect } from "@open-wc/testing";
import "./mb-button.js";

describe("mb-button", () => {
  it("renders with default properties", async () => {
    const el = await fixture("<mb-button>Click me</mb-button>");
    expect(el.variant).to.equal("primary");
  });

  it("emits click event when clicked", async () => {
    const el = await fixture("<mb-button>Click me</mb-button>");
    let clicked = false;
    el.addEventListener("mb-click", () => {
      clicked = true;
    });

    el.shadowRoot.querySelector("button").click();
    expect(clicked).to.be.true;
  });

  it("does not emit click when disabled", async () => {
    const el = await fixture(
      "<mb-button disabled>Click me</mb-button>"
    );
    let clicked = false;
    el.addEventListener("mb-click", () => {
      clicked = true;
    });

    el.shadowRoot.querySelector("button").click();
    expect(clicked).to.be.false;
  });
});
```

### Visual Regression Tests (Storybook)

Use Storybook's visual testing:

```typescript
import type { Meta, StoryObj } from "@storybook/web-components";
import "./mb-button.js";

const meta: Meta = {
  title: "Components/Button",
  component: "mb-button",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
  render: (args) => html`
    <mb-button variant=${args.variant}>Primary Button</mb-button>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem;">
      <mb-button variant="primary">Primary</mb-button>
      <mb-button variant="secondary">Secondary</mb-button>
      <mb-button variant="tertiary">Tertiary</mb-button>
    </div>
  `,
};
```

### Integration Tests

Test components together in real usage scenarios:

```typescript
describe("cat-creator integration", () => {
  it("creates cat with valid form data", async () => {
    const el = await fixture("<cat-creator></cat-creator>");

    // Fill in text input
    const nameInput = el.shadowRoot.querySelector("mb-text-input");
    nameInput.value = "Whiskers";

    // Click button
    const createButton = el.shadowRoot.querySelector(
      'mb-button[variant="primary"]'
    );
    createButton.click();

    // Assert cat created
    expect(/* ... */).to.be.true;
  });
});
```

### Manual Testing Checklist

Before completing each phase:

- [ ] Test all variants of component
- [ ] Test disabled state
- [ ] Test error states
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Test dark mode
- [ ] Test responsive behavior
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge

---

## Risk Management

### High Risks

| Risk                                | Impact    | Probability | Mitigation                                          |
| ----------------------------------- | --------- | ----------- | --------------------------------------------------- |
| **Breaking existing functionality** | 🔴 High   | 🟡 Medium   | Comprehensive testing, incremental rollout          |
| **Accessibility regressions**       | 🔴 High   | 🟡 Medium   | Accessibility checklist, screen reader testing      |
| **Visual inconsistencies**          | 🟡 Medium | 🟡 Medium   | Visual regression tests, design review              |
| **Timeline overrun**                | 🟡 Medium | 🟡 Medium   | Prioritize critical components, defer optional ones |

### Medium Risks

| Risk                             | Impact    | Probability | Mitigation                       |
| -------------------------------- | --------- | ----------- | -------------------------------- |
| **Performance degradation**      | 🟡 Medium | 🟢 Low      | Performance testing, benchmarks  |
| **Browser compatibility issues** | 🟡 Medium | 🟢 Low      | Cross-browser testing            |
| **Component API changes needed** | 🟡 Medium | 🟡 Medium   | Maintain API compatibility layer |

### Mitigation Strategies

1. **Incremental Rollout**

   - Replace components one at a time
   - Keep both old and new running in parallel during transition
   - Use feature flags to toggle between implementations

2. **Comprehensive Testing**

   - Write tests before refactoring
   - Maintain high test coverage (>80%)
   - Manual testing checklist

3. **Documentation**

   - Document each component API
   - Create migration guide
   - Update Storybook stories

4. **Code Review**
   - Peer review all component implementations
   - Design review for visual consistency
   - Accessibility review

---

## Success Criteria

### Must Have

- [ ] All 17 Carbon components replaced with custom components
- [ ] Shoelace dependency removed
- [ ] **New design system implemented** (custom colors, typography, spacing)
- [ ] **Unique visual identity** (distinct from Carbon's IBM design language)
- [ ] All existing functionality preserved
- [ ] All tests passing
- [ ] Accessibility standards maintained (WCAG AA)
- [ ] Storybook updated with all new components
- [ ] Dependencies removed from package.json

### Should Have

- [ ] Improved bundle size (target: -200KB)
- [ ] **Cohesive visual design** across all components
- [ ] **Design documentation** (color palettes, usage guidelines)
- [ ] Component documentation complete
- [ ] Migration guide written
- [ ] Dark mode working correctly with new color palette
- [ ] All components have stories
- [ ] Test coverage >80%

### Nice to Have

- [ ] Performance improvements over Carbon
- [ ] Better TypeScript types
- [ ] Enhanced customization options
- [ ] Additional component variants
- [ ] **Smooth animations and transitions** (micro-interactions)
- [ ] **Playful/delightful UI touches** (if aligned with design direction)
- [ ] **Interactive component demos** in Storybook

---

## Timeline & Milestones

### Week 0 (Design & Preparation)

- **Days 1-2**: Design new visual identity
  - ✅ Color palette defined
  - ✅ Typography system chosen
  - ✅ Spacing and layout system defined
  - ✅ Component aesthetic direction established
- **Days 3-5**: Technical foundation setup
  - ✅ Design tokens created
  - ✅ Base styles created
  - ✅ Testing utilities set up
  - ✅ Component scaffolding ready

### Week 1 (Simple Components)

- **Day 1-2**: mb-button
  - ✅ Component implementation
  - ✅ Tests written
  - ✅ Storybook story created
- **Day 3**: mb-loading
- **Day 4**: mb-tag
- **Day 5**: Integration and testing

### Week 2 (Form Controls)

- **Day 1**: mb-text-input
- **Day 2**: mb-textarea
- **Day 3**: mb-checkbox
- **Day 4**: mb-slider (critical for personality picker)
- **Day 5**: mb-select + integration testing

### Week 3 (Complex Components)

- **Day 1-2**: mb-modal (most complex)
  - Dialog implementation
  - Focus trap
  - Backdrop handling
- **Day 3**: mb-notification
- **Day 4**: mb-icon
- **Day 5**: Integration and testing

### Week 4 (Specialized + Integration)

- **Day 1-2**: mb-color-picker (replace Shoelace)
- **Day 3**: Update all consuming components
- **Day 4**: Update styles and cleanup
- **Day 5**: Final testing and QA

---

## Post-Implementation Tasks

### Documentation

- [ ] Update README with new component usage
- [ ] Create migration guide for consumers
- [ ] Update API documentation
- [ ] Record video tutorials (optional)

### Communication

- [ ] Announce breaking changes
- [ ] Update changelog
- [ ] Create GitHub release
- [ ] Update demo applications

### Monitoring

- [ ] Monitor bundle size
- [ ] Track performance metrics
- [ ] Gather user feedback
- [ ] Address bug reports

---

## Rollback Plan

If critical issues arise:

1. **Immediate Rollback**

   - Revert to Carbon components via Git
   - Restore package.json dependencies
   - Redeploy previous version

2. **Partial Rollback**

   - Keep working custom components
   - Restore problematic components to Carbon
   - Fix issues incrementally

3. **Hybrid Approach**
   - Run both systems in parallel
   - Feature flag to toggle implementations
   - Gradual migration of users

---

## Decision Log

| Date       | Decision                                           | Rationale                                                                 |
| ---------- | -------------------------------------------------- | ------------------------------------------------------------------------- |
| 2025-11-26 | Remove Carbon Web Components                       | Reduce dependencies, create unique visual identity                        |
| 2025-11-26 | Remove Shoelace                                    | Only used for 1 component, easy to replace                                |
| 2025-11-26 | Build custom components with Lit                   | Maintain consistency with existing architecture                           |
| 2025-11-26 | **Design new UI/UX**                               | **Create distinctive brand identity, move away from IBM design language** |
| TBD        | Use native `<input type="color">` for color picker | Lightweight, native, progressive enhancement                              |
| TBD        | Color palette selection                            | TBD - pending design phase                                                |
| TBD        | Typography system                                  | TBD - pending design phase                                                |

---

## Resources

### Documentation

- [Lit Documentation](https://lit.dev/)
- [Web Components Best Practices](https://web.dev/custom-elements-best-practices/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Open WC Testing](https://open-wc.org/docs/testing/testing-package/)

### Design References

- [Material Design](https://m3.material.io/) (for UX patterns, not visual style)
- [Radix Primitives](https://www.radix-ui.com/) (for accessibility patterns)
- [Vercel Design](https://vercel.com/design) (for modern minimalism inspiration)
- [Stripe Design](https://stripe.com/design) (for clean, professional aesthetics)
- [Linear](https://linear.app/) (for polished UI inspiration)
- [Tailwind UI](https://tailwindui.com/) (for component patterns)
- [Refactoring UI](https://www.refactoringui.com/) (for design principles)

### Tools

- Lit Element - Component framework
- Vitest - Unit testing
- Storybook - Component development and documentation
- Open WC Testing - Web component testing utilities

---

## Questions & Open Issues

### Design Questions

- [ ] What's the target aesthetic? (modern, playful, minimal, professional, etc.)
- [ ] Color palette inspiration? (vibrant, muted, monochrome, etc.)
- [ ] Typography direction? (system fonts vs. custom fonts)
- [ ] Border radius preference? (sharp/boxy vs. rounded/soft)
- [ ] Animation philosophy? (subtle vs. expressive)

### Technical Questions

- [ ] Should we keep `@carbon/icons` or create custom icon system?
- [ ] What's the target bundle size reduction?
- [ ] Do we need to support legacy browsers?
- [ ] Should components be published as separate package?
- [ ] Dark mode: CSS classes or CSS custom properties?

---

**Last Updated**: November 26, 2025  
**Next Review**: TBD  
**Owner**: TBD
