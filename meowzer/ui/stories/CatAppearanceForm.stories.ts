import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/cat-appearance-form/cat-appearance-form.js";

const meta = {
  title: "Creation Components/Cat Appearance Form",
  component: "cat-appearance-form",
  tags: ["autodocs"],
  argTypes: {
    settings: {
      control: "object",
      description: "Current cat appearance settings",
      table: {
        type: { summary: "Partial<CatSettings>" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Cat Appearance Form

Form component for customizing cat appearance with color pickers, presets, and dropdowns.

### Usage

\`\`\`html
<cat-appearance-form
  .settings="\${currentSettings}"
  @settings-change="\${handleChange}">
</cat-appearance-form>
\`\`\`

### Features

- **Color Pickers** - Interactive color input with live preview
- **Preset Colors** - Quick selection from predefined palettes
- **Pattern Selection** - Choose from solid, tabby, calico, tuxedo, spotted
- **Size Options** - Small, medium, or large cats
- **Fur Length** - Short, medium, or long fur

### Events

- **settings-change** - Emitted when any setting changes with updated settings object
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    settings: {
      color: "#FF6B35",
      eyeColor: "#4ECDC4",
      pattern: "solid",
      size: "medium",
      furLength: "short",
    },
  },
  render: (args) => html`
    <cat-appearance-form
      .settings=${args.settings}
      @settings-change=${(e: CustomEvent) => {
        console.log("Settings changed:", e.detail);
      }}
    >
    </cat-appearance-form>
  `,
};

export const OrangeTabby: Story = {
  args: {
    settings: {
      color: "#FF6B35",
      eyeColor: "#90EE90",
      pattern: "tabby",
      size: "medium",
      furLength: "medium",
    },
  },
  render: (args) => html`
    <cat-appearance-form
      .settings=${args.settings}
      @settings-change=${(e: CustomEvent) => {
        console.log("Settings changed:", e.detail);
      }}
    >
    </cat-appearance-form>
  `,
};

export const WhiteCalico: Story = {
  args: {
    settings: {
      color: "#FFFFFF",
      eyeColor: "#4ECDC4",
      pattern: "calico",
      size: "small",
      furLength: "long",
    },
  },
  render: (args) => html`
    <cat-appearance-form
      .settings=${args.settings}
      @settings-change=${(e: CustomEvent) => {
        console.log("Settings changed:", e.detail);
      }}
    >
    </cat-appearance-form>
  `,
};

export const BlackTuxedo: Story = {
  args: {
    settings: {
      color: "#2C3E50",
      eyeColor: "#F4D03F",
      pattern: "tuxedo",
      size: "large",
      furLength: "short",
    },
  },
  render: (args) => html`
    <cat-appearance-form
      .settings=${args.settings}
      @settings-change=${(e: CustomEvent) => {
        console.log("Settings changed:", e.detail);
      }}
    >
    </cat-appearance-form>
  `,
};

export const InContainer: Story = {
  render: () => html`
    <div
      style="max-width: 400px; padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;"
    >
      <h3 style="margin-top: 0;">Customize Your Cat</h3>
      <cat-appearance-form
        .settings=${{
          color: "#8B4513",
          eyeColor: "#FF8C00",
          pattern: "spotted",
          size: "medium",
          furLength: "short",
        }}
        @settings-change=${(e: CustomEvent) => {
          console.log("Settings changed:", e.detail);
        }}
      >
      </cat-appearance-form>
    </div>
  `,
};
