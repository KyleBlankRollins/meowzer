# Meowzer Demo Site Proposal

**Created:** October 26, 2025  
**Framework:** Astro 5.15.1  
**Purpose:** Fun, interactive playground for creating and playing with Meowzer cats

## Overview

Transform the basic Astro starter into a delightful playground site where people can create, customize, and play with cats. This is NOT a marketing site - it's a sandbox for experimentation and fun.

## Core Philosophy

**Fun First, Docs Second**

- Primary goal: Let people play with cats immediately
- No sign-up, no barriers, just cats
- Save creations to IndexedDB (automatic persistence)
- Share creations via URL
- Discovery through interaction, not documentation

## Site Structure

### 1. **Home Page** - Immediate Playground

**Route:** `/`

**Purpose:** Jump right into creating cats

**Layout:**

```
┌─────────────────────────────────────────┐
│  [Logo] Meowzer Playground     [About]  │
├─────────────────────────────────────────┤
│                                         │
│      🐱  Cat Playground Area  🐱       │
│         (Full height viewport)          │
│                                         │
│  [Cats roaming and playing here]       │
│                                         │
├─────────────────────────────────────────┤
│  [Creator Panel - Floating/Sidebar]    │
└─────────────────────────────────────────┘
```

**Features:**

- Immediate cat playground on page load
- 2-3 demo cats already roaming
- Floating/docked creator panel
- Collapsible controls (so cats are focus)
- Fun animations and interactions
- Cats can interact with page elements

**Components:**

```astro
<Layout title="Meowzer Playground">
  <!-- Full-screen playground -->
  <meowzer-provider auto-init>
    <mb-cat-playground></mb-cat-playground>
  </meowzer-provider>
</Layout>
```

### 2. **About** - Simple Explanation

**Route:** `/about`

**Purpose:** Quick explanation if people are curious

**Content:**

- What is this? "A playground for creating animated cats"
- How to use it (brief, 3-4 bullet points)
- Link to GitHub repo
- Credits (Quiet UI, etc.)
- "Want to add this to your site? Check the repo"

**Tone:** Casual, fun, no marketing speak

```astro
<Layout title="About">
  <div class="about-content">
    <h1>What is this?</h1>
    <p>A fun playground for creating and playing with animated cats! 🐱</p>

    <h2>How to use it</h2>
    <ul>
      <li>Click "Create Cat" to make a new friend</li>
      <li>Customize colors, patterns, and personality</li>
      <li>Watch them roam around the screen</li>
      <li>Save your favorites and share them!</li>
    </ul>

    <h2>Want cats on your site?</h2>
    <p>Check out the <a href="https://github.com/yourusername/meowzer">GitHub repo</a></p>

    <!-- A few demo cats roaming on this page too -->
    <meowzer-provider auto-init>
      <mb-cat-playground></mb-cat-playground>
    </meowzer-provider>
  </div>
</Layout>
```

### 3. **Gallery** (Optional) - Community Creations

**Route:** `/gallery`

**Purpose:** Showcase cool cats people have made

**Features:**

- Grid of shared cats
- Click to import
- Vote/like system (optional)
- Filter by color, personality, etc.
- "Load Random Cat" button

**Note:** This could be added later if people start sharing creations

````

## Technical Implementation

### Dependencies to Add

```json
{
  "dependencies": {
    "astro": "^5.15.1",
    "meowzer": "file:../meowzer/sdk",
    "@meowzer/ui": "file:../meowzer/ui",
    "@quietui/quiet": "^1.3.0",
    "lit": "^3.0.0",
    "@astrojs/lit": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/tailwind": "^5.1.3",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  }
}
````

### Astro Configuration

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [lit(), tailwind()],
  vite: {
    ssr: {
      noExternal: ["@meowzer/ui", "meowzer", "@quietui/quiet"],
    },
  },
});
```

### Layout Structure

```
src/
├── layouts/
│   └── Layout.astro              # Simple base layout
├── components/
│   ├── Header.astro              # Minimal header with logo
│   ├── Footer.astro              # Credits footer
│   └── ShareButton.astro         # Share cat creation
├── pages/
│   ├── index.astro               # Playground (main page)
│   ├── about.astro               # About page
│   └── gallery.astro             # Optional gallery
└── styles/
    └── global.css                # Minimal global styles
```

### Key Features to Implement

#### 1. **URL Sharing**

- Encode cat configuration in URL hash
- "Share this cat" button generates shareable URL
- Auto-load cat from URL on page load

```typescript
// Share functionality
function shareCat(cat) {
  const encoded = btoa(JSON.stringify(cat.settings));
  const shareUrl = `${window.location.origin}?cat=${encoded}`;
  navigator.clipboard.writeText(shareUrl);
  // Show "Copied!" message
}
```

#### 2. **IndexedDB Persistence**

- Auto-save cats to IndexedDB (via Meowbase)
- "My Cats" panel to reload saved cats
- Export/import functionality
- Collections for organizing cats

#### 3. **Minimal UI**

- Collapsible creator panel
- Floating action buttons
- Full-screen mode toggle
- Distraction-free cat watching

#### 4. **Performance**

- Static generation for fast load
- Client-side hydration for interactivity
- Optimized cat animations

## Design System

### Visual Style

**Playful & Minimal:**

- Soft, rounded corners
- Pastel color accents
- Smooth animations
- Clean, uncluttered interface
- Focus on the cats, not the UI

### Color Palette

- Background: Light cream/white (#FFFEF9)
- Accents: Soft oranges, blues, greens (cat-themed)
- Dark mode: Cozy dark blues and purples
- UI elements: Quiet UI defaults

### Typography

- Headings: Playful but readable
- Body: Clean system fonts
- Minimal text overall

### Layout Philosophy

- Cats take center stage
- UI fades into background
- Plenty of whitespace
- Mobile-friendly but desktop-optimized

## SEO & Meta

### Meta Tags

```astro
<head>
  <title>Meowzer Playground - Create Animated Cats</title>
  <meta name="description" content="Create and customize your own animated cats. Play with personalities, colors, and watch them roam!" />
  <meta property="og:title" content="Meowzer Playground" />
  <meta property="og:description" content="Create your own animated cats!" />
  <meta property="og:image" content="/og-cat.png" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
```

## Deployment

### Hosting: Cloudflare Pages (Recommended)

- Free tier
- Fast global CDN
- Automatic HTTPS
- Simple deployment

### Build Configuration

```yaml
# .github/workflows/deploy.yml
name: Deploy Playground

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: meowzer-playground
          directory: dist
```

## Development Phases

### Phase 1: Foundation (Day 1-2)

- [x] Astro setup complete
- [ ] Add Meowzer dependencies
- [ ] Configure Lit integration
- [ ] Create base layout (header, footer)
- [ ] Add Quiet UI theming
- [ ] Set up Tailwind CSS

### Phase 2: Core Playground (Day 3-5)

- [ ] Implement full playground on home page
- [ ] Make UI collapsible/minimal
- [ ] Add URL sharing functionality
- [ ] Implement IndexedDB persistence (via Meowbase)
- [ ] Add "My Cats" saved panel

### Phase 3: Polish (Day 6-7)

- [ ] About page
- [ ] Dark mode toggle
- [ ] Mobile responsive design
- [ ] Fun animations and interactions
- [ ] Easter eggs!

### Phase 4: Optional Gallery (Later)

- [ ] Gallery page structure
- [ ] Share/import functionality
- [ ] Community showcase

## Content Needed

### Essential

- Playful copy for home page ("Make cats! 🐱")
- Brief "how to use" on about page
- Credits and links

### Assets

- Logo (cat-themed, playful)
- Favicon (cat paw? cat face?)
- OG image for sharing (cute cat graphic)
- Maybe some cat-themed decorative elements

## Next Steps

1. **Immediate:**

   - Install dependencies
   - Set up Lit integration
   - Create minimal layout
   - Get playground working on home page

2. **This Week:**

   - Implement share functionality
   - Use IndexedDB for cat persistence
   - Polish UI/UX
   - Deploy to Netlify

3. **Nice to Have:**
   - Gallery page

## Conclusion

This will be a **playground first, documentation second** site. The goal is to create something delightful and fun that makes people smile and want to play with cats.

The focus is on:

- ✨ **Immediate fun** - No barriers to playing
- 🎨 **Creativity** - Endless customization
- 🔗 **Sharing** - Show off your creations
- 😊 **Joy** - Just pure cat fun

Documentation exists for those who want to implement Meowzer on their own sites, but it's not the primary purpose. This is a playground, a toy, a digital cat park where people can create and play.

Let's make something that brings joy! 🐱
