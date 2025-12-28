# mb-tabs

A controlled tabs component for switching between different views.

## Features

- **Controlled Component**: Parent manages active tab state via `activeIndex` prop
- **Event-Based**: Dispatches `tab-change` events when user clicks a tab
- **Three Sizes**: Small, Medium, Large
- **Accessibility**: Full ARIA support with proper roles and keyboard navigation
- **Customizable**: Exposed CSS parts for external styling
- **No Content Management**: Only handles tab UI, parent controls content display

## Usage

### Basic Usage

```html
<mb-tabs
  .tabs=${["Create", "Adopt"]}
  activeIndex=${0}
  @tab-change=${this.handleTabChange}
></mb-tabs>
```

### With Content Switching

```typescript
class MyComponent extends LitElement {
  @state() private activeTab = 0;

  private handleTabChange(e: CustomEvent) {
    this.activeTab = e.detail.index;
  }

  render() {
    return html`
      <mb-tabs
        .tabs=${["Profile", "Settings"]}
        activeIndex=${this.activeTab}
        @tab-change=${this.handleTabChange}
      ></mb-tabs>

      ${this.activeTab === 0
        ? html`<profile-view></profile-view>`
        : html`<settings-view></settings-view>`}
    `;
  }
}
```

### Sizes

```html
<mb-tabs .tabs=${["Tab 1", "Tab 2"]} size="sm"></mb-tabs>
<mb-tabs .tabs=${["Tab 1", "Tab 2"]} size="md"></mb-tabs>
<mb-tabs .tabs=${["Tab 1", "Tab 2"]} size="lg"></mb-tabs>
```

### Disabled

```html
<mb-tabs .tabs=${["Tab 1", "Tab 2"]} disabled></mb-tabs>
```

## API

### Properties

| Property      | Type       | Default | Description                             |
| ------------- | ---------- | ------- | --------------------------------------- |
| `tabs`        | `string[]` | `[]`    | Array of tab labels                     |
| `activeIndex` | `number`   | `0`     | Index of currently active tab           |
| `disabled`    | `boolean`  | `false` | Whether tabs are disabled               |
| `size`        | `string`   | `'md'`  | Size variant: `'sm'`, `'md'`, or `'lg'` |

### Events

| Event        | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `tab-change` | Fired when a tab is clicked. Detail: `{ index: number, label: string }` |

### CSS Parts

| Part             | Description                |
| ---------------- | -------------------------- |
| `tabs-container` | The container for all tabs |
| `tab`            | Individual tab button      |
| `tab-active`     | Active tab button          |

## Examples

### Cat Creator Tabs

```typescript
@customElement("cat-creator")
class CatCreator extends LitElement {
  @state() private activeTab = 0;

  render() {
    return html`
      <mb-tabs
        .tabs=${["Create Cat", "Adopt Cat"]}
        activeIndex=${this.activeTab}
        @tab-change=${(e: CustomEvent) =>
          (this.activeTab = e.detail.index)}
      ></mb-tabs>

      ${this.activeTab === 0
        ? html`<create-section></create-section>`
        : html`<adopt-section></adopt-section>`}
    `;
  }
}
```

## Accessibility

- Uses proper `role="tablist"` and `role="tab"` attributes
- Active tab has `aria-selected="true"`
- Manages `tabindex` correctly (active tab = 0, others = -1)
- Keyboard navigation support
- Disabled state properly communicated with `aria-disabled`

## Design Tokens

The component uses the following design tokens:

- `--mb-space-xs`, `--mb-space-sm`, `--mb-space-md`, `--mb-space-lg`
- `--mb-font-family`
- `--mb-font-size`, `--mb-font-size-sm`, `--mb-font-size-lg`
- `--mb-font-weight-medium`
- `--mb-line-height-tight`
- `--mb-color-text-primary`, `--mb-color-text-secondary`, `--mb-color-text-disabled`
- `--mb-color-brand-primary`
- `--mb-color-border-subtle`
- `--mb-color-surface-hover`
- `--mb-color-interactive-focus`
