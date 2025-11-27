import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { MbTooltip } from "./mb-tooltip.js";
import "./mb-tooltip.js";
import "../mb-button/mb-button.js";

const meta: Meta<MbTooltip> = {
  title: "Components/Tooltip",
  component: "mb-tooltip",
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "The tooltip text content",
    },
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Position of the tooltip",
    },
    delay: {
      control: "number",
      description: "Delay in milliseconds before showing tooltip",
    },
    disabled: {
      control: "boolean",
      description: "Disable the tooltip",
    },
  },
};

export default meta;
type Story = StoryObj<MbTooltip>;

export const Default: Story = {
  args: {
    text: "Helpful hint",
    position: "top",
    delay: 200,
    disabled: false,
  },
  render: (args) => html`
    <mb-tooltip
      text=${args.text}
      position=${args.position}
      delay=${args.delay}
      ?disabled=${args.disabled}
    >
      <mb-button>Hover me</mb-button>
    </mb-tooltip>
  `,
};

export const Top: Story = {
  args: {
    text: "Tooltip on top",
    position: "top",
  },
  render: (args) => html`
    <div
      style="padding: 4rem; display: flex; justify-content: center;"
    >
      <mb-tooltip text=${args.text} position=${args.position}>
        <mb-button>Top</mb-button>
      </mb-tooltip>
    </div>
  `,
};

export const Bottom: Story = {
  args: {
    text: "Tooltip on bottom",
    position: "bottom",
  },
  render: (args) => html`
    <div
      style="padding: 4rem; display: flex; justify-content: center;"
    >
      <mb-tooltip text=${args.text} position=${args.position}>
        <mb-button>Bottom</mb-button>
      </mb-tooltip>
    </div>
  `,
};

export const Left: Story = {
  args: {
    text: "Tooltip on left",
    position: "left",
  },
  render: (args) => html`
    <div
      style="padding: 4rem; display: flex; justify-content: center;"
    >
      <mb-tooltip text=${args.text} position=${args.position}>
        <mb-button>Left</mb-button>
      </mb-tooltip>
    </div>
  `,
};

export const Right: Story = {
  args: {
    text: "Tooltip on right",
    position: "right",
  },
  render: (args) => html`
    <div
      style="padding: 4rem; display: flex; justify-content: center;"
    >
      <mb-tooltip text=${args.text} position=${args.position}>
        <mb-button>Right</mb-button>
      </mb-tooltip>
    </div>
  `,
};

export const LongText: Story = {
  args: {
    text: "This is a longer tooltip message that should wrap to multiple lines when it exceeds the maximum width.",
    position: "top",
  },
  render: (args) => html`
    <div
      style="padding: 4rem; display: flex; justify-content: center;"
    >
      <mb-tooltip text=${args.text} position=${args.position}>
        <mb-button>Long text</mb-button>
      </mb-tooltip>
    </div>
  `,
};

export const NoDelay: Story = {
  args: {
    text: "Instant tooltip (no delay)",
    position: "top",
    delay: 0,
  },
  render: (args) => html`
    <div
      style="padding: 4rem; display: flex; justify-content: center;"
    >
      <mb-tooltip
        text=${args.text}
        position=${args.position}
        delay=${args.delay}
      >
        <mb-button>No delay</mb-button>
      </mb-tooltip>
    </div>
  `,
};

export const SlowDelay: Story = {
  args: {
    text: "Slow tooltip (1 second delay)",
    position: "top",
    delay: 1000,
  },
  render: (args) => html`
    <div
      style="padding: 4rem; display: flex; justify-content: center;"
    >
      <mb-tooltip
        text=${args.text}
        position=${args.position}
        delay=${args.delay}
      >
        <mb-button>Slow delay</mb-button>
      </mb-tooltip>
    </div>
  `,
};

export const Disabled: Story = {
  args: {
    text: "This tooltip is disabled",
    position: "top",
    disabled: true,
  },
  render: (args) => html`
    <div
      style="padding: 4rem; display: flex; justify-content: center;"
    >
      <mb-tooltip
        text=${args.text}
        position=${args.position}
        ?disabled=${args.disabled}
      >
        <mb-button>Disabled tooltip</mb-button>
      </mb-tooltip>
    </div>
  `,
};

export const AllPositions: Story = {
  render: () => html`
    <div
      style="padding: 4rem; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; max-width: 800px;"
    >
      <mb-tooltip text="Top position" position="top">
        <mb-button>Top</mb-button>
      </mb-tooltip>

      <mb-tooltip text="Bottom position" position="bottom">
        <mb-button>Bottom</mb-button>
      </mb-tooltip>

      <mb-tooltip text="Left position" position="left">
        <mb-button>Left</mb-button>
      </mb-tooltip>

      <mb-tooltip text="Right position" position="right">
        <mb-button>Right</mb-button>
      </mb-tooltip>
    </div>
  `,
};

export const WithIcon: Story = {
  args: {
    text: "Additional information",
    position: "top",
  },
  render: (args) => html`
    <div
      style="padding: 4rem; display: flex; justify-content: center; align-items: center; gap: 0.5rem;"
    >
      <span>Label</span>
      <mb-tooltip text=${args.text} position=${args.position}>
        <button
          style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.25rem;
            height: 1.25rem;
            border-radius: 50%;
            border: 1px solid currentColor;
            background: transparent;
            cursor: help;
            font-size: 0.75rem;
          "
        >
          ?
        </button>
      </mb-tooltip>
    </div>
  `,
};

export const InteractiveDemo: Story = {
  render: () => html`
    <div style="padding: 4rem;">
      <h3 style="margin-top: 0;">Tooltip Positions Demo</h3>
      <p>
        Hover over each button to see the tooltip in different
        positions.
      </p>

      <div
        style="display: flex; flex-direction: column; gap: 2rem; margin-top: 2rem;"
      >
        <div style="display: flex; justify-content: center;">
          <mb-tooltip
            text="Top position - appears above the element"
            position="top"
          >
            <mb-button>Top</mb-button>
          </mb-tooltip>
        </div>

        <div
          style="display: flex; justify-content: space-between; align-items: center;"
        >
          <mb-tooltip
            text="Left position - appears to the left"
            position="left"
          >
            <mb-button>Left</mb-button>
          </mb-tooltip>

          <mb-tooltip
            text="Right position - appears to the right"
            position="right"
          >
            <mb-button>Right</mb-button>
          </mb-tooltip>
        </div>

        <div style="display: flex; justify-content: center;">
          <mb-tooltip
            text="Bottom position - appears below the element"
            position="bottom"
          >
            <mb-button>Bottom</mb-button>
          </mb-tooltip>
        </div>
      </div>

      <div
        style="margin-top: 3rem; padding: 1rem; background: #f4f4f4; border-radius: 4px;"
      >
        <h4 style="margin-top: 0;">Features:</h4>
        <ul style="margin-bottom: 0;">
          <li>Hover or focus to show tooltip</li>
          <li>Customizable delay (default 200ms)</li>
          <li>Auto-positioning to stay within viewport</li>
          <li>Smooth fade-in animation</li>
          <li>Keyboard accessible</li>
        </ul>
      </div>
    </div>
  `,
};

export const AccessibilityDemo: Story = {
  render: () => html`
    <div style="padding: 4rem;">
      <h3 style="margin-top: 0;">Accessibility Features</h3>
      <p>
        Try using keyboard navigation (Tab key) to focus on the
        buttons.
      </p>

      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <mb-tooltip
          text="Accessible via keyboard focus"
          position="top"
        >
          <mb-button>Focus me (Tab)</mb-button>
        </mb-tooltip>

        <mb-tooltip
          text="Tooltips support screen readers"
          position="top"
        >
          <mb-button>Screen reader friendly</mb-button>
        </mb-tooltip>

        <mb-tooltip text="ARIA attributes included" position="top">
          <mb-button>ARIA support</mb-button>
        </mb-tooltip>
      </div>

      <div
        style="margin-top: 2rem; padding: 1rem; background: #f4f4f4; border-radius: 4px;"
      >
        <h4 style="margin-top: 0;">Accessibility Features:</h4>
        <ul style="margin-bottom: 0;">
          <li><code>role="tooltip"</code> for proper semantics</li>
          <li>
            <code>aria-hidden</code> to hide from screen readers when
            not visible
          </li>
          <li>Keyboard navigation support (focus/blur)</li>
          <li>Hover and focus triggers</li>
        </ul>
      </div>
    </div>
  `,
};
