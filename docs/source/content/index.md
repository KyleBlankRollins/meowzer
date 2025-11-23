---
title: Welcome to Meowzer
layout: layouts/home.njk
description: Autonomous, animated cats for your web projects
---

# Meowzer

> Bring autonomous, AI-powered cats to your web projects

Meowzer is a TypeScript SDK for creating animated cat sprites that wander around web pages with personality-driven AI behaviors. Perfect for adding delightful, interactive companions to websites, games, and creative projects.

---

## Choose Your Path

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 3rem 0;">

<cds-tile>
  <h3>🐱 For End Users</h3>
  <p>Learn how to interact with Meowzer cats on websites. Feed them, play with toys, and understand their behaviors.</p>
  <p><strong>No coding required!</strong> Just enjoy the cats.</p>
  <div style="margin-top: 1rem;">
    <a href="/play/">
      <cds-button kind="primary">Explore Cats →</cds-button>
    </a>
  </div>
</cds-tile>

<cds-tile>
  <h3>💻 For Developers</h3>
  <p>Integrate Meowzer into your projects. Full SDK documentation, tutorials, and API reference.</p>
  <p><strong>TypeScript-first</strong> with complete type safety.</p>
  <div style="margin-top: 1rem;">
    <a href="/docs/">
      <cds-button kind="primary">View Docs →</cds-button>
    </a>
  </div>
</cds-tile>

</div>

---

## What is Meowzer?

Meowzer creates autonomous cats that:

- 🐾 **Move on their own** - AI-powered wandering and exploration
- 😺 **Have personalities** - Each cat is unique (playful, lazy, curious, etc.)
- 🎾 **Respond to interactions** - Feed them, give toys, use laser pointers
- 💾 **Can be saved** - Persist cats between sessions with IndexedDB
- ✨ **Look beautiful** - Smooth GSAP animations and procedural generation

<cds-tile>
  <img
    slot="media"
    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop"
    alt="Orange tabby cat looking curious"
  />
  
  Watch the cats on this very page! They're real Meowzer cats wandering around as you read. Notice how each one has its own personality and movement patterns.

</cds-tile>

---

## Quick Start (Developers)

Get a cat on your page in 5 minutes:

```typescript
import { Meowzer } from "meowzer";

const meowzer = new Meowzer();
await meowzer.init();

const cat = await meowzer.cats.create({
  name: "Whiskers",
});

cat.place(document.body);
```

[View full Quick Start guide →](/docs/getting-started/quick-start)

---

## Features at a Glance

**🎨 Customizable Appearance**

- Fur colors and patterns
- Eye colors
- Different sizes
- Accessories (hats, collars)

**🧠 Autonomous AI**

- Personality-driven behaviors
- Decision-making engine
- Environmental awareness
- Interaction responses

**🎮 Interactive Elements**

- Food (basic & fancy)
- Water bowls
- Yarn balls
- Laser pointers
- Custom interactions

**💾 Persistence**

- IndexedDB storage
- Collection management
- Cross-session cats
- Import/export

**🔌 Extensible**

- Plugin system
- Lifecycle hooks
- Event emitters
- Custom behaviors

---

## Ready to Start?

<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <a href="/play/">
    <cds-button kind="primary">Play with Cats</cds-button>
  </a>
  <a href="/docs/">
    <cds-button kind="primary">Developer Docs</cds-button>
  </a>
  <a href="/docs/getting-started/installation">
    <cds-button kind="secondary">Install Meowzer</cds-button>
  </a>
</div>
