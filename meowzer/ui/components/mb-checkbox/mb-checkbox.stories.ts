import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-checkbox.js";

const meta: Meta = {
  title: "Components/mb-checkbox",
  component: "mb-checkbox",
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    required: { control: "boolean" },
    helper: { control: "text" },
    errorMessage: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {},
  render: (args) => html`
    <mb-checkbox
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?error=${args.error}
      ?required=${args.required}
      helper=${args.helper || ""}
      error-message=${args.errorMessage || ""}
    >
      Subscribe to newsletter
    </mb-checkbox>
  `,
};

export const Checked: Story = {
  args: {
    checked: true,
  },
  render: (args) => html`
    <mb-checkbox ?checked=${args.checked}>
      I agree to the terms and conditions
    </mb-checkbox>
  `,
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
  render: (args) => html`
    <mb-checkbox ?indeterminate=${args.indeterminate}>
      Select all items
    </mb-checkbox>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <mb-checkbox disabled>Disabled unchecked</mb-checkbox>
      <mb-checkbox checked disabled>Disabled checked</mb-checkbox>
      <mb-checkbox indeterminate disabled
        >Disabled indeterminate</mb-checkbox
      >
    </div>
  `,
};

export const WithHelper: Story = {
  render: () => html`
    <mb-checkbox helper="You'll receive updates about new features">
      Subscribe to updates
    </mb-checkbox>
  `,
};

export const WithError: Story = {
  render: () => html`
    <mb-checkbox
      error
      error-message="You must accept the terms to continue"
    >
      I agree to the terms
    </mb-checkbox>
  `,
};

export const Required: Story = {
  render: () => html`
    <mb-checkbox required helper="This field is required">
      Accept privacy policy
    </mb-checkbox>
  `,
};

export const AllStates: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Unchecked
        </h3>
        <mb-checkbox>Default option</mb-checkbox>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Checked
        </h3>
        <mb-checkbox checked>Selected option</mb-checkbox>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Indeterminate
        </h3>
        <mb-checkbox indeterminate>Partial selection</mb-checkbox>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          With Helper
        </h3>
        <mb-checkbox
          helper="Additional information about this option"
        >
          Option with helper
        </mb-checkbox>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Error State
        </h3>
        <mb-checkbox error error-message="This option is required">
          Required option
        </mb-checkbox>
      </div>

      <div>
        <h3
          style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;"
        >
          Disabled
        </h3>
        <mb-checkbox disabled>Disabled option</mb-checkbox>
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
      }}
    >
      <mb-checkbox
        name="newsletter"
        value="yes"
        helper="Get weekly updates about new features"
      >
        Subscribe to newsletter
      </mb-checkbox>

      <mb-checkbox
        name="terms"
        value="accepted"
        required
        error-message="You must accept the terms"
      >
        I agree to the terms and conditions
      </mb-checkbox>

      <mb-checkbox name="marketing" value="yes">
        Send me marketing emails
      </mb-checkbox>

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
    let state = {
      option1: false,
      option2: false,
      option3: false,
    };

    const updateSelectAll = () => {
      const allChecked =
        state.option1 && state.option2 && state.option3;
      const noneChecked =
        !state.option1 && !state.option2 && !state.option3;
      const selectAll = document.getElementById("select-all") as any;

      if (allChecked) {
        selectAll.checked = true;
        selectAll.indeterminate = false;
      } else if (noneChecked) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
      } else {
        selectAll.checked = false;
        selectAll.indeterminate = true;
      }
    };

    return html`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <mb-checkbox
          id="select-all"
          @mb-change=${(e: CustomEvent) => {
            const checked = e.detail.checked;
            state.option1 = checked;
            state.option2 = checked;
            state.option3 = checked;

            const option1 = document.getElementById("option1") as any;
            const option2 = document.getElementById("option2") as any;
            const option3 = document.getElementById("option3") as any;

            option1.checked = checked;
            option2.checked = checked;
            option3.checked = checked;
          }}
        >
          <strong>Select all</strong>
        </mb-checkbox>

        <div
          style="margin-left: 24px; display: flex; flex-direction: column; gap: 8px;"
        >
          <mb-checkbox
            id="option1"
            @mb-change=${(e: CustomEvent) => {
              state.option1 = e.detail.checked;
              updateSelectAll();
            }}
          >
            Option 1
          </mb-checkbox>

          <mb-checkbox
            id="option2"
            @mb-change=${(e: CustomEvent) => {
              state.option2 = e.detail.checked;
              updateSelectAll();
            }}
          >
            Option 2
          </mb-checkbox>

          <mb-checkbox
            id="option3"
            @mb-change=${(e: CustomEvent) => {
              state.option3 = e.detail.checked;
              updateSelectAll();
            }}
          >
            Option 3
          </mb-checkbox>
        </div>
      </div>
    `;
  },
};

export const CatCreatorExample: Story = {
  render: () => html`
    <div style="max-width: 500px;">
      <h3
        style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600;"
      >
        Cat Behavior Options
      </h3>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        <mb-checkbox
          name="roaming"
          value="yes"
          helper="The cat will automatically move around the viewport"
        >
          Make cat roam the viewport
        </mb-checkbox>

        <mb-checkbox
          name="interactive"
          value="yes"
          helper="Users can click and drag the cat"
        >
          Enable interactive mode
        </mb-checkbox>

        <mb-checkbox
          name="animations"
          value="yes"
          checked
          helper="Play idle animations when cat is stationary"
        >
          Enable animations
        </mb-checkbox>
      </div>
    </div>
  `,
};
