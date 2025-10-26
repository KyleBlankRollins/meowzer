import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/collection-picker/collection-picker.js";
import "../providers/meowzer-provider.js";

const meta = {
  title: "Gallery Components/Collection Picker",
  component: "collection-picker",
  tags: ["autodocs"],
  argTypes: {
    selectedCollection: {
      control: "text",
      description: "Currently selected collection ID",
      table: {
        type: { summary: "string" },
      },
    },
    showCreateButton: {
      control: "boolean",
      description: "Whether to show the create collection button",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    showLabel: {
      control: "boolean",
      description: "Whether to show the label",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    label: {
      control: "text",
      description: "Label text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Collection:" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for select",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Select a collection" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Collection Picker

Dropdown selector for choosing a collection from available collections in storage.

### Usage

\`\`\`html
<meowzer-provider auto-init>
  <collection-picker
    .selectedCollection="\${collectionId}"
    @collection-select="\${handleSelect}"
    @collection-create="\${handleCreate}">
  </collection-picker>
</meowzer-provider>
\`\`\`

### Features

- **Reactive Collection List** - Automatically updates when collections change
- **Create Button** - Quick access to create new collections
- **Count Display** - Shows number of cats in each collection
- **Loading State** - Displays spinner while loading collections
- **Error Handling** - Shows error messages if loading fails
- **Empty State** - Helpful message when no collections exist
- **Context Integration** - Requires meowzer-provider ancestor

### Events

- **collection-select** - Emitted when a collection is selected with collectionId in detail
- **collection-create** - Emitted when create button is clicked
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    showCreateButton: true,
    showLabel: true,
    label: "Collection:",
    placeholder: "Select a collection",
  },
  render: (args) => html`
    <meowzer-provider auto-init>
      <collection-picker
        .selectedCollection=${args.selectedCollection}
        ?showCreateButton=${args.showCreateButton}
        ?showLabel=${args.showLabel}
        .label=${args.label}
        .placeholder=${args.placeholder}
        @collection-select=${(e: CustomEvent) => {
          console.log("Collection selected:", e.detail.collectionId);
        }}
        @collection-create=${() => {
          console.log("Create collection clicked");
        }}
      >
      </collection-picker>
    </meowzer-provider>
  `,
};

export const NoCreateButton: Story = {
  args: {
    showCreateButton: false,
    showLabel: true,
  },
  render: (args) => html`
    <meowzer-provider auto-init>
      <collection-picker
        ?showCreateButton=${args.showCreateButton}
        ?showLabel=${args.showLabel}
        @collection-select=${(e: CustomEvent) => {
          console.log("Collection selected:", e.detail.collectionId);
        }}
      >
      </collection-picker>
    </meowzer-provider>
  `,
};

export const NoLabel: Story = {
  args: {
    showCreateButton: true,
    showLabel: false,
  },
  render: (args) => html`
    <meowzer-provider auto-init>
      <collection-picker
        ?showCreateButton=${args.showCreateButton}
        ?showLabel=${args.showLabel}
        @collection-select=${(e: CustomEvent) => {
          console.log("Collection selected:", e.detail.collectionId);
        }}
        @collection-create=${() => {
          console.log("Create collection clicked");
        }}
      >
      </collection-picker>
    </meowzer-provider>
  `,
};

export const InForm: Story = {
  render: () => html`
    <meowzer-provider auto-init>
      <div
        style="max-width: 500px; padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;"
      >
        <h3 style="margin-top: 0;">Save Cat</h3>
        <div
          style="display: flex; flex-direction: column; gap: 1rem;"
        >
          <quiet-text-field
            label="Cat Name"
            placeholder="Enter cat name"
          ></quiet-text-field>

          <collection-picker
            showCreateButton
            showLabel
            label="Save to Collection:"
            @collection-select=${(e: CustomEvent) => {
              console.log(
                "Collection selected:",
                e.detail.collectionId
              );
            }}
            @collection-create=${() => {
              console.log("Create collection clicked");
            }}
          >
          </collection-picker>

          <div
            style="display: flex; gap: 0.5rem; justify-content: flex-end;"
          >
            <quiet-button appearance="outline" variant="neutral"
              >Cancel</quiet-button
            >
            <quiet-button variant="primary">Save Cat</quiet-button>
          </div>
        </div>
      </div>
    </meowzer-provider>
  `,
};
