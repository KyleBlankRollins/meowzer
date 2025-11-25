---
title: Best Practices
description: Production-ready patterns and recommendations for building with Meowzer
---

Building production applications with Meowzer requires following best practices for reliability, maintainability, and user experience. This guide covers recommended patterns and common pitfalls.

## Initialization

### Proper Setup

**Do: Initialize once at app start**

```typescript
// main.ts or app initialization
let meowzer: MeowzerSDK;

async function initializeApp() {
  meowzer = new MeowzerSDK({
    storage: "indexeddb",
    boundaries: {
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    },
  });

  await meowzer.init();

  // Make available globally if needed
  window.meowzer = meowzer;
}

initializeApp().catch(console.error);
```

**Don't: Create multiple instances**

```typescript
// Bad: Multiple SDKs conflict
const meowzer1 = new MeowzerSDK();
const meowzer2 = new MeowzerSDK(); // Conflicts!
```

### Error Handling

**Do: Handle initialization errors**

```typescript
async function initializeApp() {
  try {
    const meowzer = new MeowzerSDK();
    await meowzer.init();
    return meowzer;
  } catch (error) {
    console.error("Failed to initialize Meowzer:", error);

    // Fallback: try with simpler config
    try {
      const meowzer = new MeowzerSDK({
        storage: "memory", // IndexedDB might have failed
      });
      await meowzer.init();
      return meowzer;
    } catch (fallbackError) {
      console.error("Fallback initialization failed:", fallbackError);
      // Show user-friendly error
      showError("Cats unavailable. Please refresh.");
      return null;
    }
  }
}
```

## Cat Management

### Creation Patterns

**Do: Validate before creating**

```typescript
async function createCat(config) {
  // Validate config
  if (!config.primaryColor || !isValidColor(config.primaryColor)) {
    throw new Error("Invalid primary color");
  }

  // Check limits
  if (meowzer.cats.getAll().length >= MAX_CATS) {
    throw new Error("Maximum cat limit reached");
  }

  // Create with error handling
  try {
    const cat = await meowzer.cats.create(config);
    return cat;
  } catch (error) {
    console.error("Cat creation failed:", error);
    throw error;
  }
}
```

**Don't: Create without validation**

```typescript
// Bad: No validation, no error handling
const cat = await meowzer.cats.create(userInput);
```

### Cleanup

**Do: Always clean up**

```typescript
// Component unmount / page unload
async function cleanup() {
  // Destroy all cats
  const cats = meowzer.cats.getAll();
  await Promise.all(cats.map((cat) => meowzer.cats.destroy(cat.id)));

  // Clear interactions
  meowzer.interactions.removeAllNeeds();

  // Remove event listeners
  meowzer.removeAllListeners();
}

// React example
useEffect(() => {
  return () => {
    cleanup();
  };
}, []);

// Vanilla JS
window.addEventListener("beforeunload", cleanup);
```

**Don't: Leave cats running**

```typescript
// Bad: Memory leak, cats continue after component unmounts
function MyComponent() {
  useEffect(() => {
    meowzer.cats.create({ personality: "playful" });
    // No cleanup!
  }, []);
}
```

## Storage and Persistence

### Saving Patterns

**Do: Save with error handling**

```typescript
async function saveCat(catId) {
  try {
    await meowzer.storage.save(catId);
    showNotification("Cat saved successfully");
  } catch (error) {
    console.error("Save failed:", error);
    showError("Failed to save cat. Try again?");
  }
}
```

**Do: Batch save operations**

```typescript
// Good: Save multiple cats efficiently
async function saveAll() {
  const catIds = meowzer.cats.getAll().map((cat) => cat.id);

  try {
    await meowzer.storage.saveAll(catIds);
  } catch (error) {
    console.error("Batch save failed:", error);
    // Fallback: try one by one
    for (const id of catIds) {
      try {
        await meowzer.storage.save(id);
      } catch (err) {
        console.error(`Failed to save ${id}:`, err);
      }
    }
  }
}
```

### Loading Patterns

**Do: Handle missing data**

```typescript
async function loadCat(catId) {
  try {
    const cat = await meowzer.storage.load(catId);
    return cat;
  } catch (error) {
    if (error.message.includes("not found")) {
      console.log("Cat not found in storage");
      return null;
    }
    throw error; // Re-throw unexpected errors
  }
}
```

**Do: Validate loaded data**

```typescript
async function loadAndValidate(catId) {
  const cat = await meowzer.storage.load(catId);

  // Validate loaded data
  if (!cat || !cat.id || !cat.appearance) {
    throw new Error("Invalid cat data");
  }

  return cat;
}
```

## Event Handling

### Listener Management

**Do: Clean up listeners**

```typescript
class CatController {
  constructor(meowzer) {
    this.meowzer = meowzer;
    this.listeners = [];
  }

  init() {
    // Store listener reference
    const onCatCreated = (cat) => {
      console.log("Cat created:", cat.id);
    };

    this.meowzer.on("catCreated", onCatCreated);
    this.listeners.push({
      event: "catCreated",
      handler: onCatCreated,
    });
  }

  destroy() {
    // Remove all listeners
    this.listeners.forEach(({ event, handler }) => {
      this.meowzer.off(event, handler);
    });
    this.listeners = [];
  }
}
```

**Don't: Leak listeners**

```typescript
// Bad: Listener never removed
function setupListeners() {
  meowzer.on("catCreated", (cat) => {
    console.log("Created:", cat.id);
  });
  // No cleanup - memory leak!
}
```

### Event Patterns

**Do: Use events for loose coupling**

```typescript
// Good: UI reacts to events
meowzer.on("catCreated", (cat) => {
  updateCatList();
  showNotification(`New cat: ${cat.id}`);
});

meowzer.on("catDestroyed", ({ catId }) => {
  updateCatList();
  showNotification(`Cat ${catId} removed`);
});
```

**Don't: Tightly couple components**

```typescript
// Bad: Direct coupling
function createCatAndUpdateUI(config) {
  const cat = await meowzer.cats.create(config);
  updateCatList(); // Coupled
  updateStats(); // Coupled
  saveToAnalytics(); // Coupled
  notifyWebSocket(); // Coupled
  // Hard to maintain!
}
```

## User Experience

### Loading States

**Do: Show loading feedback**

```typescript
async function handleCreateCat(config) {
  setLoading(true);
  setError(null);

  try {
    const cat = await meowzer.cats.create(config);
    setSuccess(`Cat ${cat.id} created!`);
  } catch (error) {
    setError("Failed to create cat");
  } finally {
    setLoading(false);
  }
}
```

### Progressive Enhancement

**Do: Graceful degradation**

```typescript
async function initializeCats() {
  try {
    // Try full feature set
    await meowzer.init({
      storage: "indexeddb",
      features: ["animations", "ai", "persistence"],
    });
  } catch (error) {
    console.warn("Full initialization failed, using basic mode");

    // Fallback to basic features
    await meowzer.init({
      storage: "memory",
      features: ["basic"],
    });
  }
}
```

### Accessibility

**Do: Provide alternatives**

```typescript
// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "f") {
    // Feed nearest cat
    const cats = meowzer.cats.getAll();
    if (cats.length > 0) {
      const position = cats[0].position;
      meowzer.interactions.placeNeed("food:basic", position);
      announceToScreenReader("Food placed for cat");
    }
  }
});

// Reduced motion
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if (prefersReducedMotion.matches) {
  meowzer.config.animation.enabled = false;
}
```

**Do: Announce important changes**

```typescript
function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

meowzer.on("catCreated", (cat) => {
  announceToScreenReader(
    `New cat created with ${cat.personality} personality`
  );
});
```

## Performance

### Limits and Throttling

**Do: Set reasonable limits**

```typescript
const CONFIG = {
  MAX_CATS: 50,
  MAX_FOOD: 20,
  MAX_YARN: 10,
  MIN_DECISION_INTERVAL: 2000,
};

async function createCat(config) {
  if (meowzer.cats.getAll().length >= CONFIG.MAX_CATS) {
    throw new Error("Maximum cat limit reached");
  }

  return await meowzer.cats.create(config);
}
```

**Do: Throttle user actions**

```typescript
import { throttle } from "lodash";

// Throttle food placement
const placeFood = throttle((position) => {
  meowzer.interactions.placeNeed("food:basic", position);
}, 500); // Maximum once per 500ms

document.addEventListener("click", (e) => {
  placeFood({ x: e.clientX, y: e.clientY });
});
```

### Responsive Boundaries

**Do: Update on resize**

```typescript
import { debounce } from "lodash";

const updateBoundaries = debounce(() => {
  const bounds = {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  };

  meowzer.cats.getAll().forEach((cat) => {
    cat.updateBoundaries(bounds);
  });
}, 250);

window.addEventListener("resize", updateBoundaries);
```

## Error Handling

### Defensive Programming

**Do: Validate assumptions**

```typescript
function getCat(catId) {
  if (!catId) {
    throw new Error("Cat ID required");
  }

  const cat = meowzer.cats.find(catId);

  if (!cat) {
    throw new Error(`Cat ${catId} not found`);
  }

  return cat;
}
```

**Do: Handle edge cases**

```typescript
async function feedCat(catId) {
  const cat = getCat(catId);

  // Check if cat can eat
  if (!cat.canEat()) {
    console.log("Cat is not hungry");
    return false;
  }

  // Get cat position
  const position = cat.position;

  // Ensure position is valid
  if (!position || typeof position.x !== "number") {
    console.error("Invalid cat position");
    return false;
  }

  // Place food
  meowzer.interactions.placeNeed("food:basic", position);
  return true;
}
```

### User-Friendly Errors

**Do: Provide helpful messages**

```typescript
try {
  await meowzer.storage.save(catId);
} catch (error) {
  let userMessage;

  if (error.message.includes("quota")) {
    userMessage = "Storage full. Please delete some cats.";
  } else if (error.message.includes("network")) {
    userMessage = "Network error. Check your connection.";
  } else {
    userMessage = "Something went wrong. Please try again.";
  }

  showError(userMessage);

  // Log technical details
  console.error("Storage error:", error);
}
```

## Testing

### Testable Patterns

**Do: Write testable code**

```typescript
// Good: Dependency injection
class CatManager {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async createMultiple(count, config) {
    const cats = [];
    for (let i = 0; i < count; i++) {
      const cat = await this.sdk.cats.create(config);
      cats.push(cat);
    }
    return cats;
  }
}

// Easy to test
test("creates multiple cats", async () => {
  const mockSDK = createMockSDK();
  const manager = new CatManager(mockSDK);

  const cats = await manager.createMultiple(3, {
    personality: "playful",
  });

  expect(cats).toHaveLength(3);
  expect(mockSDK.cats.create).toHaveBeenCalledTimes(3);
});
```

### Integration Testing

**Do: Test real scenarios**

```typescript
test("cat lifecycle - create, interact, save, destroy", async () => {
  const meowzer = new MeowzerSDK();
  await meowzer.init();

  // Create
  const cat = await meowzer.cats.create({ personality: "playful" });
  expect(cat).toBeDefined();

  // Interact
  const needId = meowzer.interactions.placeNeed("food:basic", {
    x: 100,
    y: 100,
  });
  expect(needId).toBeDefined();

  // Save
  await meowzer.storage.save(cat.id);
  const loaded = await meowzer.storage.load(cat.id);
  expect(loaded.id).toBe(cat.id);

  // Destroy
  await meowzer.cats.destroy(cat.id);
  expect(meowzer.cats.find(cat.id)).toBeUndefined();
});
```

## Common Pitfalls

### Avoid These Mistakes

**1. Not cleaning up:**

```typescript
// Bad
useEffect(() => {
  const cats = createManyCats();
  // No cleanup - memory leak!
}, []);

// Good
useEffect(() => {
  const cats = createManyCats();

  return () => {
    cats.forEach((cat) => meowzer.cats.destroy(cat.id));
  };
}, []);
```

**2. Ignoring async:**

```typescript
// Bad
function loadCats() {
  const cats = meowzer.storage.loadAll(); // Missing await!
  displayCats(cats); // undefined!
}

// Good
async function loadCats() {
  const cats = await meowzer.storage.loadAll();
  displayCats(cats);
}
```

**3. Mutating cat data:**

```typescript
// Bad
const cat = meowzer.cats.find(catId);
cat.personality.playfulness = 0.9; // Direct mutation!

// Good
const data = cat.toData();
data.personality.playfulness = 0.9;
await meowzer.cats.destroy(cat.id);
await meowzer.cats.create(data);
```

**4. Blocking the main thread:**

```typescript
// Bad
for (let i = 0; i < 100; i++) {
  await meowzer.cats.create({ personality: "playful" }); // Blocks!
}

// Good
const configs = Array(100).fill({ personality: "playful" });
await Promise.all(configs.map((c) => meowzer.cats.create(c)));
```

**5. Hardcoding configuration:**

```typescript
// Bad
const cat = await meowzer.cats.create({
  boundaries: { minX: 0, maxX: 1920, minY: 0, maxY: 1080 }, // Hardcoded!
});

// Good
const cat = await meowzer.cats.create({
  boundaries: {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  },
});
```

## Production Checklist

Before deploying:

- [ ] Error handling on all async operations
- [ ] Cleanup on component unmount / page unload
- [ ] Event listener cleanup
- [ ] Performance limits enforced
- [ ] Loading states shown to users
- [ ] Error messages user-friendly
- [ ] Tested on target devices
- [ ] Accessibility considered
- [ ] Storage errors handled
- [ ] Boundaries responsive to resize
- [ ] TypeScript types used (if applicable)
- [ ] Console errors reviewed
- [ ] Memory leaks checked
- [ ] Reduced motion respected
- [ ] Documentation for future maintainers

## Framework-Specific Patterns

### React

```typescript
function CatContainer() {
  const [cats, setCats] = useState([]);
  const meowzerRef = useRef(null);

  useEffect(() => {
    // Initialize
    const meowzer = new MeowzerSDK();
    meowzer.init().then(() => {
      meowzerRef.current = meowzer;

      // Listen for changes
      meowzer.on("catCreated", (cat) => {
        setCats((prev) => [...prev, cat]);
      });

      meowzer.on("catDestroyed", ({ catId }) => {
        setCats((prev) => prev.filter((c) => c.id !== catId));
      });
    });

    // Cleanup
    return () => {
      if (meowzerRef.current) {
        const allCats = meowzerRef.current.cats.getAll();
        allCats.forEach((cat) => {
          meowzerRef.current.cats.destroy(cat.id);
        });
      }
    };
  }, []);

  const handleCreateCat = async () => {
    if (meowzerRef.current) {
      await meowzerRef.current.cats.create({
        personality: "playful",
      });
    }
  };

  return (
    <div>
      <button onClick={handleCreateCat}>Create Cat</button>
      <p>{cats.length} cats active</p>
    </div>
  );
}
```

### Vue

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { MeowzerSDK } from "@meowzer/sdk";

const meowzer = ref(null);
const cats = ref([]);

onMounted(async () => {
  meowzer.value = new MeowzerSDK();
  await meowzer.value.init();

  meowzer.value.on("catCreated", (cat) => {
    cats.value.push(cat);
  });
});

onUnmounted(() => {
  if (meowzer.value) {
    const allCats = meowzer.value.cats.getAll();
    allCats.forEach((cat) => {
      meowzer.value.cats.destroy(cat.id);
    });
  }
});

const createCat = async () => {
  await meowzer.value.cats.create({ personality: "playful" });
};
</script>

<template>
  <div>
    <button @click="createCat">Create Cat</button>
    <p>{{ cats.length }} cats active</p>
  </div>
</template>
```

## Next Steps

- [Customization Guide](/guides/customization) - Customize cats effectively
- [Performance Guide](/guides/performance) - Optimize for production
- [Architecture](/concepts/architecture) - Understand the system

---

_Following best practices ensures reliable, maintainable, and user-friendly Meowzer implementations!_ ✅
