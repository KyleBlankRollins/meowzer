# Meowzer Documentation

Documentation website for Meowzer, built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

> **Note:** This documentation site serves as a demonstration of documentation best practices and technical writing patterns. While based on real code, it prioritizes illustrating good docs structure over complete accuracy. See [About These Docs](./src/content/docs/about.md) for full context.

## 🚀 Project Structure

```
docs/
├── public/              # Static assets (favicons, images)
├── src/
│   ├── assets/          # Images embedded in Markdown
│   ├── content/
│   │   └── docs/        # Documentation pages (.md and .mdx)
│   │       ├── index.mdx
│   │       ├── about.md
│   │       ├── credits.md
│   │       ├── getting-started/
│   │       ├── tutorials/
│   │       ├── concepts/
│   │       ├── guides/
│   │       ├── api/
│   │       ├── examples/
│   │       ├── advanced/
│   │       └── play/
│   └── content.config.ts
├── astro.config.mjs     # Astro + Starlight configuration
├── package.json
└── tsconfig.json
```

All commands are run from the `docs/` directory:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

Or from the monorepo root:

| Command              | Action                        |
| :------------------- | :---------------------------- |
| `npm run dev:docs`   | Start docs development server |
| `npm run build:docs` | Build docs for production     |

## 📝 Adding Documentation

1. Create a new `.md` or `.mdx` file in `src/content/docs/`
2. Add frontmatter with title and description
3. Update the sidebar configuration in `astro.config.mjs`

Example:

```markdown
---
title: My New Page
description: A description of this page
---

# My New Page

Content goes here...
```

## 🎨 Customization

- **Sidebar:** Edit `astro.config.mjs` to modify navigation structure
- **Styling:** Starlight uses CSS custom properties for theming
- **Components:** Import Starlight components in `.mdx` files

## 📚 Documentation Sections

- **Getting Started** - Installation, quick start, first cat
- **Tutorials** - Step-by-step guides for common tasks
- **Concepts** - Architecture, lifecycle, AI behaviors
- **Guides** - Best practices, performance, customization
- **API Reference** - Complete SDK documentation
- **Examples** - Code snippets and live demos
- **Advanced** - Plugin development, framework integration
- **Play** - End-user documentation for interacting with cats

## 🔗 Resources

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)
- [Markdown Guide](https://www.markdownguide.org/)
