import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-tag.js";

const meta = {
  title: "Components/Tag",
  component: "mb-tag",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["gray", "blue", "green", "red", "yellow", "purple"],
      description: "Color variant of the tag",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the tag",
    },
    removable: {
      control: "boolean",
      description: "Whether the tag can be removed",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Tag

A tag component for labels, categories, and badges. Supports multiple color variants, sizes, and optional remove functionality.

### Features

- **Six Color Variants**: Gray, Blue, Green, Red, Yellow, Purple
- **Three Sizes**: Small, Medium, Large
- **Removable**: Optional remove button with event
- **Accessible**: Proper ARIA labels and keyboard support
- **Customizable**: CSS parts for external styling

### Usage

\`\`\`html
<!-- Basic tag -->
<mb-tag variant="blue">New</mb-tag>

<!-- Removable tag -->
<mb-tag variant="red" removable>Error</mb-tag>

<!-- Different sizes -->
<mb-tag size="sm">Small</mb-tag>
<mb-tag size="lg">Large</mb-tag>
\`\`\`
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Default story
export const Gray: Story = {
  args: {
    variant: "gray",
    size: "md",
    removable: false,
  },
  render: (args) => html`
    <mb-tag
      variant=${args.variant}
      size=${args.size}
      ?removable=${args.removable}
    >
      Gray Tag
    </mb-tag>
  `,
};

export const Blue: Story = {
  args: {
    variant: "blue",
    size: "md",
    removable: false,
  },
  render: (args) => html`
    <mb-tag
      variant=${args.variant}
      size=${args.size}
      ?removable=${args.removable}
    >
      Blue Tag
    </mb-tag>
  `,
};

export const Green: Story = {
  args: {
    variant: "green",
    size: "md",
    removable: false,
  },
  render: (args) => html`
    <mb-tag
      variant=${args.variant}
      size=${args.size}
      ?removable=${args.removable}
    >
      Green Tag
    </mb-tag>
  `,
};

export const Red: Story = {
  args: {
    variant: "red",
    size: "md",
    removable: false,
  },
  render: (args) => html`
    <mb-tag
      variant=${args.variant}
      size=${args.size}
      ?removable=${args.removable}
    >
      Red Tag
    </mb-tag>
  `,
};

// All variants
export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <mb-tag variant="gray">Gray</mb-tag>
      <mb-tag variant="blue">Blue</mb-tag>
      <mb-tag variant="green">Green</mb-tag>
      <mb-tag variant="red">Red</mb-tag>
      <mb-tag variant="yellow">Yellow</mb-tag>
      <mb-tag variant="purple">Purple</mb-tag>
    </div>
  `,
};

// All sizes
export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <mb-tag variant="blue" size="sm">Small</mb-tag>
      <mb-tag variant="blue" size="md">Medium</mb-tag>
      <mb-tag variant="blue" size="lg">Large</mb-tag>
    </div>
  `,
};

// Removable tags
export const Removable: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <mb-tag variant="gray" removable>Gray</mb-tag>
      <mb-tag variant="blue" removable>Blue</mb-tag>
      <mb-tag variant="green" removable>Green</mb-tag>
      <mb-tag variant="red" removable>Red</mb-tag>
      <mb-tag variant="yellow" removable>Yellow</mb-tag>
      <mb-tag variant="purple" removable>Purple</mb-tag>
    </div>
  `,
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const handleRemove = (e: Event) => {
      const tag = e.target as HTMLElement;
      tag.style.opacity = "0";
      tag.style.transition = "opacity 0.3s ease";
      setTimeout(() => {
        tag.remove();
      }, 300);
    };

    return html`
      <div>
        <h3
          style="margin: 0 0 1rem 0; color: var(--mb-color-text-primary);"
        >
          Click × to remove tags
        </h3>
        <div
          id="tag-container"
          style="display: flex; gap: 0.5rem; flex-wrap: wrap;"
        >
          <mb-tag variant="blue" removable @mb-remove=${handleRemove}
            >React</mb-tag
          >
          <mb-tag variant="green" removable @mb-remove=${handleRemove}
            >TypeScript</mb-tag
          >
          <mb-tag
            variant="purple"
            removable
            @mb-remove=${handleRemove}
            >Lit</mb-tag
          >
          <mb-tag
            variant="yellow"
            removable
            @mb-remove=${handleRemove}
            >Web Components</mb-tag
          >
          <mb-tag variant="red" removable @mb-remove=${handleRemove}
            >JavaScript</mb-tag
          >
        </div>
      </div>
    `;
  },
};

// Use case: Categories
export const Categories: Story = {
  render: () => html`
    <div style="max-width: 600px;">
      <h3
        style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-primary);"
      >
        Cat: Whiskers
      </h3>
      <p
        style="margin: 0 0 1rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
      >
        A playful orange tabby with a curious personality
      </p>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <mb-tag variant="blue" size="sm">Indoor</mb-tag>
        <mb-tag variant="green" size="sm">Friendly</mb-tag>
        <mb-tag variant="purple" size="sm">Playful</mb-tag>
        <mb-tag variant="yellow" size="sm">Curious</mb-tag>
      </div>
    </div>
  `,
};

// Use case: Status indicators
export const StatusIndicators: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div
        style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: var(--mb-color-surface-default); border-radius: var(--mb-radius-small);"
      >
        <span style="color: var(--mb-color-text-primary); flex: 1;"
          >System Status</span
        >
        <mb-tag variant="green" size="sm">Active</mb-tag>
      </div>
      <div
        style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: var(--mb-color-surface-default); border-radius: var(--mb-radius-small);"
      >
        <span style="color: var(--mb-color-text-primary); flex: 1;"
          >API Connection</span
        >
        <mb-tag variant="red" size="sm">Error</mb-tag>
      </div>
      <div
        style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: var(--mb-color-surface-default); border-radius: var(--mb-radius-small);"
      >
        <span style="color: var(--mb-color-text-primary); flex: 1;"
          >Database</span
        >
        <mb-tag variant="yellow" size="sm">Warning</mb-tag>
      </div>
      <div
        style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: var(--mb-color-surface-default); border-radius: var(--mb-radius-small);"
      >
        <span style="color: var(--mb-color-text-primary); flex: 1;"
          >Cache</span
        >
        <mb-tag variant="blue" size="sm">Info</mb-tag>
      </div>
    </div>
  `,
};

// Use case: Filter tags
export const FilterTags: Story = {
  render: () => {
    return html`
      <div>
        <h3
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-primary);"
        >
          Active Filters
        </h3>
        <p
          style="margin: 0 0 1rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Click × to remove a filter
        </p>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <mb-tag variant="blue" removable>Color: Orange</mb-tag>
          <mb-tag variant="blue" removable>Pattern: Tabby</mb-tag>
          <mb-tag variant="blue" removable>Age: 2-5 years</mb-tag>
          <mb-tag variant="blue" removable
            >Personality: Playful</mb-tag
          >
        </div>
      </div>
    `;
  },
};
