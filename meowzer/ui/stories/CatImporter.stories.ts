import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/cat-importer/cat-importer.js";
import "../providers/meowzer-provider.js";

const meta = {
  title: "Gallery Components/Cat Importer",
  component: "cat-importer",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Cat Importer

UI component for importing cats from JSON files created by the exporter.

### Usage

\`\`\`html
<meowzer-provider storage="indexeddb" auto-init>
  <cat-importer
    @import-complete="\${handleImportComplete}">
  </cat-importer>
</meowzer-provider>
\`\`\`

### Features

- **Drag & Drop** - Drag JSON files directly onto the upload area
- **Click to Upload** - Traditional file picker interface
- **Import Preview** - Shows file details before importing
  - File type and version
  - Number of cats
  - Export timestamp
- **Import Options**
  - Create as active cats (running immediately)
  - Save to specific collection
- **Validation** - Validates file format before import
- **Error Handling** - Clear error messages for invalid files
- **Context Integration** - Requires meowzer-provider ancestor

### Supported Formats

Imports JSON files exported by cat-exporter component:

\`\`\`json
{
  "type": "meowzer-cats",
  "version": "1.0",
  "exportedAt": "2025-10-26T12:00:00.000Z",
  "cats": [ ... ]
}
\`\`\`

### Events

- **import-complete** - Emitted when import completes with type and count in detail
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
      <cat-importer
        @import-complete=${(e: CustomEvent) => {
          console.log("Import complete:", e.detail);
        }}
      >
      </cat-importer>
    </meowzer-provider>
  `,
};

export const WithInstructions: Story = {
  render: () => html`
    <meowzer-provider auto-init>
      <div
        style="max-width: 600px; padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;"
      >
        <quiet-callout variant="primary">
          <p>
            Import cats from a JSON file exported by the Cat Exporter.
            You can drag and drop the file or click to browse.
          </p>
        </quiet-callout>

        <cat-importer
          @import-complete=${(e: CustomEvent) => {
            console.log("Import complete:", e.detail);
            alert(`Successfully imported ${e.detail.count} cat(s)!`);
          }}
        >
        </cat-importer>
      </div>
    </meowzer-provider>
  `,
};

export const InDialog: Story = {
  render: () => html`
    <meowzer-provider storage="indexeddb" auto-init>
      <quiet-dialog>
        <span slot="header">Import Cats</span>
        <cat-importer
          @import-complete=${(e: CustomEvent) => {
            console.log("Import complete:", e.detail);
          }}
        >
        </cat-importer>
      </quiet-dialog>
    </meowzer-provider>
  `,
};

export const ImportExportWorkflow: Story = {
  render: () => html`
    <meowzer-provider auto-init>
      <div
        style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 1200px;"
      >
        <div
          style="padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;"
        >
          <h3 style="margin-top: 0;">Export</h3>
          <cat-exporter
            @export-complete=${(e: CustomEvent) => {
              console.log("Export complete:", e.detail);
            }}
          >
          </cat-exporter>
        </div>

        <div
          style="padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;"
        >
          <h3 style="margin-top: 0;">Import</h3>
          <cat-importer
            @import-complete=${(e: CustomEvent) => {
              console.log("Import complete:", e.detail);
            }}
          >
          </cat-importer>
        </div>
      </div>
    </meowzer-provider>
  `,
};
