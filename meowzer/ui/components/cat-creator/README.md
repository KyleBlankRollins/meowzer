# cat-creator

A multi-step wizard component for creating customized cats with live preview.

## Features

- **4-Step Wizard**: Basic info → Appearance → Personality → Behavior
- **Live Preview**: Real-time cat preview with custom settings
- **Validation**: Step-by-step form validation with error messages
- **Custom Settings**: Color, pattern, size, fur length, eye color customization
- **Personality Presets**: Balanced, playful, lazy, curious, independent
- **Roaming Option**: Option to spawn cat as roaming viewport element
- **Reset Functionality**: Clear all form data and start over
- **Context Integration**: Requires MeowzerProvider for SDK access

## Usage

### Basic Usage

```html
<meowzer-provider auto-init>
  <cat-creator></cat-creator>
</meowzer-provider>
```

### In a Dialog/Modal

```html
<mb-modal ?open="${showCreator}" @mb-close="${handleClose}">
  <cat-creator @cat-created="${handleCatCreated}"></cat-creator>
</mb-modal>
```

### Listening to Events

```typescript
const creator = document.querySelector("cat-creator");

creator.addEventListener("cat-created", (e) => {
  console.log("Cat created:", e.detail.cat);
  // Close dialog, show success message, etc.
});

creator.addEventListener("cat-creation-error", (e) => {
  console.error("Error creating cat:", e.detail.error);
});
```

## API

### Properties

This component uses internal state and does not expose public properties. All configuration is done through the wizard UI.

### Events

| Event                | Detail                | Description                              |
| -------------------- | --------------------- | ---------------------------------------- |
| `cat-created`        | `{ cat: MeowzerCat }` | Fired when a cat is successfully created |
| `cat-creation-error` | `{ error: Error }`    | Fired when cat creation fails            |

### Slots

This component does not use slots.

### CSS Parts

This component does not expose CSS parts. Style customization should be done via CSS custom properties.

## Wizard Steps

### Step 1: Basic Info

- **Cat Name** (required) - Text input for cat's name
- **Description** (optional) - Textarea for cat description
- **Validation**: Name cannot be empty, max 50 characters

**Components Used**: `basic-info-section` (internal partial)

### Step 2: Appearance & Size

- **Fur Color** - Color picker for main body color
- **Eye Color** - Color picker for eye color
- **Pattern** - Select from solid, tabby, spotted, calico
- **Size** - Select from small, medium, large
- **Fur Length** - Select from short, medium, long

**Components Used**: `appearance-section` (internal partial)

### Step 3: Personality

- **Personality Presets** - Choose from preset personalities:
  - Balanced - Well-rounded traits
  - Playful - High energy and playfulness
  - Lazy - Low energy, loves sleeping
  - Curious - High curiosity, loves exploring
  - Independent - Prefers solitude
- **Custom Traits** - Fine-tune individual traits:
  - Curiosity (0-1)
  - Playfulness (0-1)
  - Independence (0-1)
  - Sociability (0-1)
  - Energy (0-1)

**Components Used**: `cat-personality-picker`

### Step 4: Behavior Options

- **Make cat roam the viewport** - Checkbox to spawn cat as roaming element
  - When enabled: Cat is added to document.body as a fixed-position element
  - When disabled: Cat is created but not automatically added to DOM

## Preview Panel

The left panel shows a live preview of the cat being created:

- Updates in real-time as settings change
- Uses `cat-preview` component with `autoBuild` enabled
- Shows cat with current color, pattern, and size settings
- **Reset Button** - Clears all form data and returns to step 1

## Internal Components

### basic-info-section

Internal partial component for name and description inputs.

**Events**: `basic-info-change` - Emits `{ name, description }`

### appearance-section

Internal partial component for appearance and size customization.

**Events**: `appearance-change` - Emits full settings object

## Form Validation

### Step 1 Validation

- Name is required
- Name must be 1-50 characters
- Description is optional, max 500 characters

### Step 2-3 Validation

- All appearance settings have defaults, no validation needed
- Personality always has a default preset

### Step 4 Validation

- No validation, behavior options are optional

## Error Handling

### Validation Errors

Shown as inline notifications above the form:

```html
<mb-notification variant="error" title="Please fix the following:">
  Name is required
</mb-notification>
```

### Creation Errors

Shown as info notification at the top of the component:

```html
<mb-notification variant="info" title="Error creating cat">
</mb-notification>
```

### No SDK Error

Shown when component is not wrapped in `<meowzer-provider>`:

```html
<mb-notification variant="error" title="No Meowzer SDK">
  Please wrap this component in a &lt;meowzer-provider&gt;.
</mb-notification>
```

## Examples

### Standalone Usage

```html
<meowzer-provider auto-init>
  <cat-creator></cat-creator>
</meowzer-provider>

<script type="module">
  const creator = document.querySelector("cat-creator");

  creator.addEventListener("cat-created", (e) => {
    alert(`Created cat: ${e.detail.cat.name}`);
  });
</script>
```

### In a Modal Dialog

```typescript
import { html } from "lit";

render() {
  return html`
    <mb-button @click=${() => this.showCreator = true}>
      Create New Cat
    </mb-button>

    <mb-modal
      ?open=${this.showCreator}
      heading="Create a Cat"
      size="lg"
      @mb-close=${() => this.showCreator = false}
    >
      <cat-creator
        @cat-created=${this.handleCatCreated}
      ></cat-creator>
    </mb-modal>
  `;
}

private handleCatCreated(e: CustomEvent) {
  const cat = e.detail.cat;
  console.log("Cat created:", cat.name);
  this.showCreator = false;
}
```

### Custom Event Handling

```typescript
const creator = document.querySelector("cat-creator");

// Success handler
creator.addEventListener("cat-created", (e) => {
  const cat = e.detail.cat;

  // Show success message
  showNotification(`${cat.name} has been created!`, "success");

  // Add to cat list
  updateCatList(cat);

  // Close dialog
  closeCreatorDialog();
});

// Error handler
creator.addEventListener("cat-creation-error", (e) => {
  const error = e.detail.error;

  // Show error message
  showNotification(`Failed to create cat: ${error.message}`, "error");

  // Log for debugging
  console.error("Cat creation error:", error);
});
```

## Dependencies

**Required Components**:

- `mb-button` - Navigation and action buttons
- `mb-notification` - Error and info messages
- `mb-checkbox` - Roaming option
- `cat-preview` - Live cat preview
- `cat-personality-picker` - Personality selection
- `basic-info-section` (internal) - Name and description inputs
- `appearance-section` (internal) - Appearance customization

**Required Context**:

- `meowzer-provider` - Provides Meowzer SDK instance

## Design Tokens Used

### Layout

- `--mb-space-md` - Panel padding
- `--mb-space-lg` - Section spacing

### Typography

- `--mb-font-size-base` - Form labels
- `--mb-font-size-large` - Section headings

### Colors

- `--mb-color-surface-default` - Panel backgrounds
- `--mb-color-border-default` - Panel borders
- `--mb-color-text-primary` - Form labels

## Accessibility

- ✅ Proper form semantics with labels
- ✅ Keyboard navigation through wizard steps
- ✅ Error messages announced to screen readers
- ✅ Focus management on step changes
- ✅ All interactive elements are keyboard accessible
- ✅ Clear visual step indicators

## Browser Support

- Modern browsers with Web Components support
- Shadow DOM v1
- CSS Custom Properties
- ES Modules

## Related Components

- `mb-cat-playground` - Uses cat-creator for in-playground cat creation
- `cat-preview` - Provides live preview functionality
- `cat-personality-picker` - Standalone personality picker
- `mb-modal` - Common wrapper for cat-creator
