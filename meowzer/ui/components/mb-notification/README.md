# mb-notification

A flexible notification component for displaying alerts, messages, and feedback to users.

## Installation

```typescript
import "@meowzer/ui/components/mb-notification/mb-notification.js";
```

## Usage

### Basic Notification

```html
<mb-notification
  variant="info"
  title="Information"
  subtitle="This is an informational message."
>
</mb-notification>
```

### Variants

```html
<!-- Info notification -->
<mb-notification
  variant="info"
  title="Information"
  subtitle="Here's some helpful information."
>
</mb-notification>

<!-- Success notification -->
<mb-notification
  variant="success"
  title="Success!"
  subtitle="Your changes have been saved."
>
</mb-notification>

<!-- Warning notification -->
<mb-notification
  variant="warning"
  title="Warning"
  subtitle="Please review your settings."
>
</mb-notification>

<!-- Error notification -->
<mb-notification
  variant="error"
  title="Error"
  subtitle="Something went wrong."
>
</mb-notification>
```

### With Slot Content

```html
<mb-notification variant="error" title="Please fix the following:">
  <ul>
    <li>Name is required</li>
    <li>Email must be valid</li>
    <li>Password must be at least 8 characters</li>
  </ul>
</mb-notification>
```

### Low Contrast

```html
<mb-notification
  variant="info"
  title="Low Contrast"
  subtitle="Uses neutral background instead of colored."
  low-contrast
>
</mb-notification>
```

### Toast Positioning

```html
<!-- Top-right toast -->
<mb-notification
  variant="success"
  title="Saved!"
  toast
  position="top-right"
>
</mb-notification>

<!-- Bottom-center toast -->
<mb-notification
  variant="info"
  title="New Message"
  toast
  position="bottom-center"
>
</mb-notification>
```

### Auto-dismiss

```html
<mb-notification
  variant="success"
  title="Success"
  subtitle="This will disappear after 3 seconds."
  timeout="3000"
  @mb-close="${handleClose}"
>
</mb-notification>
```

### Without Close Button

```html
<mb-notification
  variant="info"
  title="Quick message"
  hide-close-button
>
</mb-notification>
```

## API

### Properties

| Property          | Type                                                                                              | Default       | Description                                                |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------- |
| `variant`         | `"info" \| "success" \| "warning" \| "error"`                                                     | `"info"`      | The variant/type of notification                           |
| `title`           | `string`                                                                                          | `""`          | The title of the notification                              |
| `subtitle`        | `string`                                                                                          | `""`          | The subtitle/message of the notification                   |
| `hideCloseButton` | `boolean`                                                                                         | `false`       | Whether to hide the close button                           |
| `lowContrast`     | `boolean`                                                                                         | `false`       | Use low contrast (neutral) background                      |
| `toast`           | `boolean`                                                                                         | `false`       | Display as toast with fixed positioning                    |
| `position`        | `"top-right" \| "top-left" \| "bottom-right" \| "bottom-left" \| "top-center" \| "bottom-center"` | `"top-right"` | Toast position (only when toast=true)                      |
| `timeout`         | `number`                                                                                          | `0`           | Auto-dismiss timeout in milliseconds (0 = no auto-dismiss) |

### Methods

| Method    | Description                                            |
| --------- | ------------------------------------------------------ |
| `close()` | Closes the notification and emits the `mb-close` event |

### Events

| Event      | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| `mb-close` | Fired when the notification is closed (via close button or auto-dismiss) |

### Slots

| Slot      | Description                                            |
| --------- | ------------------------------------------------------ |
| (default) | Additional content to display in the notification body |

### CSS Parts

| Part           | Description                |
| -------------- | -------------------------- |
| `notification` | The notification container |
| `icon`         | The notification icon      |
| `content`      | The content area           |
| `title`        | The title element          |
| `subtitle`     | The subtitle element       |
| `close`        | The close button           |

## Features

### Variants

Four semantic variants with appropriate colors and icons:

- **info**: Blue - for informational messages
- **success**: Green - for successful operations
- **warning**: Yellow - for warnings and cautions
- **error**: Red - for errors and failures

### Auto-dismiss

Set a `timeout` (in milliseconds) to automatically close the notification:

```html
<mb-notification
  variant="success"
  title="Saved!"
  timeout="3000"
  @mb-close="${handleClose}"
>
</mb-notification>
```

### Toast Positioning

Use `toast` mode for fixed positioning with six position options:

- `top-right` (default)
- `top-left`
- `top-center`
- `bottom-right`
- `bottom-left`
- `bottom-center`

### Low Contrast

Use `low-contrast` for a more subtle appearance with neutral backgrounds:

```html
<mb-notification variant="info" low-contrast>
  Content here
</mb-notification>
```

## Migration from Carbon

If you're migrating from `cds-inline-notification`, here are the key differences:

### API Changes

| Carbon            | mb-notification     |
| ----------------- | ------------------- |
| `kind="info"`     | `variant="info"`    |
| `hideCloseButton` | `hide-close-button` |
| `subtitle`        | `subtitle`          |
| `title`           | `title`             |
| `lowContrast`     | `low-contrast`      |

### Before (Carbon)

```html
<cds-inline-notification
  kind="error"
  title="Error Title"
  subtitle="Error message"
  hideCloseButton
>
</cds-inline-notification>
```

### After (mb-notification)

```html
<mb-notification
  variant="error"
  title="Error Title"
  subtitle="Error message"
  hide-close-button
>
</mb-notification>
```

## Examples

### Validation Errors

```html
<mb-notification
  variant="error"
  title="Please fix the following:"
  subtitle="Name is required, Email is invalid"
  hide-close-button
>
</mb-notification>
```

### Success Message

```html
<mb-notification
  variant="success"
  title="Cat Created!"
  subtitle="Your new cat has been added to the playground."
  timeout="5000"
  @mb-close="${this.handleNotificationClose}"
>
</mb-notification>
```

### Info Banner

```html
<mb-notification
  variant="info"
  title="No Meowzer SDK"
  subtitle="Please wrap this component in a <meowzer-provider>."
  hide-close-button
>
</mb-notification>
```

### Interactive Toast

```typescript
// Show toast notification
const showToast = (message: string) => {
  const notification = document.createElement("mb-notification");
  notification.variant = "success";
  notification.title = message;
  notification.toast = true;
  notification.position = "top-right";
  notification.timeout = 3000;

  notification.addEventListener("mb-close", () => {
    notification.remove();
  });

  document.body.appendChild(notification);
};

showToast("Changes saved successfully!");
```

### Form Validation

```html
${this.errors.length > 0 ? html`
<mb-notification
  variant="error"
  title="Please fix the following:"
  hide-close-button
>
  <ul>
    ${this.errors.map(error => html`
    <li>${error}</li>
    `)}
  </ul>
</mb-notification>
` : ""}
```
