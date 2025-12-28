# mb-share-cat-modal

A modal component for sharing a cat's seed value with copy functionality.

## Features

- **Cat Preview**: Displays the cat's SVG sprite
- **Cat Information**: Shows name and description
- **Seed Display**: Shows seed value in monospace font for easy copying
- **Copy Button**: One-click copy to clipboard with visual feedback
- **Auto-Reset**: Copy button returns to normal state after 3 seconds
- **Responsive**: Works on all screen sizes

## Usage

### Basic Usage

```html
<mb-share-cat-modal
  .cat="${myCat}"
  ?open="${true}"
  @close="${handleClose}"
></mb-share-cat-modal>
```

### Full Example

```typescript
import { MbShareCatModal } from "@meowzer/ui";
import type { MeowzerCat } from "meowzer";

class MyComponent extends LitElement {
  @state() private shareModalOpen = false;
  @state() private selectedCat?: MeowzerCat;

  private handleShare(cat: MeowzerCat) {
    this.selectedCat = cat;
    this.shareModalOpen = true;
  }

  private handleCloseShareModal() {
    this.shareModalOpen = false;
  }

  render() {
    return html`
      <mb-button @mb-click=${() => this.handleShare(someCat)}>
        Share Cat
      </mb-button>

      <mb-share-cat-modal
        .cat=${this.selectedCat}
        ?open=${this.shareModalOpen}
        @close=${this.handleCloseShareModal}
      ></mb-share-cat-modal>
    `;
  }
}
```

## API

### Properties

| Property | Type         | Default | Description               |
| -------- | ------------ | ------- | ------------------------- |
| `cat`    | `MeowzerCat` | -       | The cat to share          |
| `open`   | `boolean`    | `false` | Whether the modal is open |

### Events

| Event   | Description                |
| ------- | -------------------------- |
| `close` | Fired when modal is closed |

## Behavior

### Copy Functionality

When the "Copy Seed" button is clicked:

1. Seed value is copied to clipboard using `navigator.clipboard.writeText()`
2. Button text changes to "✓ Copied!"
3. After 3 seconds, button text returns to "Copy Seed"

### Display Logic

- If cat has no name: Shows "Unnamed Cat"
- If cat has no description: Description section is hidden
- Seed is always displayed in a monospace font for readability
- SVG preview is centered and constrained to a reasonable size

## Accessibility

- Modal uses proper ARIA attributes from `mb-modal` component
- Copy button provides visual feedback
- Seed value can be selected and copied manually if clipboard API fails
- Keyboard navigation supported

## Examples

### With Full Cat Info

```typescript
const cat = {
  id: "cat-123",
  seed: "tabby-FF9500-00FF00-m-short-v1",
  name: "Whiskers",
  description: "A friendly orange tabby",
  spriteData: { svg: "...", width: 100, height: 100 },
};
```

### Unnamed Cat

```typescript
const cat = {
  id: "cat-456",
  seed: "calico-FF9500-00FF00-m-short-v1",
  // No name property
  spriteData: { svg: "...", width: 100, height: 100 },
};
// Will display "Unnamed Cat"
```

### Integration with Context Menu

```typescript
class CatContextMenu extends LitElement {
  private handleShareClick() {
    this.dispatchEvent(
      new CustomEvent("cat-share", {
        detail: { cat: this.cat },
        bubbles: true,
        composed: true,
      })
    );
  }
}

// Parent component
class Playground extends LitElement {
  @state() private shareModalOpen = false;
  @state() private catToShare?: MeowzerCat;

  private handleCatShare(e: CustomEvent) {
    this.catToShare = e.detail.cat;
    this.shareModalOpen = true;
  }

  render() {
    return html`
      <mb-cat-context-menu
        @cat-share=${this.handleCatShare}
      ></mb-cat-context-menu>

      <mb-share-cat-modal
        .cat=${this.catToShare}
        ?open=${this.shareModalOpen}
        @close=${() => (this.shareModalOpen = false)}
      ></mb-share-cat-modal>
    `;
  }
}
```
