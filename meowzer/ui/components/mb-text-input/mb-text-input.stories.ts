import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-text-input.js";

const meta = {
  title: "Components/TextInput",
  component: "mb-text-input",
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the input",
    },
    value: {
      control: "text",
      description: "Current value of the input",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    helper: {
      control: "text",
      description: "Helper text displayed below input",
    },
    errorMessage: {
      control: "text",
      description: "Error message displayed when error is true",
    },
    error: {
      control: "boolean",
      description: "Whether the input is in error state",
    },
    required: {
      control: "boolean",
      description: "Whether the input is required",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "tel", "url", "search"],
      description: "Input type",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Text Input

A text input component for single-line text entry with label, helper text, and error states.

### Features

- **Multiple Input Types**: text, email, password, tel, url, search
- **Label Support**: Optional label with required indicator
- **Helper Text**: Additional guidance below input
- **Error States**: Visual feedback and error messages
- **Validation**: Required, maxlength attributes
- **Accessible**: ARIA attributes and keyboard support
- **Customizable**: CSS parts for external styling

### Usage

\`\`\`html
<!-- Basic input -->
<mb-text-input
  label="Username"
  placeholder="Enter username"
></mb-text-input>

<!-- With validation -->
<mb-text-input
  label="Email"
  type="email"
  required
  helper="We'll never share your email"
></mb-text-input>

<!-- Error state -->
<mb-text-input
  label="Password"
  type="password"
  error
  error-message="Password must be at least 8 characters"
></mb-text-input>
\`\`\`
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Default story
export const Default: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    value: "",
    helper: "",
    errorMessage: "",
    error: false,
    required: false,
    disabled: false,
    type: "text",
  },
  render: (args) => html`
    <mb-text-input
      label=${args.label}
      placeholder=${args.placeholder}
      value=${args.value}
      helper=${args.helper}
      error-message=${args.errorMessage}
      ?error=${args.error}
      ?required=${args.required}
      ?disabled=${args.disabled}
      type=${args.type}
    ></mb-text-input>
  `,
};

// With helper text
export const WithHelper: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    helper: "We'll never share your email with anyone else",
  },
  render: (args) => html`
    <mb-text-input
      label=${args.label}
      type=${args.type}
      placeholder=${args.placeholder}
      helper=${args.helper}
    ></mb-text-input>
  `,
};

// Required field
export const Required: Story = {
  args: {
    label: "Full Name",
    placeholder: "John Doe",
    required: true,
    helper: "This field is required",
  },
  render: (args) => html`
    <mb-text-input
      label=${args.label}
      placeholder=${args.placeholder}
      ?required=${args.required}
      helper=${args.helper}
    ></mb-text-input>
  `,
};

// Error state
export const ErrorState: Story = {
  args: {
    label: "Password",
    type: "password",
    value: "123",
    error: true,
    errorMessage: "Password must be at least 8 characters",
  },
  render: (args) => html`
    <mb-text-input
      label=${args.label}
      type=${args.type}
      value=${args.value}
      ?error=${args.error}
      error-message=${args.errorMessage}
    ></mb-text-input>
  `,
};

// Disabled
export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    value: "Cannot edit this",
    disabled: true,
  },
  render: (args) => html`
    <mb-text-input
      label=${args.label}
      value=${args.value}
      ?disabled=${args.disabled}
    ></mb-text-input>
  `,
};

// Different types
export const DifferentTypes: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;"
    >
      <mb-text-input
        label="Text"
        type="text"
        placeholder="Enter text"
      ></mb-text-input>
      <mb-text-input
        label="Email"
        type="email"
        placeholder="you@example.com"
      ></mb-text-input>
      <mb-text-input
        label="Password"
        type="password"
        placeholder="Enter password"
      ></mb-text-input>
      <mb-text-input
        label="Phone"
        type="tel"
        placeholder="(123) 456-7890"
      ></mb-text-input>
      <mb-text-input
        label="Website"
        type="url"
        placeholder="https://example.com"
      ></mb-text-input>
      <mb-text-input
        label="Search"
        type="search"
        placeholder="Search..."
      ></mb-text-input>
    </div>
  `,
};

// Form example
export const FormExample: Story = {
  render: () => html`
    <form
      style="max-width: 400px; display: flex; flex-direction: column; gap: 1.5rem;"
    >
      <h3 style="margin: 0; color: var(--mb-color-text-primary);">
        Sign Up Form
      </h3>
      <mb-text-input
        label="Full Name"
        placeholder="John Doe"
        required
      ></mb-text-input>
      <mb-text-input
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        helper="We'll send a confirmation email"
      ></mb-text-input>
      <mb-text-input
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        required
        helper="Use a strong password"
      ></mb-text-input>
      <mb-text-input
        label="Phone (Optional)"
        type="tel"
        placeholder="(123) 456-7890"
      ></mb-text-input>
    </form>
  `,
};

// Cat name input (like in cat-creator)
export const CatNameInput: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <h3
        style="margin: 0 0 1rem 0; color: var(--mb-color-text-primary);"
      >
        Create Your Cat
      </h3>
      <mb-text-input
        label="Cat Name"
        placeholder="e.g., Whiskers"
        required
        helper="Choose a unique name for your cat"
      ></mb-text-input>
    </div>
  `,
};

// All states
export const AllStates: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;"
    >
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Default
        </h4>
        <mb-text-input
          label="Default State"
          placeholder="Enter text"
        ></mb-text-input>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          With Value
        </h4>
        <mb-text-input
          label="With Value"
          value="Some text here"
        ></mb-text-input>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          With Helper
        </h4>
        <mb-text-input
          label="With Helper"
          helper="This is helpful information"
        ></mb-text-input>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Required
        </h4>
        <mb-text-input
          label="Required Field"
          required
        ></mb-text-input>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Error
        </h4>
        <mb-text-input
          label="Error State"
          error
          error-message="This field is required"
        ></mb-text-input>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Disabled
        </h4>
        <mb-text-input
          label="Disabled State"
          value="Cannot edit"
          disabled
        ></mb-text-input>
      </div>
    </div>
  `,
};

// Interactive validation
export const InteractiveValidation: Story = {
  render: () => {
    const handleInput = (e: Event) => {
      const value = (e as CustomEvent).detail.value;

      // Simple email validation
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (value && !isValid) {
        (e.target as any).error = true;
        (e.target as any).errorMessage =
          "Please enter a valid email address";
      } else {
        (e.target as any).error = false;
        (e.target as any).errorMessage = "";
      }
    };

    return html`
      <div style="max-width: 400px;">
        <h3
          style="margin: 0 0 1rem 0; color: var(--mb-color-text-primary);"
        >
          Real-time Validation
        </h3>
        <mb-text-input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          helper="Enter a valid email address"
          @mb-input=${handleInput}
        ></mb-text-input>
      </div>
    `;
  },
};

// Character counter
export const CharacterCounter: Story = {
  render: () => {
    const maxLength = 50;

    const handleInput = (e: Event) => {
      const value = (e as CustomEvent).detail.value;
      const remaining = maxLength - value.length;

      const counter = document.getElementById("char-counter");
      if (counter) {
        counter.textContent = `${remaining} characters remaining`;
        counter.style.color =
          remaining < 10
            ? "var(--mb-color-feedback-error)"
            : "var(--mb-color-text-secondary)";
      }
    };

    return html`
      <div style="max-width: 400px;">
        <mb-text-input
          label="Short Description"
          placeholder="Keep it brief..."
          maxlength=${maxLength}
          @mb-input=${handleInput}
        ></mb-text-input>
        <div
          id="char-counter"
          style="
            margin-top: 0.25rem;
            font-size: var(--mb-font-size-small);
            color: var(--mb-color-text-secondary);
          "
        >
          ${maxLength} characters remaining
        </div>
      </div>
    `;
  },
};
