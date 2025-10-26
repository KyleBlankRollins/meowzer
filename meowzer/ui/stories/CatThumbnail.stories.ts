import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/cat-thumbnail/cat-thumbnail.js";

const meta = {
  title: "Gallery Components/Cat Thumbnail",
  component: "cat-thumbnail",
  tags: ["autodocs"],
  argTypes: {
    catInfo: {
      control: "object",
      description: "Saved cat information",
      table: {
        type: { summary: "SavedCatInfo" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Cat Thumbnail

Compact thumbnail component for displaying saved cats in gallery view.

### Usage

\`\`\`html
<cat-thumbnail
  .catInfo="\${{
    id: 'cat-123',
    name: 'Whiskers',
    image: '/path/to/image.png',
    birthday: new Date(),
    description: 'A friendly cat'
  }}"
  @cat-load="\${handleLoad}"
  @cat-delete="\${handleDelete}">
</cat-thumbnail>
\`\`\`

### Features

- **Visual Preview** - Shows cat image or placeholder
- **Quick Info** - Name and optional birthday
- **Quick Actions** - Load and delete buttons
- **Hover Effects** - Interactive feedback
- **Responsive** - Works in grid layouts

### Events

- **cat-load** - Emitted when load button is clicked
- **cat-delete** - Emitted when delete button is clicked
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const mockCatInfo = {
  id: "cat-123",
  name: "Whiskers",
  image:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ff8c42' width='100' height='100'/%3E%3C/svg%3E",
  birthday: new Date("2025-01-15"),
  description: "A friendly orange cat",
};

const mockCatInfo2 = {
  id: "cat-456",
  name: "Shadow",
  image:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%232c2c2c' width='100' height='100'/%3E%3C/svg%3E",
  birthday: new Date("2024-12-01"),
};

const mockCatInfo3 = {
  id: "cat-789",
  name: "Luna",
  image:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%236b8cae' width='100' height='100'/%3E%3C/svg%3E",
};

export const Default: Story = {
  args: {
    catInfo: mockCatInfo,
  },
  render: (args) => html`
    <cat-thumbnail
      .catInfo=${args.catInfo}
      @cat-load=${() => console.log("Load clicked")}
      @cat-delete=${() => console.log("Delete clicked")}
    >
    </cat-thumbnail>
  `,
};

export const NoBirthday: Story = {
  args: {
    catInfo: mockCatInfo3,
  },
  render: (args) => html`
    <cat-thumbnail
      .catInfo=${args.catInfo}
      @cat-load=${() => console.log("Load clicked")}
      @cat-delete=${() => console.log("Delete clicked")}
    >
    </cat-thumbnail>
  `,
};

export const InGrid: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;"
    >
      <cat-thumbnail
        .catInfo=${mockCatInfo}
        @cat-load=${() => console.log("Load cat-123")}
        @cat-delete=${() => console.log("Delete cat-123")}
      >
      </cat-thumbnail>
      <cat-thumbnail
        .catInfo=${mockCatInfo2}
        @cat-load=${() => console.log("Load cat-456")}
        @cat-delete=${() => console.log("Delete cat-456")}
      >
      </cat-thumbnail>
      <cat-thumbnail
        .catInfo=${mockCatInfo3}
        @cat-load=${() => console.log("Load cat-789")}
        @cat-delete=${() => console.log("Delete cat-789")}
      >
      </cat-thumbnail>
      <cat-thumbnail
        .catInfo=${{ ...mockCatInfo, id: "cat-abc", name: "Mittens" }}
        @cat-load=${() => console.log("Load cat-abc")}
        @cat-delete=${() => console.log("Delete cat-abc")}
      >
      </cat-thumbnail>
    </div>
  `,
};
