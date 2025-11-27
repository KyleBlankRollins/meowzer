import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-popover.js";
import "../mb-button/mb-button.js";

const meta = {
  title: "Components/Popover",
  tags: ["autodocs"],
  component: "mb-popover",
  parameters: {
    docs: {
      description: {
        component:
          "A popover component that displays floating content triggered by click or hover.",
      },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    trigger: {
      control: "select",
      options: ["click", "hover"],
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <mb-popover>
      <mb-button>Click me</mb-button>
      <div slot="content">
        <p style="margin: 0;">This is popover content</p>
      </div>
    </mb-popover>
  `,
};

export const TopPosition: Story = {
  render: () => html`
    <div style="padding: 100px; text-align: center;">
      <mb-popover position="top">
        <mb-button>Top popover</mb-button>
        <div slot="content">
          <p style="margin: 0;">Content appears above</p>
        </div>
      </mb-popover>
    </div>
  `,
};

export const BottomPosition: Story = {
  render: () => html`
    <div style="padding: 100px; text-align: center;">
      <mb-popover position="bottom">
        <mb-button>Bottom popover</mb-button>
        <div slot="content">
          <p style="margin: 0;">Content appears below</p>
        </div>
      </mb-popover>
    </div>
  `,
};

export const LeftPosition: Story = {
  render: () => html`
    <div style="padding: 100px; text-align: center;">
      <mb-popover position="left">
        <mb-button>Left popover</mb-button>
        <div slot="content">
          <p style="margin: 0;">Content appears to the left</p>
        </div>
      </mb-popover>
    </div>
  `,
};

export const RightPosition: Story = {
  render: () => html`
    <div style="padding: 100px; text-align: center;">
      <mb-popover position="right">
        <mb-button>Right popover</mb-button>
        <div slot="content">
          <p style="margin: 0;">Content appears to the right</p>
        </div>
      </mb-popover>
    </div>
  `,
};

export const HoverTrigger: Story = {
  render: () => html`
    <mb-popover trigger="hover">
      <mb-button variant="secondary">Hover me</mb-button>
      <div slot="content">
        <p style="margin: 0;">Opens on hover</p>
      </div>
    </mb-popover>
  `,
};

export const CustomDelay: Story = {
  render: () => html`
    <mb-popover trigger="hover" delay="1000">
      <mb-button variant="secondary">Hover me (1s delay)</mb-button>
      <div slot="content">
        <p style="margin: 0;">Opens after 1 second</p>
      </div>
    </mb-popover>
  `,
};

export const NoArrow: Story = {
  render: () => html`
    <mb-popover .showArrow=${false}>
      <mb-button>No arrow</mb-button>
      <div slot="content">
        <p style="margin: 0;">Popover without arrow</p>
      </div>
    </mb-popover>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <mb-popover disabled>
      <mb-button>Disabled popover</mb-button>
      <div slot="content">
        <p style="margin: 0;">This won't open</p>
      </div>
    </mb-popover>
  `,
};

export const RichContent: Story = {
  render: () => html`
    <mb-popover>
      <mb-button variant="primary">User Menu</mb-button>
      <div slot="content" style="min-width: 200px;">
        <div style="padding: 0.5rem 0;">
          <div
            style="padding: 0.5rem 1rem; cursor: pointer; border-bottom: 1px solid #e0e0e0;"
          >
            <strong>John Doe</strong>
            <div style="font-size: 0.875rem; color: #666;">
              john@example.com
            </div>
          </div>
          <a
            href="#"
            style="display: block; padding: 0.5rem 1rem; text-decoration: none; color: inherit;"
            >Profile</a
          >
          <a
            href="#"
            style="display: block; padding: 0.5rem 1rem; text-decoration: none; color: inherit;"
            >Settings</a
          >
          <a
            href="#"
            style="display: block; padding: 0.5rem 1rem; text-decoration: none; color: inherit; border-top: 1px solid #e0e0e0; color: #d32f2f;"
            >Sign out</a
          >
        </div>
      </div>
    </mb-popover>
  `,
};

export const WithForm: Story = {
  render: () => html`
    <mb-popover>
      <mb-button>Quick Add</mb-button>
      <div slot="content" style="min-width: 250px;">
        <div style="padding: 0.5rem;">
          <label style="display: block; margin-bottom: 0.5rem;">
            <span
              style="display: block; margin-bottom: 0.25rem; font-weight: 500;"
              >Name</span
            >
            <input
              type="text"
              style="width: 100%; padding: 0.5rem; border: 1px solid #e0e0e0; border-radius: 4px;"
            />
          </label>
          <label style="display: block; margin-bottom: 0.5rem;">
            <span
              style="display: block; margin-bottom: 0.25rem; font-weight: 500;"
              >Email</span
            >
            <input
              type="email"
              style="width: 100%; padding: 0.5rem; border: 1px solid #e0e0e0; border-radius: 4px;"
            />
          </label>
          <mb-button variant="primary" size="sm" style="width: 100%;"
            >Submit</mb-button
          >
        </div>
      </div>
    </mb-popover>
  `,
};

export const MultiplePopovers: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; padding: 50px;">
      <mb-popover position="top">
        <mb-button size="sm">Top</mb-button>
        <div slot="content">
          <p style="margin: 0;">Top popover</p>
        </div>
      </mb-popover>

      <mb-popover position="bottom">
        <mb-button size="sm">Bottom</mb-button>
        <div slot="content">
          <p style="margin: 0;">Bottom popover</p>
        </div>
      </mb-popover>

      <mb-popover position="left">
        <mb-button size="sm">Left</mb-button>
        <div slot="content">
          <p style="margin: 0;">Left popover</p>
        </div>
      </mb-popover>

      <mb-popover position="right">
        <mb-button size="sm">Right</mb-button>
        <div slot="content">
          <p style="margin: 0;">Right popover</p>
        </div>
      </mb-popover>
    </div>
  `,
};
