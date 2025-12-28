# Meowzer Demo

Interactive demo website showcasing the Meowzer SDK and UI components.

> **Note:** This demo uses the Meowzer SDK and UI library to create an interactive playground with autonomous cats.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the `demo/` directory:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview your build locally, before deploying |

Or from the monorepo root:

| Command              | Action                        |
| :------------------- | :---------------------------- |
| `npm run dev:demo`   | Start demo development server |
| `npm run build:demo` | Build demo for production     |

**Note:** The demo requires the SDK and UI packages to be built first:

```bash
# From monorepo root
npm run build:sdk
npm run build:ui
npm run dev:demo
```

## Features

The demo showcases:

- **Cat Playground** - Interactive area with autonomous cats
- **Cat Creator** - Create custom cats with appearance and personality
- **Cat Adoption** - Adopt cats from seed values
- **Interactions** - Feed cats, give toys, use laser pointer
- **Context Menu** - Rename, share, change hats, remove cats
- **Statistics** - View cat collection stats

## 📚 Learn More

- [Meowzer Documentation](../docs/) - Complete SDK documentation
- [Astro Documentation](https://docs.astro.build) - Astro framework docs
