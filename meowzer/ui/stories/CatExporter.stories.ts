import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/cat-exporter/cat-exporter.js";
import "../providers/meowzer-provider.js";

const meta = {
  title: "Gallery Components/Cat Exporter",
  component: "cat-exporter",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Cat Exporter

UI component for exporting cats to JSON files for backup or sharing.

### Usage

\`\`\`html
<meowzer-provider storage="indexeddb" auto-init>
  <cat-exporter
    @export-complete="\${handleExportComplete}">
  </cat-exporter>
</meowzer-provider>
\`\`\`

### Features

- **Two Export Modes**
  - **Active Cats** - Export currently running cats
  - **Collection** - Export entire saved collections
- **Selective Export** - Choose specific cats to export
- **Batch Selection** - Select all or deselect all cats at once
- **Export Preview** - See JSON structure before downloading
- **Auto Download** - Automatically downloads JSON file
- **Timestamp** - Includes export timestamp in filename
- **Context Integration** - Requires meowzer-provider ancestor

### Export Format

\`\`\`json
{
  "type": "meowzer-cats",
  "version": "1.0",
  "exportedAt": "2025-10-26T12:00:00.000Z",
  "cats": [
    {
      "id": "cat-123",
      "name": "Whiskers",
      "seed": "tabby-FF6B35-4ECDC4-m-short-v1",
      "personality": { "curiosity": 0.8, ... },
      "createdAt": "2025-10-20T10:00:00.000Z",
      "metadata": { ... }
    }
  ]
}
\`\`\`

### Events

- **export-complete** - Emitted when export completes with mode and count in detail
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <meowzer-provider auto-init>
      <cat-exporter
        @export-complete=${(e: CustomEvent) => {
          console.log("Export complete:", e.detail);
        }}
      >
      </cat-exporter>
    </meowzer-provider>
  `,
};

export const ActiveCatsMode: Story = {
  render: () => html`
    <meowzer-provider auto-init>
      <div
        style="max-width: 600px; padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;"
      >
        <cat-exporter
          @export-complete=${(e: CustomEvent) => {
            console.log("Export complete:", e.detail);
            alert(`Successfully exported ${e.detail.count} cat(s)!`);
          }}
        >
        </cat-exporter>
      </div>
    </meowzer-provider>
  `,
};

export const InDialog: Story = {
  render: () => html`
    <meowzer-provider auto-init>
      <quiet-dialog>
        <span slot="header">Export Cats</span>
        <cat-exporter
          @export-complete=${(e: CustomEvent) => {
            console.log("Export complete:", e.detail);
          }}
        >
        </cat-exporter>
      </quiet-dialog>
    </meowzer-provider>
  `,
};
