# Developer Guide

This guide helps contributors understand the documentation site architecture and common development tasks.

## Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:8080)
npm run build            # Production build
npm run preview          # Preview production build
npm run clean            # Clean build artifacts

# Utilities
npm run new-page -- <path> <title>  # Create new page
npm run debug            # Debug mode with verbose logging
npm run validate         # Validate build without writing files
```

### Creating a New Page

```bash
npm run new-page -- docs/guides/my-guide "My Guide Title"
```

This creates:

- File: `source/content/docs/guides/my-guide.md`
- URL: `/docs/guides/my-guide/`
- Boilerplate frontmatter and content

## Architecture Overview

### Build Process

```
1. 11ty processes Markdown → HTML
2. Nunjucks layouts wrap content
3. Collections generate navigation
4. Vite bundles client-side assets
5. Output to _site/
```

### File Flow

```
source/content/*.md
  ↓ (frontmatter + markdown-it)
source/_includes/layouts/*.njk
  ↓ (nunjucks rendering)
HTML with placeholders
  ↓ (content injection)
_site/*.html
  ↓ (vite processing)
_site/*.html + _site/assets/*.js/css
```

## Configuration Files

### eleventy.config.js

Main 11ty configuration:

- **Plugins**: Vite integration, syntax highlighting
- **Markdown**: markdown-it with anchors, typographer
- **Collections**: topNav, navigation, metaPages
- **Filters**: dump, markdown, dateFormat, readingTime, excerpt
- **Shortcodes**: alert, codeExample

### vite.config.ts

Minimal Vite config - most options in eleventy.config.js via plugin.

### package.json

Scripts and dependencies for the docs site.

## Directory Structure

```
docs/
├── eleventy.config.js       # 11ty config
├── .eleventyignore          # Files to ignore
├── package.json             # Dependencies
├── vite.config.ts           # Vite overrides
│
├── public/                  # Static assets
│   ├── scripts/
│   │   └── main.js         # Client-side entry
│   └── styles/
│       └── main.css        # Global styles
│
├── scripts/                 # Build scripts
│   └── new-page.js         # Page creation script
│
├── source/
│   ├── _data/              # Global data
│   │   └── site.js         # Site metadata
│   │
│   ├── _includes/          # Layouts & partials
│   │   └── layouts/
│   │       ├── base.njk           # HTML shell
│   │       ├── home.njk           # Home layout
│   │       ├── landing.njk        # Landing layout
│   │       └── documentation.njk  # Doc layout
│   │
│   ├── content/            # Markdown content
│   │   ├── index.md       # Home page
│   │   └── docs/          # Documentation
│   │
│   └── utilities/          # Helper functions
│
└── _site/                  # Build output (gitignored)
```

## Collections

Collections automatically generate navigation from content structure.

### topNav Collection

Top-level navigation items (section index pages):

```javascript
// Generated from source/content/*/index.md
[
  { title: "Docs", url: "/docs/" },
  { title: "API", url: "/api/" },
  { title: "Examples", url: "/examples/" },
];
```

### navigation Collection

Hierarchical navigation tree:

```javascript
{
  "docs": {
    "title": "Docs",
    "url": "/docs/",
    "children": {
      "getting-started": {
        "title": "Getting Started",
        "pages": [...]
      }
    }
  }
}
```

### metaPages Collection

Special pages (Credits, etc.) that don't fit in main nav.

## Layouts

### Layout Chaining

Layouts use frontmatter (not Nunjucks extends):

```nunjucks
---
layout: layouts/base.njk
---
<div class="content">
  {{ content | safe }}
</div>
```

### Automatic Layout Assignment

Layouts are auto-assigned based on file location:

- `source/content/index.md` → `layouts/home.njk`
- `source/content/*/index.md` → `layouts/landing.njk`
- All other `*.md` → `layouts/documentation.njk`

Override with frontmatter:

```yaml
---
layout: layouts/custom.njk
---
```

## Filters

### Built-in Filters

- `{{ obj | dump | safe }}` - JSON serialization
- `{{ content | markdown | safe }}` - Render markdown
- `{{ text | markdownInline | safe }}` - Inline markdown
- `{{ date | dateFormat }}` - Format date (long/short)
- `{{ content | readingTime }}` - "X min read"
- `{{ content | excerpt }}` - First 160 chars
- `{{ array | limit(5) }}` - Limit array length

### Usage Examples

```nunjucks
{# Reading time #}
<span class="meta">{{ content | readingTime }}</span>

{# Excerpt #}
<p>{{ description | excerpt(200) }}</p>

{# Date formatting #}
<time>{{ page.date | dateFormat("short") }}</time>
```

## Shortcodes

### Alert Shortcode

```nunjucks
{% alert "warning" %}
This is important!
{% endalert %}
```

Types: `info`, `warning`, `error`, `success`

### Code Example Shortcode

```nunjucks
{% codeExample "typescript", "Creating a Cat" %}
const cat = await meowzer.cats.create();
{% endcodeExample %}
```

## Frontmatter

### Required Properties

```yaml
---
title: Page Title # Required
description: Description # Required
---
```

### Optional Properties

```yaml
---
layout: layouts/custom.njk # Override auto-layout
draft: true # Exclude from build
isMeta: true # Mark as meta page (Credits, etc.)
---
```

## Markdown Enhancements

### Syntax Highlighting

Code blocks are auto-highlighted:

````markdown
```typescript
const meowzer = new Meowzer();
```
````

### Heading Anchors

All headings get anchor links automatically:

```markdown
## My Section
```

Links to `#my-section`

### Typographer

Smart typography:

- "quotes" → "quotes"
- 'quotes' → 'quotes'
- -- → –
- --- → —
- ... → …

## Performance Tips

### Build Optimization

1. **Use .eleventyignore** - Exclude unnecessary files
2. **Limit watch targets** - Only watch what changes
3. **Optimize images** - Compress before adding
4. **Minimize dependencies** - Keep client JS small

### Dev Server

Hot reload works for:

- Markdown content changes
- Layout changes
- CSS changes
- JavaScript changes (via Vite HMR)

### Build Times

Current performance:

- Full build: ~0.4 seconds
- Incremental: ~0.1 seconds
- Dev server ready: ~0.2 seconds

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
npm run clean
npm run build
```

### Dev Server Won't Start

```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Restart
npm run dev
```

### Assets Not Loading

1. Check file exists in `public/`
2. Check path uses `{{ '/path' | url }}`
3. Check Vite plugin enabled in config
4. Clear browser cache

### Layout Not Applied

1. Check frontmatter syntax (YAML)
2. Verify layout file exists
3. Check layout path (relative to `_includes/`)
4. Look for template errors in console

## Testing

### Pre-Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] All pages render correctly
- [ ] Navigation works
- [ ] Code blocks highlighted
- [ ] No console errors
- [ ] Assets load (CSS, JS)
- [ ] Links not broken
- [ ] Mobile responsive

### Manual Testing

1. Test all page types (home, landing, docs)
2. Test navigation (top nav, sidebar)
3. Test syntax highlighting
4. Test anchor links
5. Test dark/light theme
6. Test on different browsers

## Contributing

### Adding Content

1. Create new markdown file or use `npm run new-page`
2. Add required frontmatter
3. Write content in Markdown
4. Test locally with `npm run dev`
5. Build with `npm run build`
6. Commit and push

### Adding Features

1. Update `eleventy.config.js` for 11ty features
2. Update `vite.config.ts` for Vite features
3. Add layouts in `source/_includes/layouts/`
4. Add styles in `public/styles/`
5. Add scripts in `public/scripts/`
6. Document in this guide
7. Test thoroughly

## Resources

- [11ty Documentation](https://www.11ty.dev/docs/)
- [Nunjucks Documentation](https://mozilla.github.io/nunjucks/)
- [Markdown-it Documentation](https://github.com/markdown-it/markdown-it)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Vite Documentation](https://vitejs.dev/)
