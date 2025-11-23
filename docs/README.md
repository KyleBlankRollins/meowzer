# Meowzer Documentation

The Meowzer documentation site built with [Eleventy (11ty)](https://www.11ty.dev/) and styled with [Carbon Design System](https://carbondesignsystem.com/).

## Quick Start

### Development

```bash
npm run dev
```

Starts the 11ty dev server at `http://localhost:8080` with hot reload.

### Build

```bash
npm run build
```

Builds the static site to the `_site/` directory.

### Preview

```bash
npm run preview
```

Preview the production build locally.

## Architecture

### Static Site Generation

This site uses **Eleventy (11ty)**, a mature static site generator that:

- Processes Markdown files into HTML
- Provides a built-in dev server with hot reload
- Supports multiple template languages (we use Nunjucks)
- Has excellent plugin ecosystem

### Client-Side Assets

**Vite** handles client-side bundling via `@11ty/eleventy-plugin-vite`:

- TypeScript/JavaScript bundling
- CSS processing with Carbon styles
- ES module support for web components
- Hot module replacement in dev mode

## Pages

Each page is a Markdown file with YAML frontmatter in `source/content/`.

### YAML Frontmatter

Required and optional properties for each page:

- `title`: **required** - Page title
- `description`: **required** - Page description (for meta tags)
- `layout`: optional - Override default layout (auto-detected if omitted)
- `draft`: optional - Set to `true` to exclude from build
- `isMeta`: optional - Mark as meta page (Credits, etc.)

Example:

```yaml
---
title: Getting Started
description: Learn how to use Meowzer SDK
---
```

## Directory Structure and URLs

The directory structure in `source/content/` maps directly to URLs:

```
source/content/
├── index.md                    → / (Home)
├── docs/
│   └── index.md               → /docs/ (Landing)
│   └── getting-started/
│       ├── index.md           → /docs/getting-started/ (Landing)
│       └── installation.md    → /docs/getting-started/installation/ (Doc)
```

### Automatic Layout Assignment

Three layouts are automatically chosen based on file location:

1. **Home Layout** (`layouts/home.njk`)

   - Root `index.md` only
   - Full-width home page layout

2. **Landing Layout** (`layouts/landing.njk`)

   - Directory `index.md` files
   - Section overview pages

3. **Documentation Layout** (`layouts/documentation.njk`)
   - All other `.md` files
   - Standard doc pages with navigation

You can override the layout in frontmatter:

```yaml
---
layout: layouts/custom.njk
---
```

## Templates and Layouts

Templates are located in `source/_includes/layouts/` and use **Nunjucks** syntax.

### Layout Hierarchy

```
base.njk                 # Base HTML shell
├── home.njk            # Extends base
├── landing.njk         # Extends base
└── documentation.njk   # Extends base
```

### Layout Chaining

Layouts use frontmatter to chain (not Nunjucks extends):

```nunjucks
---
layout: layouts/base.njk
---
<div class="my-content">
  {{ content | safe }}
</div>
```

## Navigation

Navigation is automatically generated from the content structure using **11ty Collections**.

### Collections

Defined in `eleventy.config.js`:

- `topNav` - Top-level navigation items
- `navigation` - Hierarchical navigation tree
- `metaPages` - Pages like Credits

### Global Data

Site-wide data is in `source/_data/`:

- `site.js` - Site title, description, URL

## Using Carbon Web Components

Carbon web components can be used directly in Markdown since they're valid HTML:

```markdown
<cds-button kind="primary">Click me</cds-button>

<cds-tile>
  This is a tile with some content.
</cds-tile>
```

All Carbon Web Components are imported in `public/scripts/main.js`.

## Markdown Features

The site uses enhanced Markdown with several features. See [MARKDOWN-FEATURES.md](./MARKDOWN-FEATURES.md) for full documentation.

### Syntax Highlighting

Code blocks are automatically highlighted:

````markdown
```typescript
const meowzer = new Meowzer();
await meowzer.init();
```
````

### Heading Anchors

All headings get automatic anchor links:

```markdown
## My Section

Links to #my-section
```

### Custom Shortcodes

#### Alerts/Callouts

```nunjucks
{% alert "warning" %}
This is important!
{% endalert %}
```

Types: `info`, `warning`, `error`, `success`

#### Code Examples with Titles

```nunjucks
{% codeExample "typescript", "Example Title" %}
const code = "here";
{% endcodeExample %}
```

### Filters

- `{{ content | markdown | safe }}` - Render markdown inline
- `{{ content | markdownInline | safe }}` - Render without `<p>` wrapper
- `{{ object | dump | safe }}` - Serialize to JSON

## File Structure

```
docs/
├── eleventy.config.js          # 11ty configuration
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite overrides (minimal)
├── MARKDOWN-FEATURES.md        # Markdown documentation
├── public/                     # Static assets
│   ├── scripts/
│   │   └── main.js            # Client-side entry point
│   └── styles/
│       └── main.css           # Global styles
├── source/
│   ├── _data/                 # Global data files
│   │   └── site.js
│   ├── _includes/             # Layouts and components
│   │   └── layouts/
│   │       ├── base.njk       # Base HTML shell
│   │       ├── home.njk       # Home layout
│   │       ├── landing.njk    # Landing layout
│   │       └── documentation.njk  # Doc layout
│   ├── content/               # Markdown content
│   │   ├── index.md
│   │   ├── docs/
│   │   └── ...
│   └── utilities/             # Helper utilities
└── _site/                     # Build output (gitignored)
```

## Development Workflow

### Adding a New Page

1. Create a markdown file in `source/content/`
2. Add frontmatter (title, description)
3. Write content using Markdown
4. The page automatically appears in navigation

### Modifying Layouts

1. Edit files in `source/_includes/layouts/`
2. Use Nunjucks syntax
3. Changes hot-reload in dev server

### Updating Styles

1. Edit `public/styles/main.css`
2. Use Carbon Design tokens (e.g., `var(--cds-text-primary)`)
3. Changes hot-reload automatically

### Adding Components

1. Create web components in `source/components/`
2. Import in `public/scripts/main.js`
3. Use in Markdown or layouts

## Configuration

### Eleventy Config

Main configuration in `eleventy.config.js`:

- Input/output directories
- Template formats
- Plugins (Vite, syntax highlighting)
- Markdown-it options
- Collections
- Filters and shortcodes

### Vite Config

Minimal configuration in `vite.config.ts`. Most Vite options are in `eleventy.config.js` via the Vite plugin.

## Testing Checklist

Before deploying:

- [ ] All pages build without errors
- [ ] Navigation works on every page
- [ ] Code syntax highlighting appears correctly
- [ ] Heading anchor links work
- [ ] Dark/light theme toggles properly
- [ ] All assets load (CSS, JS)
- [ ] No console errors
- [ ] Links are not broken

## Build Performance

- Full rebuild: ~0.3-0.5 seconds
- Incremental rebuild: <0.1 seconds
- Dev server hot reload: <1 second

## Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Nunjucks Documentation](https://mozilla.github.io/nunjucks/)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Markdown Features Guide](./MARKDOWN-FEATURES.md)

## Troubleshooting

### Build Errors

```bash
# Clear build cache
rm -rf _site .11ty-vite

# Rebuild
npm run build
```

### Dev Server Issues

```bash
# Kill any process on port 8080
lsof -ti:8080 | xargs kill -9

# Restart dev server
npm run dev
```

### Asset Loading Issues

Check that:

1. Files exist in `public/` directory
2. Paths in templates use `{{ '/path/to/asset' | url }}`
3. Vite plugin is enabled in `eleventy.config.js`
