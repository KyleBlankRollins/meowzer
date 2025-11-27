import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-icon.js";

const meta = {
  title: "Components/Icon",
  component: "mb-icon",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["16", "20", "24", "32", "48"],
      description: "Predefined size variant",
    },
    svg: {
      control: "text",
      description: "SVG content as string",
    },
    name: {
      control: "text",
      description: "Icon name (for future library integration)",
    },
    label: {
      control: "text",
      description: "Accessible label for the icon",
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Sample SVG icons for demonstration
const addIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
`;

const checkIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
`;

const closeIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
`;

const settingsIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>
`;

const starIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
`;

const heartIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
`;

export const Default: Story = {
  args: {
    size: "24",
    svg: addIcon,
    label: "Add icon",
  },
  render: (args) => html`
    <mb-icon
      size=${args.size}
      .svg=${args.svg}
      label=${args.label}
    ></mb-icon>
  `,
};

export const SizeVariants: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 1rem;">
      <mb-icon size="16" .svg=${checkIcon}></mb-icon>
      <mb-icon size="20" .svg=${checkIcon}></mb-icon>
      <mb-icon size="24" .svg=${checkIcon}></mb-icon>
      <mb-icon size="32" .svg=${checkIcon}></mb-icon>
      <mb-icon size="48" .svg=${checkIcon}></mb-icon>
    </div>
  `,
};

export const WithColors: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 1rem;">
      <mb-icon
        size="32"
        .svg=${heartIcon}
        style="color: #da1e28;"
      ></mb-icon>
      <mb-icon
        size="32"
        .svg=${starIcon}
        style="color: #f1c21b;"
      ></mb-icon>
      <mb-icon
        size="32"
        .svg=${checkIcon}
        style="color: #24a148;"
      ></mb-icon>
      <mb-icon
        size="32"
        .svg=${settingsIcon}
        style="color: #0f62fe;"
      ></mb-icon>
    </div>
  `,
};

export const SlottedContent: Story = {
  render: () => html`
    <mb-icon size="32" label="Custom icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
        />
      </svg>
    </mb-icon>
  `,
};

export const IconGallery: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 1rem; padding: 1rem;"
    >
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;"
      >
        <mb-icon size="32" .svg=${addIcon}></mb-icon>
        <span style="font-size: 0.75rem;">Add</span>
      </div>

      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;"
      >
        <mb-icon size="32" .svg=${checkIcon}></mb-icon>
        <span style="font-size: 0.75rem;">Check</span>
      </div>

      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;"
      >
        <mb-icon size="32" .svg=${closeIcon}></mb-icon>
        <span style="font-size: 0.75rem;">Close</span>
      </div>

      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;"
      >
        <mb-icon size="32" .svg=${settingsIcon}></mb-icon>
        <span style="font-size: 0.75rem;">Settings</span>
      </div>

      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;"
      >
        <mb-icon size="32" .svg=${starIcon}></mb-icon>
        <span style="font-size: 0.75rem;">Star</span>
      </div>

      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;"
      >
        <mb-icon size="32" .svg=${heartIcon}></mb-icon>
        <span style="font-size: 0.75rem;">Heart</span>
      </div>
    </div>
  `,
};

export const CustomSize: Story = {
  render: () => html`
    <mb-icon
      .svg=${starIcon}
      style="--mb-icon-size: 64px; color: #f1c21b;"
    ></mb-icon>
  `,
};

export const InButton: Story = {
  render: () => html`
    <button
      style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; cursor: pointer;"
    >
      <mb-icon size="20" .svg=${addIcon}></mb-icon>
      <span>Add Item</span>
    </button>
  `,
};

export const InText: Story = {
  render: () => html`
    <p
      style="display: flex; align-items: center; gap: 0.25rem; font-size: 1rem;"
    >
      This is a success message
      <mb-icon
        size="20"
        .svg=${checkIcon}
        style="color: #24a148;"
      ></mb-icon>
    </p>
  `,
};

export const WithAccessibility: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem;">
      <!-- Decorative icon (no label) -->
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <mb-icon
          size="24"
          .svg=${starIcon}
          style="color: #f1c21b;"
        ></mb-icon>
        <span>Featured</span>
      </div>

      <!-- Semantic icon (with label) -->
      <button
        style="padding: 0.5rem; cursor: pointer; border: none; background: transparent;"
      >
        <mb-icon
          size="24"
          .svg=${settingsIcon}
          label="Open settings"
        ></mb-icon>
      </button>
    </div>
  `,
};
