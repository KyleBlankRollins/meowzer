# mb-button Reference Component - Complete

**Status**: ✅ Complete  
**Date**: Phase 0 - Component Scaffolding  
**Purpose**: Reference component pattern for all Phase 1 components

## What Was Created

### File Structure

```
meowzer/ui/components/mb-button/
├── mb-button.ts           # Component logic (95 lines)
├── mb-button.style.ts     # Component styles (130+ lines)
├── mb-button.test.ts      # Unit tests (16 tests, all passing)
├── mb-button.stories.ts   # Storybook documentation (9 stories)
└── README.md              # API documentation
```

### Component Features

**Variants**: 3

- Primary (brand color)
- Secondary (subtle with border)
- Tertiary (transparent/minimal)

**Sizes**: 3

- Small (sm)
- Medium (md)
- Large (lg)

**States**: 4

- Default
- Hover
- Disabled
- Loading (with spinner animation)

**Slots**: 2

- Default (button text)
- Icon (leading icon)

**Events**: 1

- `mb-click` - Custom event with originalEvent detail

**CSS Parts**: 1

- `button` - Exposes native button for external styling

### Design Token Usage

This component demonstrates proper usage of the new design token system:

#### Colors

- `--mb-color-brand-primary`
- `--mb-color-text-on-brand`
- `--mb-color-surface-subtle`
- `--mb-color-interactive-default`
- `--mb-color-interactive-hover`
- `--mb-color-text-primary`
- `--mb-color-text-secondary`
- `--mb-color-border-default`

#### Spacing

- `--mb-space-xs` through `--mb-space-lg`

#### Typography

- `--mb-font-size-small`, `--mb-font-size-base`, `--mb-font-size-large`
- `--mb-font-weight-medium`

#### Other

- `--mb-radius-medium`
- `--mb-shadow-small`

### Code Patterns Established

#### 1. Component Structure

```typescript
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../../shared/base-styles.js";
import { mbButtonStyles } from "./mb-button.style.js";

@customElement("mb-button")
export class MbButton extends LitElement {
  @property({ type: String }) declare variant:
    | "primary"
    | "secondary"
    | "tertiary";
  @property({ type: String }) declare size: "sm" | "md" | "lg";
  @property({ type: Boolean }) declare disabled: boolean;
  @property({ type: Boolean }) declare loading: boolean;

  static styles = [baseStyles, mbButtonStyles];

  render() {
    /* ... */
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-button": MbButton;
  }
}
```

#### 2. Style Organization

```typescript
import { css } from "lit";

export const mbButtonStyles = css`
  /* Base styles */
  .mb-button {
    /* ... */
  }

  /* Variants */
  .mb-button--primary {
    /* ... */
  }
  .mb-button--secondary {
    /* ... */
  }
  .mb-button--tertiary {
    /* ... */
  }

  /* Sizes */
  .mb-button--sm {
    /* ... */
  }
  .mb-button--md {
    /* ... */
  }
  .mb-button--lg {
    /* ... */
  }

  /* States */
  .mb-button:hover {
    /* ... */
  }
  .mb-button:active {
    /* ... */
  }
  .mb-button[disabled] {
    /* ... */
  }
  .mb-button--loading {
    /* ... */
  }
`;
```

#### 3. Test Pattern

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbButton } from "./mb-button.js";

describe("MbButton", () => {
  let el: MbButton;

  beforeEach(() => {
    el = document.createElement("mb-button") as MbButton;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-button")).toBe(MbButton);
  });

  // More tests...
});
```

#### 4. Storybook Pattern

```typescript
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-button.js";

const meta = {
  title: "Components/Button",
  component: "mb-button",
  tags: ["autodocs"],
  argTypes: {
    /* ... */
  },
  parameters: {
    /* ... */
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: { variant: "primary", size: "md" },
  render: (args) => html`<mb-button ...>${args.text}</mb-button>`,
};
```

### Accessibility Features

- ✅ Proper ARIA attributes (`aria-busy` when loading)
- ✅ Disabled state prevents all interaction
- ✅ Focus-visible indicator for keyboard navigation
- ✅ Semantic HTML (native `<button>` element)
- ✅ Custom events bubble and compose through shadow DOM
- ✅ Screen reader friendly (proper button semantics)

### Testing Results

```
✓ 16 tests passing
  ✓ Custom element registration
  ✓ Instance creation
  ✓ Default property values
  ✓ Variant class application
  ✓ Size class application
  ✓ Loading state
  ✓ Event emission
  ✓ Disabled event blocking
  ✓ Loading event blocking
  ✓ Disabled attribute
  ✓ ARIA attributes
  ✓ Button type
  ✓ CSS parts exposure
  ✓ Icon slot support
```

### Exports

Added to `meowzer/ui/components/index.ts`:

```typescript
export { MbButton } from "./mb-button/mb-button.js";
```

Added to `meowzer/ui/index.ts`:

```typescript
export { MbButton } from "./components/index.js";
```

## How to Use This Reference

### For Phase 1 Component Development

When creating new Phase 1 components (Input, Textarea, Checkbox, etc.), use mb-button as a reference:

1. **File Structure**: Copy the folder structure (4 required files + README)

   - `component-name.ts`
   - `component-name.style.ts`
   - `component-name.test.ts`
   - `component-name.stories.ts`
   - `README.md`

2. **Code Patterns**: Reference the code organization

   - How to structure the component class
   - How to organize styles (base → variants → sizes → states)
   - How to write comprehensive tests
   - How to create Storybook stories

3. **Design Token Usage**: Follow the token patterns

   - Use semantic tokens (not primitives)
   - Consistent naming patterns
   - Proper fallback values (none needed!)

4. **Accessibility**: Match the accessibility standards

   - ARIA attributes
   - Focus indicators
   - Keyboard support
   - Semantic HTML

5. **Documentation**: Follow the README structure
   - Features list
   - Usage examples
   - API documentation (props, slots, events, parts)
   - Design token list
   - Accessibility notes

### Visual & Interactive Testing (Storybook)

Run Storybook to see component documentation and test visually:

```bash
npm run storybook
```

Navigate to "Components/Button" to see all stories, which include:

1. All variants render correctly
2. All sizes render correctly
3. Hover/active states work
4. Disabled state prevents clicks
5. Loading state prevents clicks and shows spinner
6. Icons render in slot
7. Events fire correctly (check Actions panel)
8. Dark mode support (if implemented)

**Note**: Storybook replaces the need for standalone test.html files. All visual testing should be done through stories.

## Phase 0 Completion

This completes the **"Set up component scaffolding structure"** task from Phase 0:

✅ Reference component created (mb-button)  
✅ File structure established  
✅ Code patterns documented  
✅ Design token usage demonstrated  
✅ Testing patterns established  
✅ Storybook patterns established  
✅ Documentation patterns established  
✅ Accessibility standards set

## Next Steps

**Phase 1 - Core Components**

Now that the reference is complete, proceed with Phase 1 components using this pattern:

1. **mb-input** - Text input field
2. **mb-textarea** - Multi-line text input
3. **mb-checkbox** - Checkbox with label
4. **mb-radio** - Radio button group
5. **mb-select** - Dropdown select
6. **mb-toggle** - Toggle switch
7. **mb-card** - Card container
8. **mb-dialog** - Modal dialog

Each component should:

- Follow the mb-button file structure
- Use semantic design tokens
- Include comprehensive tests
- Have Storybook documentation
- Meet accessibility standards
- Export from components/index.ts

**Carbon Removal**

Before starting Phase 1, consider removing Carbon:

- [ ] Remove Carbon CSS from `demo/src/layouts/Layout.astro`
- [ ] Remove Carbon imports from `.storybook/preview.ts`
- [ ] Update `scripts/setup.ts` to remove Carbon component imports
- [ ] Add `global-tokens.css` to demo and Storybook

This ensures Phase 1 components are tested in a pure Meowzer environment.
