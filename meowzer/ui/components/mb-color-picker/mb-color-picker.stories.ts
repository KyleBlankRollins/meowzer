import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { MbColorPicker } from "./mb-color-picker.js";
import "./mb-color-picker.js";

const meta: Meta<MbColorPicker> = {
  title: "Components/Color Picker",
  component: "mb-color-picker",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "color",
      description: "The color value in hex format",
    },
    format: {
      control: "select",
      options: ["hex"],
      description: "Color format (only hex currently supported)",
    },
    inline: {
      control: "boolean",
      description: "Display inline without border/shadow",
    },
    disabled: {
      control: "boolean",
      description: "Disable the color picker",
    },
  },
};

export default meta;
type Story = StoryObj<MbColorPicker>;

export const Default: Story = {
  args: {
    value: "#3498db",
    format: "hex",
    inline: false,
    disabled: false,
  },
  render: (args) => html`
    <mb-color-picker
      value=${args.value}
      format=${args.format}
      ?inline=${args.inline}
      ?disabled=${args.disabled}
    ></mb-color-picker>
  `,
};

export const Red: Story = {
  args: {
    value: "#e74c3c",
  },
  render: (args) => html`
    <mb-color-picker value=${args.value}></mb-color-picker>
  `,
};

export const Green: Story = {
  args: {
    value: "#2ecc71",
  },
  render: (args) => html`
    <mb-color-picker value=${args.value}></mb-color-picker>
  `,
};

export const Blue: Story = {
  args: {
    value: "#3498db",
  },
  render: (args) => html`
    <mb-color-picker value=${args.value}></mb-color-picker>
  `,
};

export const Yellow: Story = {
  args: {
    value: "#f1c40f",
  },
  render: (args) => html`
    <mb-color-picker value=${args.value}></mb-color-picker>
  `,
};

export const Purple: Story = {
  args: {
    value: "#9b59b6",
  },
  render: (args) => html`
    <mb-color-picker value=${args.value}></mb-color-picker>
  `,
};

export const Orange: Story = {
  args: {
    value: "#e67e22",
  },
  render: (args) => html`
    <mb-color-picker value=${args.value}></mb-color-picker>
  `,
};

export const Black: Story = {
  args: {
    value: "#000000",
  },
  render: (args) => html`
    <mb-color-picker value=${args.value}></mb-color-picker>
  `,
};

export const White: Story = {
  args: {
    value: "#ffffff",
  },
  render: (args) => html`
    <mb-color-picker value=${args.value}></mb-color-picker>
  `,
};

export const Inline: Story = {
  args: {
    value: "#3498db",
    inline: true,
  },
  render: (args) => html`
    <mb-color-picker value=${args.value} inline></mb-color-picker>
  `,
};

export const Disabled: Story = {
  args: {
    value: "#3498db",
    disabled: true,
  },
  render: (args) => html`
    <mb-color-picker value=${args.value} disabled></mb-color-picker>
  `,
};

export const Interactive: Story = {
  args: {
    value: "#3498db",
  },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <mb-color-picker
        value=${args.value}
        @mb-change=${(e: CustomEvent) => {
          const result = document.getElementById(
            "color-result"
          ) as HTMLDivElement;
          if (result) {
            result.textContent = e.detail.value;
            result.style.background = e.detail.value;
          }
        }}
        @mb-input=${(e: CustomEvent) => {
          const preview = document.getElementById(
            "color-preview"
          ) as HTMLDivElement;
          if (preview) {
            preview.textContent = e.detail.value;
            preview.style.background = e.detail.value;
          }
        }}
      ></mb-color-picker>

      <div
        style="display: flex; flex-direction: column; gap: 0.5rem;"
      >
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <strong>Live Preview (mb-input):</strong>
          <div
            id="color-preview"
            style="
              padding: 0.5rem 1rem;
              border: 1px solid #ccc;
              border-radius: 4px;
              font-family: monospace;
              min-width: 100px;
            "
          >
            ${args.value}
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <strong>Selected (mb-change):</strong>
          <div
            id="color-result"
            style="
              padding: 0.5rem 1rem;
              border: 1px solid #ccc;
              border-radius: 4px;
              font-family: monospace;
              min-width: 100px;
            "
          >
            ${args.value}
          </div>
        </div>
      </div>
    </div>
  `,
};

export const MultipleColors: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;"
    >
      <mb-color-picker value="#e74c3c"></mb-color-picker>
      <mb-color-picker value="#3498db"></mb-color-picker>
      <mb-color-picker value="#2ecc71"></mb-color-picker>
      <mb-color-picker value="#f1c40f"></mb-color-picker>
      <mb-color-picker value="#9b59b6"></mb-color-picker>
      <mb-color-picker value="#e67e22"></mb-color-picker>
    </div>
  `,
};

export const InlineVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <mb-color-picker value="#e74c3c" inline></mb-color-picker>
      <mb-color-picker value="#3498db" inline></mb-color-picker>
      <mb-color-picker value="#2ecc71" inline></mb-color-picker>
    </div>
  `,
};

export const WithinModal: Story = {
  render: () => html`
    <div
      style="position: relative; padding: 2rem; border: 2px dashed #ccc; border-radius: 8px;"
    >
      <p style="margin: 0 0 1rem 0;">
        <strong>Simulated modal context</strong><br />
        Color picker should work correctly even within
        transformed/positioned containers.
      </p>
      <mb-color-picker value="#3498db"></mb-color-picker>
    </div>
  `,
};

export const AccessibilityDemo: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <p>
        <strong>Keyboard Navigation:</strong>
        Tab through the color picker elements (swatch, grid, hue
        slider, text input)
      </p>
      <mb-color-picker value="#3498db"></mb-color-picker>
      <ul style="margin: 0; padding-left: 1.5rem;">
        <li>Swatch: Clickable, opens native color picker fallback</li>
        <li>Grid: Interactive slider for saturation/brightness</li>
        <li>Hue slider: Interactive slider for hue selection</li>
        <li>Text input: Manual hex value entry</li>
        <li>All elements have proper ARIA labels and roles</li>
      </ul>
    </div>
  `,
};
