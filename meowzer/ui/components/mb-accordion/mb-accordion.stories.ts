import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-accordion.js";
import "./mb-accordion-item.js";

const meta = {
  title: "Components/Accordion",
  tags: ["autodocs"],
  component: "mb-accordion",
  parameters: {
    docs: {
      description: {
        component:
          "An accordion component for displaying collapsible content sections.",
      },
    },
  },
  argTypes: {},
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <mb-accordion>
      <mb-accordion-item title="Section 1">
        <p>This is the content for section 1.</p>
      </mb-accordion-item>
      <mb-accordion-item title="Section 2">
        <p>This is the content for section 2.</p>
      </mb-accordion-item>
      <mb-accordion-item title="Section 3">
        <p>This is the content for section 3.</p>
      </mb-accordion-item>
    </mb-accordion>
  `,
};

export const SingleItem: Story = {
  render: () => html`
    <mb-accordion>
      <mb-accordion-item title="Single Section">
        <p>This accordion only has one section.</p>
      </mb-accordion-item>
    </mb-accordion>
  `,
};

export const InitiallyOpen: Story = {
  render: () => html`
    <mb-accordion>
      <mb-accordion-item title="Section 1" open>
        <p>This section starts open.</p>
      </mb-accordion-item>
      <mb-accordion-item title="Section 2">
        <p>This section starts closed.</p>
      </mb-accordion-item>
      <mb-accordion-item title="Section 3">
        <p>This section starts closed.</p>
      </mb-accordion-item>
    </mb-accordion>
  `,
};

export const MultipleOpen: Story = {
  render: () => html`
    <mb-accordion>
      <mb-accordion-item title="Section 1" open>
        <p>Multiple sections can be open at once.</p>
      </mb-accordion-item>
      <mb-accordion-item title="Section 2" open>
        <p>This is also open by default.</p>
      </mb-accordion-item>
      <mb-accordion-item title="Section 3">
        <p>This one is closed.</p>
      </mb-accordion-item>
    </mb-accordion>
  `,
};

export const DisabledItem: Story = {
  render: () => html`
    <mb-accordion>
      <mb-accordion-item title="Normal Section">
        <p>This section can be toggled.</p>
      </mb-accordion-item>
      <mb-accordion-item title="Disabled Section" disabled>
        <p>This section cannot be toggled.</p>
      </mb-accordion-item>
      <mb-accordion-item title="Another Normal Section">
        <p>This section can be toggled.</p>
      </mb-accordion-item>
    </mb-accordion>
  `,
};

export const CustomTitleSlot: Story = {
  render: () => html`
    <mb-accordion>
      <mb-accordion-item>
        <div
          slot="title"
          style="display: flex; align-items: center; gap: 0.5rem;"
        >
          <span style="color: var(--mb-color-primary, #0066cc);"
            >🎨</span
          >
          <strong>Custom Title with Icon</strong>
        </div>
        <p>Content for the custom title section.</p>
      </mb-accordion-item>
      <mb-accordion-item title="Regular Title">
        <p>Content for the regular title section.</p>
      </mb-accordion-item>
    </mb-accordion>
  `,
};

export const LongContent: Story = {
  render: () => html`
    <mb-accordion>
      <mb-accordion-item title="Short Content">
        <p>Just a little bit of content.</p>
      </mb-accordion-item>
      <mb-accordion-item title="Long Content">
        <p>This section has much more content:</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
          <li>Item 5</li>
        </ul>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </mb-accordion-item>
    </mb-accordion>
  `,
};

export const NestedContent: Story = {
  render: () => html`
    <mb-accordion>
      <mb-accordion-item title="Section with Form">
        <div
          style="display: flex; flex-direction: column; gap: 1rem;"
        >
          <label>
            Name:
            <input type="text" style="margin-left: 0.5rem;" />
          </label>
          <label>
            Email:
            <input type="email" style="margin-left: 0.5rem;" />
          </label>
          <button>Submit</button>
        </div>
      </mb-accordion-item>
      <mb-accordion-item title="Section with Code">
        <pre
          style="background: #f5f5f5; padding: 1rem; border-radius: 4px;"
        ><code>const greeting = "Hello, World!";
console.log(greeting);</code></pre>
      </mb-accordion-item>
    </mb-accordion>
  `,
};

export const ManyItems: Story = {
  render: () => html`
    <mb-accordion>
      ${Array.from({ length: 10 }, (_, i) => i + 1).map(
        (num) => html`
          <mb-accordion-item title="Section ${num}">
            <p>Content for section ${num}.</p>
          </mb-accordion-item>
        `
      )}
    </mb-accordion>
  `,
};

export const Interactive: Story = {
  render: () => {
    const handleToggle = (e: Event) => {
      const event = e as CustomEvent;
      console.log("Accordion item toggled:", event.detail);
    };

    return html`
      <mb-accordion>
        <mb-accordion-item
          title="Section with Event Listener"
          @mb-toggle=${handleToggle}
        >
          <p>Open the console to see toggle events.</p>
        </mb-accordion-item>
        <mb-accordion-item
          title="Another Section"
          @mb-toggle=${handleToggle}
        >
          <p>This also logs events.</p>
        </mb-accordion-item>
      </mb-accordion>
    `;
  },
};

export const Accessible: Story = {
  render: () => html`
    <mb-accordion>
      <mb-accordion-item title="Keyboard Navigation">
        <p>Use Tab to focus items, then Enter or Space to toggle.</p>
        <p>Screen readers will announce the state of each section.</p>
      </mb-accordion-item>
      <mb-accordion-item title="ARIA Attributes">
        <p>
          Each item has proper aria-expanded and aria-controls
          attributes.
        </p>
        <p>Content areas have aria-hidden when collapsed.</p>
      </mb-accordion-item>
    </mb-accordion>
  `,
};
