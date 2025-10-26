import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/cat-card/cat-card.js";
import { createMockCat } from "./mocks/meowzer-cat-mock.js";

const meta = {
  title: "Management Components/Cat Card",
  component: "cat-card",
  tags: ["autodocs"],
  argTypes: {
    cat: {
      control: "object",
      description: "The cat instance to display",
      table: {
        type: { summary: "MeowzerCat" },
      },
    },
    selectable: {
      control: "boolean",
      description: "Whether the card can be selected",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    selected: {
      control: "boolean",
      description: "Whether the card is currently selected",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    showActions: {
      control: "boolean",
      description: "Whether to show action buttons",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Cat Card

Individual card component for displaying cat information and controls in a grid layout.

### Usage

\`\`\`html
<cat-card 
  .cat="\${catInstance}"
  selectable
  showActions>
</cat-card>
\`\`\`

### Features

- **Compact Display** - Shows key cat information
- **Status Indicator** - Visual indication of active/paused state
- **Quick Actions** - Pause/resume and destroy controls
- **Selectable** - Optional checkbox for bulk operations
- **Hover Effects** - Interactive visual feedback

### Events

- **cat-select** - Emitted when card is selected/deselected
- **cat-action** - Emitted when an action button is clicked
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const mockCat = createMockCat({
  id: "cat-123",
  name: "Whiskers",
  isActive: true,
  state: "idle",
});

const mockPausedCat = createMockCat({
  id: "cat-456",
  name: "Mittens",
  isActive: false,
  state: "sitting",
});

export const Default: Story = {
  args: {
    cat: mockCat,
    selectable: false,
    selected: false,
    showActions: true,
  },
  render: (args) => html`
    <cat-card
      .cat=${args.cat}
      ?selectable=${args.selectable}
      ?selected=${args.selected}
      ?showActions=${args.showActions}
    >
    </cat-card>
  `,
};

export const Paused: Story = {
  args: {
    cat: mockPausedCat,
    selectable: false,
    selected: false,
    showActions: true,
  },
  render: (args) => html`
    <cat-card
      .cat=${args.cat}
      ?selectable=${args.selectable}
      ?selected=${args.selected}
      ?showActions=${args.showActions}
    >
    </cat-card>
  `,
};

export const Selectable: Story = {
  args: {
    cat: mockCat,
    selectable: true,
    selected: false,
    showActions: true,
  },
  render: (args) => html`
    <cat-card
      .cat=${args.cat}
      ?selectable=${args.selectable}
      ?selected=${args.selected}
      ?showActions=${args.showActions}
    >
    </cat-card>
  `,
};

export const Selected: Story = {
  args: {
    cat: mockCat,
    selectable: true,
    selected: true,
    showActions: true,
  },
  render: (args) => html`
    <cat-card
      .cat=${args.cat}
      ?selectable=${args.selectable}
      ?selected=${args.selected}
      ?showActions=${args.showActions}
    >
    </cat-card>
  `,
};

export const NoActions: Story = {
  args: {
    cat: mockCat,
    selectable: false,
    selected: false,
    showActions: false,
  },
  render: (args) => html`
    <cat-card
      .cat=${args.cat}
      ?selectable=${args.selectable}
      ?selected=${args.selected}
      ?showActions=${args.showActions}
    >
    </cat-card>
  `,
};

export const InGrid: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;"
    >
      <cat-card .cat=${mockCat} showActions></cat-card>
      <cat-card .cat=${mockPausedCat} showActions></cat-card>
      <cat-card
        .cat=${createMockCat({
          id: "cat-789",
          name: "Shadow",
          isActive: true,
          state: "walking",
        })}
        showActions
      ></cat-card>
    </div>
  `,
};
