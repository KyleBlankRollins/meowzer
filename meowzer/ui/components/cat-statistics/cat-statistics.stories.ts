import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../cat-statistics/cat-statistics.js";

const meta = {
  title: "Feature Components/Cat Statistics",
  component: "cat-statistics",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Cat Statistics

Real-time statistics display for Meowzer cats, showing counts and performance metrics.

### Usage

\`\`\`html
<meowzer-provider>
  <cat-statistics></cat-statistics>
</meowzer-provider>
\`\`\`

### Features

- **Total Cats Count** - Shows the total number of cats in the playground
- **Active Cats** - Counts cats that are currently active/running
- **Paused Cats** - Counts cats that are paused
- **Live FPS Monitoring** - Real-time frame rate display
- **Reactive Updates** - Automatically updates as cats are added/removed
- **Performance Optimized** - Efficient rendering with minimal overhead

### Context Requirements

This component requires the Meowzer context to be provided by \`meowzer-provider\`.
        `,
      },
    },
  },
  decorators: [
    (story) => html`
      <meowzer-provider> ${story()} </meowzer-provider>
    `,
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html` <cat-statistics></cat-statistics> `,
};

export const InModal: Story = {
  render: () => html`
    <mb-modal open heading="Cat Statistics" size="sm">
      <cat-statistics></cat-statistics>
    </mb-modal>
  `,
};

export const WithHeading: Story = {
  render: () => html`
    <div>
      <h3>Playground Statistics</h3>
      <cat-statistics></cat-statistics>
    </div>
  `,
};

export const Compact: Story = {
  render: () => html` <cat-statistics></cat-statistics> `,
};
