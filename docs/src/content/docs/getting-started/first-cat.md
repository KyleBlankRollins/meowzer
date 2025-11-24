---
title: Your First Cat
description: A comprehensive tutorial for creating and customizing your first Meowzer cat
---

This tutorial provides a comprehensive walkthrough of creating your first Meowzer cat. We'll cover everything from setup to customization, interactions, and persistence.

**Time:** 15-20 minutes  
**Level:** Beginner  
**Prerequisites:** Meowzer installed ([Installation Guide](/getting-started/installation))

## What You'll Build

By the end of this tutorial, you'll have:

- ✅ A fully customized cat with unique appearance
- ✅ Personality traits that affect behavior
- ✅ Interactive elements (food, toys)
- ✅ Persistence (save and reload your cat)
- ✅ UI controls to manage your cat

## Project Setup

Create a new project with Vite:

```bash
npm create vite@latest my-first-cat -- --template vanilla
cd my-first-cat
npm install
npm install meowzer
```

## HTML Structure

Replace the contents of `index.html`:

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

## Add Styles

Create `style.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
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
```

## Implementation

Create `main.js` with the complete implementation:

```javascript
import { Meowzer } from "meowzer";
import "./style.css";

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

Open the URL in your browser (usually `http://localhost:5173`).

## Try It Out

Now you can:

1. **Create a cat** - Customize name, colors, pattern, personality
2. **Watch it wander** - The cat moves autonomously
3. **Feed it** - Click "Feed Cat" to place food
4. **Play with it** - Click "Throw Yarn" for a toy
5. **Save it** - Click "Save Cat" to persist to IndexedDB
6. **Reload the page** - Click "Load Cat" to restore your saved cat

## Understanding Behavior

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

Congratulations! You've created a fully functional Meowzer cat with custom appearance, personality traits, interactions, and persistence.

### Continue Learning

- **API Reference** - Full SDK documentation
- Learn about advanced customization options
- Explore the plugin system
