---
title: Live Demos
description: Interactive examples and playgrounds for Meowzer
---

:::note[Coming Soon]
Interactive demos are currently in development. This page outlines planned demos that will be available soon. Check back later for live, interactive examples!
:::

The following demos are planned for future implementation. Each will be hosted on CodeSandbox for easy experimentation and learning.

## Quick Start Demos

### Hello World Cat

The absolute minimal example - create a single cat on a page.

**Features:**

- Single cat creation
- Default settings
- Basic initialization

```typescript
import { Meowzer } from "meowzer";

const meowzer = new Meowzer();
await meowzer.init();

const cat = await meowzer.cats.create({
  name: "Hello World",
});
```

_Demo coming soon_

---

### Cat Control Panel

Interactive UI for creating, customizing, and managing cats.

**Features:**

- Create/remove cats with buttons
- Real-time cat counter
- Multiple cat management
- Boundary configuration

```typescript
// Add cat button
document
  .getElementById("add-cat")
  .addEventListener("click", async () => {
    await meowzer.cats.create();
    updateCount();
  });

// Remove cat button
document
  .getElementById("remove-cat")
  .addEventListener("click", async () => {
    const cats = meowzer.cats.getAll();
    if (cats.length > 0) {
      await meowzer.cats.destroy(cats[0].id);
      updateCount();
    }
  });
```

_Demo coming soon_

---

## Customization Demos

### Cat Appearance Generator

Visual customizer for creating cats with different appearances.

**Features:**

- Color picker for fur and eyes
- Pattern selector (tabby, spotted, tuxedo, etc.)
- Size and fur length controls
- Live preview
- Export settings as JSON

_Demo coming soon_

---

### Personality Playground

Experiment with personality traits and observe behavioral differences.

**Features:**

- Sliders for each personality trait
- Multiple cats with different personalities side-by-side
- Behavioral comparison
- Preset personalities (playful, lazy, curious, etc.)

_Demo coming soon_

---

## Interaction Demos

### Interactive Feeding Station

Feed cats and watch them respond to different food types.

**Features:**

- Click to place food
- Basic vs. fancy food comparison
- Water placement
- Auto-cleanup consumed items
- Interaction statistics

```typescript
document.addEventListener("click", async (e) => {
  const foodType = Math.random() > 0.5 ? "food:basic" : "food:fancy";

  await meowzer.interactions.placeNeed(foodType, {
    x: e.clientX,
    y: e.clientY,
  });
});
```

_Demo coming soon_

---

### Yarn Ball Playground

Throw yarn balls and watch cats play.

**Features:**

- Click to throw yarn
- Multiple yarn balls
- Cat chase behavior
- Yarn removal after timeout
- Play statistics

_Demo coming soon_

---

### Laser Pointer Chase

Interactive laser pointer for cats to chase.

**Features:**

- Click to toggle laser
- Mouse-controlled movement
- Multiple cats chasing
- Auto-pattern movement option
- Chase statistics

```typescript
const laser = meowzer.createLaserPointer();

document.addEventListener("click", (e) => {
  if (!laser.isActive) {
    laser.turnOn({ x: e.clientX, y: e.clientY });
  } else {
    laser.turnOff();
  }
});

document.addEventListener("mousemove", (e) => {
  if (laser.isActive) {
    laser.moveTo({ x: e.clientX, y: e.clientY });
  }
});
```

_Demo coming soon_

---

## Persistence Demos

### Cat Collection Manager

Save, load, and organize cats into collections.

**Features:**

- Create and save cats
- Load saved cats
- Collection management
- Import/export functionality
- Storage statistics

_Demo coming soon_

---

### Session Persistence

Automatically save cats and restore them on page reload.

**Features:**

- Auto-save on cat creation
- Auto-load on page init
- Session management
- Clear all data option

```typescript
// Auto-save on create
meowzer.hooks.on("afterCreate", async (ctx) => {
  await meowzer.storage.save(ctx.cat.id);
});

// Auto-load on init
await meowzer.init();
const savedCats = await meowzer.storage.loadAll();
```

_Demo coming soon_

---

## Advanced Demos

### Multi-Cat Ecosystem

Complex environment with multiple cats, interactions, and autonomous behaviors.

**Features:**

- 10+ cats with varied personalities
- Automatic food/water placement
- Yarn throwing
- Boundary management
- Performance monitoring
- Event logging

_Demo coming soon_

---

### Cat Analytics Dashboard

Monitor cat behaviors and interactions with real-time analytics.

**Features:**

- Cat activity tracking
- Interaction heatmap
- State distribution chart
- Performance metrics
- Export data as CSV

_Demo coming soon_

---

### Responsive Cat Environment

Cats that adapt to viewport changes and device orientation.

**Features:**

- Responsive boundary updates
- Mobile-optimized controls
- Touch gesture support
- Landscape/portrait adaptation
- Device motion integration

_Demo coming soon_

---

## Framework Integrations

### React Cat Component

Meowzer integrated into a React application.

**Features:**

- React hooks for cat management
- Component-based architecture
- State management with Context
- TypeScript support

```tsx
import { useMeowzer } from "./hooks/useMeowzer";

function App() {
  const { cats, createCat, destroyCat } = useMeowzer();

  return (
    <div>
      <button onClick={createCat}>Add Cat</button>
      <p>Active cats: {cats.length}</p>
    </div>
  );
}
```

_Demo coming soon_

---

### Vue Cat Manager

Meowzer with Vue 3 Composition API.

**Features:**

- Composition API integration
- Reactive cat management
- Component composition
- TypeScript support

_Demo coming soon_

---

### Svelte Cat Playground

Meowzer in a Svelte application.

**Features:**

- Svelte stores integration
- Reactive declarations
- Component-based UI
- TypeScript support

_Demo coming soon_

---

## Templates

### Vite + TypeScript Starter

Ready-to-use Vite template with TypeScript and Meowzer.

**Includes:**

- Vite configuration
- TypeScript setup
- Basic cat examples
- Hot module replacement

_Demo coming soon_

---

### Next.js App

Meowzer in a Next.js application with SSR support.

**Includes:**

- Next.js 14+ setup
- App Router integration
- Client component examples
- TypeScript configuration

_Demo coming soon_

---

### Astro Integration

Static site with Meowzer using Astro.

**Includes:**

- Astro setup
- Client-side hydration
- Component islands
- TypeScript support

_Demo coming soon_

---

## Building Your Own

### Starting from Scratch

All demos follow this basic structure:

1. **Install Meowzer**

   ```bash
   npm install meowzer
   ```

2. **Initialize**

   ```typescript
   import { Meowzer } from "meowzer";

   const meowzer = new Meowzer();
   await meowzer.init();
   ```

3. **Create cats**

   ```typescript
   const cat = await meowzer.cats.create();
   ```

4. **Add interactions**
   ```typescript
   await meowzer.interactions.placeNeed("food:basic", {
     x: 400,
     y: 300,
   });
   ```

### Tips for Demos

**Performance:**

- Limit cat count (10-15 for smooth performance)
- Use `destroyAll()` to reset
- Monitor frame rate with many cats

**UI/UX:**

- Provide clear controls
- Show cat count
- Add visual feedback for interactions
- Include reset button

**Persistence:**

- Clear storage during development
- Handle storage errors gracefully
- Provide export/import for user data

**Mobile:**

- Use touch events for interactions
- Adjust boundaries for mobile viewport
- Optimize for smaller screens

---

## Want to Help?

Interested in building these demos? We'd love your contributions!

1. Pick a demo from the list above
2. Create it on CodeSandbox
3. Open a PR with the link and any improvements to the description
4. We'll review and integrate it

---

## See Also

- [Code Snippets](/examples/code-snippets) - Copy-paste examples
- [Basic Integration Tutorial](/tutorials/basic-integration) - Step-by-step guide
- [API Reference](/api/meowzer-sdk) - Complete API documentation
