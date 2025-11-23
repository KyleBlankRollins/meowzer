#!/usr/bin/env node

/**
 * Script to create a new documentation page
 * Usage: npm run new-page -- <path> <title> [description]
 * Example: npm run new-page -- docs/guides/advanced "Advanced Guide"
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Get arguments
const args: string[] = process.argv.slice(2);

if (args.length < 2) {
  console.error(
    "Usage: npm run new-page -- <path> <title> [description]"
  );
  console.error(
    'Example: npm run new-page -- docs/guides/advanced "Advanced Guide"'
  );
  process.exit(1);
}

const [pagePath, title] = args;
const description: string =
  args[2] || `Learn about ${title.toLowerCase()}`;

// Construct file path
const filePath: string = join(
  __dirname,
  "..",
  "source",
  "content",
  `${pagePath}.md`
);

// Create directory if it doesn't exist
mkdirSync(dirname(filePath), { recursive: true });

// Create frontmatter
const frontmatter = `---
title: ${title}
description: ${description}
---

# ${title}

Write your content here.

## Getting Started

Start writing your documentation.

## Examples

Add code examples:

\`\`\`typescript
const example = "code";
\`\`\`

## Next Steps

- Link to related pages
- Add more sections as needed
`;

// Write file
try {
  writeFileSync(filePath, frontmatter, "utf-8");
  console.log(`✅ Created new page: ${filePath}`);
  console.log(`\n📝 Edit the file to add your content.`);
  console.log(`🌐 Page will be available at: /${pagePath}/`);
} catch (error) {
  console.error(
    "❌ Error creating page:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
}
