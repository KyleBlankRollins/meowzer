---
title: Performance Guide
description: Optimize Meowzer for smooth performance with many cats
---

Meowzer is designed to be performant, but understanding performance characteristics helps you build smooth experiences with many cats. This guide covers optimization strategies, monitoring, and best practices.

## Performance Characteristics

### What Affects Performance

**Cat count:**

- Most significant factor
- Each cat runs AI loop
- Each cat renders/animates
- Spatial grid helps but doesn't eliminate cost

**Decision frequency:**

- Each decision = perception + scoring + selection
- More frequent = higher CPU usage
- Default: 2 seconds between decisions

**Animation complexity:**

- GSAP animations are GPU-accelerated
- Multiple simultaneous animations cost more
- State changes trigger new animations

**DOM manipulation:**

- Each cat = DOM element
- Movement updates position
- Many cats = many reflows

**Storage operations:**

- IndexedDB reads/writes
- Serialization/deserialization
- Mostly async, minimal impact

### Typical Performance

**Recommended limits:**

- **1-10 cats** - Smooth on all devices
- **10-50 cats** - Good on modern devices
- **50-100 cats** - Requires optimization
- **100+ cats** - Advanced optimization needed

**Benchmarks (approximate):**

- Modern desktop: 100+ cats smoothly
- Modern mobile: 30-50 cats
- Older devices: 10-20 cats

## Optimization Strategies

### 1. Adjust Decision Intervals

Longer intervals = less CPU usage:

```typescript
// More cats = slower decisions
const catCount = meowzer.cats.getAll().length;
const interval = Math.max(2000, catCount * 50);

await meowzer.cats.create({
  decisionInterval: interval,
});
```

**Stagger decision times:**

```typescript
// Spread CPU load
const cats = await Promise.all(
  Array.from({ length: 50 }, async (_, i) => {
    const cat = await meowzer.cats.create({
      decisionInterval: 3000,
    });

    // Offset each cat's decision timer
    cat.brain.setDecisionOffset(i * 60); // 60ms apart

    return cat;
  })
);
```

### 2. Use Spatial Grid Efficiently

The spatial grid prevents O(n²) proximity checks:

```typescript
// Already handled internally, but good to understand
// Grid divides page into cells
// Only nearby cells checked for proximity

// Optimize cell size for your use case
meowzer.config.spatialGrid = {
  cellSize: 150, // Larger cells = fewer cells = faster lookups
};
```

**Best practices:**

- Default cell size (100px) works for most cases
- Larger cells for spread-out cats
- Smaller cells for dense populations

### 3. Limit Animation Complexity

**Simplify movement:**

```typescript
// Reduce movement smoothness for performance
meowzer.config.animation = {
  movementEasing: "linear", // Simpler than 'power2.out'
  duration: 1.0, // Shorter = less GPU work
};
```

**Pause when tab hidden:**

```typescript
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    meowzer.cats.pauseAll();
  } else {
    meowzer.cats.resumeAll();
  }
});
```

### 4. Batch Operations

**Create cats in batches:**

```typescript
// Bad: Creates one at a time (slow)
for (let i = 0; i < 100; i++) {
  await meowzer.cats.create({ personality: "playful" });
}

// Better: Batch with Promise.all
const catConfigs = Array.from({ length: 100 }, () => ({
  personality: "playful",
}));

const cats = await Promise.all(
  catConfigs.map((config) => meowzer.cats.create(config))
);
```

**Batch storage operations:**

```typescript
// Save multiple cats at once
await meowzer.storage.saveAll([cat1.id, cat2.id, cat3.id]);

// Instead of multiple awaits
await meowzer.storage.save(cat1.id);
await meowzer.storage.save(cat2.id);
await meowzer.storage.save(cat3.id);
```

### 5. Optimize Boundaries

**Use simple rectangular boundaries:**

```typescript
// Simple rectangle (fast)
boundaries: {
  minX: 0,
  maxX: window.innerWidth,
  minY: 0,
  maxY: window.innerHeight
}

// Complex polygon boundaries are slower
// Avoid if possible
```

**Shared boundaries:**

```typescript
// Define once, reuse
const commonBounds = {
  minX: 100,
  maxX: 700,
  minY: 100,
  maxY: 500,
};

// All cats use same bounds
for (let i = 0; i < 50; i++) {
  await meowzer.cats.create({ boundaries: commonBounds });
}
```

### 6. Reduce Interaction Elements

**Limit active needs/toys:**

```typescript
// Track active interactions
const MAX_FOOD = 10;
let foodCount = 0;

function placeFood(position) {
  if (foodCount >= MAX_FOOD) {
    // Remove oldest food first
    meowzer.interactions.removeOldestNeed("food");
  }

  meowzer.interactions.placeNeed("food:basic", position);
  foodCount++;
}
```

**Auto-cleanup:**

```typescript
// Remove consumed items immediately
meowzer.on("needConsumed", ({ needId }) => {
  foodCount--;
  // Already removed by SDK, just track count
});
```

### 7. Lazy Loading

**Load cats on demand:**

```typescript
// Don't create all cats immediately
let activeCats = [];
const MAX_ACTIVE = 20;

async function ensureCats() {
  while (activeCats.length < MAX_ACTIVE) {
    const cat = await meowzer.cats.create({
      personality: "playful",
    });
    activeCats.push(cat);
  }
}

// Destroy excess cats
function trimCats() {
  while (activeCats.length > MAX_ACTIVE) {
    const cat = activeCats.pop();
    meowzer.cats.destroy(cat.id);
  }
}
```

**Viewport-based loading:**

```typescript
// Only load cats in viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Load cats for this section
      loadCatsForSection(entry.target);
    }
  });
});

document.querySelectorAll(".cat-zone").forEach((zone) => {
  observer.observe(zone);
});
```

### 8. Memory Management

**Properly destroy cats:**

```typescript
// Always destroy when done
async function cleanup() {
  const allCats = meowzer.cats.getAll();

  await Promise.all(
    allCats.map((cat) => meowzer.cats.destroy(cat.id))
  );
}

// Call on page unload
window.addEventListener("beforeunload", cleanup);
```

**Clear storage periodically:**

```typescript
// Prevent storage bloat
async function cleanOldCats() {
  const all = await meowzer.storage.listCats();
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (const catId of all) {
    const cat = await meowzer.storage.load(catId);
    if (cat.timestamp < oneWeekAgo) {
      await meowzer.storage.delete(catId);
    }
  }
}
```

## Monitoring Performance

### Built-in Metrics

```typescript
// Enable performance monitoring
meowzer.config.debug.performance = true;

// Get performance stats
const stats = meowzer.performance.getStats();
console.log({
  activeCats: stats.catCount,
  avgDecisionTime: stats.avgDecisionMs,
  avgFrameTime: stats.avgFrameMs,
  memoryUsage: stats.memoryMB,
});
```

### Custom Monitoring

```typescript
// Track decision times
let decisionTimes = [];

meowzer.on("decision", ({ cat, duration }) => {
  decisionTimes.push(duration);

  // Keep last 100
  if (decisionTimes.length > 100) {
    decisionTimes.shift();
  }

  // Calculate average
  const avg =
    decisionTimes.reduce((a, b) => a + b) / decisionTimes.length;

  if (avg > 50) {
    console.warn(`Slow decisions: ${avg}ms average`);
  }
});
```

### Frame Rate Monitoring

```typescript
// Monitor FPS
let lastTime = performance.now();
let frames = 0;

function checkFPS() {
  frames++;
  const now = performance.now();

  if (now - lastTime >= 1000) {
    const fps = frames;
    frames = 0;
    lastTime = now;

    if (fps < 30) {
      console.warn(`Low FPS: ${fps}`);
      // Take action: reduce cats, increase intervals, etc.
    }
  }

  requestAnimationFrame(checkFPS);
}

checkFPS();
```

## Adaptive Performance

### Dynamic Adjustment

Automatically adjust based on performance:

```typescript
class AdaptivePerformance {
  constructor(meowzer) {
    this.meowzer = meowzer;
    this.targetFPS = 60;
    this.checkInterval = 5000; // 5 seconds

    this.startMonitoring();
  }

  startMonitoring() {
    setInterval(() => {
      const fps = this.measureFPS();

      if (fps < this.targetFPS * 0.8) {
        // Performance struggling
        this.reduceLoad();
      } else if (fps > this.targetFPS * 0.95) {
        // Performance good, can handle more
        this.increaseLoad();
      }
    }, this.checkInterval);
  }

  measureFPS() {
    // Simplified FPS measurement
    return performance.now(); // Use actual FPS counter
  }

  reduceLoad() {
    const cats = this.meowzer.cats.getAll();

    // Increase decision intervals
    cats.forEach((cat) => {
      const current = cat.brain.decisionInterval;
      cat.brain.setDecisionInterval(current * 1.2);
    });

    console.log("Reduced load: increased decision intervals");
  }

  increaseLoad() {
    const cats = this.meowzer.cats.getAll();

    // Decrease decision intervals (but not too low)
    cats.forEach((cat) => {
      const current = cat.brain.decisionInterval;
      const newInterval = Math.max(1000, current * 0.9);
      cat.brain.setDecisionInterval(newInterval);
    });

    console.log("Increased responsiveness");
  }
}

// Use adaptive performance
const adaptive = new AdaptivePerformance(meowzer);
```

### Device Detection

Adjust based on device capabilities:

```typescript
function getDeviceProfile() {
  const cores = navigator.hardwareConcurrency || 2;
  const memory = navigator.deviceMemory || 4;
  const mobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);

  if (mobile) {
    return {
      maxCats: 20,
      decisionInterval: 4000,
      animationQuality: "low",
    };
  } else if (cores >= 8 && memory >= 8) {
    return {
      maxCats: 100,
      decisionInterval: 2000,
      animationQuality: "high",
    };
  } else {
    return {
      maxCats: 50,
      decisionInterval: 3000,
      animationQuality: "medium",
    };
  }
}

// Apply profile
const profile = getDeviceProfile();
meowzer.config.maxCats = profile.maxCats;
meowzer.config.defaultDecisionInterval = profile.decisionInterval;
```

## Platform-Specific Optimizations

### Mobile Devices

```typescript
function isMobile() {
  return /Mobile|Android|iPhone/i.test(navigator.userAgent);
}

if (isMobile()) {
  // Reduce cat count
  const MAX_MOBILE_CATS = 15;

  // Slower decisions
  meowzer.config.defaultDecisionInterval = 4000;

  // Pause on scroll
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    meowzer.cats.pauseAll();

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      meowzer.cats.resumeAll();
    }, 200);
  });

  // Reduce animation quality
  meowzer.config.animation.quality = "low";
}
```

### Low-End Devices

```typescript
// Detect low-end device
function isLowEnd() {
  const cores = navigator.hardwareConcurrency || 2;
  const memory = navigator.deviceMemory || 4;

  return cores < 4 || memory < 4;
}

if (isLowEnd()) {
  // Very conservative settings
  meowzer.config.maxCats = 10;
  meowzer.config.defaultDecisionInterval = 5000;
  meowzer.config.spatialGrid.cellSize = 200;

  // Disable complex features
  meowzer.config.features = {
    shadows: false,
    reflections: false,
    particleEffects: false,
  };
}
```

## Best Practices

### Do's

**Monitor performance:**

- Track FPS and decision times
- Test on target devices
- Use browser DevTools Performance tab

**Optimize progressively:**

- Start with reasonable defaults
- Measure before optimizing
- Adjust based on data

**Scale appropriately:**

- Match cat count to device
- Use adaptive techniques
- Provide quality settings

**Clean up properly:**

- Destroy unused cats
- Clear old storage
- Remove event listeners

### Don'ts

**Premature optimization:**

- Don't optimize before measuring
- Don't sacrifice UX for minor gains
- Don't assume bottlenecks

**Over-optimization:**

- Don't reduce quality too much
- Don't make cats unresponsive
- Don't remove essential features

**Ignoring edge cases:**

- Don't forget old devices
- Don't ignore mobile
- Don't skip testing at limits

## Troubleshooting

### Symptoms and Solutions

**Choppy animations:**

- Reduce cat count
- Increase decision intervals
- Simplify boundaries
- Check for other JS on page

**Slow decisions:**

- Increase decision intervals
- Reduce perception radius
- Simplify scoring logic
- Check spatial grid size

**High memory usage:**

- Destroy unused cats
- Clear old storage
- Check for memory leaks
- Reduce cat count

**Page freezing:**

- Too many cats for device
- Decision intervals too short
- Complex custom hooks
- Check browser console for errors

## Performance Checklist

Before deploying:

- [ ] Test on target devices (desktop, mobile, tablet)
- [ ] Measure FPS with typical cat count
- [ ] Profile with browser DevTools
- [ ] Test with maximum expected load
- [ ] Verify cleanup on page unload
- [ ] Check memory usage over time
- [ ] Test with tab visibility changes
- [ ] Verify storage doesn't grow unbounded
- [ ] Test on slower network (if loading assets)
- [ ] Verify accessibility still works

## Next Steps

- [Customization Guide](/guides/customization) - Balance features with performance
- [Best Practices](/guides/best-practices) - Production-ready patterns
- [Architecture](/concepts/architecture) - Understand system design

---

_Performance optimization ensures smooth experiences for all users. Measure, optimize, and test on real devices!_ ⚡
