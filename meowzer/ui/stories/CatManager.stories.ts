import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/cat-manager/cat-manager.js";
import "../providers/meowzer-provider.js";

const meta = {
  title: "Management Components/Cat Manager",
  component: "cat-manager",
  tags: ["autodocs"],
  argTypes: {
    view: {
      control: "select",
      options: ["grid", "list"],
      description: "Display mode for cats",
      table: {
        type: { summary: "'grid' | 'list'" },
        defaultValue: { summary: "'grid'" },
      },
    },
    sortBy: {
      control: "select",
      options: ["name", "created", "state"],
      description: "Sort order for cats",
      table: {
        type: { summary: "'name' | 'created' | 'state'" },
        defaultValue: { summary: "'created'" },
      },
    },
    showFilters: {
      control: "boolean",
      description: "Show filtering options",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Cat Manager

Display and manage all active cats with filtering, sorting, and bulk actions.

### Usage

\`\`\`html
<meowzer-provider>
  <cat-manager 
    view="grid"
    sortBy="created"
    showFilters>
  </cat-manager>
</meowzer-provider>
\`\`\`

### Features

- **Multiple Views** - Grid or list display modes
- **Sorting** - By name, creation date, or state
- **Filtering** - Filter by state (active/paused)
- **Bulk Actions** - Pause all, resume all, destroy all
- **Live Updates** - Automatically updates when cats change
- **Responsive** - Adapts to different screen sizes

### Context Requirements

Requires a parent \`<meowzer-provider>\` to function properly.

### Events

- **cats-updated** - Emitted when the cat list changes
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const GridView: Story = {
  args: {
    view: "grid",
    sortBy: "created",
    showFilters: true,
  },
  render: (args) => html`
    <meowzer-provider autoInit>
      <cat-manager
        view=${args.view}
        sortBy=${args.sortBy}
        ?showFilters=${args.showFilters}
      >
      </cat-manager>
    </meowzer-provider>
  `,
};

export const ListView: Story = {
  args: {
    view: "list",
    sortBy: "name",
    showFilters: true,
  },
  render: (args) => html`
    <meowzer-provider autoInit>
      <cat-manager
        view=${args.view}
        sortBy=${args.sortBy}
        ?showFilters=${args.showFilters}
      >
      </cat-manager>
    </meowzer-provider>
  `,
};

export const NoFilters: Story = {
  args: {
    view: "grid",
    sortBy: "created",
    showFilters: false,
  },
  render: (args) => html`
    <meowzer-provider autoInit>
      <cat-manager
        view=${args.view}
        sortBy=${args.sortBy}
        ?showFilters=${args.showFilters}
      >
      </cat-manager>
    </meowzer-provider>
  `,
};

export const SortedByName: Story = {
  args: {
    view: "grid",
    sortBy: "name",
    showFilters: true,
  },
  render: (args) => html`
    <meowzer-provider autoInit>
      <cat-manager
        view=${args.view}
        sortBy=${args.sortBy}
        ?showFilters=${args.showFilters}
      >
      </cat-manager>
    </meowzer-provider>
  `,
};
