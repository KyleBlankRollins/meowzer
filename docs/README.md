# Meowbase Docs

The Meowbase docs describe how to use Meowbase. The docs site is built using a custom static site generator.

## Pages

Each page of the documentation is a Markdown file with YAML frontmatter.

### YAML frontmatter

The frontmatter for each page should have the following properties:

- title: required
- description: required
- template: optional
- banner: optional
- previous: optional
- next: optional
- draft: optional

## Getting Started

### Development

```bash
npm run dev
```

This starts the development server at `http://localhost:3000` with hot module replacement.

### Build

```bash
npm run build
```

This builds the static site to the `dist/` directory.

## Directory Structure and URLs

The directory structure of `source/content/` directly maps to URLs:

- `source/content/index.md` → `/` (Home template)
- `source/content/getting-started/index.md` → `/getting-started` (Landing template)
- `source/content/getting-started/installation.md` → `/getting-started/installation` (Documentation template)

### Templates

Three templates are automatically chosen based on file location:

1. **Home Template**: Root `index.md` only - Full-width home page layout
2. **Landing Template**: Directory `index.md` files - Section overview pages with sidebar
3. **Documentation Template**: All other `.md` files - Standard doc pages with sidebar and prev/next navigation

## Navigation

Navigation is automatically generated from:

- The directory structure in `source/content/`
- Page titles from frontmatter
- Folder names are prettified (e.g., `getting-started` → "Getting Started")

## Using Quiet UI Components

Quiet UI web components can be used directly in Markdown since they're valid HTML:

```markdown
<quiet-button variant="primary">Click me</quiet-button>

<quiet-card>
  This is a card with some content.
</quiet-card>
```

All Quiet UI components are registered in `source/main.ts`.

## Template System

The SSG uses **Lit HTML** for server-side template rendering. Templates are located in `source/templates/index.ts`.

### Why Lit HTML?

- **Type-safe templates** with TypeScript support
- **Automatic escaping** to prevent XSS vulnerabilities
- **Clean syntax** using tagged template literals
- **Composable** templates that can be nested
- **Consistent** with Quiet UI's Lit-based web components

### How It Works

1. **Template Rendering**: Lit HTML templates define the page structure (navigation, headers, layout)
2. **Markdown Injection**: Pre-rendered markdown HTML (from markdown-it) is inserted into placeholders after template rendering
3. **SSR Conversion**: A custom `renderToString()` function converts Lit templates to static HTML strings

### Template Files

- `renderHomeTemplate()` - Full-width landing page layout
- `renderLandingTemplate()` - Section overview pages with sidebar navigation
- `renderDocumentationTemplate()` - Standard doc pages with prev/next links

Example template structure:

```typescript
const content = html`
  <div class="home-layout">
    <header class="home-header">
      <h1>${props.frontmatter.title}</h1>
    </header>
    <main class="home-content"></main>
  </div>
`;

const rendered = renderToString(createBaseTemplate(props, content));
return rendered.replace(
  '<main class="home-content"></main>',
  `<main class="home-content">${props.html}</main>`
);
```

## Hot Reload

The SSG supports hot module replacement (HMR) for markdown content changes and CSS updates. Changes to markdown files trigger a page reload to update navigation and content.
