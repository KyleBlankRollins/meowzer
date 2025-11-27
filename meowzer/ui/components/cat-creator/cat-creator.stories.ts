import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/cat-creator/cat-creator.js";
import "../providers/meowzer-provider.js";

const meta = {
  title: "Creation Components/Cat Creator",
  component: "cat-creator",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Cat Creator

Main component for creating new cats with a complete creation flow.

### Usage

\`\`\`html
<meowzer-provider>
  <cat-creator></cat-creator>
</meowzer-provider>
\`\`\`

### Features

- **Appearance Customization** - Choose colors and patterns
- **Personality Selection** - Set playfulness, independence, and affection
- **Live Preview** - See changes in real-time
- **Responsive Layout** - Two-column desktop, single-column mobile
- **Context-Aware** - Requires MeowzerProvider parent

### Events

- **cat-created** - Emitted when a new cat is successfully created
- **creation-cancelled** - Emitted when creation is cancelled

### Layout

The component uses a two-column grid layout with the form on the left and live preview on the right.
On mobile devices, it stacks into a single column for better usability.
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
      <cat-creator></cat-creator>
    </meowzer-provider>
  `,
};

export const WithinContainer: Story = {
  render: () => html`
    <div style="max-width: 800px; margin: 0 auto; padding: 2rem;">
      <meowzer-provider autoInit>
        <cat-creator></cat-creator>
      </meowzer-provider>
    </div>
  `,
};

export const FullWidth: Story = {
  render: () => html`
    <meowzer-provider autoInit>
      <cat-creator></cat-creator>
    </meowzer-provider>
  `,
  parameters: {
    layout: "fullscreen",
  },
};
