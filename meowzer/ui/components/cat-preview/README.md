# Cat Preview

Live preview component showing a visual representation of a cat being created or customized.

## Features

- **Dual Preview Modes** - Simplified CSS-based preview or full ProtoCat SVG rendering
- **Real-time Updates** - Updates automatically as settings change
- **Pattern Support** - Displays 5 different fur patterns (solid, tabby, spotted, calico, tuxedo)
- **Validation Feedback** - Shows error states when validation fails
- **Loading State** - Displays loading indicator when waiting for data
- **Settings Summary** - Shows current pattern, size, and fur length
- **Auto-build Option** - Can automatically build ProtoCat from settings

## Usage

### Basic Usage (Simplified Preview)

```html
<cat-preview .settings="${catSettings}" .validationErrors="${errors}">
</cat-preview>
```

### With ProtoCat (SVG Preview)

```html
<cat-preview .protoCat="${protoCat}"> </cat-preview>
```

### With Auto-build

```html
<cat-preview .settings="${catSettings}" .autoBuild="${true}">
</cat-preview>
```

## API

### Properties

| Property           | Type                   | Default     | Description                                          |
| ------------------ | ---------------------- | ----------- | ---------------------------------------------------- |
| `settings`         | `Partial<CatSettings>` | `undefined` | Cat settings for simplified CSS-based preview        |
| `protoCat`         | `ProtoCat`             | `undefined` | Full ProtoCat object for accurate SVG preview        |
| `validationErrors` | `string[]`             | `[]`        | Array of validation error messages to display        |
| `autoBuild`        | `boolean`              | `false`     | Auto-build ProtoCat from settings using MeowzerUtils |

### Events

This component does not emit any custom events.

## Preview Modes

The component supports three rendering modes, prioritized in this order:

### 1. ProtoCat Preview (Highest Priority)

When a `protoCat` object is provided, renders the actual SVG sprite:

```typescript
el.protoCat = {
  seed: "abc123",
  dimensions: {
    scale: 1,
    size: "medium",
  },
  appearance: {
    pattern: "tabby",
  },
  spriteData: {
    svg: "<svg>...</svg>",
  },
};
```

Displays:

- Full SVG rendering
- Seed information
- Size information
- Pattern information

### 2. Simplified Preview (Medium Priority)

When only `settings` are provided, renders a CSS-based visual representation:

```typescript
el.settings = {
  color: "#FF6B35",
  eyeColor: "#4ECDC4",
  pattern: "tabby",
  size: "medium",
  furLength: "short",
};
```

Displays:

- CSS-drawn cat (ears, body, eyes)
- Pattern overlay
- Color customization
- Settings summary panel
- "Live Preview" label

### 3. Error State

When `validationErrors` are present (and no ProtoCat), shows error messages:

```typescript
el.validationErrors = ["Name is required", "Invalid color format"];
```

### 4. Empty/Loading State (Lowest Priority)

When no settings or ProtoCat are provided, shows loading state:

- Loading spinner (mb-loading component)
- "Waiting for settings..." message

## Supported Patterns

The simplified preview supports 5 fur patterns:

| Pattern     | Visual Effect                         |
| ----------- | ------------------------------------- |
| **Solid**   | No pattern overlay                    |
| **Tabby**   | Repeating vertical stripes            |
| **Spotted** | Circular spots of varying sizes       |
| **Calico**  | Orange and dark gray patches          |
| **Tuxedo**  | White chest/belly area with dark body |

## Default Values

When settings properties are undefined, the following defaults are used:

| Property    | Default   |
| ----------- | --------- |
| `color`     | `#FF6B35` |
| `eyeColor`  | `#4ECDC4` |
| `pattern`   | `solid`   |
| `size`      | `medium`  |
| `furLength` | `short`   |

## Priority System

The component renders in this priority order:

1. **ProtoCat** - If provided, always renders SVG preview
2. **Build Error** - If auto-build fails, shows error
3. **Validation Errors** - If present, shows error state
4. **Settings** - If provided, shows simplified preview
5. **Empty** - If nothing provided, shows loading state

This means:

- ProtoCat takes precedence over everything
- Validation errors override simplified preview
- Settings are only shown if no errors and no ProtoCat

## Auto-build Feature

When `autoBuild` is `true`, the component will automatically call `MeowzerUtils.buildPreview()` to generate a ProtoCat from settings:

```typescript
el.autoBuild = true;
el.settings = {
  color: "#FF6B35",
  pattern: "tabby",
  size: "medium",
};
// Component automatically builds ProtoCat internally
```

If the build fails, an error message is displayed.

## Integration with Cat Creator

The component is designed to be used within the cat creator workflow:

```html
<cat-preview
  .settings="${this.currentSettings}"
  .validationErrors="${this.validationErrors}"
>
</cat-preview>
```

As the user adjusts settings in the creator, the preview updates in real-time.

## Dependencies

### Required Components

- `mb-loading` - Loading state display

### Required Packages

- `meowzer` - For `CatSettings`, `ProtoCat` types and `MeowzerUtils`
- `lit` - Component framework

## Design Tokens Used

### Layout

- `--cds-spacing-05` - Internal spacing
- `--cds-spacing-07` - Component padding

### Typography

- `--cds-body-01` - Settings summary text
- `--cds-code-01` - Seed display

### Colors

- `--cds-background` - Container background
- `--cds-layer-01` - Preview background
- `--cds-text-primary` - Main text
- `--cds-text-secondary` - Labels
- `--cds-danger` - Error text
- CSS variables:
  - `--preview-fur-color` - Dynamically set fur color
  - `--preview-eye-color` - Dynamically set eye color
  - `--preview-pattern` - Dynamically set pattern gradient

## Examples

### In Cat Creator

```typescript
import { html, LitElement } from "lit";
import "@meowzer/ui/components/cat-preview/cat-preview.js";

class CatCreator extends LitElement {
  settings = {
    color: "#FF6B35",
    pattern: "tabby",
  };

  render() {
    return html`
      <div class="creator">
        <div class="settings-panel">
          <!-- Settings controls -->
        </div>
        <div class="preview-panel">
          <cat-preview .settings=${this.settings}></cat-preview>
        </div>
      </div>
    `;
  }
}
```

### With Validation

```typescript
class MyComponent extends LitElement {
  settings = {
    /* ... */
  };
  errors: string[] = [];

  validate() {
    this.errors = [];
    if (!this.settings.color) {
      this.errors.push("Color is required");
    }
    // ... more validation
  }

  render() {
    return html`
      <cat-preview
        .settings=${this.settings}
        .validationErrors=${this.errors}
      >
      </cat-preview>
    `;
  }
}
```

### With ProtoCat

```typescript
import { MeowzerUtils } from "meowzer";

class MyComponent extends LitElement {
  protoCat = MeowzerUtils.buildPreview({
    color: "#FF6B35",
    pattern: "spotted",
    size: "large",
  });

  render() {
    return html`
      <cat-preview .protoCat=${this.protoCat}></cat-preview>
    `;
  }
}
```

### Switching Between Modes

```typescript
class MyComponent extends LitElement {
  useProtoCat = false;
  settings = { color: "#FF6B35" };
  protoCat = {
    /* ... */
  };

  render() {
    return html`
      <button @click=${() => (this.useProtoCat = !this.useProtoCat)}>
        Toggle Preview Mode
      </button>

      <cat-preview
        .settings=${this.useProtoCat ? undefined : this.settings}
        .protoCat=${this.useProtoCat ? this.protoCat : undefined}
      >
      </cat-preview>
    `;
  }
}
```

## Accessibility

- Semantic HTML structure for screen readers
- Error messages clearly labeled
- Loading state announced via mb-loading component
- Visual information supplemented with text (seed, size, pattern)
- Color contrast meets WCAG guidelines
- No interactive elements (display-only component)

## Performance

- Lightweight CSS-based preview for simple cases
- Only builds ProtoCat when `autoBuild` is enabled
- Updates efficiently using Lit's reactive properties
- Pattern gradients are CSS-only (no canvas/SVG overhead for simplified mode)
