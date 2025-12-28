---
title: Sharing & Adopting Cats
description: Share your favorite cats with others or adopt cats from the community using seed values
---

# Sharing & Adopting Cats

Meowzer makes it easy to share your favorite cats with friends or adopt cats created by others. Every cat has a unique **seed** value that captures its appearance, allowing you to recreate identical-looking cats.

## Understanding Seeds

A seed is a reproducible string that encodes a cat's visual characteristics:

```javascript
const cat = await meowzer.cats.create();
console.log(cat.seed);
// Example: "tabby-FF9500-00FF00-m-short-v1"
```

The seed includes:

- **Pattern** (tabby, calico, solid, etc.)
- **Primary color** (hex code)
- **Eye color** (hex code)
- **Size** (s, m, l)
- **Fur length** (short, medium, long)
- **Accessories** (optional - hat colors)
- **Version** (format version)

:::tip[Reproducible Cats]
The same seed will always create a cat with the same appearance, but personality and behavior are randomized each time!
:::

## Sharing a Cat

Share your cats with others through the playground's context menu.

1. Click on any cat in the playground to open its context menu.
2. Select the **Share Cat** option from the menu.
3. In the share modal, click the **Copy Seed** button to copy the seed to your clipboard.

### Programmatic access

```javascript
// You can also access the seed programmatically
const cat = await meowzer.cats.create({
  name: "Whiskers",
  description: "A playful orange tabby",
  settings: {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  },
});

// Share this seed with others
console.log(cat.seed); // "tabby-FF9500-00FF00-m-short-v1"
```

## Adopting a Cat

Adopt cats shared by others using their seed values.

1. Click the **Create Cat** button in the playground toolbar.
2. Click the **Adopt Cat** tab at the top of the creator dialog.
3. Fill in the adoption form:

   - **Seed** (required): Paste the seed value you received
   - **Name** (optional): Give your adopted cat a name
   - **Description** (optional): Add a description

   The preview will update in real-time as you type the seed, showing validation feedback.

4. Click **Adopt Cat** to create the cat and add it to your playground.

### Validation

The adopt form validates seeds automatically:

- ✅ **Valid seed**: Green checkmark, preview shows the cat
- ❌ **Invalid seed**: Error message with details
- ⏳ **Typing**: Preview updates as you type

:::note[Seed Format]
Seeds must follow the format: `pattern-primaryColor-eyeColor-size-furLength[-hatPrimary-hatSecondary]-version`

Example: `tabby-FF9500-00FF00-m-short-v1`
:::

## Programmatic Adoption

You can also adopt cats programmatically using the SDK:

```javascript
// Adopt a cat from a seed
const adoptedCat = await meowzer.cats.create({
  seed: "tabby-FF9500-00FF00-m-short-v1",
  name: "Adopted Whiskers",
  description: "Adopted from a friend!",
});

// The cat will have the exact same appearance
console.log(adoptedCat.seed); // "tabby-FF9500-00FF00-m-short-v1"
```

## Use Cases

### Community Sharing

Share your favorite cats on social media or forums:

```markdown
Check out my cat! 🐱
Seed: calico-FFB6C1-4169E1-l-long-v1
Name: Risotto
```

### Themed Collections

Create collections of cats with similar themes:

```javascript
const halloweenSeeds = [
  "solid-FF6600-FF0000-m-short-v1", // Orange cat
  "solid-000000-FFA500-m-short-v1", // Black cat
  "tabby-8B4513-00FF00-l-long-v1", // Brown tabby
];

for (const seed of halloweenSeeds) {
  await meowzer.cats.create({ seed });
}
```

## Troubleshooting

### Seed Won't Validate

**Problem**: The seed shows an error when pasted into the adopt form.

**Solutions**:

- Check for extra spaces or line breaks
- Verify all hyphens are present
- Ensure color codes are valid hex values (6 characters)
- Confirm the pattern name is valid (tabby, calico, solid, etc.)

### Different Personality

**Problem**: The adopted cat behaves differently than expected.

**Explanation**: Seeds only control appearance. Personality and behavior are randomized for each cat instance. You can set the personality after adoption:

```javascript
const cat = await meowzer.cats.create({
  seed: "tabby-FF9500-00FF00-m-short-v1",
});

// Set specific personality
cat.setPersonality("playful");
```

### Copy Button Not Working

**Problem**: The copy button doesn't copy the seed.

**Solutions**:

- Ensure your browser supports the Clipboard API
- Check browser permissions for clipboard access
- Try manually selecting and copying the seed text

## Related Documentation

- [Creating Cats](/api/managers/cat-manager#create) - Learn about cat creation options
- [Cat Customization](/guides/customization) - Customize cat appearance
- [Understanding Cats](/play/understanding-cats) - Learn about cat behavior
