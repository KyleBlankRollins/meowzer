import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-modal.js";

const meta = {
  title: "Components/Modal",
  component: "mb-modal",
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the modal is visible",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant of the modal",
    },
    heading: {
      control: "text",
      description: "Heading text for the modal",
    },
    showClose: {
      control: "boolean",
      description: "Whether to show the close button",
    },
    closeOnBackdrop: {
      control: "boolean",
      description: "Whether clicking the backdrop closes the modal",
    },
    closeOnEscape: {
      control: "boolean",
      description: "Whether pressing Escape closes the modal",
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    open: true,
    size: "md",
    heading: "Modal Heading",
    showClose: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
  },
  render: (args) => html`
    <mb-modal
      ?open=${args.open}
      size=${args.size}
      heading=${args.heading}
      ?showClose=${args.showClose}
      ?closeOnBackdrop=${args.closeOnBackdrop}
      ?closeOnEscape=${args.closeOnEscape}
    >
      <p>
        This is the modal body content. You can put anything here.
      </p>
      <div slot="footer">
        <button>Cancel</button>
        <button>Confirm</button>
      </div>
    </mb-modal>
  `,
};

export const SmallSize: Story = {
  args: {
    open: true,
    size: "sm",
    heading: "Small Modal",
  },
  render: (args) => html`
    <mb-modal
      ?open=${args.open}
      size=${args.size}
      heading=${args.heading}
    >
      <p>This is a small modal. Perfect for simple confirmations.</p>
      <div slot="footer">
        <button>OK</button>
      </div>
    </mb-modal>
  `,
};

export const LargeSize: Story = {
  args: {
    open: true,
    size: "lg",
    heading: "Large Modal",
  },
  render: (args) => html`
    <mb-modal
      ?open=${args.open}
      size=${args.size}
      heading=${args.heading}
    >
      <p>
        This is a large modal. Great for detailed content or forms.
      </p>
      <p>
        You can include multiple paragraphs, images, or other content.
      </p>
      <div slot="footer">
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </mb-modal>
  `,
};

export const WithForm: Story = {
  args: {
    open: true,
    heading: "Edit Profile",
  },
  render: (args) => html`
    <mb-modal ?open=${args.open} heading=${args.heading}>
      <form style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            style="width: 100%; padding: 0.5rem;"
          />
        </div>
        <div>
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            style="width: 100%; padding: 0.5rem;"
          />
        </div>
        <div>
          <label for="bio">Bio</label>
          <textarea
            id="bio"
            placeholder="Tell us about yourself"
            rows="4"
            style="width: 100%; padding: 0.5rem;"
          ></textarea>
        </div>
      </form>
      <div slot="footer">
        <button type="button">Cancel</button>
        <button type="submit">Save Changes</button>
      </div>
    </mb-modal>
  `,
};

export const Confirmation: Story = {
  args: {
    open: true,
    size: "sm",
    heading: "Confirm Delete",
  },
  render: (args) => html`
    <mb-modal
      ?open=${args.open}
      size=${args.size}
      heading=${args.heading}
    >
      <p>
        Are you sure you want to delete this item? This action cannot
        be undone.
      </p>
      <div slot="footer">
        <button>Cancel</button>
        <button
          style="background: #da1e28; color: white; padding: 0.5rem 1rem; border: none; cursor: pointer;"
        >
          Delete
        </button>
      </div>
    </mb-modal>
  `,
};

export const LongContent: Story = {
  args: {
    open: true,
    heading: "Terms and Conditions",
  },
  render: (args) => html`
    <mb-modal ?open=${args.open} heading=${args.heading}>
      <h3>1. Introduction</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>

      <h3>2. User Agreement</h3>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </p>

      <h3>3. Privacy Policy</h3>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur.
      </p>

      <h3>4. Data Collection</h3>
      <p>
        Excepteur sint occaecat cupidatat non proident, sunt in culpa
        qui officia deserunt mollit anim id est laborum.
      </p>

      <h3>5. Cookie Policy</h3>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium.
      </p>

      <h3>6. Third-Party Services</h3>
      <p>
        Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
        et quasi architecto beatae vitae dicta sunt explicabo.
      </p>

      <h3>7. Limitation of Liability</h3>
      <p>
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui
        ratione voluptatem sequi nesciunt.
      </p>

      <div slot="footer">
        <button>Decline</button>
        <button>Accept</button>
      </div>
    </mb-modal>
  `,
};

export const CustomHeader: Story = {
  args: {
    open: true,
  },
  render: (args) => html`
    <mb-modal ?open=${args.open}>
      <div
        slot="header"
        style="display: flex; align-items: center; gap: 0.5rem;"
      >
        <span style="font-size: 1.5rem;">🎉</span>
        <span style="font-size: 1.25rem; font-weight: 600;"
          >Success!</span
        >
      </div>
      <p>Your changes have been saved successfully.</p>
      <div slot="footer">
        <button>Close</button>
      </div>
    </mb-modal>
  `,
};

export const NoCloseButton: Story = {
  args: {
    open: true,
    heading: "Important Notice",
    showClose: false,
    closeOnBackdrop: false,
    closeOnEscape: false,
  },
  render: (args) => html`
    <mb-modal
      ?open=${args.open}
      heading=${args.heading}
      ?showClose=${args.showClose}
      ?closeOnBackdrop=${args.closeOnBackdrop}
      ?closeOnEscape=${args.closeOnEscape}
    >
      <p>You must acknowledge this message before continuing.</p>
      <div slot="footer">
        <button>I Understand</button>
      </div>
    </mb-modal>
  `,
};

export const Interactive: Story = {
  render: () => {
    const handleOpen = () => {
      document
        .getElementById("interactive-modal")
        ?.setAttribute("open", "");
    };

    const handleClose = () => {
      document
        .getElementById("interactive-modal")
        ?.removeAttribute("open");
    };

    return html`
      <div>
        <button
          @click=${handleOpen}
          style="padding: 0.75rem 1.5rem; cursor: pointer;"
        >
          Open Modal
        </button>

        <mb-modal
          id="interactive-modal"
          heading="Interactive Modal"
          @mb-close=${handleClose}
        >
          <p>This modal can be opened and closed interactively.</p>
          <p>
            Try clicking the backdrop, pressing Escape, or clicking
            the close button.
          </p>
          <div slot="footer">
            <button @click=${handleClose}>Close</button>
          </div>
        </mb-modal>
      </div>
    `;
  },
};
