---
title: Introduction to Meowzer
description: Learn what Meowzer is and what it can do
---

Meowzer is a TypeScript SDK for creating autonomous, animated cat sprites with AI-driven behaviors. It brings delightful, interactive cats to web projects.

## What is Meowzer?

Meowzer creates animated cats that:

- **Move on their own** - Powered by AI decision-making engine (MeowBrain)
- **Have unique personalities** - Curious, playful, lazy, energetic, etc.
- **Respond to interactions** - Food, water, toys, laser pointers
- **Persist across sessions** - Save and load from IndexedDB
- **Look great** - Smooth GSAP animations and procedural generation

## Perfect For

**Interactive Websites**
Add life to landing pages, portfolios, or marketing sites with wandering cats.

**Games & Experiences**
Create pet simulation games, virtual companions, or interactive storytelling.

**Educational Projects**
Demonstrate AI behaviors, state machines, or animation techniques.

**Creative Experiments**
Build unique, delightful web experiences that stand out.

## Key Features

### 🎨 Customizable Appearance

- Procedurally generated or fully custom
- Fur colors and patterns (tabby, spotted, tuxedo, calico)
- Eye colors
- Different sizes
- Accessories (coming soon: hats, collars)

### 🧠 Autonomous AI (MeowBrain)

- Personality-driven decision making
- Behavior system (wandering, playing, resting, exploring)
- Environmental awareness
- Interaction responses
- Configurable decision frequency

### ✨ Smooth Animation (Meowtion)

- GSAP-based movement
- Multiple states (idle, walking, sitting, sleeping, running)
- Curved path generation
- Boundary detection
- Physics simulation

### 🎮 Interactive Elements

- **Food** - Basic and fancy variants
- **Water** - Hydration system
- **Yarn** - Throwable and battable
- **Laser Pointer** - Chase mechanics
- **Custom interactions** - Extend with plugins

### 💾 Persistence (MeowBase)

- IndexedDB storage
- Collection management
- Async operations
- Import/export cats
- Migration support

### 🔌 Extensible

- Plugin system
- Lifecycle hooks
- Event emitters
- Custom behaviors
- Framework integrations

## Architecture

Meowzer combines four specialized libraries:

```
┌──────────────────────────────────────┐
│         MEOWZER SDK                  │
│     (Main API Entry Point)           │
└──────────────────────────────────────┘
          │
          ├──► Managers (API Layer)
          │    ├── CatManager
          │    ├── StorageManager
          │    ├── InteractionManager
          │    ├── HookManager
          │    └── PluginManager
          │
          └──► Core Libraries
               ├── MeowKit   - Cat generation
               ├── Meowtion  - Animation engine
               ├── MeowBrain - AI behaviors
               └── MeowBase  - Storage layer
```

**MeowKit** generates cat appearance from settings → Creates ProtoCat data

**Meowtion** renders ProtoCat as animated SVG → Manages movement and states

**MeowBrain** adds autonomous decision-making → Controls cat behaviors

**MeowzerCat** wraps everything → Public API you interact with

**MeowBase** persists cats → Survive page reloads

## How It Works

### 1. Initialize the SDK

```typescript
import { Meowzer } from "meowzer";

const meowzer = new Meowzer();
await meowzer.init();
```

### 2. Create a Cat

```typescript
const cat = await meowzer.cats.create({
  name: "Whiskers",
  settings: {
    color: "#FF9500",
    pattern: "tabby",
  },
});
```

**What happens:**

1. MeowKit generates unique cat appearance
2. Meowtion creates animated sprite
3. MeowBrain initializes AI decision engine
4. Everything wrapped in MeowzerCat instance

### 3. Place on Page

```typescript
cat.place(document.body);
```

**What happens:**

1. DOM element appended to container
2. AI behaviors start
3. Cat begins autonomous wandering
4. Event listeners activated

### 4. Cat Lives Autonomously

The cat now:

- Makes decisions every 5-30 seconds
- Executes behaviors (wandering, resting, playing)
- Responds to interactions
- Emits events for state changes

## Browser Support

**Minimum Requirements:**

- ES6+ support
- RequestAnimationFrame API
- IndexedDB (for persistence features)
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

**Dependencies:**

- `gsap` - Animation library (only runtime dependency)

## TypeScript Support

Meowzer is TypeScript-first with:

- Full type definitions
- Strict type checking
- Comprehensive JSDoc comments
- Type inference

```typescript
import type {
  MeowzerConfig,
  CatSettings,
  Personality,
} from "meowzer";
```

## What's Next?

Ready to get started?

1. [**Installation**](/getting-started/installation) - Install Meowzer in your project
2. [**Quick Start**](/getting-started/quick-start) - Your first cat in 5 minutes
3. [**First Cat Tutorial**](/getting-started/first-cat) - Detailed walkthrough
