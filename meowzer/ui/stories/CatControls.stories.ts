import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/cat-controls/cat-controls.js";

const meta = {
  title: "Management Components/Cat Controls",
  component: "cat-controls",
  tags: ["autodocs"],
  argTypes: {
    cat: {
      control: "object",
      description: "The cat instance to control",
      table: {
        type: { summary: "MeowzerCat" },
      },
    },
    size: {
      control: "select",
      options: ["small", "medium"],
      description: "Size of the control buttons",
      table: {
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: "'medium'" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Cat Controls

Reusable control buttons for managing a cat instance. Provides pause/resume and destroy actions.

### Usage

\`\`\`html
<cat-controls 
  .cat="\${catInstance}"
  size="medium"
  @pause="\${handlePause}"
  @resume="\${handleResume}"
  @destroy="\${handleDestroy}">
</cat-controls>
\`\`\`

### Events

- **pause** - Emitted when pause button is clicked
- **resume** - Emitted when resume button is clicked
- **destroy** - Emitted when destroy button is clicked
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Mock cat object for stories
const mockActiveCat = {
  id: "cat-1",
  name: "Whiskers",
  isActive: true,
  destroy: () => {},
};

const mockPausedCat = {
  id: "cat-2",
  name: "Mittens",
  isActive: false,
  destroy: () => {},
};

export const ActiveCat: Story = {
  args: {
    cat: mockActiveCat,
    size: "medium",
  },
  render: (args) => html`
    <cat-controls
      .cat=${args.cat}
      size=${args.size}
      @pause=${() => console.log("Paused")}
      @resume=${() => console.log("Resumed")}
      @destroy=${() => console.log("Destroyed")}
    >
    </cat-controls>
  `,
};

export const PausedCat: Story = {
  args: {
    cat: mockPausedCat,
    size: "medium",
  },
  render: (args) => html`
    <cat-controls
      .cat=${args.cat}
      size=${args.size}
      @pause=${() => console.log("Paused")}
      @resume=${() => console.log("Resumed")}
      @destroy=${() => console.log("Destroyed")}
    >
    </cat-controls>
  `,
};

export const SmallSize: Story = {
  args: {
    cat: mockActiveCat,
    size: "small",
  },
  render: (args) => html`
    <cat-controls
      .cat=${args.cat}
      size=${args.size}
      @pause=${() => console.log("Paused")}
      @resume=${() => console.log("Resumed")}
      @destroy=${() => console.log("Destroyed")}
    >
    </cat-controls>
  `,
};
