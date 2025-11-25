---
title: "Persistence Setup"
description: "Save and load cats with IndexedDB storage"
---

Learn how to persist cats across browser sessions using Meowzer's built-in storage system.

## What You'll Build

An application that can:

- Save cats to IndexedDB
- Load saved cats on page reload
- Manage multiple collections
- Handle storage errors gracefully
- Export and import cat data

**Estimated time:** 20 minutes

## Prerequisites

- Completed [Basic Integration](/tutorials/basic-integration) tutorial
- Understanding of async/await
- Modern browser with IndexedDB support

## Understanding Storage

Meowzer uses **IndexedDB** to persist cat data locally in the browser. This means:

- Cats survive page refreshes
- No server required
- Works offline
- Stored per-origin (domain)
- Typically 50MB+ available space

### What Gets Saved

When you save a cat, Meowzer stores:

- Cat appearance (color, pattern, accessories)
- Personality traits
- Current name
- Creation timestamp
- Custom metadata (if provided)

### What Doesn't Get Saved

- Current position on screen
- Active animation state
- Runtime behaviors
- Event listeners

:::tip
Saved cats will appear at default positions when loaded. You can set their position after loading.
:::

## Step 1: Enable Storage

By default, storage is enabled. You can configure it explicitly:

```javascript
import { Meowzer } from "meowzer";

const meowzer = new Meowzer({
  storage: {
    adapter: "indexeddb", // or 'memory' for testing
    enabled: true,
    defaultCollection: "my-cats", // Collection name
    dbName: "meowzer-db", // Database name
    version: 1, // Schema version
  },
});

await meowzer.init();
```

## Step 2: Save a Cat

After creating a cat, save it to storage:

```javascript
// Create a cat
const cat = await meowzer.cats.create({
  name: "Whiskers",
  settings: {
    color: "#FF9500",
    pattern: "tabby",
  },
});

// Cat is automatically placed on the page!

// Save to storage
try {
  await meowzer.storage.save(cat.id);
  console.log(`Saved ${cat.name} successfully!`);
} catch (error) {
  console.error("Failed to save cat:", error);
}
```

:::caution
Always use `try/catch` when working with storage operations. IndexedDB can fail due to quota limits or permissions.
:::

## Step 3: Load Saved Cats

Load cats when your page initializes:

```javascript
const meowzer = new Meowzer();
await meowzer.init();

try {
  // Get list of saved cats
  const savedCats = await meowzer.storage.listCats();
  console.log(`Found ${savedCats.length} saved cats`);

  // Load each cat
  for (const catMeta of savedCats) {
    const cat = await meowzer.storage.load(catMeta.id);
    // Cat is automatically placed on the page!
    console.log(`Loaded ${cat.name}`);
  }
} catch (error) {
  console.error("Failed to load cats:", error);
}
```

## Complete Example: Persistent Cat Manager

Here's a full implementation with save/load functionality:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Persistent Cats</title>
    <style>
      body {
        margin: 0;
        padding: 20px;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
      }

      #controls {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        min-width: 250px;
        z-index: 1000;
      }

      h2 {
        margin: 0 0 16px 0;
        font-size: 18px;
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

      button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .primary {
        background: #667eea;
        color: white;
      }

      .danger {
        background: #f56565;
        color: white;
      }

      .stats {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 2px solid #e2e8f0;
        font-size: 14px;
        color: #666;
      }

      .stats div {
        margin-bottom: 8px;
      }

      .stats strong {
        color: #333;
      }

      #status {
        margin-top: 12px;
        padding: 12px;
        border-radius: 6px;
        font-size: 13px;
        display: none;
      }

      #status.success {
        background: #c6f6d5;
        color: #22543d;
        display: block;
      }

      #status.error {
        background: #fed7d7;
        color: #742a2a;
        display: block;
      }
    </style>
  </head>
  <body>
    <div id="controls">
      <h2>Persistent Cats</h2>
      <button class="primary" id="add-cat">Add Cat</button>
      <button class="primary" id="save-all">Save All Cats</button>
      <button class="primary" id="load-cats">Load Saved Cats</button>
      <button class="danger" id="clear-all">Clear All Cats</button>

      <div class="stats">
        <div>Active: <strong id="active-count">0</strong></div>
        <div>Saved: <strong id="saved-count">0</strong></div>
      </div>

      <div id="status"></div>
    </div>

    <script type="module" src="/main.js"></script>
  </body>
</html>
```

```javascript
// main.js
import { Meowzer } from "meowzer";

const meowzer = new Meowzer({
  behavior: {
    boundaries: {
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    },
  },
  storage: {
    enabled: true,
    defaultCollection: "persistent-cats",
  },
});

await meowzer.init();

const activeCats = new Set();

// UI elements
const statusEl = document.getElementById("status");
const activeCountEl = document.getElementById("active-count");
const savedCountEl = document.getElementById("saved-count");

// Show status message
function showStatus(message, type = "success") {
  statusEl.textContent = message;
  statusEl.className = type;
  setTimeout(() => {
    statusEl.className = "";
  }, 3000);
}

// Update counts
async function updateCounts() {
  activeCountEl.textContent = activeCats.size;

  try {
    const savedCats = await meowzer.storage.listCats();
    savedCountEl.textContent = savedCats.length;
  } catch (error) {
    console.error("Failed to count saved cats:", error);
  }
}

// Add cat
document
  .getElementById("add-cat")
  .addEventListener("click", async () => {
    try {
      const cat = await meowzer.cats.create({
        name: `Cat ${activeCats.size + 1}`,
      });
      // Cat is automatically placed on the page!
      activeCats.add(cat);
      await updateCounts();
      showStatus(`Created ${cat.name}!`);
    } catch (error) {
      showStatus(`Failed to create cat: ${error.message}`, "error");
    }
  });

// Save all cats
document
  .getElementById("save-all")
  .addEventListener("click", async () => {
    if (activeCats.size === 0) {
      showStatus("No cats to save!", "error");
      return;
    }

    try {
      const savePromises = Array.from(activeCats).map((cat) =>
        meowzer.storage.save(cat.id)
      );
      await Promise.all(savePromises);
      await updateCounts();
      showStatus(`Saved ${activeCats.size} cats!`);
    } catch (error) {
      showStatus(`Failed to save cats: ${error.message}`, "error");
    }
  });

// Load saved cats
document
  .getElementById("load-cats")
  .addEventListener("click", async () => {
    try {
      // Clear active cats first
      activeCats.forEach((cat) => cat.destroy());
      activeCats.clear();

      // Load from storage
      const savedCats = await meowzer.storage.listCats();

      if (savedCats.length === 0) {
        showStatus("No saved cats found!", "error");
        await updateCounts();
        return;
      }

      for (const catMeta of savedCats) {
        const cat = await meowzer.storage.load(catMeta.id);
        // Cat is automatically placed on the page!
        activeCats.add(cat);
      }

      await updateCounts();
      showStatus(`Loaded ${savedCats.length} cats!`);
    } catch (error) {
      showStatus(`Failed to load cats: ${error.message}`, "error");
    }
  });

// Clear all cats
document
  .getElementById("clear-all")
  .addEventListener("click", async () => {
    if (
      !confirm("Delete all cats from storage? This cannot be undone!")
    ) {
      return;
    }

    try {
      // Destroy active cats
      activeCats.forEach((cat) => cat.destroy());
      activeCats.clear();

      // Delete from storage
      await meowzer.storage.clearCollection();
      await updateCounts();
      showStatus("All cats cleared!");
    } catch (error) {
      showStatus(`Failed to clear cats: ${error.message}`, "error");
    }
  });

// Initial count
updateCounts();
```

## Working with Collections

Collections let you organize cats into separate groups:

```javascript
// Save to specific collection
await meowzer.storage.save(cat.id, {
  collection: "playful-cats",
});

// List cats in a collection
const playfulCats = await meowzer.storage.listCats({
  collection: "playful-cats",
});

// Load from specific collection
const cat = await meowzer.storage.load(catId, {
  collection: "playful-cats",
});
```

## Advanced: Metadata

Store custom data with your cats:

```javascript
// Save with metadata
await meowzer.storage.save(cat.id, {
  metadata: {
    favoriteFood: "tuna",
    adoptedDate: new Date().toISOString(),
    tags: ["playful", "orange"],
  },
});

// Retrieve metadata
const savedCats = await meowzer.storage.listCats();
savedCats.forEach((catMeta) => {
  console.log(catMeta.metadata);
  // { favoriteFood: 'tuna', adoptedDate: '2025-11-24...', tags: [...] }
});
```

## Error Handling

Common storage errors and how to handle them:

```javascript
try {
  await meowzer.storage.save(cat.id);
} catch (error) {
  if (error.name === "QuotaExceededError") {
    // Storage quota exceeded
    alert("Not enough storage space! Please delete some cats.");
  } else if (error.name === "NotFoundError") {
    // Cat doesn't exist
    console.error("Cat not found:", cat.id);
  } else {
    // Other errors
    console.error("Storage error:", error);
  }
}
```

## Storage Limits

IndexedDB provides significant storage:

- **Chrome/Edge:** 60% of available disk space
- **Firefox:** 10GB default, 2GB per origin
- **Safari:** 1GB per origin

Check storage usage:

```javascript
if ("storage" in navigator && "estimate" in navigator.storage) {
  const estimate = await navigator.storage.estimate();
  const percentUsed = (estimate.usage / estimate.quota) * 100;
  console.log(`Storage: ${percentUsed.toFixed(2)}% used`);
}
```

## Best Practices

### 1. Save Strategically

Don't save after every change. Save when:

- User explicitly clicks "Save"
- Before page unload (with confirmation)
- After significant changes

```javascript
window.addEventListener("beforeunload", async (e) => {
  if (activeCats.size > 0) {
    e.preventDefault();
    e.returnValue = ""; // Shows browser confirm dialog

    // Save cats
    const savePromises = Array.from(activeCats).map((cat) =>
      meowzer.storage.save(cat.id)
    );
    await Promise.all(savePromises);
  }
});
```

### 2. Handle Load Failures

Individual cats might fail to load:

```javascript
const savedCats = await meowzer.storage.listCats();
const loaded = [];
const failed = [];

for (const catMeta of savedCats) {
  try {
    const cat = await meowzer.storage.load(catMeta.id);
    // Cat is automatically placed on the page!
    loaded.push(cat);
  } catch (error) {
    console.error(`Failed to load ${catMeta.id}:`, error);
    failed.push(catMeta.id);
  }
}

console.log(`Loaded: ${loaded.length}, Failed: ${failed.length}`);
```

### 3. Clean Up Old Data

Periodically remove old cats:

```javascript
const savedCats = await meowzer.storage.listCats();
const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

for (const catMeta of savedCats) {
  if (catMeta.createdAt < oneWeekAgo) {
    await meowzer.storage.delete(catMeta.id);
    console.log(`Deleted old cat: ${catMeta.id}`);
  }
}
```

## Testing with Memory Storage

For development and testing, use the memory adapter:

```javascript
const meowzer = new Meowzer({
  storage: {
    adapter: "memory", // Data lost on page refresh
    enabled: true,
  },
});
```

This is useful for:

- Unit tests
- Temporary demos
- Avoiding IndexedDB quota during development

## Next Steps

- [Customize Cat Appearance](/tutorials/customization) - Control colors and patterns
- [Explore Storage API](/api/managers/storage-manager) - Full storage reference
- [Handle Interactions](/guides/interactions) - Add toys and food

## Troubleshooting

### Cats don't persist after reload

- Check that `storage.enabled: true`
- Verify `await meowzer.storage.save()` is called
- Check browser console for IndexedDB errors
- Ensure not using memory adapter

### QuotaExceededError

- Clear old saved cats
- Reduce number of saved cats
- Check storage estimate with `navigator.storage.estimate()`

### Cats load in wrong positions

- This is expected - positions aren't saved
- Set position after loading: `cat.setPosition({ x: 100, y: 100 })`

## Complete Example

View the full working code on CodeSandbox:

[View Live Demo →](https://codesandbox.io/s/meowzer-persistence)
