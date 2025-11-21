---
title: Developer Documentation
template: Landing
description: Learn how to integrate Meowzer into your projects
---

# Meowzer SDK Documentation

> A TypeScript SDK for creating autonomous, animated cat sprites with AI-driven behaviors.

## What is Meowzer?

Meowzer is a powerful SDK that lets you programmatically create animated cats that move autonomously around web pages. Each cat has:

- **🎨 Unique appearance** - Procedurally generated or fully customized
- **🧠 Autonomous behavior** - AI-powered decision-making (MeowBrain)
- **✨ Smooth animations** - GSAP-based movement engine (Meowtion)
- **🎮 Interactive elements** - Responds to food, toys, and laser pointers
- **💾 Persistence** - Save and load cats from IndexedDB

Perfect for adding delightful, autonomous companions to websites, games, or interactive experiences.

---

## Quick Start

Get a cat on your page in under 5 minutes:

```typescript
import { Meowzer } from "meowzer";

// Initialize
const meowzer = new Meowzer();
await meowzer.init();

// Create a cat
const cat = await meowzer.cats.create({
  name: "Whiskers",
});

// Place it on the page
cat.place(document.body);

// Cat now wanders autonomously! 🐈
```

---

## Documentation Sections

### 🚀 Getting Started

New to Meowzer? Start here!

- [Introduction](/docs/getting-started/introduction) - What is Meowzer?
- [Installation](/docs/getting-started/installation) - Set up Meowzer
- [Quick Start](/docs/getting-started/quick-start) - Your first cat in 5 minutes
- [First Cat Tutorial](/docs/getting-started/first-cat) - Detailed walkthrough

### 💡 Concepts

Understand how Meowzer works under the hood.

- [Architecture](/docs/concepts/architecture) - How the libraries work together
- [Cat Lifecycle](/docs/concepts/cat-lifecycle) - From creation to destruction
- [AI Behaviors](/docs/concepts/ai-behaviors) - Understanding autonomous decisions
- [Storage & Persistence](/docs/concepts/storage-persistence) - Saving and loading
- [Event System](/docs/concepts/event-system) - Hooks and listeners

### 📚 Tutorials

Learn by building real projects.

- [Basic Integration](/docs/tutorials/basic-integration) - Add cats to a webpage
- [Interactive Playground](/docs/tutorials/interactive-playground) - Build a full playground
- [Persistence Setup](/docs/tutorials/persistence-setup) - Save cats between sessions
- [Framework Integration](/docs/tutorials/framework-integration) - React, Vue, Svelte, Astro

### 📖 Guides

Deep dives into specific topics.

- [Customization](/docs/guides/customization) - Appearance and personality
- [Interactions](/docs/guides/interactions) - Food, toys, laser pointers
- [Performance](/docs/guides/performance) - Optimization tips
- [Best Practices](/docs/guides/best-practices) - Recommended patterns

### 📋 API Reference

Complete API documentation.

- [Meowzer SDK](/docs/api/meowzer-sdk) - Main SDK class
- [Managers](/docs/api/managers) - CatManager, StorageManager, etc.
- [MeowzerCat](/docs/api/meowzer-cat) - Cat instance API
- [Interactions](/docs/api/interactions) - LaserPointer, Yarn, Need
- [Types](/docs/api/types) - TypeScript definitions

### 🧪 Examples

Ready-to-use code snippets.

- [Code Snippets](/docs/examples/code-snippets) - Common tasks
- [Live Demos](/docs/examples/live-demos) - Interactive examples
- [Templates](/docs/examples/templates) - Project starters

---

## Architecture Overview

Meowzer combines four specialized libraries:

```
┌─────────────────────────────────────────────┐
│              MEOWZER SDK                    │
│         (Main API Entry Point)              │
└─────────────────────────────────────────────┘
     │
     ├──► Managers (API Layer)
     │    ├── CatManager
     │    ├── StorageManager
     │    ├── InteractionManager
     │    ├── HookManager
     │    └── PluginManager
     │
     └──► Libraries (Core Engine)
          ├── MeowKit   - Cat generation
          ├── Meowtion  - Animation engine
          ├── MeowBrain - AI behaviors
          └── MeowBase  - Storage layer
```

Learn more in [Architecture](/docs/concepts/architecture).

---

## Need Help?

- 📖 Check the [API Reference](/docs/api)
- 💬 Ask questions on GitHub Discussions
- 🐛 Report bugs on GitHub Issues
- 📺 Watch tutorial videos (coming soon)

---

## Ready to Get Started?

<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <a href="/docs/getting-started/installation">
    <cds-button kind="primary">Install Meowzer</cds-button>
  </a>
  <a href="/docs/getting-started/quick-start">
    <cds-button kind="secondary">Quick Start Guide</cds-button>
  </a>
</div>
