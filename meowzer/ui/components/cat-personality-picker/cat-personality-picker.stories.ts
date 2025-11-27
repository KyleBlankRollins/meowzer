import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/cat-personality-picker/cat-personality-picker.js";

const meta = {
  title: "Creation Components/Cat Personality Picker",
  component: "cat-personality-picker",
  tags: ["autodocs"],
  argTypes: {
    personality: {
      control: "object",
      description: "Current personality settings",
      table: {
        type: { summary: "Partial<Personality>" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Cat Personality Picker

Interface for selecting cat personality using presets or custom trait sliders.

### Usage

\`\`\`html
<cat-personality-picker
  .personality="\${currentPersonality}"
  @personality-change="\${handleChange}">
</cat-personality-picker>
\`\`\`

### Features

- **Preset Personalities** - Quick selection from common archetypes
  - Playful
  - Lazy
  - Curious
  - Aloof
  - Energetic
  - Balanced
- **Custom Traits** - Fine-tune individual personality traits
  - Curiosity (0-1)
  - Playfulness (0-1)
  - Independence (0-1)
  - Sociability (0-1)
  - Energy (0-1)
- **Expandable Advanced Options** - Hide complexity until needed

### Events

- **personality-change** - Emitted when personality changes with updated personality object
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    personality: {},
  },
  render: (args) => html`
    <cat-personality-picker
      .personality=${args.personality}
      @personality-change=${(e: CustomEvent) => {
        console.log("Personality changed:", e.detail);
      }}
    >
    </cat-personality-picker>
  `,
};

export const PlayfulPreset: Story = {
  args: {
    personality: { preset: "playful" } as any,
  },
  render: (args) => html`
    <cat-personality-picker
      .personality=${args.personality}
      @personality-change=${(e: CustomEvent) => {
        console.log("Personality changed:", e.detail);
      }}
    >
    </cat-personality-picker>
  `,
};

export const CustomTraits: Story = {
  args: {
    personality: {
      curiosity: 0.8,
      playfulness: 0.6,
      independence: 0.3,
      sociability: 0.9,
      energy: 0.7,
    },
  },
  render: (args) => html`
    <cat-personality-picker
      .personality=${args.personality}
      @personality-change=${(e: CustomEvent) => {
        console.log("Personality changed:", e.detail);
      }}
    >
    </cat-personality-picker>
  `,
};

export const LazyPreset: Story = {
  args: {
    personality: { preset: "lazy" } as any,
  },
  render: (args) => html`
    <cat-personality-picker
      .personality=${args.personality}
      @personality-change=${(e: CustomEvent) => {
        console.log("Personality changed:", e.detail);
      }}
    >
    </cat-personality-picker>
  `,
};

export const InContainer: Story = {
  render: () => html`
    <div
      style="max-width: 500px; padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;"
    >
      <h3 style="margin-top: 0;">Set Personality</h3>
      <cat-personality-picker
        .personality=${{
          curiosity: 0.9,
          playfulness: 0.8,
          independence: 0.4,
          sociability: 0.7,
          energy: 0.9,
        }}
        @personality-change=${(e: CustomEvent) => {
          console.log("Personality changed:", e.detail);
        }}
      >
      </cat-personality-picker>
    </div>
  `,
};
