import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-notification.js";

const meta = {
  title: "Components/Notification",
  component: "mb-notification",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
      description: "The variant/type of notification",
    },
    title: {
      control: "text",
      description: "The title of the notification",
    },
    subtitle: {
      control: "text",
      description: "The subtitle/message of the notification",
    },
    hideCloseButton: {
      control: "boolean",
      description: "Whether to hide the close button",
    },
    lowContrast: {
      control: "boolean",
      description: "Use low contrast (neutral) background",
    },
    toast: {
      control: "boolean",
      description: "Display as toast with fixed positioning",
    },
    position: {
      control: "select",
      options: [
        "top-right",
        "top-left",
        "bottom-right",
        "bottom-left",
        "top-center",
        "bottom-center",
      ],
      description: "Toast position (only when toast=true)",
    },
    timeout: {
      control: "number",
      description:
        "Auto-dismiss timeout in milliseconds (0 = no auto-dismiss)",
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Info: Story = {
  args: {
    variant: "info",
    title: "Information",
    subtitle: "This is an informational message.",
    hideCloseButton: false,
  },
  render: (args) => html`
    <mb-notification
      variant=${args.variant}
      title=${args.title}
      subtitle=${args.subtitle}
      ?hide-close-button=${args.hideCloseButton}
    >
    </mb-notification>
  `,
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success!",
    subtitle: "Your changes have been saved successfully.",
    hideCloseButton: false,
  },
  render: (args) => html`
    <mb-notification
      variant=${args.variant}
      title=${args.title}
      subtitle=${args.subtitle}
      ?hide-close-button=${args.hideCloseButton}
    >
    </mb-notification>
  `,
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    subtitle: "Please review your settings before continuing.",
    hideCloseButton: false,
  },
  render: (args) => html`
    <mb-notification
      variant=${args.variant}
      title=${args.title}
      subtitle=${args.subtitle}
      ?hide-close-button=${args.hideCloseButton}
    >
    </mb-notification>
  `,
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    subtitle: "Something went wrong. Please try again.",
    hideCloseButton: false,
  },
  render: (args) => html`
    <mb-notification
      variant=${args.variant}
      title=${args.title}
      subtitle=${args.subtitle}
      ?hide-close-button=${args.hideCloseButton}
    >
    </mb-notification>
  `,
};

export const TitleOnly: Story = {
  args: {
    variant: "info",
    title: "Quick message",
    hideCloseButton: true,
  },
  render: (args) => html`
    <mb-notification
      variant=${args.variant}
      title=${args.title}
      ?hide-close-button=${args.hideCloseButton}
    >
    </mb-notification>
  `,
};

export const WithSlotContent: Story = {
  args: {
    variant: "error",
    title: "Please fix the following:",
  },
  render: (args) => html`
    <mb-notification variant=${args.variant} title=${args.title}>
      <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
        <li>Name is required</li>
        <li>Email must be valid</li>
        <li>Password must be at least 8 characters</li>
      </ul>
    </mb-notification>
  `,
};

export const LowContrast: Story = {
  args: {
    variant: "info",
    title: "Low Contrast Variant",
    subtitle:
      "Uses neutral background instead of colored background.",
    lowContrast: true,
  },
  render: (args) => html`
    <mb-notification
      variant=${args.variant}
      title=${args.title}
      subtitle=${args.subtitle}
      ?low-contrast=${args.lowContrast}
    >
    </mb-notification>
  `,
};

export const ToastTopRight: Story = {
  args: {
    variant: "success",
    title: "Toast Notification",
    subtitle: "This appears in the top-right corner.",
    toast: true,
    position: "top-right",
  },
  render: (args) => html`
    <mb-notification
      variant=${args.variant}
      title=${args.title}
      subtitle=${args.subtitle}
      ?toast=${args.toast}
      position=${args.position}
    >
    </mb-notification>
  `,
};

export const ToastBottomCenter: Story = {
  args: {
    variant: "info",
    title: "Bottom Center Toast",
    subtitle: "This appears at the bottom center of the screen.",
    toast: true,
    position: "bottom-center",
  },
  render: (args) => html`
    <mb-notification
      variant=${args.variant}
      title=${args.title}
      subtitle=${args.subtitle}
      ?toast=${args.toast}
      position=${args.position}
    >
    </mb-notification>
  `,
};

export const AutoDismiss: Story = {
  args: {
    variant: "success",
    title: "Auto-dismiss",
    subtitle: "This notification will disappear after 3 seconds.",
    timeout: 3000,
  },
  render: (args) => {
    const handleClose = (e: Event) => {
      const target = e.target as HTMLElement;
      target.remove();
    };

    return html`
      <mb-notification
        variant=${args.variant}
        title=${args.title}
        subtitle=${args.subtitle}
        timeout=${args.timeout}
        @mb-close=${handleClose}
      >
      </mb-notification>
    `;
  },
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <mb-notification
        variant="info"
        title="Information"
        subtitle="This is an informational message."
      >
      </mb-notification>

      <mb-notification
        variant="success"
        title="Success"
        subtitle="Operation completed successfully."
      >
      </mb-notification>

      <mb-notification
        variant="warning"
        title="Warning"
        subtitle="Please review before proceeding."
      >
      </mb-notification>

      <mb-notification
        variant="error"
        title="Error"
        subtitle="An error occurred. Please try again."
      >
      </mb-notification>
    </div>
  `,
};

export const Interactive: Story = {
  render: () => {
    const showNotification = (
      variant: "info" | "success" | "warning" | "error"
    ) => {
      const container = document.getElementById(
        "notification-container"
      );
      if (!container) return;

      const notification = document.createElement("mb-notification");
      notification.variant = variant;
      notification.title = `${
        variant.charAt(0).toUpperCase() + variant.slice(1)
      } Notification`;
      notification.subtitle = "This notification can be dismissed.";
      notification.timeout = 5000;

      notification.addEventListener("mb-close", () => {
        notification.remove();
      });

      container.appendChild(notification);
    };

    return html`
      <div>
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
          <button @click=${() => showNotification("info")}>
            Show Info
          </button>
          <button @click=${() => showNotification("success")}>
            Show Success
          </button>
          <button @click=${() => showNotification("warning")}>
            Show Warning
          </button>
          <button @click=${() => showNotification("error")}>
            Show Error
          </button>
        </div>

        <div
          id="notification-container"
          style="display: flex; flex-direction: column; gap: 1rem;"
        ></div>
      </div>
    `;
  },
};
