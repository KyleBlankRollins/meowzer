import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-need-visual.js";

const meta: Meta = {
  title: "Components/Need Visual",
  component: "mb-need-visual",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    needId: {
      control: "text",
      description: "ID of the need instance to render",
    },
    type: {
      control: "select",
      options: ["food:basic", "food:fancy", "water"],
      description: "Type of need (food:basic, food:fancy, water)",
    },
    interactive: {
      control: "boolean",
      description: "Whether the need can be interacted with",
    },
    size: {
      control: { type: "number", min: 40, max: 120, step: 10 },
      description: "Size of the icon in pixels",
    },
  },
};

export default meta;
type Story = StoryObj;

export const BasicFood: Story = {
  args: {
    needId: "need-basic-food",
    type: "food:basic",
    interactive: false,
    size: 60,
  },
  render: (args) => html`
    <div
      style="width: 200px; height: 200px; position: relative; border: 1px dashed #ccc;"
    >
      <mb-need-visual
        needId=${args.needId}
        type=${args.type}
        ?interactive=${args.interactive}
        size=${args.size}
        style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
      ></mb-need-visual>
    </div>
  `,
};

export const FancyFood: Story = {
  args: {
    needId: "need-fancy-food",
    type: "food:fancy",
    interactive: false,
    size: 60,
  },
  render: (args) => html`
    <div
      style="width: 200px; height: 200px; position: relative; border: 1px dashed #ccc;"
    >
      <mb-need-visual
        needId=${args.needId}
        type=${args.type}
        ?interactive=${args.interactive}
        size=${args.size}
        style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
      ></mb-need-visual>
    </div>
  `,
};

export const Water: Story = {
  args: {
    needId: "need-water",
    type: "water",
    interactive: false,
    size: 60,
  },
  render: (args) => html`
    <div
      style="width: 200px; height: 200px; position: relative; border: 1px dashed #ccc;"
    >
      <mb-need-visual
        needId=${args.needId}
        type=${args.type}
        ?interactive=${args.interactive}
        size=${args.size}
        style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
      ></mb-need-visual>
    </div>
  `,
};

export const AllTypes: Story = {
  render: () => html`
    <div style="display: flex; gap: 30px; align-items: center;">
      <div style="text-align: center;">
        <div
          style="width: 150px; height: 150px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="need-basic"
            type="food:basic"
            size="60"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Basic Food
        </p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 150px; height: 150px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="need-fancy"
            type="food:fancy"
            size="60"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Fancy Food
        </p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 150px; height: 150px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="need-water"
            type="water"
            size="60"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">Water</p>
      </div>
    </div>
  `,
};

export const ActiveStates: Story = {
  render: () => html`
    <div style="display: flex; gap: 30px; align-items: center;">
      <div style="text-align: center;">
        <div
          style="width: 150px; height: 150px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="need-basic-inactive"
            type="food:basic"
            size="60"
            data-active="false"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">Inactive</p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 150px; height: 150px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="need-basic-active"
            type="food:basic"
            size="60"
            data-active="true"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Active (Pulsing)
        </p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 150px; height: 150px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="need-water-active"
            type="water"
            size="60"
            data-active="true"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Water Active (Shimmer)
        </p>
      </div>
    </div>
  `,
};

export const DifferentSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 30px; align-items: center;">
      <div style="text-align: center;">
        <div
          style="width: 120px; height: 120px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="need-small"
            type="water"
            size="50"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Small (50px)
        </p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 150px; height: 150px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="need-medium"
            type="water"
            size="60"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Medium (60px)
        </p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 180px; height: 180px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="need-large"
            type="water"
            size="80"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Large (80px)
        </p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 220px; height: 220px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="need-xlarge"
            type="water"
            size="100"
            style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Extra Large (100px)
        </p>
      </div>
    </div>
  `,
};

export const WithFancyFoodSteam: Story = {
  render: () => html`
    <div style="display: flex; gap: 30px; align-items: center;">
      <div style="text-align: center;">
        <div
          style="width: 150px; height: 180px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="fancy-inactive"
            type="food:fancy"
            size="70"
            data-active="false"
            style="left: 50%; top: 60%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Inactive<br />
          <span style="color: #666; font-size: 0.75rem;"
            >(no steam)</span
          >
        </p>
      </div>

      <div style="text-align: center;">
        <div
          style="width: 150px; height: 180px; position: relative; border: 1px dashed #ccc;"
        >
          <mb-need-visual
            needId="fancy-active"
            type="food:fancy"
            size="70"
            data-active="true"
            style="left: 50%; top: 60%; transform: translate(-50%, -50%);"
          ></mb-need-visual>
        </div>
        <p style="margin-top: 8px; font-size: 0.875rem;">
          Active<br />
          <span style="color: #666; font-size: 0.75rem;"
            >(with steam)</span
          >
        </p>
      </div>
    </div>
  `,
};
