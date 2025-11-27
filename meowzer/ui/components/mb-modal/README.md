# mb-modal

A flexible modal dialog component with focus trap, keyboard navigation, and customizable behavior.

## Installation

```typescript
import "@meowzer/ui/components/mb-modal/mb-modal.js";
```

## Usage

### Basic Modal

```html
<mb-modal open heading="Modal Title">
  <p>Modal content goes here.</p>
  <div slot="footer">
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
</mb-modal>
```

### With Custom Header

```html
<mb-modal open>
  <div slot="header">
    <h2>Custom Header Content</h2>
  </div>
  <p>Modal body content.</p>
</mb-modal>
```

### Size Variants

```html
<!-- Small modal (400px) -->
<mb-modal open size="sm" heading="Small Modal">
  <p>Content...</p>
</mb-modal>

<!-- Medium modal (600px, default) -->
<mb-modal open size="md" heading="Medium Modal">
  <p>Content...</p>
</mb-modal>

<!-- Large modal (900px) -->
<mb-modal open size="lg" heading="Large Modal">
  <p>Content...</p>
</mb-modal>
```

### Confirmation Dialog

```html
<mb-modal open size="sm" heading="Confirm Action">
  <p>Are you sure you want to proceed?</p>
  <div slot="footer">
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
</mb-modal>
```

### Programmatic Control

```typescript
const modal = document.querySelector("mb-modal");

// Open modal
modal.open = true;

// Close modal
modal.close();

// Listen for close event
modal.addEventListener("mb-close", () => {
  console.log("Modal closed");
  modal.open = false;
});
```

## API

### Properties

| Property          | Type                   | Default | Description                                    |
| ----------------- | ---------------------- | ------- | ---------------------------------------------- |
| `open`            | `boolean`              | `false` | Whether the modal is visible                   |
| `size`            | `"sm" \| "md" \| "lg"` | `"md"`  | Size variant of the modal                      |
| `heading`         | `string`               | `""`    | Heading text (alternative to header slot)      |
| `showClose`       | `boolean`              | `true`  | Whether to show the close button               |
| `closeOnBackdrop` | `boolean`              | `true`  | Whether clicking the backdrop closes the modal |
| `closeOnEscape`   | `boolean`              | `true`  | Whether pressing Escape closes the modal       |

### Methods

| Method    | Description                                     |
| --------- | ----------------------------------------------- |
| `close()` | Closes the modal and emits the `mb-close` event |

### Events

| Event      | Description                                                                |
| ---------- | -------------------------------------------------------------------------- |
| `mb-close` | Fired when the modal is closed (via close button, backdrop, or Escape key) |

### Slots

| Slot      | Description                                          |
| --------- | ---------------------------------------------------- |
| `header`  | Custom header content (overrides `heading` property) |
| (default) | Modal body content                                   |
| `footer`  | Footer content (typically action buttons)            |

### CSS Parts

| Part       | Description                |
| ---------- | -------------------------- |
| `backdrop` | The modal backdrop overlay |
| `modal`    | The modal container        |
| `header`   | The modal header section   |
| `body`     | The modal body section     |
| `footer`   | The modal footer section   |

## Features

### Focus Management

- Automatically focuses the first focusable element when opened
- Traps focus within the modal (Tab/Shift+Tab cycle through focusable elements)
- Restores focus to the previously focused element when closed

### Keyboard Navigation

- **Escape**: Closes the modal (when `closeOnEscape` is true)
- **Tab**: Moves focus to the next focusable element
- **Shift+Tab**: Moves focus to the previous focusable element

### Accessibility

- Uses native dialog role (`role="dialog"`)
- Sets `aria-modal="true"` to indicate modal behavior
- Prevents body scroll when open
- Includes accessible labels for interactive elements

### Animations

- Backdrop fades in (0.2s)
- Modal slides in from center (0.3s)
- Smooth transitions for opening and closing

## Migration from Carbon

If you're migrating from `cds-modal`, here are the key differences:

### API Changes

| Carbon                | mb-modal                                     |
| --------------------- | -------------------------------------------- |
| `<cds-modal>`         | `<mb-modal>`                                 |
| `<cds-modal-header>`  | `<div slot="header">` or `heading` property  |
| `<cds-modal-heading>` | Use `heading` property or custom header slot |
| `<cds-modal-body>`    | Default slot (no wrapper needed)             |
| `<cds-modal-footer>`  | `<div slot="footer">`                        |
| `@cds-modal-closed`   | `@mb-close`                                  |

### Before (Carbon)

```html
<cds-modal open @cds-modal-closed="${handleClose}">
  <cds-modal-header>
    <cds-modal-heading>Modal Title</cds-modal-heading>
  </cds-modal-header>
  <cds-modal-body>
    <p>Content</p>
  </cds-modal-body>
  <cds-modal-footer>
    <button>Cancel</button>
    <button>Confirm</button>
  </cds-modal-footer>
</cds-modal>
```

### After (mb-modal)

```html
<mb-modal open heading="Modal Title" @mb-close="${handleClose}">
  <p>Content</p>
  <div slot="footer">
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
</mb-modal>
```

## Examples

### Rename Dialog

```html
<mb-modal
  ?open="${this.showRenameDialog}"
  heading="Rename Cat"
  @mb-close="${this.handleRenameCancel}"
>
  <mb-text-input
    label="Cat Name"
    .value="${this.catName}"
    @mb-input="${this.handleNameInput}"
  ></mb-text-input>

  <div slot="footer">
    <mb-button
      variant="secondary"
      @click="${this.handleRenameCancel}"
    >
      Cancel
    </mb-button>
    <mb-button variant="primary" @click="${this.handleRenameSubmit}">
      Rename
    </mb-button>
  </div>
</mb-modal>
```

### Confirmation Dialog

```html
<mb-modal
  ?open="${this.showDeleteDialog}"
  size="sm"
  heading="Confirm Delete"
  @mb-close="${this.handleCancelDelete}"
>
  <p>
    Are you sure you want to delete this item? This action cannot be
    undone.
  </p>

  <div slot="footer">
    <mb-button
      variant="secondary"
      @click="${this.handleCancelDelete}"
    >
      Cancel
    </mb-button>
    <mb-button variant="danger" @click="${this.handleConfirmDelete}">
      Delete
    </mb-button>
  </div>
</mb-modal>
```

### Form Modal

```html
<mb-modal
  ?open="${this.showFormModal}"
  heading="Edit Settings"
  @mb-close="${this.handleFormCancel}"
>
  <form @submit="${this.handleFormSubmit}">
    <mb-text-input
      label="Username"
      .value="${this.username}"
      required
    ></mb-text-input>

    <mb-text-input
      label="Email"
      type="email"
      .value="${this.email}"
      required
    ></mb-text-input>

    <mb-textarea label="Bio" .value="${this.bio}"></mb-textarea>
  </form>

  <div slot="footer">
    <mb-button variant="secondary" @click="${this.handleFormCancel}">
      Cancel
    </mb-button>
    <mb-button variant="primary" @click="${this.handleFormSubmit}">
      Save Changes
    </mb-button>
  </div>
</mb-modal>
```
