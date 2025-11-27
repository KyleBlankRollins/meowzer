import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-button.js";

const meta = {
  title: "Components/Button",
  component: "mb-button",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "The visual style variant of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    loading: {
      control: "boolean",
      description: "Whether the button is in a loading state",
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "The HTML button type",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Button

A versatile button component built with the Meowzer design system. Supports multiple variants, sizes, states, and includes loading and icon support.

### Features

- **Three Variants**: Primary (brand), Secondary (subtle), Tertiary (minimal)
- **Three Sizes**: Small, Medium, Large
- **States**: Hover, active, disabled, loading
- **Icon Support**: Optional icon slot for leading icons
- **Accessibility**: Proper ARIA attributes and keyboard support
- **Events**: Custom mb-click event

### Usage

\`\`\`html
<mb-button variant="primary" size="md">
  Click me
</mb-button>

<mb-button variant="secondary" loading>
  Loading...
</mb-button>

<mb-button variant="tertiary" size="sm">
  <span slot="icon">🐱</span>
  With Icon
</mb-button>
\`\`\`
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Default story
export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
  },
  render: (args) => html`
    <mb-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      Click me
    </mb-button>
  `,
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    disabled: false,
    loading: false,
  },
  render: (args) => html`
    <mb-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      Click me
    </mb-button>
  `,
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    size: "md",
    disabled: false,
    loading: false,
  },
  render: (args) => html`
    <mb-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      Click me
    </mb-button>
  `,
};

// Sizes
export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center;">
      <mb-button variant="primary" size="sm">Small</mb-button>
      <mb-button variant="primary" size="md">Medium</mb-button>
      <mb-button variant="primary" size="lg">Large</mb-button>
    </div>
  `,
};

// Variants
export const AllVariants: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 1rem; flex-direction: column; max-width: 300px;"
    >
      <mb-button variant="primary">Primary Button</mb-button>
      <mb-button variant="secondary">Secondary Button</mb-button>
      <mb-button variant="tertiary">Tertiary Button</mb-button>
    </div>
  `,
};

// Loading state
export const Loading: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center;">
      <mb-button variant="primary" loading>Loading...</mb-button>
      <mb-button variant="secondary" loading>Loading...</mb-button>
      <mb-button variant="tertiary" loading>Loading...</mb-button>
    </div>
  `,
};

// Disabled state
export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center;">
      <mb-button variant="primary" disabled>Disabled</mb-button>
      <mb-button variant="secondary" disabled>Disabled</mb-button>
      <mb-button variant="tertiary" disabled>Disabled</mb-button>
    </div>
  `,
};

// With Icon
export const WithIcon: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 1rem; flex-direction: column; max-width: 300px;"
    >
      <mb-button variant="primary">
        <span slot="icon">🐱</span>
        Adopt Cat
      </mb-button>
      <mb-button variant="secondary">
        <span slot="icon">❤️</span>
        Favorite
      </mb-button>
      <mb-button variant="tertiary">
        <span slot="icon">⚙️</span>
        Settings
      </mb-button>
    </div>
  `,
};

// Interactive example
export const Interactive: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 1rem; flex-direction: column; max-width: 400px;"
    >
      <mb-button
        variant="primary"
        @mb-click=${() => alert("Primary button clicked!")}
      >
        Click for Alert
      </mb-button>
      <p
        style="color: var(--mb-color-text-secondary); font-size: 0.875rem;"
      >
        Click the button above to see the custom mb-click event in
        action.
      </p>
    </div>
  `,
};

// All States Showcase
export const AllStates: Story = {
  render: () => html`
    <div style="display: grid; gap: 2rem;">
      <section>
        <h3
          style="margin-bottom: 1rem; color: var(--mb-color-text-primary);"
        >
          Primary Variant
        </h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <mb-button variant="primary">Default</mb-button>
          <mb-button variant="primary" disabled>Disabled</mb-button>
          <mb-button variant="primary" loading>Loading</mb-button>
        </div>
      </section>

      <section>
        <h3
          style="margin-bottom: 1rem; color: var(--mb-color-text-primary);"
        >
          Secondary Variant
        </h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <mb-button variant="secondary">Default</mb-button>
          <mb-button variant="secondary" disabled>Disabled</mb-button>
          <mb-button variant="secondary" loading>Loading</mb-button>
        </div>
      </section>

      <section>
        <h3
          style="margin-bottom: 1rem; color: var(--mb-color-text-primary);"
        >
          Tertiary Variant
        </h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <mb-button variant="tertiary">Default</mb-button>
          <mb-button variant="tertiary" disabled>Disabled</mb-button>
          <mb-button variant="tertiary" loading>Loading</mb-button>
        </div>
      </section>

      <section>
        <h3
          style="margin-bottom: 1rem; color: var(--mb-color-text-primary);"
        >
          All Sizes
        </h3>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <mb-button variant="primary" size="sm">Small</mb-button>
          <mb-button variant="primary" size="md">Medium</mb-button>
          <mb-button variant="primary" size="lg">Large</mb-button>
        </div>
      </section>
    </div>
  `,
};
