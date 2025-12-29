# Cat Personality Picker

Interface for selecting and customizing cat personality using presets or custom trait sliders.

## Features

- **6 Preset Personalities** - Quick selection from common personality archetypes
- **5 Customizable Traits** - Fine-tune individual personality characteristics
- **Visual Feedback** - Highlights selected preset, clears when manually adjusting
- **Real-time Updates** - Emits changes as user interacts with controls
- **Meowbrain Integration** - Uses personality definitions from `@meowzer/meowbrain`

## Usage

### Basic Usage

```html
<cat-personality-picker
  .personality="${currentPersonality}"
  @personality-change="${handlePersonalityChange}"
>
</cat-personality-picker>
```

### With Preset

```typescript
import { html, LitElement } from "lit";
import "@meowzer/ui/components/cat-personality-picker/cat-personality-picker.js";

class MyComponent extends LitElement {
  personality = { preset: "playful" };

  handlePersonalityChange(e: CustomEvent) {
    console.log("New personality:", e.detail);
    this.personality = e.detail;
  }

  render() {
    return html`
      <cat-personality-picker
        .personality=${this.personality}
        @personality-change=${this.handlePersonalityChange}
      >
      </cat-personality-picker>
    `;
  }
}
```

### With Custom Traits

```typescript
const customPersonality = {
  curiosity: 0.8,
  playfulness: 0.6,
  independence: 0.3,
  sociability: 0.9,
  energy: 0.7,
};
```

```html
<cat-personality-picker .personality="${customPersonality}">
</cat-personality-picker>
```

## API

### Properties

| Property      | Type                   | Default | Description                                  |
| ------------- | ---------------------- | ------- | -------------------------------------------- |
| `personality` | `Partial<Personality>` | `{}`    | Current personality settings (traits/preset) |

### Events

| Event                | Detail                 | Description                                                 |
| -------------------- | ---------------------- | ----------------------------------------------------------- |
| `personality-change` | `Partial<Personality>` | Fired when personality changes (preset or trait adjustment) |

#### Event Detail Structure

When a preset is selected:

```typescript
{
  preset: "playful", // PersonalityPreset
  curiosity: 0.8,
  playfulness: 0.9,
  independence: 0.4,
  sociability: 0.7,
  energy: 0.9
}
```

When traits are manually adjusted:

```typescript
{
  curiosity: 0.7,
  playfulness: 0.5,
  // ... other modified traits
}
```

## Personality Presets

The component offers 6 preset personality archetypes:

| Preset        | Description                                    |
| ------------- | ---------------------------------------------- |
| **Playful**   | High energy and playfulness, loves interaction |
| **Lazy**      | Low energy, prefers rest and minimal activity  |
| **Curious**   | High curiosity, explores and investigates      |
| **Aloof**     | Independent, low sociability, keeps to itself  |
| **Energetic** | Maximum energy and activity levels             |
| **Balanced**  | Moderate values across all traits              |

Each preset sets specific values for all 5 personality traits.

## Personality Traits

The component allows adjustment of 5 core personality traits:

| Trait            | Range | Description                                  |
| ---------------- | ----- | -------------------------------------------- |
| **Curiosity**    | 0-1   | How interested the cat is in exploring       |
| **Playfulness**  | 0-1   | How much the cat enjoys play and interaction |
| **Independence** | 0-1   | How self-sufficient the cat is               |
| **Sociability**  | 0-1   | How much the cat seeks social interaction    |
| **Energy**       | 0-1   | Activity level and stamina                   |

All sliders support 0.1 increments (step="0.1").

## Behavior

### Preset Selection

- Clicking a preset button highlights it (primary variant)
- All other preset buttons become tertiary variant
- The personality property is updated with preset values from meowbrain
- A `personality-change` event is emitted with preset name and trait values

### Manual Trait Adjustment

- Moving any slider clears the selected preset
- All preset buttons return to tertiary variant
- Only the modified traits are included in the personality object
- A `personality-change` event is emitted with updated trait values

### Default Values

- Traits without explicit values default to 0.5
- Empty personality object shows all sliders at midpoint

## Internal Components

This component uses:

- `mb-button` - For preset selection buttons
- `mb-slider` - For trait adjustment controls

## Integration with Meowbrain

The component imports `getPersonality()` from `@meowzer/meowbrain` to fetch preset trait values:

```typescript
import { getPersonality } from "meowzer";

// Get preset values
const playfulTraits = getPersonality("playful");
// Returns: { curiosity: 0.8, playfulness: 0.9, ... }
```

## Dependencies

### Required Components

- `mb-button` - Preset selection
- `mb-slider` - Trait adjustment

### Required Packages

- `meowzer` - For `Personality` types and `getPersonality()` function
- `lit` - Component framework

## Design Tokens Used

### Layout

- `--mb-space-md` - Padding for preset buttons container
- `gap: 0.5rem` - Spacing between preset buttons
- `gap: 1.5rem` - Spacing between trait sliders

### Typography

- Inherits from parent context

### Colors

- Button colors determined by `mb-button` variants
- Slider colors determined by `mb-slider` styles

## Examples

### Listen to Personality Changes

```typescript
const picker = document.querySelector("cat-personality-picker");
picker.addEventListener("personality-change", (e: CustomEvent) => {
  const newPersonality = e.detail;
  console.log("Personality updated:", newPersonality);

  // Check if preset was selected
  if (newPersonality.preset) {
    console.log("Preset selected:", newPersonality.preset);
  }

  // Access individual traits
  console.log("Curiosity:", newPersonality.curiosity);
  console.log("Playfulness:", newPersonality.playfulness);
});
```

### In Cat Creator Workflow

```html
<cat-personality-picker
  .personality="${this.catPersonality}"
  @personality-change="${this.handlePersonalityChange}"
>
</cat-personality-picker>
```

```typescript
handlePersonalityChange(e: CustomEvent) {
  // Update local state
  this.catPersonality = e.detail;

  // Propagate to parent
  this.dispatchEvent(new CustomEvent("personality-updated", {
    detail: e.detail,
    bubbles: true,
    composed: true
  }));
}
```

### Programmatically Set Preset

```typescript
const picker = document.querySelector("cat-personality-picker");
picker.personality = { preset: "curious" };
```

### Get Current Values

```typescript
const picker = document.querySelector("cat-personality-picker");
const currentPersonality = picker.personality;

console.log(
  "Current curiosity:",
  currentPersonality.curiosity || 0.5
);
console.log("Current energy:", currentPersonality.energy || 0.5);
```

## Accessibility

- All sliders have visible labels
- Preset buttons have clear text labels
- Keyboard navigation supported through button and slider components
- Focus indicators on all interactive elements
- Events bubble and compose for integration with parent components
- Semantic HTML structure
