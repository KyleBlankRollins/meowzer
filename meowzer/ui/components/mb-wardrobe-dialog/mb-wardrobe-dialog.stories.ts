import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-wardrobe-dialog";

const meta: Meta = {
  title: "Feature Components/Wardrobe Dialog",
  component: "mb-wardrobe-dialog",
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the dialog is open",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Default wardrobe dialog state.
 * Opens with beanie selected and default colors.
 */
export const Default: Story = {
  args: {
    open: true,
  },
  render: (args) => html`
    <mb-wardrobe-dialog
      ?open=${args.open}
      @dialog-close=${(e: CustomEvent) => {
        console.log("Dialog closed:", e.detail);
      }}
      @hat-applied=${(e: CustomEvent) => {
        console.log("Hat applied:", e.detail);
      }}
    ></mb-wardrobe-dialog>
  `,
};

/**
 * Closed state of the dialog.
 * Click to see the trigger interaction.
 */
export const Closed: Story = {
  args: {
    open: false,
  },
  render: (args) => html`
    <div>
      <mb-button
        @click=${(e: Event) => {
          const dialog = (
            e.target as HTMLElement
          ).parentElement?.querySelector("mb-wardrobe-dialog") as any;
          if (dialog) {
            dialog.open = true;
          }
        }}
      >
        Open Wardrobe
      </mb-button>
      <mb-wardrobe-dialog
        ?open=${args.open}
        @dialog-close=${(e: CustomEvent) => {
          const dialog = e.target as any;
          dialog.open = false;
          console.log("Dialog closed:", e.detail);
        }}
        @hat-applied=${(e: CustomEvent) => {
          console.log("Hat applied:", e.detail);
        }}
      ></mb-wardrobe-dialog>
    </div>
  `,
};

/**
 * Dialog with event logging.
 * Demonstrates the events fired when interacting with the dialog.
 */
export const WithEventLogging: Story = {
  args: {
    open: true,
  },
  render: (args) => html`
    <div>
      <div
        id="event-log"
        style="margin-bottom: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 4px;"
      >
        <strong>Event Log:</strong>
        <div
          id="log-content"
          style="margin-top: 0.5rem; font-family: monospace; font-size: 0.875rem;"
        ></div>
      </div>
      <mb-wardrobe-dialog
        ?open=${args.open}
        @dialog-close=${(e: CustomEvent) => {
          const logContent = document.getElementById("log-content");
          if (logContent) {
            logContent.innerHTML += `<div>dialog-close: ${JSON.stringify(
              e.detail
            )}</div>`;
          }
          console.log("Dialog closed:", e.detail);
        }}
        @hat-applied=${(e: CustomEvent) => {
          const logContent = document.getElementById("log-content");
          if (logContent) {
            logContent.innerHTML += `<div style="color: green;">hat-applied: ${JSON.stringify(
              e.detail
            )}</div>`;
          }
          console.log("Hat applied:", e.detail);
        }}
      ></mb-wardrobe-dialog>
    </div>
  `,
};
