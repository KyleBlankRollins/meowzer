---
title: "Cat Customization"
description: "Control appearance and personality of your cats"
---

Learn how to customize cat appearance and personality to create exactly the cats you want.

## What You'll Learn

How to customize:

- **Appearance** - Colors, patterns, fur length, and size
- **Personality** - Traits that affect behavior
- **Accessories** - Collars, bows, and other decorations
- **Names** - Procedural and custom naming

**Estimated time:** 25 minutes

## Prerequisites

- Completed [Basic Integration](/tutorials/basic-integration)
- Understanding of Meowzer creation API

## Appearance Customization

### Basic Color

The simplest customization is setting the primary fur color:

```javascript
const cat = await meowzer.cats.create({
  name: "Orange",
  settings: {
    color: "#FF9500", // Hex color code
  },
});
```

**Supported formats:**

- Hex: `#FF9500` (recommended)
- Shorthand hex: `#F90`
- Named colors are not supported - convert to hex first

### Patterns

Choose from five distinct patterns:

```javascript
const patterns = ["solid", "tabby", "spotted", "tuxedo", "calico"];

const cat = await meowzer.cats.create({
  settings: {
    pattern: "tabby",
    color: "#FF9500", // Base color
    patternColor: "#8B4513", // Pattern accent color
  },
});
```

**Pattern descriptions:**

| Pattern   | Description                     | Best With           |
| --------- | ------------------------------- | ------------------- |
| `solid`   | No pattern, single color        | Any color           |
| `tabby`   | Classic tiger stripes           | Orange, brown, gray |
| `spotted` | Leopard-like spots              | Yellow, cream       |
| `tuxedo`  | Black and white formal attire   | Black base          |
| `calico`  | Three-color patches (tri-color) | White, orange       |

### Size Options

Three size variations:

```javascript
const sizes = ["small", "medium", "large"];

const smallCat = await meowzer.cats.create({
  settings: {
    size: "small", // 80% scale
  },
});

const largeCat = await meowzer.cats.create({
  settings: {
    size: "large", // 120% scale
  },
});
```

### Fur Length

Control the fluffiness:

```javascript
const furLengths = ["short", "medium", "long"];

const fluffyCat = await meowzer.cats.create({
  settings: {
    furLength: "long", // Extra fluffy!
  },
});
```

### Eye Color

Customize eye appearance:

```javascript
const cat = await meowzer.cats.create({
  settings: {
    eyeColor: "#00FF00", // Bright green eyes
  },
});
```

**Popular eye colors:**

- `#00FF00` - Bright green (default)
- `#0000FF` - Blue (striking)
- `#FFD700` - Gold (mystical)
- `#FF8C00` - Amber (warm)

### Complete Appearance Example

Combine all appearance settings:

```javascript
const customCat = await meowzer.cats.create({
  name: "Tiger",
  settings: {
    // Appearance
    color: "#FF6600", // Orange
    patternColor: "#000000", // Black
    pattern: "tabby",
    eyeColor: "#FFD700", // Gold eyes

    // Physical traits
    size: "large",
    furLength: "medium",
  },
});
```

## Personality Customization

### Preset Personalities

Use predefined personality types:

```javascript
const personalities = [
  "playful",
  "lazy",
  "curious",
  "energetic",
  "calm",
];

const playfulCat = await meowzer.cats.create({
  name: "Zippy",
  personality: "playful",
});

const lazyCat = await meowzer.cats.create({
  name: "Sleepy",
  personality: "lazy",
});
```

**Personality effects:**

| Personality | Energy    | Curiosity | Playfulness | Independence | Sociability |
| ----------- | --------- | --------- | ----------- | ------------ | ----------- |
| `playful`   | High      | Medium    | Very High   | Low          | High        |
| `lazy`      | Low       | Low       | Low         | High         | Low         |
| `curious`   | Medium    | Very High | Medium      | Medium       | Medium      |
| `energetic` | Very High | High      | High        | Low          | High        |
| `calm`      | Low       | Medium    | Low         | High         | Medium      |

### Custom Personality Traits

Fine-tune personality with individual traits (0-1 scale):

```javascript
const cat = await meowzer.cats.create({
  name: "Custom",
  personality: {
    energy: 0.8, // Very active
    curiosity: 0.6, // Moderately curious
    playfulness: 0.9, // Loves to play
    independence: 0.4, // Prefers company
    sociability: 0.7, // Friendly
  },
});
```

**Trait details:**

#### Energy (0 = Lethargic, 1 = Hyperactive)

- **Low (0-0.3)**: Moves slowly, sits often, prefers resting
- **Medium (0.4-0.6)**: Balanced activity and rest
- **High (0.7-1.0)**: Constantly moving, rarely rests, zooms around

```javascript
// Couch potato cat
personality: {
  energy: 0.2;
}

// Zoomy cat
personality: {
  energy: 0.95;
}
```

#### Curiosity (0 = Indifferent, 1 = Explorer)

- **Low**: Stays in familiar areas, ignores new objects
- **Medium**: Occasionally explores, notices changes
- **High**: Investigates everything, explores all corners

```javascript
// Stick-in-the-mud
personality: {
  curiosity: 0.1;
}

// Adventure cat
personality: {
  curiosity: 0.9;
}
```

#### Playfulness (0 = Serious, 1 = Playful)

- **Low**: Ignores toys, prefers watching
- **Medium**: Plays sometimes, loses interest quickly
- **High**: Obsessed with toys, plays for extended periods

```javascript
// No-nonsense cat
personality: {
  playfulness: 0.15;
}

// Eternal kitten
personality: {
  playfulness: 0.95;
}
```

#### Independence (0 = Clingy, 1 = Aloof)

- **Low**: Seeks interaction, follows cursor, responds quickly
- **Medium**: Balanced social needs
- **High**: Does its own thing, less reactive to interactions

```javascript
// Velcro cat
personality: {
  independence: 0.2;
}

// Lone wolf
personality: {
  independence: 0.85;
}
```

#### Sociability (0 = Shy, 1 = Friendly)

- **Low**: Avoids placed items, takes time to approach
- **Medium**: Cautiously investigates
- **High**: Immediately interested in new items, approaches eagerly

```javascript
// Scaredy cat
personality: {
  sociability: 0.25;
}

// Social butterfly
personality: {
  sociability: 0.9;
}
```

### Personality Combinations

Create distinct character types:

```javascript
// The Lazy Loaf
const loaf = await meowzer.cats.create({
  name: "Loaf",
  personality: {
    energy: 0.1,
    curiosity: 0.2,
    playfulness: 0.1,
    independence: 0.8,
    sociability: 0.3,
  },
});

// The Hyper Kitten
const kitten = await meowzer.cats.create({
  name: "Zoom",
  personality: {
    energy: 0.95,
    curiosity: 0.9,
    playfulness: 0.95,
    independence: 0.2,
    sociability: 0.9,
  },
});

// The Dignified Elder
const elder = await meowzer.cats.create({
  name: "Whiskers",
  personality: {
    energy: 0.4,
    curiosity: 0.5,
    playfulness: 0.3,
    independence: 0.7,
    sociability: 0.6,
  },
});
```

## Accessories

Add decorative accessories to cats:

```javascript
const cat = await meowzer.cats.create({
  settings: {
    accessories: [
      {
        type: "collar",
        color: "#FF0000", // Red collar
      },
      {
        type: "bow",
        color: "#FF69B4", // Pink bow
        position: "head",
      },
    ],
  },
});
```

**Available accessories:**

- `collar` - Neck collar
- `bow` - Decorative bow (head or neck)
- `bandana` - Neck bandana
- `bell` - Jingle bell on collar

## Naming

### Auto-generated Names

Meowzer generates random names by default:

```javascript
const cat = await meowzer.cats.create();
console.log(cat.name); // e.g., "Whiskers", "Shadow", "Luna"
```

### Custom Names

Provide your own names:

```javascript
const cat = await meowzer.cats.create({
  name: "Sir Fluffington III",
});
```

### Name Conventions

```javascript
const themes = {
  food: ["Mochi", "Waffles", "Noodles", "Biscuit"],
  space: ["Nebula", "Comet", "Galaxy", "Orbit"],
  royal: ["Duke", "Duchess", "Prince", "Princess"],
  nature: ["River", "Storm", "Autumn", "Willow"],
};

// Pick random theme and name
const theme = themes.food;
const name = theme[Math.floor(Math.random() * theme.length)];

const cat = await meowzer.cats.create({ name });
```

## Interactive Customizer Example

Build a full customizer UI:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Cat Customizer</title>
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
      }

      #customizer {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        width: 320px;
        max-height: 90vh;
        overflow-y: auto;
        z-index: 1000;
      }

      h2 {
        margin-bottom: 20px;
        color: #333;
        font-size: 20px;
      }

      .section {
        margin-bottom: 20px;
      }

      .section h3 {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      label {
        display: block;
        margin-bottom: 12px;
        font-size: 14px;
        color: #333;
      }

      input,
      select {
        width: 100%;
        padding: 8px 12px;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        font-size: 14px;
        margin-top: 4px;
      }

      input[type="color"] {
        height: 40px;
        cursor: pointer;
      }

      input[type="range"] {
        margin-top: 8px;
      }

      .trait-value {
        float: right;
        color: #667eea;
        font-weight: 600;
      }

      button {
        width: 100%;
        padding: 14px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: 20px;
      }

      button:hover {
        background: #5568d3;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      button:active {
        transform: translateY(0);
      }
    </style>
  </head>
  <body>
    <div id="customizer">
      <h2>Cat Customizer</h2>

      <div class="section">
        <h3>Basic Info</h3>
        <label>
          Name
          <input type="text" id="name" value="Custom Cat" />
        </label>
      </div>

      <div class="section">
        <h3>Appearance</h3>
        <label>
          Color
          <input type="color" id="color" value="#FF9500" />
        </label>
        <label>
          Pattern
          <select id="pattern">
            <option value="solid">Solid</option>
            <option value="tabby">Tabby</option>
            <option value="spotted">Spotted</option>
            <option value="tuxedo">Tuxedo</option>
            <option value="calico">Calico</option>
          </select>
        </label>
        <label>
          Eye Color
          <input type="color" id="eyeColor" value="#00FF00" />
        </label>
        <label>
          Size
          <select id="size">
            <option value="small">Small</option>
            <option value="medium" selected>Medium</option>
            <option value="large">Large</option>
          </select>
        </label>
        <label>
          Fur Length
          <select id="furLength">
            <option value="short">Short</option>
            <option value="medium" selected>Medium</option>
            <option value="long">Long</option>
          </select>
        </label>
      </div>

      <div class="section">
        <h3>Personality</h3>
        <label>
          Energy
          <span class="trait-value" id="energy-value">0.5</span>
          <input
            type="range"
            id="energy"
            min="0"
            max="1"
            step="0.05"
            value="0.5"
          />
        </label>
        <label>
          Curiosity
          <span class="trait-value" id="curiosity-value">0.5</span>
          <input
            type="range"
            id="curiosity"
            min="0"
            max="1"
            step="0.05"
            value="0.5"
          />
        </label>
        <label>
          Playfulness
          <span class="trait-value" id="playfulness-value">0.5</span>
          <input
            type="range"
            id="playfulness"
            min="0"
            max="1"
            step="0.05"
            value="0.5"
          />
        </label>
        <label>
          Independence
          <span class="trait-value" id="independence-value">0.5</span>
          <input
            type="range"
            id="independence"
            min="0"
            max="1"
            step="0.05"
            value="0.5"
          />
        </label>
        <label>
          Sociability
          <span class="trait-value" id="sociability-value">0.5</span>
          <input
            type="range"
            id="sociability"
            min="0"
            max="1"
            step="0.05"
            value="0.5"
          />
        </label>
      </div>

      <button id="create-cat">Create Cat</button>
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
      maxX: window.innerWidth - 400,
      minY: 0,
      maxY: window.innerHeight,
    },
  },
});

await meowzer.init();

// Update trait value displays
const traits = [
  "energy",
  "curiosity",
  "playfulness",
  "independence",
  "sociability",
];
traits.forEach((trait) => {
  const slider = document.getElementById(trait);
  const display = document.getElementById(`${trait}-value`);

  slider.addEventListener("input", () => {
    display.textContent = parseFloat(slider.value).toFixed(2);
  });
});

// Create cat button
document
  .getElementById("create-cat")
  .addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const color = document.getElementById("color").value;
    const pattern = document.getElementById("pattern").value;
    const eyeColor = document.getElementById("eyeColor").value;
    const size = document.getElementById("size").value;
    const furLength = document.getElementById("furLength").value;

    const personality = {
      energy: parseFloat(document.getElementById("energy").value),
      curiosity: parseFloat(
        document.getElementById("curiosity").value
      ),
      playfulness: parseFloat(
        document.getElementById("playfulness").value
      ),
      independence: parseFloat(
        document.getElementById("independence").value
      ),
      sociability: parseFloat(
        document.getElementById("sociability").value
      ),
    };

    const cat = await meowzer.cats.create({
      name,
      settings: {
        color,
        pattern,
        eyeColor,
        size,
        furLength,
      },
      personality,
    });

    cat.place(document.body);
    console.log(`Created ${name}!`, {
      settings: cat.settings,
      personality,
    });
  });
```

## Randomization Helpers

Create variety with randomization:

```javascript
// Random color
function randomColor() {
  const colors = [
    "#FF9500", // Orange
    "#007AFF", // Blue
    "#34C759", // Green
    "#FF3B30", // Red
    "#AF52DE", // Purple
    "#FFD700", // Gold
    "#8B4513", // Brown
    "#000000", // Black
    "#FFFFFF", // White
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Random pattern
function randomPattern() {
  const patterns = ["solid", "tabby", "spotted", "tuxedo", "calico"];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

// Random trait (0-1)
function randomTrait() {
  return Math.random();
}

// Create random cat
const randomCat = await meowzer.cats.create({
  settings: {
    color: randomColor(),
    pattern: randomPattern(),
    eyeColor: randomColor(),
  },
  personality: {
    energy: randomTrait(),
    curiosity: randomTrait(),
    playfulness: randomTrait(),
    independence: randomTrait(),
    sociability: randomTrait(),
  },
});
```

## Best Practices

### 1. Test Personalities

Different personalities behave very differently. Test extremes:

```javascript
// Maximum chaos
const chaotic = await meowzer.cats.create({
  personality: { energy: 1, curiosity: 1, playfulness: 1 },
});

// Maximum chill
const chill = await meowzer.cats.create({
  personality: { energy: 0, curiosity: 0, playfulness: 0 },
});
```

### 2. Color Accessibility

Ensure colors are visible against your background:

```javascript
// Light background - use darker cats
const darkCat = await meowzer.cats.create({
  settings: { color: "#000000" },
});

// Dark background - use lighter cats
const lightCat = await meowzer.cats.create({
  settings: { color: "#FFFFFF" },
});
```

### 3. Save Customizations

Store favorite configurations:

```javascript
const presets = {
  tiger: {
    settings: {
      color: "#FF6600",
      pattern: "tabby",
      patternColor: "#000000",
    },
    personality: "energetic",
  },
  ghost: {
    settings: {
      color: "#FFFFFF",
      pattern: "solid",
      eyeColor: "#00FFFF",
    },
    personality: "calm",
  },
};

const tigerCat = await meowzer.cats.create({
  name: "Tiger",
  ...presets.tiger,
});
```

## Next Steps

- [Add Persistence](/tutorials/persistence-setup) - Save your customized cats
- [Explore Interactions](/guides/interactions) - See how personality affects play
- [View API Reference](/api/meowzer-cat) - Complete customization options

## Complete Example

See the full interactive customizer:

[View Live Demo →](https://codesandbox.io/s/meowzer-customization)
