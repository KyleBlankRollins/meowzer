import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-share-cat-modal.js";

const meta = {
  title: "Components/ShareCatModal",
  component: "mb-share-cat-modal",
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the modal is open",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Share Cat Modal

A modal for sharing a cat's seed value with copy functionality.

### Features

- **Cat Preview**: Shows the cat's SVG sprite
- **Cat Details**: Displays name and description
- **Seed Display**: Shows the seed value in a monospace font
- **Copy Function**: One-click copy with visual feedback
- **Auto-Reset**: Copy button returns to normal after 3 seconds

### Usage

\`\`\`html
<mb-share-cat-modal
  .cat=\${myCat}
  ?open=\${true}
  @close=\${handleClose}
></mb-share-cat-modal>
\`\`\`
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const mockCat = {
  id: "cat-123",
  seed: "tabby-FF9500-00FF00-m-short-v1",
  name: "Whiskers",
  description: "A friendly orange tabby cat who loves to play",
  spriteData: {
    svg: `<svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="#FF9500"/>
      <circle cx="35" cy="40" r="5" fill="#00FF00"/>
      <circle cx="65" cy="40" r="5" fill="#00FF00"/>
    </svg>`,
    width: 100,
    height: 100,
  },
};

const mockCatNoDescription = {
  ...mockCat,
  description: undefined,
};

const mockCatUnnamed = {
  ...mockCat,
  name: undefined,
  description: undefined,
};

// Default story
export const Default: Story = {
  args: {
    open: true,
  },
  render: (args) => html`
    <mb-share-cat-modal
      .cat=${mockCat as any}
      ?open=${args.open}
    ></mb-share-cat-modal>
  `,
};

// Without Description
export const WithoutDescription: Story = {
  render: () => html`
    <mb-share-cat-modal
      .cat=${mockCatNoDescription as any}
      open
    ></mb-share-cat-modal>
  `,
};

// Unnamed Cat
export const UnnamedCat: Story = {
  render: () => html`
    <mb-share-cat-modal
      .cat=${mockCatUnnamed as any}
      open
    ></mb-share-cat-modal>
  `,
};

// Interactive Example
export const Interactive: Story = {
  render: () => {
    return html`
      <div>
        <mb-button
          variant="primary"
          @mb-click=${(e: Event) => {
            const modal = (
              e.target as HTMLElement
            ).parentElement?.querySelector("mb-share-cat-modal");
            if (modal) {
              (modal as any).open = true;
            }
          }}
        >
          Share Cat
        </mb-button>

        <mb-share-cat-modal
          .cat=${mockCat as any}
          @close=${(e: Event) => {
            (e.target as any).open = false;
          }}
        ></mb-share-cat-modal>
      </div>
    `;
  },
};

// Long Seed Example
export const LongSeed: Story = {
  render: () => {
    const catWithHat = {
      ...mockCat,
      seed: "calico-FF9500-00FF00-l-long-party-FF0000-FFFF00-v1",
    };

    return html`
      <mb-share-cat-modal
        .cat=${catWithHat as any}
        open
      ></mb-share-cat-modal>
    `;
  },
};
