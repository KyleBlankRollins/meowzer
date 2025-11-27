import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-playground-toolbar.js";
import "../mb-button/mb-button.js";

const meta: Meta = {
  title: "Components/Playground Toolbar",
  component: "mb-playground-toolbar",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="height: 400px; display: flex; align-items: center;">
      <mb-playground-toolbar></mb-playground-toolbar>
    </div>
  `,
};

export const WithEventLogging: Story = {
  render: () => html`
    <div
      style="height: 400px; display: flex; align-items: center; gap: 20px;"
    >
      <mb-playground-toolbar
        @create-cat=${(e: CustomEvent) => {
          console.log("Create Cat clicked:", e);
          alert("Create Cat button clicked!");
        }}
        @view-stats=${(e: CustomEvent) => {
          console.log("View Stats clicked:", e);
          alert("View Statistics button clicked!");
        }}
        @laser-activated=${(e: CustomEvent) => {
          console.log("Laser activated:", e);
          alert("Laser pointer activated!");
        }}
      ></mb-playground-toolbar>
      <div style="max-width: 300px;">
        <h3>Interactive Toolbar Demo</h3>
        <p>
          Click the buttons to see event logging in the browser
          console and alerts.
        </p>
        <ul style="font-size: 0.875rem; line-height: 1.5;">
          <li>
            <strong>Create Cat:</strong> Opens cat creator dialog
          </li>
          <li>
            <strong>View Stats:</strong> Opens statistics dialog
          </li>
          <li><strong>Basic Food:</strong> Place basic food bowl</li>
          <li><strong>Fancy Food:</strong> Place fancy food bowl</li>
          <li><strong>Water:</strong> Place water bowl</li>
          <li><strong>Laser:</strong> Activate laser pointer</li>
          <li><strong>Yarn:</strong> Place yarn ball</li>
        </ul>
      </div>
    </div>
  `,
};

export const VerticalLayout: Story = {
  render: () => html`
    <div
      style="
        height: 600px;
        display: flex;
        border: 1px solid #ccc;
        border-radius: 8px;
        overflow: hidden;
      "
    >
      <mb-playground-toolbar></mb-playground-toolbar>
      <div
        style="
          flex: 1;
          padding: 20px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <div style="text-align: center;">
          <h3>Playground Area</h3>
          <p style="color: #666;">
            This is how the toolbar appears in the Cat Playground.
          </p>
          <p style="color: #666;">
            The toolbar is fixed to the left side as a vertical
            control panel.
          </p>
        </div>
      </div>
    </div>
  `,
};

export const ButtonStates: Story = {
  render: () => html`
    <div style="display: flex; gap: 40px; align-items: flex-start;">
      <div>
        <h4>Default State</h4>
        <mb-playground-toolbar></mb-playground-toolbar>
      </div>
      <div style="max-width: 400px;">
        <h3>Button States</h3>
        <p>
          The toolbar buttons show different states based on user
          interaction:
        </p>
        <ul style="font-size: 0.875rem; line-height: 1.5;">
          <li>
            <strong>Primary Button (Create):</strong> Uses primary
            variant for emphasis
          </li>
          <li>
            <strong>Tertiary Buttons:</strong> All other buttons use
            tertiary variant
          </li>
          <li>
            <strong>Active State:</strong> Placement and laser buttons
            show active state when in use (via
            <code>data-active</code> attribute)
          </li>
          <li>
            <strong>Tooltips:</strong> Hover over buttons to see
            descriptive tooltips
          </li>
        </ul>
      </div>
    </div>
  `,
};
