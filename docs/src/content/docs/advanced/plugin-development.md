---
title: Plugin Development
description: Learn how to create plugins that extend Meowzer's functionality
---

Meowzer's plugin system allows you to extend core functionality, add new features, and integrate with external systems. This guide covers creating, registering, and distributing plugins.

## Plugin Basics

### What is a Plugin?

A plugin is a JavaScript module that extends Meowzer by:

- Adding new behaviors or AI logic
- Integrating with external APIs
- Providing custom UI components
- Adding analytics or tracking
- Extending storage capabilities
- Creating new interaction types

### Plugin Structure

```typescript
interface MeowzerPlugin {
  name: string;
  version: string;
  init(sdk: MeowzerSDK): void | Promise<void>;
  destroy?(): void | Promise<void>;
}
```

**Minimal plugin:**

```typescript
const myPlugin = {
  name: "my-plugin",
  version: "1.0.0",

  init(sdk) {
    console.log("Plugin initialized!");
  },
};
```

## Creating a Plugin

### Basic Plugin Template

```typescript
// plugins/analytics-plugin.ts
export const AnalyticsPlugin = {
  name: "analytics-plugin",
  version: "1.0.0",

  // Private state
  eventCount: 0,

  // Initialize plugin
  init(sdk) {
    console.log("Analytics plugin initializing...");

    // Listen to cat events
    sdk.on("catCreated", (cat) => {
      this.trackEvent("cat_created", { catId: cat.id });
    });

    sdk.on("catDestroyed", ({ catId }) => {
      this.trackEvent("cat_destroyed", { catId });
    });

    sdk.on("needConsumed", ({ catId, needType }) => {
      this.trackEvent("cat_fed", { catId, needType });
    });
  },

  // Track event to analytics service
  trackEvent(eventName, data) {
    this.eventCount++;

    // Send to analytics service
    if (window.analytics) {
      window.analytics.track(eventName, data);
    }

    console.log(`[Analytics] ${eventName}:`, data);
  },

  // Cleanup
  destroy() {
    console.log(`Analytics plugin tracked ${this.eventCount} events`);
  },
};
```

### Registering a Plugin

```typescript
import { MeowzerSDK } from "@meowzer/sdk";
import { AnalyticsPlugin } from "./plugins/analytics-plugin";

const meowzer = new MeowzerSDK();
await meowzer.init();

// Register plugin
meowzer.plugins.register(AnalyticsPlugin);
```

### Plugin Lifecycle

```
1. Create plugin object
    ↓
2. Register with SDK
    ↓
3. SDK calls init(sdk)
    ↓
4. Plugin sets up listeners, state, etc.
    ↓
5. Plugin operates during SDK lifetime
    ↓
6. SDK calls destroy() on shutdown
    ↓
7. Plugin cleans up resources
```

## Advanced Plugin Patterns

### Adding Custom Behaviors

```typescript
// plugins/trick-plugin.ts
export const TrickPlugin = {
  name: "trick-plugin",
  version: "1.0.0",

  init(sdk) {
    // Add custom behavior
    sdk.hooks.register("registerBehaviors", (behaviors) => {
      // Add "spin" trick
      behaviors.spin = async function (cat) {
        const element = cat.meowtion.element;
        element.style.transition = "transform 0.5s";
        element.style.transform = "rotate(360deg)";

        await new Promise((resolve) => setTimeout(resolve, 500));

        element.style.transform = "";
      };

      // Add "jump" trick
      behaviors.jump = async function (cat) {
        const element = cat.meowtion.element;
        element.style.transition = "transform 0.3s";
        element.style.transform = "translateY(-50px)";

        await new Promise((resolve) => setTimeout(resolve, 300));

        element.style.transform = "";
      };

      return behaviors;
    });

    // Add API methods
    sdk.tricks = {
      spin: (catId) => {
        const cat = sdk.cats.find(catId);
        if (cat) {
          cat.brain.executeBehavior("spin");
        }
      },

      jump: (catId) => {
        const cat = sdk.cats.find(catId);
        if (cat) {
          cat.brain.executeBehavior("jump");
        }
      },
    };
  },
};

// Usage:
meowzer.plugins.register(TrickPlugin);
meowzer.tricks.spin(catId);
```

### Custom Storage Adapter

```typescript
// plugins/cloud-storage-plugin.ts
export const CloudStoragePlugin = {
  name: "cloud-storage",
  version: "1.0.0",

  init(sdk) {
    // Create custom storage adapter
    const cloudAdapter = {
      async save(catId, data) {
        const response = await fetch(
          `https://api.example.com/cats/${catId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error("Cloud save failed");
        }
      },

      async load(catId) {
        const response = await fetch(
          `https://api.example.com/cats/${catId}`
        );

        if (!response.ok) {
          throw new Error("Cloud load failed");
        }

        return await response.json();
      },

      async delete(catId) {
        await fetch(`https://api.example.com/cats/${catId}`, {
          method: "DELETE",
        });
      },

      async listAll() {
        const response = await fetch("https://api.example.com/cats");
        const data = await response.json();
        return data.catIds;
      },
    };

    // Register adapter
    sdk.storage.setAdapter(cloudAdapter);

    // Add cloud-specific methods
    sdk.storage.sync = async () => {
      const local = await sdk.storage.listCats();
      const remote = await cloudAdapter.listAll();

      // Sync logic here
      console.log("Syncing local and remote cats...");
    };
  },
};
```

### UI Extension Plugin

```typescript
// plugins/cat-ui-plugin.ts
export const CatUIPlugin = {
  name: "cat-ui",
  version: "1.0.0",

  init(sdk) {
    // Create UI container
    const container = document.createElement("div");
    container.id = "cat-ui";
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 10000;
    `;

    document.body.appendChild(container);

    // Update UI on cat changes
    const updateUI = () => {
      const cats = sdk.cats.getAll();

      container.innerHTML = `
        <h3 style="margin: 0 0 12px 0;">Meowzer Cats</h3>
        <div>Active: ${cats.length}</div>
        <button id="create-cat" style="
          margin-top: 8px;
          padding: 8px 16px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">Create Cat</button>
        <button id="remove-all" style="
          margin-top: 8px;
          margin-left: 8px;
          padding: 8px 16px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">Remove All</button>
      `;

      // Attach listeners
      document
        .getElementById("create-cat")
        ?.addEventListener("click", async () => {
          await sdk.cats.create({ personality: "playful" });
        });

      document
        .getElementById("remove-all")
        ?.addEventListener("click", async () => {
          const cats = sdk.cats.getAll();
          for (const cat of cats) {
            await sdk.cats.destroy(cat.id);
          }
        });
    };

    // Listen for changes
    sdk.on("catCreated", updateUI);
    sdk.on("catDestroyed", updateUI);

    // Initial render
    updateUI();
  },

  destroy() {
    const ui = document.getElementById("cat-ui");
    ui?.remove();
  },
};
```

### AI Enhancement Plugin

```typescript
// plugins/smart-ai-plugin.ts
export const SmartAIPlugin = {
  name: "smart-ai",
  version: "1.0.0",

  init(sdk) {
    // Enhance decision-making
    sdk.hooks.register("beforeDecision", (cat, context) => {
      // Learn from past behavior
      if (!cat.memory) {
        cat.memory = {
          favoriteFood: null,
          favoriteToy: null,
          lastActions: [],
        };
      }

      // Track actions
      cat.memory.lastActions.push({
        timestamp: Date.now(),
        scores: { ...context.scores },
      });

      // Keep last 10 actions
      if (cat.memory.lastActions.length > 10) {
        cat.memory.lastActions.shift();
      }

      // Boost scores based on memory
      if (cat.memory.favoriteFood && context.scores.eatFood) {
        context.scores.eatFood *= 1.5;
      }

      return context;
    });

    // Learn from interactions
    sdk.on("needConsumed", ({ catId, needType }) => {
      const cat = sdk.cats.find(catId);
      if (cat && cat.memory) {
        cat.memory.favoriteFood = needType;
      }
    });
  },
};
```

## Plugin Configuration

### Configurable Plugins

```typescript
export function createAnalyticsPlugin(config) {
  return {
    name: "analytics-plugin",
    version: "1.0.0",

    init(sdk) {
      // Use config
      const apiKey = config.apiKey;
      const endpoint = config.endpoint || "https://api.analytics.com";

      sdk.on("catCreated", (cat) => {
        fetch(`${endpoint}/track`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "cat_created",
            catId: cat.id,
          }),
        });
      });
    },
  };
}

// Usage:
const analyticsPlugin = createAnalyticsPlugin({
  apiKey: "your-api-key",
  endpoint: "https://custom.analytics.com",
});

meowzer.plugins.register(analyticsPlugin);
```

### Plugin Options

```typescript
export const ConfigurablePlugin = {
  name: "configurable-plugin",
  version: "1.0.0",

  // Default options
  options: {
    enabled: true,
    interval: 1000,
    debug: false,
  },

  init(sdk, options = {}) {
    // Merge options
    this.options = { ...this.options, ...options };

    if (!this.options.enabled) {
      console.log("Plugin disabled");
      return;
    }

    // Use options
    setInterval(() => {
      if (this.options.debug) {
        console.log("Plugin tick");
      }
    }, this.options.interval);
  },
};

// Usage with options:
meowzer.plugins.register(ConfigurablePlugin, {
  interval: 2000,
  debug: true,
});
```

## Testing Plugins

### Unit Testing

```typescript
// __tests__/analytics-plugin.test.ts
import { describe, it, expect, vi } from "vitest";
import { MeowzerSDK } from "@meowzer/sdk";
import { AnalyticsPlugin } from "../plugins/analytics-plugin";

describe("AnalyticsPlugin", () => {
  it("should track cat creation", async () => {
    const sdk = new MeowzerSDK();
    await sdk.init();

    // Spy on tracking
    const trackSpy = vi.spyOn(AnalyticsPlugin, "trackEvent");

    // Register plugin
    sdk.plugins.register(AnalyticsPlugin);

    // Create cat
    const cat = await sdk.cats.create({ personality: "playful" });

    // Verify tracking
    expect(trackSpy).toHaveBeenCalledWith("cat_created", {
      catId: cat.id,
    });
  });
});
```

### Integration Testing

```typescript
// __tests__/plugin-integration.test.ts
import { describe, it, expect } from "vitest";
import { MeowzerSDK } from "@meowzer/sdk";
import { TrickPlugin } from "../plugins/trick-plugin";

describe("TrickPlugin Integration", () => {
  it("should add trick methods to SDK", async () => {
    const sdk = new MeowzerSDK();
    await sdk.init();

    sdk.plugins.register(TrickPlugin);

    // Verify API exists
    expect(sdk.tricks).toBeDefined();
    expect(sdk.tricks.spin).toBeInstanceOf(Function);
    expect(sdk.tricks.jump).toBeInstanceOf(Function);
  });

  it("should execute tricks on cats", async () => {
    const sdk = new MeowzerSDK();
    await sdk.init();
    sdk.plugins.register(TrickPlugin);

    const cat = await sdk.cats.create({ personality: "playful" });

    // Should not throw
    await expect(sdk.tricks.spin(cat.id)).resolves.not.toThrow();
  });
});
```

## Publishing Plugins

### Package Structure

```
my-meowzer-plugin/
├── package.json
├── README.md
├── tsconfig.json
├── src/
│   └── index.ts
├── dist/
│   ├── index.js
│   └── index.d.ts
└── __tests__/
    └── plugin.test.ts
```

### package.json

```json
{
  "name": "@myorg/meowzer-analytics-plugin",
  "version": "1.0.0",
  "description": "Analytics plugin for Meowzer",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "keywords": ["meowzer", "plugin", "analytics"],
  "peerDependencies": {
    "@meowzer/sdk": "^1.0.0"
  },
  "devDependencies": {
    "@meowzer/sdk": "^1.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest"
  }
}
```

### README.md

```markdown
# Meowzer Analytics Plugin

Track Meowzer cat events with your analytics service.

## Installation

\`\`\`bash
npm install @myorg/meowzer-analytics-plugin
\`\`\`

## Usage

\`\`\`typescript
import { MeowzerSDK } from '@meowzer/sdk';
import { AnalyticsPlugin } from '@myorg/meowzer-analytics-plugin';

const meowzer = new MeowzerSDK();
await meowzer.init();

meowzer.plugins.register(AnalyticsPlugin);
\`\`\`

## Configuration

\`\`\`typescript
const plugin = createAnalyticsPlugin({
apiKey: 'your-api-key',
endpoint: 'https://analytics.example.com'
});

meowzer.plugins.register(plugin);
\`\`\`
```

## Best Practices

### Do's

**Keep plugins focused:**

```typescript
// Good: Single responsibility
const AnalyticsPlugin = { ... };
const UIPlugin = { ... };

// Bad: Too many responsibilities
const EverythingPlugin = { ... };
```

**Clean up properly:**

```typescript
const MyPlugin = {
  listeners: [],

  init(sdk) {
    const handler = () => { ... };
    sdk.on('catCreated', handler);
    this.listeners.push({ event: 'catCreated', handler });
  },

  destroy() {
    // Remove all listeners
    this.listeners.forEach(({ event, handler }) => {
      sdk.off(event, handler);
    });
  }
};
```

**Handle errors:**

```typescript
const MyPlugin = {
  init(sdk) {
    try {
      // Plugin logic
    } catch (error) {
      console.error("Plugin initialization failed:", error);
      // Don't break the SDK
    }
  },
};
```

### Don'ts

**Don't modify SDK internals:**

```typescript
// Bad: Modifying internal state
const BadPlugin = {
  init(sdk) {
    sdk._internalState = {}; // Don't do this!
  },
};
```

**Don't block initialization:**

```typescript
// Bad: Slow synchronous init
const SlowPlugin = {
  init(sdk) {
    // Blocks SDK initialization
    for (let i = 0; i < 1000000000; i++) {}
  },
};

// Good: Async operations
const GoodPlugin = {
  async init(sdk) {
    await fetch("https://api.example.com/init");
    // SDK continues after init completes
  },
};
```

**Don't pollute global scope:**

```typescript
// Bad
const BadPlugin = {
  init(sdk) {
    window.myGlobalVar = {}; // Pollutes global scope
  },
};

// Good
const GoodPlugin = {
  state: {},

  init(sdk) {
    this.state.data = {}; // Scoped to plugin
  },
};
```

## Example Plugins

### Debug Plugin

```typescript
export const DebugPlugin = {
  name: "debug",
  version: "1.0.0",

  init(sdk) {
    // Log all events
    const events = [
      "catCreated",
      "catDestroyed",
      "stateChange",
      "needPlaced",
      "needConsumed",
      "decision",
    ];

    events.forEach((event) => {
      sdk.on(event, (...args) => {
        console.log(`[Debug] ${event}:`, ...args);
      });
    });

    // Add debug methods
    sdk.debug = {
      getCatInfo: (catId) => {
        const cat = sdk.cats.find(catId);
        return {
          id: cat.id,
          state: cat.stateMachine.currentState,
          position: cat.position,
          personality: cat.personality,
        };
      },

      logAll: () => {
        sdk.cats.getAll().forEach((cat) => {
          console.log(sdk.debug.getCatInfo(cat.id));
        });
      },
    };
  },
};
```

### Auto-Save Plugin

```typescript
export const AutoSavePlugin = {
  name: "auto-save",
  version: "1.0.0",

  interval: null,

  init(sdk, options = { intervalMs: 30000 }) {
    // Auto-save all cats periodically
    this.interval = setInterval(async () => {
      const cats = sdk.cats.getAll();

      try {
        await sdk.storage.saveAll(cats.map((c) => c.id));
        console.log(`Auto-saved ${cats.length} cats`);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, options.intervalMs);
  },

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
};
```

## Next Steps

- [Best Practices](/guides/best-practices) - Production patterns
- [API Reference](/api/meowzer-sdk) - SDK documentation
- [Examples](/examples/code-snippets) - Code examples

---

_Plugins extend Meowzer's capabilities! Share your plugins with the community._ 🔌
