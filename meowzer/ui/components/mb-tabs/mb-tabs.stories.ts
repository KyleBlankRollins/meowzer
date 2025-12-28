import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-tabs.js";

const meta = {
  title: "Components/Tabs",
  component: "mb-tabs",
  tags: ["autodocs"],
  argTypes: {
    tabs: {
      control: "object",
      description: "Array of tab labels",
    },
    activeIndex: {
      control: "number",
      description: "Index of the currently active tab",
    },
    disabled: {
      control: "boolean",
      description: "Whether tabs are disabled",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Tabs

A controlled tabs component for switching between different views.

### Features

- **Controlled Component**: Parent manages active tab state
- **Event-Based**: Dispatches tab-change events
- **Three Sizes**: Small, Medium, Large
- **Accessibility**: Full ARIA support and keyboard navigation
- **Customizable**: Exposed CSS parts for styling

### Usage

\`\`\`html
<mb-tabs
  .tabs=\${["Create", "Adopt"]}
  activeIndex=\${this.activeTab}
  @tab-change=\${(e) => this.activeTab = e.detail.index}
></mb-tabs>

<!-- Parent controls content based on activeTab -->
\${this.activeTab === 0 ? html\`<div>Create content</div>\` : html\`<div>Adopt content</div>\`}
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
    tabs: ["Tab 1", "Tab 2", "Tab 3"],
    activeIndex: 0,
    disabled: false,
    size: "md",
  },
  render: (args) => html`
    <mb-tabs
      .tabs=${args.tabs}
      activeIndex=${args.activeIndex}
      ?disabled=${args.disabled}
      size=${args.size}
    ></mb-tabs>
  `,
};

// Interactive Example
export const Interactive: Story = {
  render: () => {
    let activeTab = 0;

    return html`
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <mb-tabs
          .tabs=${["Profile", "Settings", "Notifications"]}
          activeIndex=${activeTab}
          @tab-change=${(e: CustomEvent) => {
            activeTab = e.detail.index;
            // Re-render happens automatically
          }}
        ></mb-tabs>

        <div
          style="
            padding: 1rem;
            border: 1px solid var(--mb-color-border-subtle);
            border-radius: var(--mb-radius-medium);
            color: var(--mb-color-text-primary);
          "
        >
          ${activeTab === 0
            ? html`<p>Profile content goes here...</p>`
            : activeTab === 1
            ? html`<p>Settings content goes here...</p>`
            : html`<p>Notifications content goes here...</p>`}
        </div>
      </div>
    `;
  },
};

// Size Variants
export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h4
          style="margin-bottom: 0.5rem; color: var(--mb-color-text-primary);"
        >
          Small
        </h4>
        <mb-tabs
          .tabs=${["Tab 1", "Tab 2", "Tab 3"]}
          size="sm"
        ></mb-tabs>
      </div>

      <div>
        <h4
          style="margin-bottom: 0.5rem; color: var(--mb-color-text-primary);"
        >
          Medium (Default)
        </h4>
        <mb-tabs
          .tabs=${["Tab 1", "Tab 2", "Tab 3"]}
          size="md"
        ></mb-tabs>
      </div>

      <div>
        <h4
          style="margin-bottom: 0.5rem; color: var(--mb-color-text-primary);"
        >
          Large
        </h4>
        <mb-tabs
          .tabs=${["Tab 1", "Tab 2", "Tab 3"]}
          size="lg"
        ></mb-tabs>
      </div>
    </div>
  `,
};

// Disabled State
export const Disabled: Story = {
  render: () => html`
    <mb-tabs
      .tabs=${["Tab 1", "Tab 2", "Tab 3"]}
      activeIndex=${1}
      disabled
    ></mb-tabs>
  `,
};

// Many Tabs
export const ManyTabs: Story = {
  render: () => html`
    <mb-tabs
      .tabs=${[
        "Overview",
        "Details",
        "Settings",
        "Analytics",
        "Reports",
        "History",
      ]}
      activeIndex=${2}
    ></mb-tabs>
  `,
};

// Two Tabs (Common Pattern)
export const TwoTabs: Story = {
  render: () => html`
    <mb-tabs
      .tabs=${["Create Cat", "Adopt Cat"]}
      activeIndex=${0}
    ></mb-tabs>
  `,
};
