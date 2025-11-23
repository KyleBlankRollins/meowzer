# Markdown Features

This document describes the markdown enhancements available in the Meowzer documentation site.

## Syntax Highlighting

Code blocks are automatically highlighted using the `@11ty/eleventy-plugin-syntaxhighlight` plugin.

### Basic Code Block

````markdown
```typescript
const meowzer = new Meowzer();
await meowzer.init();
```
````

This will render with syntax highlighting for TypeScript.

### Supported Languages

All languages supported by Prism.js are available, including:

- JavaScript/TypeScript
- HTML
- CSS
- JSON
- Markdown
- And many more...

## Heading Anchors

All headings (h1-h4) automatically get anchor links generated using `markdown-it-anchor`.

### Features:

- Click on headings to get a direct link
- Anchors appear on hover
- Keyboard accessible (tab to focus)
- Slugified IDs (e.g., "Getting Started" → `#getting-started`)

### Example:

```markdown
## My Heading

This heading will have an anchor at `#my-heading`
```

## Markdown-it Features

The following markdown-it features are enabled:

### HTML in Markdown

You can use HTML directly in your markdown files:

```markdown
<div class="custom-class">
  This is HTML inside markdown
</div>
```

### Linkify

URLs are automatically converted to links:

```markdown
Check out https://example.com
```

Renders as: Check out [https://example.com](https://example.com)

### Typographer

Smart quotes and other typographic improvements:

- `"double quotes"` → "double quotes"
- `'single quotes'` → 'single quotes'
- `--` → –
- `---` → —
- `...` → …

## Custom Shortcodes

### Alert/Callout Shortcode

Create attention-grabbing callouts for warnings, tips, and notes.

**Usage:**

```nunjucks
{% alert "info" %}
This is an informational message.
{% endalert %}

{% alert "warning" %}
This is a warning message.
{% endalert %}

{% alert "error" %}
This is an error message.
{% endalert %}

{% alert "success" %}
This is a success message.
{% endalert %}
```

**Types:**

- `info` (default) - Blue informational callout
- `warning` - Yellow warning callout
- `error` - Red error callout
- `success` - Green success callout

### Code Example Shortcode

Create code examples with optional titles.

**Usage:**

```nunjucks
{% codeExample "typescript", "Creating a Meowzer Instance" %}
const meowzer = new Meowzer();
await meowzer.init();
{% endcodeExample %}
```

**Parameters:**

1. `language` - The programming language for syntax highlighting
2. `title` (optional) - A title displayed above the code block

## Custom Filters

### `dump` Filter

Serialize objects to JSON for use in data attributes:

```nunjucks
<div data-config='{{ myObject | dump | safe }}'></div>
```

### `markdown` Filter

Render markdown content inline:

```nunjucks
{{ "This is **bold** text" | markdown | safe }}
```

### `markdownInline` Filter

Render markdown without wrapping in `<p>` tags:

```nunjucks
{{ "This is **bold** text" | markdownInline | safe }}
```

## Styling

All markdown elements are styled using Carbon Design System tokens for consistency:

### Code Blocks

- Background: `var(--cds-layer-01)`
- Border: `var(--cds-border-interactive)`
- Font: `IBM Plex Mono`

### Inline Code

- Background: `var(--cds-layer-01)`
- Padding: `0.125rem 0.375rem`
- Font: `IBM Plex Mono`

### Links

- Color: `var(--cds-link-primary)`
- Hover: `var(--cds-link-primary-hover)`

### Tables

- Border: `var(--cds-border-subtle)`
- Header background: `var(--cds-layer-01)`

### Blockquotes

- Border: `var(--cds-border-interactive)`
- Background: `var(--cds-layer-01)`

## Best Practices

1. **Use semantic headings**: Start with h2 for main sections (h1 is the page title)
2. **Code language**: Always specify the language for code blocks
3. **Alt text**: Always provide alt text for images
4. **Link text**: Use descriptive link text, not "click here"
5. **Callouts**: Use alerts sparingly for important information only

## Examples

See the following pages for examples of these features in action:

- [Quick Start](/docs/getting-started/quick-start/) - Code blocks and headings
- [First Cat](/docs/getting-started/first-cat/) - Complex examples
- [Installation](/docs/getting-started/installation/) - Step-by-step guides
