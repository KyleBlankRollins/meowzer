import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-select.js";

const meta: Meta = {
  title: "Components/mb-select",
  component: "mb-select",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    helper: { control: "text" },
    errorMessage: { control: "text" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    label: "Choose an option",
  },
  render: (args) => html`
    <mb-select
      label=${args.label || ""}
      value=${args.value || ""}
      helper=${args.helper || ""}
      error-message=${args.errorMessage || ""}
      ?error=${args.error}
      ?disabled=${args.disabled}
      ?required=${args.required}
      size=${args.size || "md"}
      placeholder=${args.placeholder || ""}
    >
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </mb-select>
  `,
};

export const WithPlaceholder: Story = {
  render: () => html`
    <mb-select label="Pattern" placeholder="Select a pattern">
      <option value="solid">Solid</option>
      <option value="tabby">Tabby</option>
      <option value="spotted">Spotted</option>
      <option value="calico">Calico</option>
    </mb-select>
  `,
};

export const WithValue: Story = {
  render: () => html`
    <mb-select label="Color" value="orange">
      <option value="black">Black</option>
      <option value="white">White</option>
      <option value="orange">Orange</option>
      <option value="gray">Gray</option>
    </mb-select>
  `,
};

export const WithHelper: Story = {
  render: () => html`
    <mb-select
      label="Cat breed"
      helper="Choose the breed that best matches"
      placeholder="Select a breed"
    >
      <option value="persian">Persian</option>
      <option value="siamese">Siamese</option>
      <option value="maine-coon">Maine Coon</option>
      <option value="ragdoll">Ragdoll</option>
      <option value="british-shorthair">British Shorthair</option>
    </mb-select>
  `,
};

export const WithError: Story = {
  render: () => html`
    <mb-select
      label="Required field"
      error
      error-message="Please select an option"
      placeholder="Select an option"
    >
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </mb-select>
  `,
};

export const Required: Story = {
  render: () => html`
    <mb-select
      label="Personality preset"
      required
      helper="This field is required"
      placeholder="Select a preset"
    >
      <option value="playful">Playful</option>
      <option value="lazy">Lazy</option>
      <option value="curious">Curious</option>
      <option value="independent">Independent</option>
    </mb-select>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <mb-select
        label="Disabled without value"
        disabled
        placeholder="Select"
      >
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </mb-select>

      <mb-select label="Disabled with value" value="b" disabled>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </mb-select>
    </div>
  `,
};

export const SizeVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Small
        </h3>
        <mb-select label="Size" size="sm" placeholder="Select size">
          <option value="xs">Extra Small</option>
          <option value="s">Small</option>
          <option value="m">Medium</option>
          <option value="l">Large</option>
        </mb-select>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Medium (Default)
        </h3>
        <mb-select label="Size" size="md" placeholder="Select size">
          <option value="xs">Extra Small</option>
          <option value="s">Small</option>
          <option value="m">Medium</option>
          <option value="l">Large</option>
        </mb-select>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Large
        </h3>
        <mb-select label="Size" size="lg" placeholder="Select size">
          <option value="xs">Extra Small</option>
          <option value="s">Small</option>
          <option value="m">Medium</option>
          <option value="l">Large</option>
        </mb-select>
      </div>
    </div>
  `,
};

export const AllStates: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Empty
        </h3>
        <mb-select label="Option" placeholder="Choose">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </mb-select>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          With Value
        </h3>
        <mb-select label="Option" value="b">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </mb-select>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          With Helper
        </h3>
        <mb-select label="Option" helper="Additional information">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </mb-select>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Error State
        </h3>
        <mb-select
          label="Option"
          error
          error-message="This field is required"
        >
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </mb-select>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Required
        </h3>
        <mb-select label="Option" required>
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </mb-select>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Disabled
        </h3>
        <mb-select label="Option" disabled>
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </mb-select>
      </div>
    </div>
  `,
};

export const FormExample: Story = {
  render: () => html`
    <form
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
      @submit=${(e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        console.log(
          "Form data:",
          Object.fromEntries(formData.entries())
        );
        alert("Form submitted! Check console for data.");
      }}
    >
      <mb-select
        name="pattern"
        label="Cat pattern"
        helper="Choose the pattern for your cat"
        placeholder="Select a pattern"
      >
        <option value="solid">Solid</option>
        <option value="tabby">Tabby</option>
        <option value="spotted">Spotted</option>
        <option value="calico">Calico</option>
      </mb-select>

      <mb-select
        name="personality"
        label="Personality preset"
        required
        helper="This field is required"
      >
        <option value="">Select a preset</option>
        <option value="playful">Playful</option>
        <option value="lazy">Lazy</option>
        <option value="curious">Curious</option>
        <option value="independent">Independent</option>
      </mb-select>

      <mb-select name="size" label="Size" value="medium">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </mb-select>

      <button
        type="submit"
        style="
          padding: 8px 16px;
          background: var(--mb-color-interactive-primary);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 8px;
        "
      >
        Submit
      </button>
    </form>
  `,
};

export const InteractiveExample: Story = {
  render: () => {
    const handleChange = (e: CustomEvent) => {
      const display = document.getElementById("selected-value");
      if (display) {
        display.textContent = e.detail.value || "(none)";
      }
    };

    return html`
      <div style="max-width: 400px;">
        <mb-select
          label="Choose an option"
          placeholder="Select an option"
          @mb-change=${handleChange}
        >
          <option value="cats">Cats</option>
          <option value="dogs">Dogs</option>
          <option value="birds">Birds</option>
          <option value="fish">Fish</option>
        </mb-select>

        <div
          style="
            margin-top: 16px;
            padding: 12px;
            background: var(--mb-color-surface-secondary);
            border-radius: 4px;
          "
        >
          <strong>Selected value:</strong>
          <span id="selected-value">(none)</span>
        </div>
      </div>
    `;
  },
};

export const CatPatternSelector: Story = {
  render: () => html`
    <div style="max-width: 500px;">
      <h3
        style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;"
      >
        Cat Appearance Settings
      </h3>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        <mb-select
          label="Pattern"
          name="pattern"
          helper="The pattern style of your cat's fur"
          placeholder="Choose a pattern"
        >
          <option value="solid">Solid</option>
          <option value="tabby">Tabby</option>
          <option value="spotted">Spotted</option>
          <option value="calico">Calico</option>
          <option value="bicolor">Bicolor</option>
        </mb-select>

        <mb-select
          label="Primary color"
          name="color"
          value="orange"
          helper="The main color of your cat"
        >
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="orange">Orange</option>
          <option value="gray">Gray</option>
          <option value="brown">Brown</option>
          <option value="cream">Cream</option>
        </mb-select>

        <mb-select label="Eye color" name="eyes" value="green">
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="amber">Amber</option>
          <option value="heterochromia">
            Heterochromia (two colors)
          </option>
        </mb-select>
      </div>
    </div>
  `,
};
