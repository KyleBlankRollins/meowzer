import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-slider.js";

const meta = {
  title: "Components/Slider",
  component: "mb-slider",
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the slider",
    },
    min: {
      control: "number",
      description: "Minimum value",
    },
    max: {
      control: "number",
      description: "Maximum value",
    },
    step: {
      control: "number",
      description: "Step increment",
    },
    value: {
      control: "number",
      description: "Current value",
    },
    showValue: {
      control: "boolean",
      description: "Whether to show the current value",
    },
    decimalPlaces: {
      control: "number",
      description: "Number of decimal places to display",
    },
    helper: {
      control: "text",
      description: "Helper text",
    },
    disabled: {
      control: "boolean",
      description: "Whether the slider is disabled",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Slider

A slider component for numeric value selection with smooth interaction and visual feedback.

### Features

- **Range Control**: Customizable min, max, and step values
- **Visual Progress**: Colored track shows current position
- **Value Display**: Optional formatted value display
- **Helper Text**: Additional guidance for users
- **Accessible**: ARIA attributes and keyboard support
- **Customizable**: CSS parts for external styling

### Usage

\`\`\`html
<!-- Basic slider -->
<mb-slider
  label="Volume"
  min="0"
  max="100"
  value="50"
></mb-slider>

<!-- Decimal values -->
<mb-slider
  label="Curiosity"
  min="0"
  max="1"
  step="0.1"
  value="0.7"
  decimal-places="1"
></mb-slider>
\`\`\`
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Default story
export const Default: Story = {
  args: {
    label: "Volume",
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    showValue: true,
    decimalPlaces: 0,
    helper: "",
    disabled: false,
  },
  render: (args) => html`
    <mb-slider
      label=${args.label}
      min=${args.min}
      max=${args.max}
      step=${args.step}
      value=${args.value}
      ?show-value=${args.showValue}
      decimal-places=${args.decimalPlaces}
      helper=${args.helper}
      ?disabled=${args.disabled}
    ></mb-slider>
  `,
};

// With helper text
export const WithHelper: Story = {
  args: {
    label: "Brightness",
    min: 0,
    max: 100,
    value: 75,
    helper: "Adjust screen brightness level",
  },
  render: (args) => html`
    <mb-slider
      label=${args.label}
      min=${args.min}
      max=${args.max}
      value=${args.value}
      helper=${args.helper}
    ></mb-slider>
  `,
};

// Decimal values
export const DecimalValues: Story = {
  args: {
    label: "Opacity",
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.75,
    decimalPlaces: 2,
  },
  render: (args) => html`
    <mb-slider
      label=${args.label}
      min=${args.min}
      max=${args.max}
      step=${args.step}
      value=${args.value}
      decimal-places=${args.decimalPlaces}
    ></mb-slider>
  `,
};

// Without label
export const WithoutLabel: Story = {
  args: {
    min: 0,
    max: 100,
    value: 60,
    showValue: true,
  },
  render: (args) => html`
    <mb-slider
      min=${args.min}
      max=${args.max}
      value=${args.value}
      ?show-value=${args.showValue}
    ></mb-slider>
  `,
};

// Hide value
export const HideValue: Story = {
  args: {
    label: "Temperature",
    min: 0,
    max: 100,
    value: 22,
    showValue: false,
  },
  render: (args) => html`
    <mb-slider
      label=${args.label}
      min=${args.min}
      max=${args.max}
      value=${args.value}
      ?show-value=${args.showValue}
    ></mb-slider>
  `,
};

// Disabled
export const Disabled: Story = {
  args: {
    label: "Locked Setting",
    min: 0,
    max: 100,
    value: 50,
    disabled: true,
  },
  render: (args) => html`
    <mb-slider
      label=${args.label}
      min=${args.min}
      max=${args.max}
      value=${args.value}
      ?disabled=${args.disabled}
    ></mb-slider>
  `,
};

// Personality traits (like cat-personality-picker)
export const PersonalityTraits: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;"
    >
      <mb-slider
        label="Curiosity"
        min="0"
        max="1"
        step="0.1"
        value="0.7"
        decimal-places="1"
      ></mb-slider>
      <mb-slider
        label="Playfulness"
        min="0"
        max="1"
        step="0.1"
        value="0.8"
        decimal-places="1"
      ></mb-slider>
      <mb-slider
        label="Energy"
        min="0"
        max="1"
        step="0.1"
        value="0.6"
        decimal-places="1"
      ></mb-slider>
      <mb-slider
        label="Sociability"
        min="0"
        max="1"
        step="0.1"
        value="0.5"
        decimal-places="1"
      ></mb-slider>
      <mb-slider
        label="Independence"
        min="0"
        max="1"
        step="0.1"
        value="0.4"
        decimal-places="1"
      ></mb-slider>
    </div>
  `,
};

// Different ranges
export const DifferentRanges: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;"
    >
      <mb-slider
        label="Percentage (0-100)"
        min="0"
        max="100"
        value="50"
      ></mb-slider>
      <mb-slider
        label="Temperature (-10 to 40°C)"
        min="-10"
        max="40"
        value="22"
      ></mb-slider>
      <mb-slider
        label="Rating (1-5)"
        min="1"
        max="5"
        step="0.5"
        value="3.5"
        decimal-places="1"
      ></mb-slider>
    </div>
  `,
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const handleInput = (e: Event) => {
      const value = (e as CustomEvent).detail.value;
      const box = document.getElementById("interactive-box");
      if (box) {
        box.style.opacity = String(value);
      }
    };

    return html`
      <div style="max-width: 400px;">
        <h3
          style="margin: 0 0 1rem 0; color: var(--mb-color-text-primary);"
        >
          Adjust Opacity
        </h3>
        <mb-slider
          label="Opacity"
          min="0"
          max="1"
          step="0.01"
          value="0.75"
          decimal-places="2"
          @mb-input=${handleInput}
        ></mb-slider>
        <div
          id="interactive-box"
          style="
            margin-top: 1.5rem;
            width: 100%;
            height: 100px;
            background: var(--mb-color-interactive-primary);
            border-radius: var(--mb-radius-medium);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            opacity: 0.75;
          "
        >
          Interactive Box
        </div>
      </div>
    `;
  },
};

// Volume control example
export const VolumeControl: Story = {
  render: () => {
    return html`
      <div
        style="
          max-width: 300px;
          padding: 1.5rem;
          background: var(--mb-color-surface-default);
          border-radius: var(--mb-radius-medium);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        "
      >
        <h3
          style="
            margin: 0 0 1.5rem 0;
            color: var(--mb-color-text-primary);
            font-size: 1.25rem;
          "
        >
          Audio Settings
        </h3>
        <div
          style="display: flex; flex-direction: column; gap: 1.5rem;"
        >
          <mb-slider
            label="Volume"
            min="0"
            max="100"
            value="75"
            helper="Master volume level"
          ></mb-slider>
          <mb-slider
            label="Balance"
            min="-50"
            max="50"
            value="0"
            helper="Left (-) to Right (+)"
          ></mb-slider>
          <mb-slider
            label="Bass"
            min="-10"
            max="10"
            value="2"
            helper="Bass boost"
          ></mb-slider>
        </div>
      </div>
    `;
  },
};

// All states
export const AllStates: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;"
    >
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Default
        </h4>
        <mb-slider
          label="Default State"
          min="0"
          max="100"
          value="50"
        ></mb-slider>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          With Helper
        </h4>
        <mb-slider
          label="With Helper"
          min="0"
          max="100"
          value="60"
          helper="Additional information here"
        ></mb-slider>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Disabled
        </h4>
        <mb-slider
          label="Disabled State"
          min="0"
          max="100"
          value="40"
          disabled
        ></mb-slider>
      </div>
    </div>
  `,
};
