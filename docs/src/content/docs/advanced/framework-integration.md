---
title: Framework Integration
description: Detailed guides for integrating Meowzer with React, Vue, Svelte, and other frameworks
---

Meowzer works with any JavaScript framework. This guide provides detailed integration patterns, best practices, and gotchas for popular frameworks.

## React Integration

### Basic Setup

```typescript
// hooks/useMeowzer.ts
import { useEffect, useRef, useState } from "react";
import { MeowzerSDK } from "@meowzer/sdk";

export function useMeowzer(config = {}) {
  const sdkRef = useRef<MeowzerSDK | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        const sdk = new MeowzerSDK(config);
        await sdk.init();
        sdkRef.current = sdk;
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
      }
    };

    initSDK();

    return () => {
      if (sdkRef.current) {
        const cats = sdkRef.current.cats.getAll();
        cats.forEach((cat) => sdkRef.current?.cats.destroy(cat.id));
      }
    };
  }, []);

  return { sdk: sdkRef.current, isReady, error };
}
```

### Component Pattern

```typescript
// components/MeowzerContainer.tsx
import { useState, useEffect } from "react";
import { useMeowzer } from "../hooks/useMeowzer";

export function MeowzerContainer() {
  const { sdk, isReady, error } = useMeowzer();
  const [cats, setCats] = useState([]);

  useEffect(() => {
    if (!sdk) return;

    const handleCatCreated = (cat) => {
      setCats((prev) => [...prev, cat]);
    };

    const handleCatDestroyed = ({ catId }) => {
      setCats((prev) => prev.filter((c) => c.id !== catId));
    };

    sdk.on("catCreated", handleCatCreated);
    sdk.on("catDestroyed", handleCatDestroyed);

    return () => {
      sdk.off("catCreated", handleCatCreated);
      sdk.off("catDestroyed", handleCatDestroyed);
    };
  }, [sdk]);

  const handleCreateCat = async () => {
    if (!sdk) return;
    await sdk.cats.create({ personality: "playful" });
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isReady) {
    return <div>Loading Meowzer...</div>;
  }

  return (
    <div>
      <button onClick={handleCreateCat}>Create Cat</button>
      <p>{cats.length} cats active</p>

      <div>
        {cats.map((cat) => (
          <CatListItem key={cat.id} cat={cat} sdk={sdk} />
        ))}
      </div>
    </div>
  );
}
```

### Context Provider

```typescript
// contexts/MeowzerContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { MeowzerSDK } from "@meowzer/sdk";
import { useMeowzer } from "../hooks/useMeowzer";

interface MeowzerContextValue {
  sdk: MeowzerSDK | null;
  isReady: boolean;
  error: Error | null;
}

const MeowzerContext = createContext<MeowzerContextValue>({
  sdk: null,
  isReady: false,
  error: null,
});

export function MeowzerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useMeowzer();

  return (
    <MeowzerContext.Provider value={value}>
      {children}
    </MeowzerContext.Provider>
  );
}

export function useMeowzerContext() {
  const context = useContext(MeowzerContext);
  if (!context.sdk && context.isReady) {
    throw new Error(
      "useMeowzerContext must be used within MeowzerProvider"
    );
  }
  return context;
}

// Usage:
function App() {
  return (
    <MeowzerProvider>
      <CatManager />
    </MeowzerProvider>
  );
}

function CatManager() {
  const { sdk, isReady } = useMeowzerContext();

  const createCat = async () => {
    await sdk?.cats.create({ personality: "playful" });
  };

  return <button onClick={createCat}>Create Cat</button>;
}
```

### Advanced React Patterns

**Custom hooks for specific features:**

```typescript
// hooks/useCatList.ts
export function useCatList() {
  const { sdk } = useMeowzerContext();
  const [cats, setCats] = useState([]);

  useEffect(() => {
    if (!sdk) return;

    const updateCats = () => {
      setCats(sdk.cats.getAll());
    };

    sdk.on("catCreated", updateCats);
    sdk.on("catDestroyed", updateCats);

    updateCats(); // Initial load

    return () => {
      sdk.off("catCreated", updateCats);
      sdk.off("catDestroyed", updateCats);
    };
  }, [sdk]);

  return cats;
}

// hooks/useCatInteractions.ts
export function useCatInteractions() {
  const { sdk } = useMeowzerContext();

  const feedCat = useCallback(
    (position: { x: number; y: number }) => {
      sdk?.interactions.placeNeed("food:basic", position);
    },
    [sdk]
  );

  const throwYarn = useCallback(
    (position: { x: number; y: number }) => {
      sdk?.interactions.placeYarn(position);
    },
    [sdk]
  );

  return { feedCat, throwYarn };
}
```

## Vue Integration

### Composition API

```vue
<!-- composables/useMeowzer.ts -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { MeowzerSDK } from "@meowzer/sdk";

export function useMeowzer(config = {}) {
  const sdk = ref<MeowzerSDK | null>(null);
  const isReady = ref(false);
  const error = ref<Error | null>(null);

  onMounted(async () => {
    try {
      const meowzer = new MeowzerSDK(config);
      await meowzer.init();
      sdk.value = meowzer;
      isReady.value = true;
    } catch (err) {
      error.value = err as Error;
    }
  });

  onUnmounted(() => {
    if (sdk.value) {
      const cats = sdk.value.cats.getAll();
      cats.forEach((cat) => sdk.value?.cats.destroy(cat.id));
    }
  });

  return { sdk, isReady, error };
}
</script>
```

### Component Pattern

```vue
<!-- components/MeowzerContainer.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";
import { useMeowzer } from "../composables/useMeowzer";

const { sdk, isReady, error } = useMeowzer();
const cats = ref([]);

watch(sdk, (newSdk) => {
  if (!newSdk) return;

  newSdk.on("catCreated", (cat) => {
    cats.value.push(cat);
  });

  newSdk.on("catDestroyed", ({ catId }) => {
    cats.value = cats.value.filter((c) => c.id !== catId);
  });
});

const createCat = async () => {
  if (!sdk.value) return;
  await sdk.value.cats.create({ personality: "playful" });
};
</script>

<template>
  <div>
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-else-if="!isReady">Loading Meowzer...</div>
    <div v-else>
      <button @click="createCat">Create Cat</button>
      <p>{{ cats.length }} cats active</p>

      <div v-for="cat in cats" :key="cat.id">
        <CatListItem :cat="cat" :sdk="sdk" />
      </div>
    </div>
  </div>
</template>
```

### Provide/Inject Pattern

```typescript
// plugins/meowzer.ts
import { App, Plugin } from "vue";
import { MeowzerSDK } from "@meowzer/sdk";

export const MeowzerPlugin: Plugin = {
  install(app: App, options = {}) {
    const sdk = new MeowzerSDK(options);

    // Initialize on app mount
    sdk.init().then(() => {
      console.log("Meowzer initialized");
    });

    // Provide SDK
    app.provide("meowzer", sdk);

    // Cleanup on app unmount
    app.config.globalProperties.$onUnmount = () => {
      const cats = sdk.cats.getAll();
      cats.forEach((cat) => sdk.cats.destroy(cat.id));
    };
  },
};

// main.ts
import { createApp } from "vue";
import { MeowzerPlugin } from "./plugins/meowzer";
import App from "./App.vue";

const app = createApp(App);
app.use(MeowzerPlugin, {
  storage: "indexeddb",
});
app.mount("#app");
```

```vue
<!-- Usage in component -->
<script setup>
import { inject } from "vue";

const meowzer = inject("meowzer");

const createCat = async () => {
  await meowzer.cats.create({ personality: "playful" });
};
</script>
```

## Svelte Integration

### Store Pattern

```typescript
// stores/meowzer.ts
import { writable, derived } from "svelte/store";
import { MeowzerSDK } from "@meowzer/sdk";

function createMeowzerStore() {
  const { subscribe, set, update } = writable<{
    sdk: MeowzerSDK | null;
    cats: any[];
    isReady: boolean;
  }>({
    sdk: null,
    cats: [],
    isReady: false,
  });

  let sdk: MeowzerSDK | null = null;

  return {
    subscribe,

    async init(config = {}) {
      sdk = new MeowzerSDK(config);
      await sdk.init();

      // Listen to events
      sdk.on("catCreated", (cat) => {
        update((state) => ({
          ...state,
          cats: [...state.cats, cat],
        }));
      });

      sdk.on("catDestroyed", ({ catId }) => {
        update((state) => ({
          ...state,
          cats: state.cats.filter((c) => c.id !== catId),
        }));
      });

      set({ sdk, cats: [], isReady: true });
    },

    async createCat(config) {
      if (!sdk) throw new Error("SDK not initialized");
      return await sdk.cats.create(config);
    },

    async destroyCat(catId) {
      if (!sdk) throw new Error("SDK not initialized");
      return await sdk.cats.destroy(catId);
    },

    destroy() {
      if (sdk) {
        const allCats = sdk.cats.getAll();
        allCats.forEach((cat) => sdk?.cats.destroy(cat.id));
      }
    },
  };
}

export const meowzer = createMeowzerStore();
```

### Component Usage

```svelte
<!-- MeowzerContainer.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { meowzer } from '../stores/meowzer';

  onMount(async () => {
    await meowzer.init({
      storage: 'indexeddb'
    });
  });

  onDestroy(() => {
    meowzer.destroy();
  });

  async function createCat() {
    await meowzer.createCat({ personality: 'playful' });
  }
</script>

{#if !$meowzer.isReady}
  <p>Loading Meowzer...</p>
{:else}
  <button on:click={createCat}>Create Cat</button>
  <p>{$meowzer.cats.length} cats active</p>

  {#each $meowzer.cats as cat (cat.id)}
    <div class="cat-item">
      {cat.id} - {cat.personality}
    </div>
  {/each}
{/if}
```

## Angular Integration

### Service Pattern

```typescript
// services/meowzer.service.ts
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { MeowzerSDK } from "@meowzer/sdk";

@Injectable({
  providedIn: "root",
})
export class MeowzerService implements OnDestroy {
  private sdk: MeowzerSDK | null = null;
  private catsSubject = new BehaviorSubject<any[]>([]);
  private isReadySubject = new BehaviorSubject<boolean>(false);

  public cats$: Observable<any[]> = this.catsSubject.asObservable();
  public isReady$: Observable<boolean> =
    this.isReadySubject.asObservable();

  async init(config = {}) {
    this.sdk = new MeowzerSDK(config);
    await this.sdk.init();

    this.sdk.on("catCreated", (cat) => {
      const current = this.catsSubject.value;
      this.catsSubject.next([...current, cat]);
    });

    this.sdk.on("catDestroyed", ({ catId }) => {
      const current = this.catsSubject.value;
      this.catsSubject.next(current.filter((c) => c.id !== catId));
    });

    this.isReadySubject.next(true);
  }

  async createCat(config: any) {
    if (!this.sdk) throw new Error("SDK not initialized");
    return await this.sdk.cats.create(config);
  }

  async destroyCat(catId: string) {
    if (!this.sdk) throw new Error("SDK not initialized");
    return await this.sdk.cats.destroy(catId);
  }

  ngOnDestroy() {
    if (this.sdk) {
      const cats = this.sdk.cats.getAll();
      cats.forEach((cat) => this.sdk?.cats.destroy(cat.id));
    }
  }
}
```

### Component Usage

```typescript
// components/meowzer-container.component.ts
import { Component, OnInit } from "@angular/core";
import { MeowzerService } from "../services/meowzer.service";

@Component({
  selector: "app-meowzer-container",
  template: `
    <div *ngIf="!(isReady$ | async)">Loading Meowzer...</div>

    <div *ngIf="isReady$ | async">
      <button (click)="createCat()">Create Cat</button>
      <p>{{ (cats$ | async)?.length }} cats active</p>

      <div *ngFor="let cat of cats$ | async" class="cat-item">
        {{ cat.id }} - {{ cat.personality }}
      </div>
    </div>
  `,
})
export class MeowzerContainerComponent implements OnInit {
  cats$ = this.meowzerService.cats$;
  isReady$ = this.meowzerService.isReady$;

  constructor(private meowzerService: MeowzerService) {}

  async ngOnInit() {
    await this.meowzerService.init({
      storage: "indexeddb",
    });
  }

  async createCat() {
    await this.meowzerService.createCat({
      personality: "playful",
    });
  }
}
```

## Next.js Integration

### App Router (v13+)

```typescript
// app/providers.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MeowzerSDK } from "@meowzer/sdk";

const MeowzerContext = createContext<MeowzerSDK | null>(null);

export function MeowzerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const sdkRef = useRef<MeowzerSDK | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!sdkRef.current) {
        const sdk = new MeowzerSDK();
        await sdk.init();
        sdkRef.current = sdk;
        setIsReady(true);
      }
    };

    init();

    return () => {
      if (sdkRef.current) {
        const cats = sdkRef.current.cats.getAll();
        cats.forEach((cat) => sdkRef.current?.cats.destroy(cat.id));
      }
    };
  }, []);

  if (!isReady) {
    return <div>Loading Meowzer...</div>;
  }

  return (
    <MeowzerContext.Provider value={sdkRef.current}>
      {children}
    </MeowzerContext.Provider>
  );
}

export function useMeowzer() {
  const context = useContext(MeowzerContext);
  if (!context) {
    throw new Error("useMeowzer must be used within MeowzerProvider");
  }
  return context;
}
```

```typescript
// app/layout.tsx
import { MeowzerProvider } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MeowzerProvider>{children}</MeowzerProvider>
      </body>
    </html>
  );
}
```

## Common Patterns

### Click to Feed

```typescript
// React
function CatContainer() {
  const { sdk } = useMeowzer();

  const handleClick = (e: React.MouseEvent) => {
    sdk?.interactions.placeNeed('food:basic', {
      x: e.clientX,
      y: e.clientY
    });
  };

  return <div onClick={handleClick}>Click to feed cats</div>;
}

// Vue
<template>
  <div @click="handleClick">Click to feed cats</div>
</template>

<script setup>
const { sdk } = useMeowzer();

function handleClick(e) {
  sdk.value?.interactions.placeNeed('food:basic', {
    x: e.clientX,
    y: e.clientY
  });
}
</script>
```

### Save on Unmount

```typescript
// React
useEffect(() => {
  return () => {
    if (sdk) {
      const cats = sdk.cats.getAll();
      Promise.all(cats.map((cat) => sdk.storage.save(cat.id)));
    }
  };
}, [sdk]);

// Vue
onUnmounted(async () => {
  if (sdk.value) {
    const cats = sdk.value.cats.getAll();
    await Promise.all(
      cats.map((cat) => sdk.value.storage.save(cat.id))
    );
  }
});
```

## Best Practices

### Do's

- ✅ Initialize SDK once at app root
- ✅ Clean up cats on unmount
- ✅ Use context/provide/inject for global access
- ✅ Handle loading and error states
- ✅ Remove event listeners properly
- ✅ Use framework-specific reactivity systems

### Don'ts

- ❌ Create multiple SDK instances
- ❌ Initialize in child components
- ❌ Forget to clean up listeners
- ❌ Mutate SDK state directly
- ❌ Block rendering with sync operations

## Next Steps

- [Best Practices](/guides/best-practices) - Production patterns
- [Code Snippets](/examples/code-snippets) - More examples
- [API Reference](/api/meowzer-sdk) - Complete API

---

_Meowzer works seamlessly with your favorite framework!_ ⚛️
