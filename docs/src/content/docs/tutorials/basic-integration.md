---
title: "Basic Integration"
description: "Build a simple cat-enabled webpage from scratch"
---

Build a simple cat-enabled webpage from scratch with full control over cat creation and management.

## What You'll Build

A webpage where cats wander around and you can:

- Create new cats with a button
- Remove cats individually
- See how many cats are currently active
- Watch autonomous AI behaviors in action

**Estimated time:** 15 minutes

## Prerequisites

- Basic HTML/CSS/JavaScript knowledge
- Node.js 18+ installed
- A text editor or IDE

## Step 1: Set Up Project

Create a new directory and initialize your project:

```bash
mkdir my-cat-page
cd my-cat-page
npm init -y
npm install meowzer vite
```

## Step 2: Create HTML Structure

Create `index.html` with a simple control panel:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>My Cat Page</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        padding: 20px;
        overflow: hidden;
      }

      #controls {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        min-width: 200px;
        z-index: 1000;
      }

      h1 {
        font-size: 18px;
        margin-bottom: 16px;
        color: #333;
      }

      button {
        width: 100%;
        padding: 12px 16px;
        margin-bottom: 8px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      button:active {
        transform: translateY(0);
      }

      #add-cat {
        background: #667eea;
        color: white;
      }

      #add-cat:hover {
        background: #5568d3;
      }

      #remove-cat {
        background: #f56565;
        color: white;
      }

      #remove-cat:hover {
        background: #e53e3e;
      }

      #remove-cat:disabled {
        background: #cbd5e0;
        cursor: not-allowed;
        transform: none;
      }

      .stats {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 2px solid #e2e8f0;
        font-size: 14px;
        color: #666;
      }

      .stats strong {
        color: #333;
        font-size: 24px;
      }
    </style>
  </head>
  <body>
    <div id="controls">
      <h1>Cat Controller</h1>
      <button id="add-cat">Add Cat</button>
      <button id="remove-cat">Remove Cat</button>
      <div class="stats">
        Active cats: <strong id="count">0</strong>
      </div>
    </div>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

## Step 3: Initialize Meowzer

Create `main.js` with the core logic:

```javascript
import { Meowzer } from "meowzer";

// Initialize Meowzer with window boundaries
const meowzer = new Meowzer({
  behavior: {
    boundaries: {
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    },
  },
});

await meowzer.init();

// Track active cats
const activeCats = new Set();

// Update the displayed count
function updateCount() {
  const count = activeCats.size;
  document.getElementById("count").textContent = count;

  // Disable remove button when no cats exist
  document.getElementById("remove-cat").disabled = count === 0;
}

// Add cat button handler
document
  .getElementById("add-cat")
  .addEventListener("click", async () => {
    const cat = await meowzer.cats.create({
      name: `Cat ${activeCats.size + 1}`,
    });

    // Cat is automatically placed on the page!
    activeCats.add(cat);
    updateCount();

    console.log(`Created ${cat.name}!`);
  });

// Remove cat button handler
document
  .getElementById("remove-cat")
  .addEventListener("click", () => {
    // Get the first cat from the set
    const cat = Array.from(activeCats)[0];

    if (cat) {
      console.log(`Removing ${cat.name}...`);
      cat.destroy();
      activeCats.delete(cat);
      updateCount();
    }
  });

// Initialize button state
updateCount();
```

## Step 4: Add Package Scripts

Update your `package.json` to include dev and build scripts:

```json
{
  "name": "my-cat-page",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "meowzer": "^1.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

## Step 5: Run Your Project

Start the development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser and click "Add Cat"!

## What's Happening?

Let's break down the key parts:

### Initialization

```javascript
const meowzer = new Meowzer({
  behavior: {
    boundaries: {
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    },
  },
});

await meowzer.init();
```

- Creates a Meowzer instance with window boundaries
- Prevents cats from wandering off-screen
- `init()` must be called before creating cats

### Creating Cats

```javascript
const cat = await meowzer.cats.create({
  name: `Cat ${activeCats.size + 1}`,
});
// Cat is automatically placed on the page and AI starts!
```

- `create()` generates a new cat with random appearance
- Each cat gets a unique name
- Cat automatically appears on the page and starts autonomous behavior

### Managing State

```javascript
const activeCats = new Set();
activeCats.add(cat); // Track creation
activeCats.delete(cat); // Track destruction
```

- Uses a Set to track active cats
- Enables accurate counting
- Prevents duplicate tracking

### Destroying Cats

```javascript
cat.destroy();
```

- Stops all AI behaviors
- Removes cat from DOM
- Cleans up event listeners
- Frees memory

## Enhancements

### Responsive Boundaries

Update boundaries when window resizes:

```javascript
function updateBoundaries() {
  const boundaries = {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  };

  activeCats.forEach((cat) => {
    cat.setBoundaries(boundaries);
  });
}

window.addEventListener("resize", updateBoundaries);
```

### Random Cat Appearances

Create cats with varied appearances:

```javascript
const colors = [
  "#FF9500",
  "#007AFF",
  "#34C759",
  "#FF3B30",
  "#AF52DE",
];
const patterns = ["solid", "tabby", "spotted", "tuxedo", "calico"];

document
  .getElementById("add-cat")
  .addEventListener("click", async () => {
    const cat = await meowzer.cats.create({
      name: `Cat ${activeCats.size + 1}`,
      settings: {
        color: colors[Math.floor(Math.random() * colors.length)],
        pattern:
          patterns[Math.floor(Math.random() * patterns.length)],
      },
    });

    // Cat is automatically placed on the page!
    activeCats.add(cat);
    updateCount();
  });
```

### Event Listeners

React to cat state changes:

```javascript
const cat = await meowzer.cats.create({ name: "Whiskers" });

cat.on("stateChanged", (event) => {
  console.log(`${cat.name} is now ${event.newState}`);
});
// Cat is automatically placed on the page!
```

## Next Steps

Now that you have a basic integration working:

- [Add Persistence](/tutorials/persistence-setup) - Save and load cats
- [Customize Cats](/tutorials/customization) - Control appearance and personality
- [Explore the API](/api/) - Discover all available features

## Troubleshooting

### Cats aren't appearing

- Check browser console for errors
- Verify `await meowzer.init()` was called
- Ensure cat creation completes without errors

### Cats walk off-screen

- Verify boundaries are set correctly
- Check window dimensions match boundaries
- Update boundaries on window resize

### Performance issues with many cats

- Limit to 10-15 cats on screen
- Use `cat.pause()` for inactive cats
- Consider destroying cats that leave view

## Complete Example

The full working code is available on CodeSandbox:

[View Live Demo →](https://codesandbox.io/s/meowzer-basic-integration)
