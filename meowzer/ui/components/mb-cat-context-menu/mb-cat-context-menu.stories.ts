import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-cat-context-menu";

const meta: Meta = {
  title: "Feature Components/Cat Context Menu",
  component: "mb-cat-context-menu",
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the menu is open",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    left: {
      control: "number",
      description: "Left position in pixels",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0" },
      },
    },
    top: {
      control: "number",
      description: "Top position in pixels",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0" },
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Default context menu state.
 * Positioned at center of container.
 */
export const Default: Story = {
  args: {
    open: true,
    left: 200,
    top: 150,
  },
  render: (args) => {
    // Mock cat object
    const mockCat = {
      name: "Fluffy",
      id: "mock-cat-1",
    } as any;

    return html`
      <div
        style="position: relative; height: 400px; background: #f5f5f5; border-radius: 4px;"
      >
        <mb-cat-context-menu
          .cat=${mockCat}
          ?open=${args.open}
          .left=${args.left}
          .top=${args.top}
          @cat-rename=${(e: CustomEvent) => {
            console.log("Rename cat:", e.detail);
            alert("Rename clicked!");
          }}
          @cat-change-hat=${(e: CustomEvent) => {
            console.log("Change hat:", e.detail);
            alert("Change Hat clicked!");
          }}
          @cat-remove=${(e: CustomEvent) => {
            console.log("Remove cat:", e.detail);
            if (
              confirm("Are you sure you want to remove this cat?")
            ) {
              alert("Cat removed!");
            }
          }}
          @menu-close=${(e: CustomEvent) => {
            console.log("Menu closed:", e.detail);
          }}
        ></mb-cat-context-menu>
      </div>
    `;
  },
};

/**
 * Closed menu state.
 * Nothing is rendered when closed.
 */
export const Closed: Story = {
  args: {
    open: false,
    left: 200,
    top: 150,
  },
  render: (args) => {
    const mockCat = {
      name: "Fluffy",
      id: "mock-cat-1",
    } as any;

    return html`
      <div
        style="position: relative; height: 400px; background: #f5f5f5; border-radius: 4px;"
      >
        <p style="padding: 1rem;">
          Menu is closed - nothing rendered
        </p>
        <mb-cat-context-menu
          .cat=${mockCat}
          ?open=${args.open}
          .left=${args.left}
          .top=${args.top}
        ></mb-cat-context-menu>
      </div>
    `;
  },
};

/**
 * Interactive example with click-to-open.
 * Click the cat button to open the context menu.
 */
export const Interactive: Story = {
  render: () => {
    const mockCat = {
      name: "Whiskers",
      id: "mock-cat-2",
    } as any;

    return html`
      <div
        style="position: relative; height: 400px; background: #f5f5f5; border-radius: 4px; padding: 1rem;"
      >
        <p style="margin-bottom: 1rem;">
          Click the button below to open context menu:
        </p>
        <mb-button
          id="cat-button"
          @click=${(e: MouseEvent) => {
            const button = e.currentTarget as HTMLElement;
            const rect = button.getBoundingClientRect();
            const menu = button.parentElement?.querySelector(
              "mb-cat-context-menu"
            ) as any;
            if (menu) {
              menu.open = true;
              menu.left = rect.left;
              menu.top = rect.bottom + 4;
            }
          }}
        >
          Right-click Cat (Whiskers)
        </mb-button>

        <mb-cat-context-menu
          .cat=${mockCat}
          ?open=${false}
          @cat-rename=${() => {
            alert("Rename Whiskers");
            const menu = document.querySelector(
              "mb-cat-context-menu"
            ) as any;
            if (menu) menu.open = false;
          }}
          @cat-change-hat=${() => {
            alert("Change Whiskers' hat");
            const menu = document.querySelector(
              "mb-cat-context-menu"
            ) as any;
            if (menu) menu.open = false;
          }}
          @cat-remove=${() => {
            if (confirm("Remove Whiskers?")) {
              alert("Whiskers removed");
            }
            const menu = document.querySelector(
              "mb-cat-context-menu"
            ) as any;
            if (menu) menu.open = false;
          }}
          @menu-close=${() => {
            const menu = document.querySelector(
              "mb-cat-context-menu"
            ) as any;
            if (menu) menu.open = false;
          }}
        ></mb-cat-context-menu>
      </div>
    `;
  },
};

/**
 * Positioned at different locations.
 * Shows menu adapting to various positions.
 */
export const DifferentPositions: Story = {
  render: () => {
    const mockCat = {
      name: "Mittens",
      id: "mock-cat-3",
    } as any;

    return html`
      <div
        style="position: relative; height: 500px; background: #f5f5f5; border-radius: 4px;"
      >
        <div style="padding: 1rem; margin-bottom: 1rem;">
          <h3 style="margin: 0 0 0.5rem 0;">
            Click buttons to see menu at different positions:
          </h3>
        </div>

        <!-- Top-left -->
        <mb-button
          style="position: absolute; left: 20px; top: 60px;"
          @click=${(e: MouseEvent) => {
            const button = e.currentTarget as HTMLElement;
            const rect = button.getBoundingClientRect();
            const menu = document.getElementById(
              "position-menu"
            ) as any;
            if (menu) {
              menu.open = true;
              menu.left = rect.left;
              menu.top = rect.bottom + 4;
            }
          }}
        >
          Top-Left
        </mb-button>

        <!-- Top-right -->
        <mb-button
          style="position: absolute; right: 20px; top: 60px;"
          @click=${(e: MouseEvent) => {
            const button = e.currentTarget as HTMLElement;
            const rect = button.getBoundingClientRect();
            const menu = document.getElementById(
              "position-menu"
            ) as any;
            if (menu) {
              menu.open = true;
              menu.left = rect.right - 150; // Menu width approximation
              menu.top = rect.bottom + 4;
            }
          }}
        >
          Top-Right
        </mb-button>

        <!-- Bottom-left -->
        <mb-button
          style="position: absolute; left: 20px; bottom: 20px;"
          @click=${(e: MouseEvent) => {
            const button = e.currentTarget as HTMLElement;
            const rect = button.getBoundingClientRect();
            const menu = document.getElementById(
              "position-menu"
            ) as any;
            if (menu) {
              menu.open = true;
              menu.left = rect.left;
              menu.top = rect.top - 140; // Menu height approximation
            }
          }}
        >
          Bottom-Left
        </mb-button>

        <!-- Bottom-right -->
        <mb-button
          style="position: absolute; right: 20px; bottom: 20px;"
          @click=${(e: MouseEvent) => {
            const button = e.currentTarget as HTMLElement;
            const rect = button.getBoundingClientRect();
            const menu = document.getElementById(
              "position-menu"
            ) as any;
            if (menu) {
              menu.open = true;
              menu.left = rect.right - 150;
              menu.top = rect.top - 140;
            }
          }}
        >
          Bottom-Right
        </mb-button>

        <mb-cat-context-menu
          id="position-menu"
          .cat=${mockCat}
          ?open=${false}
          @cat-rename=${() => {
            alert("Rename Mittens");
            const menu = document.getElementById(
              "position-menu"
            ) as any;
            if (menu) menu.open = false;
          }}
          @cat-change-hat=${() => {
            alert("Change Mittens' hat");
            const menu = document.getElementById(
              "position-menu"
            ) as any;
            if (menu) menu.open = false;
          }}
          @cat-remove=${() => {
            if (confirm("Remove Mittens?")) {
              alert("Mittens removed");
            }
            const menu = document.getElementById(
              "position-menu"
            ) as any;
            if (menu) menu.open = false;
          }}
          @menu-close=${() => {
            const menu = document.getElementById(
              "position-menu"
            ) as any;
            if (menu) menu.open = false;
          }}
        ></mb-cat-context-menu>
      </div>
    `;
  },
};
