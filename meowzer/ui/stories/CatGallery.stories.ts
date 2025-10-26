import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/cat-gallery/cat-gallery.js";
import "../providers/meowzer-provider.js";

const meta = {
  title: "Gallery Components/Cat Gallery",
  component: "cat-gallery",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Cat Gallery

Gallery view for browsing and managing saved cats from collections.

### Usage

\`\`\`html
<meowzer-provider>
  <cat-gallery></cat-gallery>
</meowzer-provider>
\`\`\`

### Features

- **Collection Browser** - Switch between different cat collections
- **Thumbnail Grid** - Visual grid of saved cats
- **Quick Actions** - Load, export, or delete cats
- **Collection Management** - Create new collections
- **Empty States** - Helpful messages when no cats exist
- **Responsive Layout** - Grid adapts to screen size

### Context Requirements

Requires a parent \`<meowzer-provider>\` with IndexedDB storage enabled.

### Events

- **cat-loaded** - Emitted when a cat is successfully loaded from storage
- **collection-created** - Emitted when a new collection is created
- **cat-deleted** - Emitted when a cat is deleted from storage
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <meowzer-provider autoInit>
      <cat-gallery></cat-gallery>
    </meowzer-provider>
  `,
};

export const InContainer: Story = {
  render: () => html`
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
      <meowzer-provider autoInit>
        <cat-gallery></cat-gallery>
      </meowzer-provider>
    </div>
  `,
};

export const FullScreen: Story = {
  render: () => html`
    <meowzer-provider autoInit>
      <cat-gallery></cat-gallery>
    </meowzer-provider>
  `,
  parameters: {
    layout: "fullscreen",
  },
};
