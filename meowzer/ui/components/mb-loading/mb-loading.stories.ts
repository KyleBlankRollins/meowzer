import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-loading.js";

const meta = {
  title: "Components/Loading",
  component: "mb-loading",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the loading spinner",
    },
    overlay: {
      control: "boolean",
      description: "Whether to display as fullscreen overlay",
    },
    text: {
      control: "text",
      description: "Optional loading text",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Loading

A loading spinner component for indicating loading states. Supports multiple sizes and an overlay mode for fullscreen loading indicators.

### Features

- **Three Sizes**: Small, Medium, Large
- **Overlay Mode**: Fullscreen loading with backdrop
- **Optional Text**: Display loading message
- **Accessible**: Proper ARIA attributes
- **Customizable**: CSS parts for external styling

### Usage

\`\`\`html
<!-- Inline loading -->
<mb-loading size="md"></mb-loading>

<!-- With text -->
<mb-loading text="Loading cats..."></mb-loading>

<!-- Fullscreen overlay -->
<mb-loading overlay text="Processing..."></mb-loading>
\`\`\`
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Default story
export const Medium: Story = {
  args: {
    size: "md",
    overlay: false,
    text: "",
  },
  render: (args) => html`
    <mb-loading
      size=${args.size}
      ?overlay=${args.overlay}
      text=${args.text}
    ></mb-loading>
  `,
};

export const Small: Story = {
  args: {
    size: "sm",
    overlay: false,
    text: "",
  },
  render: (args) => html`
    <mb-loading
      size=${args.size}
      ?overlay=${args.overlay}
      text=${args.text}
    ></mb-loading>
  `,
};

export const Large: Story = {
  args: {
    size: "lg",
    overlay: false,
    text: "",
  },
  render: (args) => html`
    <mb-loading
      size=${args.size}
      ?overlay=${args.overlay}
      text=${args.text}
    ></mb-loading>
  `,
};

// All sizes
export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 2rem; align-items: center;">
      <div style="text-align: center;">
        <mb-loading size="sm"></mb-loading>
        <p
          style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--mb-color-text-secondary);"
        >
          Small
        </p>
      </div>
      <div style="text-align: center;">
        <mb-loading size="md"></mb-loading>
        <p
          style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--mb-color-text-secondary);"
        >
          Medium
        </p>
      </div>
      <div style="text-align: center;">
        <mb-loading size="lg"></mb-loading>
        <p
          style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--mb-color-text-secondary);"
        >
          Large
        </p>
      </div>
    </div>
  `,
};

// With text
export const WithText: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <mb-loading size="sm" text="Loading..."></mb-loading>
      <mb-loading size="md" text="Loading cats..."></mb-loading>
      <mb-loading
        size="lg"
        text="Processing your request..."
      ></mb-loading>
    </div>
  `,
};

// With slotted text
export const WithSlottedText: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <mb-loading size="md">Loading with slot</mb-loading>
      <mb-loading size="lg">
        <strong>Processing...</strong>
      </mb-loading>
    </div>
  `,
};

// Inline usage (in context)
export const InlineContext: Story = {
  render: () => html`
    <div
      style="padding: 2rem; background: var(--mb-color-surface-default); border-radius: var(--mb-radius-medium);"
    >
      <h3
        style="margin: 0 0 1rem 0; color: var(--mb-color-text-primary);"
      >
        Cat List
      </h3>
      <div
        style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--mb-color-surface-subtle); border-radius: var(--mb-radius-small);"
      >
        <mb-loading size="sm"></mb-loading>
        <span style="color: var(--mb-color-text-secondary);"
          >Loading cats...</span
        >
      </div>
    </div>
  `,
};

// Overlay mode
export const OverlayMode: Story = {
  render: () => html`
    <div
      style="position: relative; height: 400px; background: var(--mb-color-surface-default); border-radius: var(--mb-radius-medium); overflow: hidden;"
    >
      <div style="padding: 2rem;">
        <h3
          style="margin: 0 0 1rem 0; color: var(--mb-color-text-primary);"
        >
          Content Below Overlay
        </h3>
        <p style="color: var(--mb-color-text-secondary);">
          This content is behind the loading overlay.
        </p>
      </div>
      <mb-loading overlay text="Loading..."></mb-loading>
    </div>
  `,
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    let isLoading = false;

    const toggleLoading = () => {
      isLoading = !isLoading;
      const container = document.getElementById("loading-container");
      if (container) {
        if (isLoading) {
          const loading = document.createElement("mb-loading");
          loading.setAttribute("id", "loading-element");
          loading.overlay = true;
          loading.text = "Processing...";
          container.appendChild(loading);
        } else {
          const loading = document.getElementById("loading-element");
          if (loading) {
            loading.remove();
          }
        }
      }
    };

    return html`
      <div>
        <button
          @click=${toggleLoading}
          style="padding: 0.5rem 1rem; border-radius: var(--mb-radius-small); border: 1px solid var(--mb-color-border-default); background: var(--mb-color-surface-default); color: var(--mb-color-text-primary); cursor: pointer;"
        >
          Toggle Loading Overlay
        </button>
        <div
          id="loading-container"
          style="position: relative; margin-top: 1rem; height: 300px; background: var(--mb-color-surface-subtle); border-radius: var(--mb-radius-medium); padding: 2rem;"
        >
          <p style="color: var(--mb-color-text-primary);">
            Click the button above to show/hide the loading overlay.
          </p>
        </div>
      </div>
    `;
  },
};
