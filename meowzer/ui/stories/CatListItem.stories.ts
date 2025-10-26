import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/cat-list-item/cat-list-item.js";
import { createMockCat } from "./mocks/meowzer-cat-mock.js";

const meta = {
  title: "Management Components/Cat List Item",
  component: "cat-list-item",
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
      description: "Whether the item can be selected",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    selected: {
      control: "boolean",
      description: "Whether the item is currently selected",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Cat List Item

Compact horizontal list row component for displaying cat information in a list view.

### Usage

\`\`\`html
<cat-list-item 
  .cat="\${catInstance}"
  selectable
  @cat-select="\${handleSelect}">
</cat-list-item>
\`\`\`

### Features

- **Horizontal Layout** - Optimized for list view
- **Compact Design** - Shows key information efficiently
- **Status Display** - Visual state indicator
- **Selectable** - Optional checkbox for bulk operations
- **Responsive** - Adapts to available width

### Events

- **cat-select** - Emitted when checkbox is toggled
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
  createdAt: new Date("2025-10-20"),
});

const mockPausedCat = createMockCat({
  id: "cat-456",
  name: "Mittens",
  isActive: false,
  state: "sitting",
  createdAt: new Date("2025-10-19"),
});

export const Default: Story = {
  args: {
    cat: mockCat,
    selectable: false,
    selected: false,
  },
  render: (args) => html`
    <cat-list-item
      .cat=${args.cat}
      ?selectable=${args.selectable}
      ?selected=${args.selected}
    >
    </cat-list-item>
  `,
};

export const Paused: Story = {
  args: {
    cat: mockPausedCat,
    selectable: false,
    selected: false,
  },
  render: (args) => html`
    <cat-list-item
      .cat=${args.cat}
      ?selectable=${args.selectable}
      ?selected=${args.selected}
    >
    </cat-list-item>
  `,
};

export const Selectable: Story = {
  args: {
    cat: mockCat,
    selectable: true,
    selected: false,
  },
  render: (args) => html`
    <cat-list-item
      .cat=${args.cat}
      ?selectable=${args.selectable}
      ?selected=${args.selected}
    >
    </cat-list-item>
  `,
};

export const Selected: Story = {
  args: {
    cat: mockCat,
    selectable: true,
    selected: true,
  },
  render: (args) => html`
    <cat-list-item
      .cat=${args.cat}
      ?selectable=${args.selectable}
      ?selected=${args.selected}
    >
    </cat-list-item>
  `,
};

export const InList: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <cat-list-item .cat=${mockCat} selectable></cat-list-item>
      <cat-list-item .cat=${mockPausedCat} selectable></cat-list-item>
      <cat-list-item
        .cat=${createMockCat({
          id: "cat-789",
          name: "Shadow",
          isActive: true,
          state: "walking",
        })}
        selectable
      ></cat-list-item>
      <cat-list-item
        .cat=${createMockCat({
          id: "cat-012",
          name: "Luna",
          isActive: false,
          state: "sleeping",
        })}
        selectable
      ></cat-list-item>
    </div>
  `,
};
