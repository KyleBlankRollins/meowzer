import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-textarea.js";

const meta = {
  title: "Components/Textarea",
  component: "mb-textarea",
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the textarea",
    },
    value: {
      control: "text",
      description: "Current value of the textarea",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    helper: {
      control: "text",
      description: "Helper text displayed below textarea",
    },
    errorMessage: {
      control: "text",
      description: "Error message displayed when error is true",
    },
    error: {
      control: "boolean",
      description: "Whether the textarea is in error state",
    },
    required: {
      control: "boolean",
      description: "Whether the textarea is required",
    },
    disabled: {
      control: "boolean",
      description: "Whether the textarea is disabled",
    },
    rows: {
      control: "number",
      description: "Number of visible text rows",
    },
    showCounter: {
      control: "boolean",
      description: "Whether to show character counter",
    },
    resizable: {
      control: "select",
      options: ["true", "false"],
      description: "Whether the textarea is resizable",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Textarea

A textarea component for multi-line text entry with label, helper text, error states, and character counting.

### Features

- **Multi-line Input**: Configurable rows
- **Resizable**: Optional vertical resize
- **Character Counter**: Track character usage with visual feedback
- **Label Support**: Optional label with required indicator
- **Helper Text**: Additional guidance below textarea
- **Error States**: Visual feedback and error messages
- **Validation**: Required, maxlength attributes
- **Accessible**: ARIA attributes and keyboard support
- **Customizable**: CSS parts for external styling

### Usage

\`\`\`html
<!-- Basic textarea -->
<mb-textarea
  label="Description"
  placeholder="Enter description"
  rows="4"
></mb-textarea>

<!-- With character counter -->
<mb-textarea
  label="Bio"
  maxlength="500"
  show-counter
  helper="Tell us about yourself"
></mb-textarea>

<!-- Non-resizable -->
<mb-textarea
  label="Message"
  rows="3"
  resizable="false"
></mb-textarea>
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
    label: "Description",
    placeholder: "Enter description",
    value: "",
    helper: "",
    errorMessage: "",
    error: false,
    required: false,
    disabled: false,
    rows: 3,
    showCounter: false,
    resizable: "true",
  },
  render: (args) => html`
    <mb-textarea
      label=${args.label}
      placeholder=${args.placeholder}
      value=${args.value}
      helper=${args.helper}
      error-message=${args.errorMessage}
      ?error=${args.error}
      ?required=${args.required}
      ?disabled=${args.disabled}
      rows=${args.rows}
      ?show-counter=${args.showCounter}
      resizable=${args.resizable}
    ></mb-textarea>
  `,
};

// With helper text
export const WithHelper: Story = {
  args: {
    label: "Feedback",
    placeholder: "Share your thoughts",
    rows: 4,
    helper: "Your feedback helps us improve",
  },
  render: (args) => html`
    <mb-textarea
      label=${args.label}
      placeholder=${args.placeholder}
      rows=${args.rows}
      helper=${args.helper}
    ></mb-textarea>
  `,
};

// With character counter
export const WithCounter: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself",
    rows: 4,
    maxlength: 500,
    showCounter: true,
    helper: "Keep it brief and interesting",
  },
  render: (args) => html`
    <mb-textarea
      label=${args.label}
      placeholder=${args.placeholder}
      rows=${args.rows}
      maxlength=${args.maxlength}
      ?show-counter=${args.showCounter}
      helper=${args.helper}
    ></mb-textarea>
  `,
};

// Required field
export const Required: Story = {
  args: {
    label: "Message",
    placeholder: "Your message",
    rows: 5,
    required: true,
    helper: "This field is required",
  },
  render: (args) => html`
    <mb-textarea
      label=${args.label}
      placeholder=${args.placeholder}
      rows=${args.rows}
      ?required=${args.required}
      helper=${args.helper}
    ></mb-textarea>
  `,
};

// Error state
export const ErrorState: Story = {
  args: {
    label: "Comments",
    value: "Too short",
    rows: 4,
    error: true,
    errorMessage: "Comments must be at least 50 characters",
  },
  render: (args) => html`
    <mb-textarea
      label=${args.label}
      value=${args.value}
      rows=${args.rows}
      ?error=${args.error}
      error-message=${args.errorMessage}
    ></mb-textarea>
  `,
};

// Disabled
export const Disabled: Story = {
  args: {
    label: "Read Only",
    value: "This content cannot be edited",
    rows: 3,
    disabled: true,
  },
  render: (args) => html`
    <mb-textarea
      label=${args.label}
      value=${args.value}
      rows=${args.rows}
      ?disabled=${args.disabled}
    ></mb-textarea>
  `,
};

// Non-resizable
export const NonResizable: Story = {
  args: {
    label: "Fixed Size",
    placeholder: "This textarea cannot be resized",
    rows: 4,
    resizable: "false",
  },
  render: (args) => html`
    <mb-textarea
      label=${args.label}
      placeholder=${args.placeholder}
      rows=${args.rows}
      resizable=${args.resizable}
    ></mb-textarea>
  `,
};

// Cat description (like in cat-creator)
export const CatDescription: Story = {
  render: () => html`
    <div style="max-width: 500px;">
      <h3
        style="margin: 0 0 1rem 0; color: var(--mb-color-text-primary);"
      >
        Cat Profile
      </h3>
      <mb-textarea
        label="Description"
        placeholder="Describe your cat's personality, habits, and quirks..."
        rows="5"
        maxlength="500"
        show-counter
        helper="Share what makes your cat unique"
      ></mb-textarea>
    </div>
  `,
};

// Different sizes
export const DifferentSizes: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 500px;"
    >
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Small (3 rows)
        </h4>
        <mb-textarea
          label="Small"
          placeholder="3 rows"
          rows="3"
        ></mb-textarea>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Medium (5 rows)
        </h4>
        <mb-textarea
          label="Medium"
          placeholder="5 rows"
          rows="5"
        ></mb-textarea>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Large (8 rows)
        </h4>
        <mb-textarea
          label="Large"
          placeholder="8 rows"
          rows="8"
        ></mb-textarea>
      </div>
    </div>
  `,
};

// Form example
export const FormExample: Story = {
  render: () => html`
    <form
      style="max-width: 500px; display: flex; flex-direction: column; gap: 1.5rem;"
    >
      <h3 style="margin: 0; color: var(--mb-color-text-primary);">
        Contact Form
      </h3>
      <mb-textarea
        label="Message"
        placeholder="How can we help?"
        rows="6"
        required
        maxlength="1000"
        show-counter
        helper="Please provide as much detail as possible"
      ></mb-textarea>
      <mb-textarea
        label="Additional Comments (Optional)"
        placeholder="Anything else we should know?"
        rows="4"
      ></mb-textarea>
    </form>
  `,
};

// All states
export const AllStates: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 500px;"
    >
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Default
        </h4>
        <mb-textarea
          label="Default State"
          placeholder="Enter text"
          rows="3"
        ></mb-textarea>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          With Value
        </h4>
        <mb-textarea
          label="With Value"
          value="Some text here"
          rows="3"
        ></mb-textarea>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          With Helper
        </h4>
        <mb-textarea
          label="With Helper"
          helper="This is helpful information"
          rows="3"
        ></mb-textarea>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Required
        </h4>
        <mb-textarea
          label="Required Field"
          required
          rows="3"
        ></mb-textarea>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          With Counter
        </h4>
        <mb-textarea
          label="With Counter"
          value="Hello world"
          maxlength="100"
          show-counter
          rows="3"
        ></mb-textarea>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Error
        </h4>
        <mb-textarea
          label="Error State"
          error
          error-message="This field is required"
          rows="3"
        ></mb-textarea>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Disabled
        </h4>
        <mb-textarea
          label="Disabled State"
          value="Cannot edit"
          disabled
          rows="3"
        ></mb-textarea>
      </div>
      <div>
        <h4
          style="margin: 0 0 0.5rem 0; color: var(--mb-color-text-secondary); font-size: 0.875rem;"
        >
          Non-resizable
        </h4>
        <mb-textarea
          label="Non-resizable"
          placeholder="Cannot resize vertically"
          resizable="false"
          rows="3"
        ></mb-textarea>
      </div>
    </div>
  `,
};

// Interactive character counter
export const InteractiveCounter: Story = {
  render: () => {
    return html`
      <div style="max-width: 500px;">
        <h3
          style="margin: 0 0 1rem 0; color: var(--mb-color-text-primary);"
        >
          Character Counter Demo
        </h3>
        <mb-textarea
          label="Tweet"
          placeholder="What's happening?"
          rows="4"
          maxlength="280"
          show-counter
          helper="Twitter-style character limit"
        ></mb-textarea>
      </div>
    `;
  },
};

// Validation example
export const ValidationExample: Story = {
  render: () => {
    const handleInput = (e: Event) => {
      const value = (e as CustomEvent).detail.value;
      const minLength = 50;

      if (value.length > 0 && value.length < minLength) {
        (e.target as any).error = true;
        (
          e.target as any
        ).errorMessage = `Please enter at least ${minLength} characters (${value.length}/${minLength})`;
      } else {
        (e.target as any).error = false;
        (e.target as any).errorMessage = "";
      }
    };

    return html`
      <div style="max-width: 500px;">
        <h3
          style="margin: 0 0 1rem 0; color: var(--mb-color-text-primary);"
        >
          Real-time Validation
        </h3>
        <mb-textarea
          label="Detailed Feedback"
          placeholder="Share your thoughts in detail..."
          rows="6"
          maxlength="500"
          show-counter
          helper="Minimum 50 characters required"
          @mb-input=${handleInput}
        ></mb-textarea>
      </div>
    `;
  },
};
