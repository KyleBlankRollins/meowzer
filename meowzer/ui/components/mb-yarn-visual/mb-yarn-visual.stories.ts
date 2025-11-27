import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-yarn-visual.js";

const meta: Meta = {
  title: "Components/Yarn Visual",
  component: "mb-yarn-visual",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    yarnId: {
      control: "text",
      description: "ID of the yarn instance to render",
    },
    interactive: {
      control: "boolean",
      description:
        "Whether the yarn can be interacted with (dragged)",
    },
    size: {
      control: { type: "number", min: 20, max: 100, step: 5 },
      description: "Size of the yarn ball in pixels",
    },
    color: {
      control: "color",
      description: "Color of the yarn ball",
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    yarnId: "yarn-default",
    interactive: true,
    size: 40,
    color: "#FF6B6B",
  },
  render: (args) => html`
    <div
      style="width: 200px; height: 200px; position: relative; border: 1px dashed #ccc;"
    >
      <mb-yarn-visual
        yarnId=${args.yarnId}
        ?interactive=${args.interactive}
        size=${args.size}
        color=${args.color}
        style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
      ></mb-yarn-visual>
    </div>
  `,
};

export const DifferentColors: Story = {
  render: () => html`
    <div style="display: flex; gap: 30px; align-items: center;">
      <div style="text-align: center;">
        <div
          style="width: 100px; height: 100px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-red"
            color="#FF6B6B"
            size="40"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">Red</p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 100px; height: 100px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-blue"
            color="#4A90E2"
            size="40"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">Blue</p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 100px; height: 100px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-green"
            color="#4CAF50"
            size="40"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">Green</p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 100px; height: 100px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-purple"
            color="#9C27B0"
            size="40"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">Purple</p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 100px; height: 100px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-orange"
            color="#FF9800"
            size="40"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">Orange</p>
      </div>
    </div>
  `,
};

export const DifferentSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 30px; align-items: center;">
      <div style="text-align: center;">
        <div
          style="width: 80px; height: 80px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-small"
            size="30"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Small (30px)
        </p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 100px; height: 100px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-medium"
            size="40"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Medium (40px)
        </p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 140px; height: 140px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-large"
            size="60"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Large (60px)
        </p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 180px; height: 180px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-xlarge"
            size="80"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Extra Large (80px)
        </p>
      </div>
    </div>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; gap: 30px; align-items: center;">
      <div style="text-align: center;">
        <div
          style="width: 100px; height: 100px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-idle"
            size="40"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">Idle</p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 100px; height: 100px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-dragging"
            size="40"
            data-state="dragging"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">Dragging</p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 100px; height: 100px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-rolling"
            size="40"
            data-state="rolling"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">Rolling</p>
      </div>
    </div>
  `,
};

export const NonInteractive: Story = {
  render: () => html`
    <div style="display: flex; gap: 30px; align-items: flex-start;">
      <div style="text-align: center;">
        <div
          style="width: 100px; height: 100px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-interactive"
            interactive
            size="40"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Interactive<br />
          <span style="color: #666; font-size: 0.75rem;"
            >(can be dragged)</span
          >
        </p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 100px; height: 100px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-yarn-visual
            yarnId="yarn-non-interactive"
            size="40"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-yarn-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Non-Interactive<br />
          <span style="color: #666; font-size: 0.75rem;"
            >(visual only)</span
          >
        </p>
      </div>
    </div>
  `,
};
