# Meowzer Documentation Style Guide

**Version:** 1.0  
**Last Updated:** November 20, 2025

---

## Overview

This style guide ensures consistency across all Meowzer documentation. Follow these guidelines when writing or updating documentation.

---

## Voice & Tone

### General Principles

**Professional but Friendly**

- Write like you're explaining to a colleague, not lecturing
- Be helpful and encouraging
- Assume good intent from readers

**Clear and Direct**

- Use active voice: "Create a cat" not "A cat is created"
- Be concise: Remove unnecessary words
- Front-load important information

**Inclusive and Accessible**

- Use "we" and "you" pronouns
- Avoid jargon unless explained
- Consider non-native English speakers

### Voice Examples

✅ **Good:**

> "Create a cat by calling `meowzer.cats.create()`. This returns a `MeowzerCat` instance you can place on the page."

❌ **Bad:**

> "The creation of a cat is accomplished through the invocation of the `meowzer.cats.create()` method, which subsequently returns a `MeowzerCat` instance that may be placed upon the page."

### Tone by Section

**End User Docs (`/play/`)**

- Warm and playful
- Use emojis liberally 🐱
- Short paragraphs
- Conversational
- No code examples

**Developer Docs (`/docs/`)**

- Professional and precise
- Use emojis sparingly
- Technical but accessible
- Code examples required
- Accurate terminology

---

## Content Structure

### Page Organization

**Every page should have:**

1. Title (H1) - One per page
2. Introduction paragraph - What this page covers
3. Sections (H2) - Main topics
4. Subsections (H3) - Specific details
5. Next steps - Links to related pages

**Progressive Disclosure:**

- Start simple, get complex
- Core concept → Details → Advanced
- Required info → Optional info → Edge cases

### Heading Hierarchy

```markdown
# Page Title (H1 - One per page)

Brief introduction paragraph.

## Main Section (H2)

Content about this section.

### Subsection (H3)

Specific details.

#### Minor Detail (H4)

Use sparingly.
```

**Rules:**

- Only one H1 per page (the title)
- Don't skip levels (H2 → H4 is bad)
- Keep headings short (5 words max)
- Use sentence case, not title case

---

## Writing Style

### Paragraphs

**Keep paragraphs short:**

- 3-4 sentences maximum
- One idea per paragraph
- Blank line between paragraphs

✅ **Good:**

```markdown
Cats have personalities that affect their behavior. A playful cat moves
more and interacts with toys frequently. A lazy cat prefers napping.

You can customize personality when creating a cat. Set traits like
energy, curiosity, and playfulness on a scale of 0 to 1.
```

❌ **Bad:**

```markdown
Cats have personalities that affect their behavior and a playful cat
moves more and interacts with toys frequently while a lazy cat prefers
napping and you can customize personality when creating a cat by
setting traits like energy, curiosity, and playfulness on a scale of
0 to 1.
```

### Lists

**Use lists for:**

- Multiple related items
- Steps in a process
- Options or choices
- Features or benefits

**Ordered lists** for sequences:

```markdown
1. Initialize Meowzer
2. Create a cat
3. Place it on the page
```

**Unordered lists** for collections:

```markdown
- Energy level
- Curiosity
- Playfulness
```

**Keep list items parallel:**

✅ **Good:**

- Create cats
- Save cats
- Load cats

❌ **Bad:**

- Create cats
- Saving cats
- You can load cats

### Tables

Use tables for comparisons or reference data:

```markdown
| Property  | Type   | Default | Description                |
| --------- | ------ | ------- | -------------------------- |
| energy    | number | 0.5     | Activity level (0-1)       |
| curiosity | number | 0.5     | Exploration tendency (0-1) |
```

**Table guidelines:**

- Use for 3+ columns of related data
- Keep cell content short
- Left-align text, right-align numbers
- Include headers

---

## Code Examples

### General Rules

**Every code example must:**

1. Be complete and runnable
2. Show realistic use cases
3. Include comments for clarity
4. Follow project coding standards
5. Be tested to work

**Bad code examples:**

- Incomplete snippets that won't run
- `// ...` indicating omitted code
- Unrealistic scenarios
- Outdated API usage

### Code Blocks

**Always specify language:**

````markdown
````typescript
const cat = await meowzer.cats.create();
\```
````
````

**Supported languages:**

- `typescript` - Preferred for all SDK code
- `javascript` - For plain JS examples
- `bash` - For terminal commands
- `json` - For configuration
- `html` - For markup
- `css` - For styles

### Inline Code

Use backticks for:

- Variable names: `catId`
- Function names: `create()`
- Class names: `Meowzer`
- File names: `package.json`
- Property names: `cat.name`
- Values: `true`, `"tabby"`, `42`

**Don't use for:**

- Emphasis (use **bold** instead)
- Regular words

### Code Comments

**Use comments to:**

- Explain non-obvious code
- Highlight important parts
- Show expected output
- Clarify intent

✅ **Good:**

```typescript
// Initialize with custom boundaries
const meowzer = new Meowzer({
  behavior: {
    boundaries: {
      minX: 0,
      maxX: 1920, // Full HD width
      minY: 0,
      maxY: 1080, // Full HD height
    },
  },
});
```

❌ **Bad:**

```typescript
// Create meowzer
const meowzer = new Meowzer(); // This creates meowzer
```

### Example Structure

**Complete example pattern:**

````markdown
## Creating a Cat

Create a cat with custom settings:

\```typescript
import { Meowzer } from 'meowzer';

const meowzer = new Meowzer();
await meowzer.init();

const cat = await meowzer.cats.create({
name: "Whiskers",
settings: {
color: "#FF9500",
pattern: "tabby"
}
});

cat.place(document.body);
\```

This creates an orange tabby cat named Whiskers and places it on the page.
````

---

## Links & Cross-References

### Internal Links

**Use relative paths:**

```markdown
[Installation](/docs/getting-started/installation)
[API Reference](/docs/api/meowzer-sdk)
```

**Link text should:**

- Describe the destination
- Make sense out of context
- Not be "click here" or "read more"

✅ **Good:**

```markdown
See [Cat Lifecycle](/docs/concepts/cat-lifecycle) for details.
Learn about [customization options](/docs/guides/customization).
```

❌ **Bad:**

```markdown
Click [here](/docs/concepts/cat-lifecycle) for details.
[Read more](/docs/guides/customization) about customization.
```

### External Links

**Open in same tab** (default):

```markdown
[MDN Web Docs](https://developer.mozilla.org)
```

**For external resources:**

- Specify it's external: "on GitHub", "on npm", etc.
- Use full URLs
- Check links regularly

### See Also Sections

End pages with related links:

```markdown
## See Also

- [Architecture](/docs/concepts/architecture) - How Meowzer works
- [API Reference](/docs/api/meowzer-sdk) - Complete API docs
- [Examples](/docs/examples/code-snippets) - Code snippets
```

---

## Formatting

### Emphasis

**Bold** for important concepts:

```markdown
**Always** call `init()` before using Meowzer.
```

**Italic** for introducing new terms:

```markdown
The _ProtoCat_ represents cat appearance data.
```

**Code** for technical terms:

```markdown
Call the `create()` method to make a cat.
```

### Callouts

Use Quiet UI components for callouts:

**Note:**

```markdown
<quiet-alert variant="info">
  **Note:** Cats require initialization before use.
</quiet-alert>
```

**Warning:**

```markdown
<quiet-alert variant="warning">
  **Warning:** Destroying a cat cannot be undone.
</quiet-alert>
```

**Tip:**

```markdown
<quiet-alert variant="success">
  **Tip:** Use personality presets for quick setup.
</quiet-alert>
```

### Emojis

**End User Docs:** Use liberally

```markdown
# Feed Your Cat 🍖

Cats love food! 😺 Give them treats to see them happy.
```

**Developer Docs:** Use sparingly, only for visual markers

```markdown
## Features

- 🎨 Customizable appearance
- 🧠 AI behaviors
- 💾 Persistence
```

---

## API Documentation

### Function/Method Documentation

**Pattern:**

````markdown
### methodName()

\```typescript
methodName(param1: Type, param2?: Type): ReturnType
\```

Brief description of what this method does.

**Parameters:**

| Name   | Type | Optional | Description                |
| ------ | ---- | -------- | -------------------------- |
| param1 | Type | No       | What this param does       |
| param2 | Type | Yes      | Optional param description |

**Returns:**

Description of return value.

**Example:**

\```typescript
const result = obj.methodName('value');
\```

**Throws:**

- `ErrorType` - When this error occurs
````

### Class Documentation

**Pattern:**

````markdown
## ClassName

Brief description of the class.

### Constructor

\```typescript
new ClassName(options?: Options)
\```

Construction details.

### Properties

#### propertyName

\```typescript
readonly propertyName: Type
\```

Property description.

### Methods

[Methods listed here]

### Events

[Events listed here]
````

---

## Frontmatter

Every markdown file needs frontmatter:

```yaml
---
title: Page Title
description: Brief page description (150 chars max)
previous: /docs/path/to/previous
next: /docs/path/to/next
---
```

**Required fields:**

- `title` - Page title (shows in nav)
- `description` - For SEO and previews

**Optional fields:**

- `previous` - Link to previous page
- `next` - Link to next page
- `template` - Override template (Home, Landing, Documentation)
- `draft` - Set to `true` to hide from nav

---

## File Naming

### Markdown Files

**Use kebab-case:**

- `getting-started.md` ✅
- `Getting_Started.md` ❌
- `GettingStarted.md` ❌

**Be descriptive:**

- `installation.md` ✅
- `install.md` ❌
- `i.md` ❌

### URLs

URLs are generated from file paths:

```
source/content/docs/getting-started/installation.md
→ /docs/getting-started/installation
```

**Keep URLs:**

- Short (3-5 segments max)
- Descriptive
- Permanent (don't change URLs)

---

## Content Guidelines

### Terminology

**Use consistent terms:**

✅ **Correct:**

- Meowzer (SDK name)
- MeowzerCat (class name)
- ProtoCat (appearance data)
- cat instance

❌ **Avoid:**

- Meowzer SDK (redundant)
- meowzer cat object
- Cat prototype

### Technical Accuracy

**Always:**

- Test code examples
- Use current API
- Check TypeScript types
- Verify links work
- Update with new releases

### Accessibility

**Write for everyone:**

- Describe images with alt text
- Don't rely on color alone
- Use semantic HTML
- Keep language simple
- Provide keyboard alternatives

---

## Review Checklist

Before submitting documentation:

- [ ] Spell check and grammar check
- [ ] All code examples tested
- [ ] Links work
- [ ] Frontmatter complete
- [ ] Follows style guide
- [ ] Headings properly nested
- [ ] No TODOs or placeholders
- [ ] Peer reviewed
- [ ] Accessible

---

## Questions?

When in doubt:

1. Check existing docs for patterns
2. Ask in PR review
3. Refer to this guide

**Keep this guide updated** as conventions evolve!
