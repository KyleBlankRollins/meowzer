---
title: Your First Cat - Detailed Tutorial
description: A comprehensive walkthrough of creating and customizing your first Meowzer cat
previous: /docs/getting-started/quick-start
next: /docs/tutorials/basic-integration
---

# Your First Cat - Detailed Tutorial

This tutorial provides a comprehensive, step-by-step walkthrough of creating your first Meowzer cat. We'll cover everything from setup to customization, interactions, and persistence.

**Time:** 15-20 minutes  
**Level:** Beginner  
**Prerequisites:** Meowzer installed ([Installation Guide](/docs/getting-started/installation))

## What You'll Build

By the end of this tutorial, you'll have:

- ✅ A fully customized cat with unique appearance
- ✅ Personality traits that affect behavior
- ✅ Interactive elements (food, toys)
- ✅ Persistence (save and reload your cat)
- ✅ UI controls to manage your cat

## Project Setup

### 1. Create Project Structure

Create a new directory and set up files:

```bash
mkdir my-first-cat
cd my-first-cat
npm init -y
npm install meowzer vite
```

Your `package.json` should look like:

```json
{
  "name": "my-first-cat",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "meowzer": "^1.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

### 2. Create HTML File

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>My First Meowzer Cat</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, Oxygen, Ubuntu, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        color: white;
      }

      #controls {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        color: #333;
        max-width: 300px;
      }

      h1 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      .control-group {
        margin-bottom: 1rem;
      }

      label {
        display: block;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #555;
      }

      input,
      select,
      button {
        width: 100%;
        padding: 0.5rem;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 0.9rem;
      }

      button {
        background: #667eea;
        color: white;
        border: none;
        cursor: pointer;
        font-weight: 600;
        margin-top: 0.5rem;
        transition: background 0.2s;
      }

      button:hover {
        background: #5568d3;
      }

      button:active {
        transform: scale(0.98);
      }

      .info {
        background: rgba(102, 126, 234, 0.1);
        padding: 1rem;
        border-radius: 6px;
        margin-top: 1rem;
        font-size: 0.85rem;
      }

      .info p {
        margin: 0.25rem 0;
      }
    </style>
  </head>
  <body>
    <div id="controls">
      <h1>🐱 Cat Creator</h1>

      <div class="control-group">
        <label for="cat-name">Cat Name</label>
        <input type="text" id="cat-name" value="Whiskers" />
      </div>

      <div class="control-group">
        <label for="fur-color">Fur Color</label>
        <input type="color" id="fur-color" value="#FF9500" />
      </div>

      <div class="control-group">
        <label for="eye-color">Eye Color</label>
        <input type="color" id="eye-color" value="#00FF00" />
      </div>

      <div class="control-group">
        <label for="pattern">Pattern</label>
        <select id="pattern">
          <option value="solid">Solid</option>
          <option value="tabby" selected>Tabby</option>
          <option value="spotted">Spotted</option>
          <option value="tuxedo">Tuxedo</option>
          <option value="calico">Calico</option>
        </select>
      </div>

      <div class="control-group">
        <label for="personality">Personality</label>
        <select id="personality">
          <option value="playful" selected>Playful</option>
          <option value="lazy">Lazy</option>
          <option value="curious">Curious</option>
          <option value="energetic">Energetic</option>
          <option value="calm">Calm</option>
        </select>
      </div>

      <button id="create-cat">Create Cat</button>
      <button id="feed-cat">🍖 Feed Cat</button>
      <button id="throw-yarn">🧶 Throw Yarn</button>
      <button id="save-cat">💾 Save Cat</button>
      <button id="load-cat">📂 Load Cat</button>

      <div class="info" id="cat-info">
        <p><strong>No cat yet</strong></p>
        <p>Create a cat to get started!</p>
      </div>
    </div>

    <script type="module" src="/main.js"></script>
  </body>
</html>
```

### 3. Create JavaScript File

Create `main.js` - we'll build this step by step.

## Step-by-Step Implementation

### Step 1: Initialize Meowzer

First, let's set up the Meowzer instance:

```javascript
// main.js
import { Meowzer } from "meowzer";

// Global variables
let meowzer;
let currentCat;

// Initialize on page load
async function init() {
  // Create Meowzer instance with configuration
  meowzer = new Meowzer({
    storage: {
      adapter: "indexeddb",
      enabled: true,
      defaultCollection: "my-cats",
    },
    behavior: {
      boundaries: {
        minX: 0,
        maxX: window.innerWidth,
        minY: 0,
        maxY: window.innerHeight,
      },
    },
  });

  // MUST call init before using SDK
  await meowzer.init();

  console.log("Meowzer initialized! ✅");

  // Set up event listeners
  setupEventListeners();
}

// Run init when page loads
init();
```

**What's happening:**

- We create a global `meowzer` variable accessible throughout our app
- We configure storage to use IndexedDB
- We set boundaries to match the window size
- We call `init()` which is **required** before using any features

### Step 2: Create Cat Function

Add a function to create cats based on user input:

```javascript
async function createCat() {
  // If there's already a cat, remove it
  if (currentCat) {
    currentCat.destroy();
  }

  // Get values from form inputs
  const name = document.getElementById("cat-name").value;
  const furColor = document.getElementById("fur-color").value;
  const eyeColor = document.getElementById("eye-color").value;
  const pattern = document.getElementById("pattern").value;
  const personality = document.getElementById("personality").value;

  // Create the cat with custom settings
  currentCat = await meowzer.cats.create({
    name: name,
    settings: {
      color: furColor,
      eyeColor: eyeColor,
      pattern: pattern,
      size: "medium",
      furLength: "short",
    },
    personality: personality,
  });

  // Place cat on the page
  currentCat.place(document.body);

  console.log(`Created cat: ${currentCat.name}`);

  // Update UI
  updateCatInfo();

  // Listen to cat events
  currentCat.on("stateChanged", (event) => {
    console.log(`${currentCat.name} is now ${event.newState}`);
  });
}
```

**What's happening:**

- We gather form values for appearance and personality
- We create a new cat with `meowzer.cats.create()`
- We place it on the page with `cat.place()`
- We set up event listeners to track state changes

### Step 3: Add Interactions

Create functions for feeding and playing:

```javascript
async function feedCat() {
  if (!currentCat) {
    alert("Create a cat first!");
    return;
  }

  // Place food near the cat
  const catPosition = currentCat.getPosition();

  await meowzer.interactions.placeNeed("food:basic", {
    x: catPosition.x + 100,
    y: catPosition.y,
  });

  console.log("Food placed! Cat should notice it soon.");
}

async function throwYarn() {
  if (!currentCat) {
    alert("Create a cat first!");
    return;
  }

  // Place yarn in a random spot
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;

  await meowzer.interactions.placeYarn({ x, y });

  console.log("Yarn thrown! Cat might play with it.");
}
```

**What's happening:**

- We check if a cat exists before placing items
- We use `meowzer.interactions` to place food and toys
- The cat's AI will notice these items and interact with them

### Step 4: Add Persistence

Create save and load functions:

```javascript
async function saveCat() {
  if (!currentCat) {
    alert("Create a cat first!");
    return;
  }

  try {
    await meowzer.storage.save(currentCat.id);
    alert(`${currentCat.name} saved successfully! 💾`);
  } catch (error) {
    console.error("Failed to save cat:", error);
    alert("Failed to save cat. Check console for details.");
  }
}

async function loadCat() {
  try {
    // Get list of saved cats
    const savedCats = await meowzer.storage.listCats();

    if (savedCats.length === 0) {
      alert("No saved cats found. Create and save a cat first!");
      return;
    }

    // Load the most recently saved cat
    const latestCat = savedCats[savedCats.length - 1];

    // Remove current cat if exists
    if (currentCat) {
      currentCat.destroy();
    }

    // Load the cat
    currentCat = await meowzer.storage.load(latestCat.id);
    currentCat.place(document.body);

    console.log(`Loaded cat: ${currentCat.name}`);

    // Update UI
    updateCatInfo();

    alert(`Loaded ${currentCat.name}! 📂`);
  } catch (error) {
    console.error("Failed to load cat:", error);
    alert("Failed to load cat. Check console for details.");
  }
}
```

**What's happening:**

- We use `meowzer.storage.save()` to persist the cat to IndexedDB
- We use `meowzer.storage.listCats()` to see what's saved
- We use `meowzer.storage.load()` to restore a saved cat

### Step 5: Update UI Info

Add a function to display cat information:

```javascript
function updateCatInfo() {
  const infoDiv = document.getElementById("cat-info");

  if (!currentCat) {
    infoDiv.innerHTML = `
      <p><strong>No cat yet</strong></p>
      <p>Create a cat to get started!</p>
    `;
    return;
  }

  const position = currentCat.getPosition();

  infoDiv.innerHTML = `
    <p><strong>Name:</strong> ${currentCat.name}</p>
    <p><strong>ID:</strong> ${currentCat.id.substring(0, 8)}...</p>
    <p><strong>Position:</strong> (${Math.round(
      position.x
    )}, ${Math.round(position.y)})</p>
    <p><strong>State:</strong> ${currentCat.getState()}</p>
  `;
}
```

### Step 6: Set Up Event Listeners

Connect buttons to functions:

```javascript
function setupEventListeners() {
  document
    .getElementById("create-cat")
    .addEventListener("click", createCat);

  document
    .getElementById("feed-cat")
    .addEventListener("click", feedCat);

  document
    .getElementById("throw-yarn")
    .addEventListener("click", throwYarn);

  document
    .getElementById("save-cat")
    .addEventListener("click", saveCat);

  document
    .getElementById("load-cat")
    .addEventListener("click", loadCat);

  // Update boundaries on window resize
  window.addEventListener("resize", () => {
    if (currentCat) {
      currentCat.setBoundaries({
        minX: 0,
        maxX: window.innerWidth,
        minY: 0,
        maxY: window.innerHeight,
      });
    }
  });

  // Update info every 2 seconds
  setInterval(() => {
    if (currentCat) {
      updateCatInfo();
    }
  }, 2000);
}
```

## Complete Code

Here's the full `main.js` file:

```javascript
import { Meowzer } from "meowzer";

let meowzer;
let currentCat;

async function init() {
  meowzer = new Meowzer({
    storage: {
      adapter: "indexeddb",
      enabled: true,
      defaultCollection: "my-cats",
    },
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
  console.log("Meowzer initialized! ✅");
  setupEventListeners();
}

async function createCat() {
  if (currentCat) {
    currentCat.destroy();
  }

  const name = document.getElementById("cat-name").value;
  const furColor = document.getElementById("fur-color").value;
  const eyeColor = document.getElementById("eye-color").value;
  const pattern = document.getElementById("pattern").value;
  const personality = document.getElementById("personality").value;

  currentCat = await meowzer.cats.create({
    name: name,
    settings: {
      color: furColor,
      eyeColor: eyeColor,
      pattern: pattern,
      size: "medium",
      furLength: "short",
    },
    personality: personality,
  });

  currentCat.place(document.body);
  console.log(`Created cat: ${currentCat.name}`);
  updateCatInfo();

  currentCat.on("stateChanged", (event) => {
    console.log(`${currentCat.name} is now ${event.newState}`);
  });
}

async function feedCat() {
  if (!currentCat) {
    alert("Create a cat first!");
    return;
  }

  const catPosition = currentCat.getPosition();
  await meowzer.interactions.placeNeed("food:basic", {
    x: catPosition.x + 100,
    y: catPosition.y,
  });

  console.log("Food placed!");
}

async function throwYarn() {
  if (!currentCat) {
    alert("Create a cat first!");
    return;
  }

  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;

  await meowzer.interactions.placeYarn({ x, y });
  console.log("Yarn thrown!");
}

async function saveCat() {
  if (!currentCat) {
    alert("Create a cat first!");
    return;
  }

  try {
    await meowzer.storage.save(currentCat.id);
    alert(`${currentCat.name} saved successfully! 💾`);
  } catch (error) {
    console.error("Failed to save cat:", error);
    alert("Failed to save cat.");
  }
}

async function loadCat() {
  try {
    const savedCats = await meowzer.storage.listCats();

    if (savedCats.length === 0) {
      alert("No saved cats found!");
      return;
    }

    const latestCat = savedCats[savedCats.length - 1];

    if (currentCat) {
      currentCat.destroy();
    }

    currentCat = await meowzer.storage.load(latestCat.id);
    currentCat.place(document.body);

    console.log(`Loaded cat: ${currentCat.name}`);
    updateCatInfo();
    alert(`Loaded ${currentCat.name}! 📂`);
  } catch (error) {
    console.error("Failed to load cat:", error);
    alert("Failed to load cat.");
  }
}

function updateCatInfo() {
  const infoDiv = document.getElementById("cat-info");

  if (!currentCat) {
    infoDiv.innerHTML = `
      <p><strong>No cat yet</strong></p>
      <p>Create a cat to get started!</p>
    `;
    return;
  }

  const position = currentCat.getPosition();
  infoDiv.innerHTML = `
    <p><strong>Name:</strong> ${currentCat.name}</p>
    <p><strong>ID:</strong> ${currentCat.id.substring(0, 8)}...</p>
    <p><strong>Position:</strong> (${Math.round(
      position.x
    )}, ${Math.round(position.y)})</p>
    <p><strong>State:</strong> ${currentCat.getState()}</p>
  `;
}

function setupEventListeners() {
  document
    .getElementById("create-cat")
    .addEventListener("click", createCat);
  document
    .getElementById("feed-cat")
    .addEventListener("click", feedCat);
  document
    .getElementById("throw-yarn")
    .addEventListener("click", throwYarn);
  document
    .getElementById("save-cat")
    .addEventListener("click", saveCat);
  document
    .getElementById("load-cat")
    .addEventListener("click", loadCat);

  window.addEventListener("resize", () => {
    if (currentCat) {
      currentCat.setBoundaries({
        minX: 0,
        maxX: window.innerWidth,
        minY: 0,
        maxY: window.innerHeight,
      });
    }
  });

  setInterval(() => {
    if (currentCat) {
      updateCatInfo();
    }
  }, 2000);
}

init();
```

## Run Your Project

Start the development server:

```bash
npm run dev
```

Open the URL shown (usually `http://localhost:5173`) in your browser.

## Try It Out

Now you can:

1. **Create a cat** - Customize name, colors, pattern, personality
2. **Watch it wander** - The cat moves autonomously
3. **Feed it** - Click "Feed Cat" to place food
4. **Play with it** - Click "Throw Yarn" for a toy
5. **Save it** - Click "Save Cat" to persist to IndexedDB
6. **Reload the page** - Click "Load Cat" to restore your saved cat

## Understanding the Cat's Behavior

### Personality Effects

Different personalities behave differently:

- **Playful** - Interacts with toys more, energetic movement
- **Lazy** - Sits more often, moves slowly
- **Curious** - Explores more, investigates new items
- **Energetic** - Rarely stops moving, fast pace
- **Calm** - Balanced behavior, peaceful movements

### State Machine

Cats go through different states:

- `idle` - Standing still, looking around
- `walking` - Moving to a destination
- `sitting` - Resting
- `playing` - Interacting with a toy
- `eating` - Consuming food

Watch the console and info panel to see state changes!

## Next Steps

Congratulations! You've created a fully functional Meowzer cat with:

- ✅ Custom appearance
- ✅ Personality traits
- ✅ Interactions
- ✅ Persistence

### Enhancements to Try

1. **Add more cats** - Create multiple cats at once
2. **Custom boundaries** - Restrict cats to specific areas
3. **Laser pointer** - Implement mouse-following laser
4. **Collection management** - Load different saved cats
5. **Visual feedback** - Show animations when feeding/playing

### Continue Learning

- [**Basic Integration Tutorial**](/docs/tutorials/basic-integration) - Build a simple cat page
- [**Customization Guide**](/docs/guides/customization) - All appearance options
- [**Interactions Guide**](/docs/guides/interactions) - Complete interaction reference
- [**API Reference**](/docs/api/meowzer-sdk) - Full SDK documentation

## Common Issues

### Cat doesn't appear

**Check:** Did you call `await meowzer.init()` before creating the cat?

### Cat wanders off screen

**Solution:** Boundaries are set on initialization. Make sure they match your viewport.

### Storage fails in private mode

**Solution:** Some browsers disable IndexedDB in private mode. Use memory adapter:

```javascript
const meowzer = new Meowzer({
  storage: {
    adapter: "memory",
  },
});
```

### Food/Yarn doesn't appear

**Check:** Items are placed at specific coordinates. Make sure coordinates are within viewport bounds.

## Full Project Download

Want the complete code? [Download the example project on GitHub](#) (coming soon).

Happy cat-making! 🐱
