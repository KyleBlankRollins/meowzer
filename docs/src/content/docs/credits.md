---
title: Credits
description: Technology stack and site info
---

## Docs site stack

This documentation site was built with:

- **[Astro](https://astro.build/)** - Static site framework
- **[Starlight](https://starlight.astro.build/)** - Documentation theme
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

## Meowzer stack

The Meowzer SDK and its libraries are built with:

### Core dependencies

- **[TypeScript](https://www.typescriptlang.org/)** (v5.0+) - Type-safe development across all packages
- **[GSAP](https://gsap.com/)** (v3.13.0) - Animation engine (Meowtion, SDK, UI)
- **[Lit](https://lit.dev/)** (v3.3.1) - Web components framework (Meowtion, UI)
- **[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)** - Browser storage API (MeowBase)

### Development tools

- **[Vitest](https://vitest.dev/)** (v4.0.2) - Unit testing framework
- **[TypeDoc](https://typedoc.org/)** (v0.28.14) - API documentation generator
- **[Happy-DOM](https://github.com/capricorn86/happy-dom)** (v20.0.8) - DOM implementation for testing
- **[fake-indexeddb](https://github.com/dumbmatter/fakeIndexedDB)** (v6.2.4) - IndexedDB mock for testing

### UI library specific

- **[@carbon/web-components](https://carbondesignsystem.com/)** (v2.43.0) - IBM Carbon design system
- **[@shoelace-style/shoelace](https://shoelace.style/)** (v2.20.1) - Alternative component library
- **[@lit/context](https://lit.dev/docs/data/context/)** (v1.1.0) - State management for Lit
- **[Storybook](https://storybook.js.org/)** (v8.6.14) - Component development environment

### Package structure

The Meowzer monorepo contains multiple specialized packages:

- **MeowKit** - Cat generation
- **Meowtion** - Animation (GSAP + Lit)
- **MeowBrain** - AI behaviors
- **MeowBase** - Storage layer
- **SDK** - High-level API (GSAP)
- **UI** - Web components (Lit, Carbon/Shoelace, GSAP)

## Built with AI

This documentation site and the Meowzer SDK were developed with assistance from **Claude 4.5 Sonnet** (Anthropic).
