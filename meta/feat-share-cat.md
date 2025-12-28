# Share Cats

## Feature goal

This feature allows users to copy the cat's seed value so that they can recreate specific cats on other devices.

## Terminology

We need two different words to indicate the actions involved in this process:

- "share". This is the action a user takes to copy the seed value.
- "adopt". Thisi is the action a user takes to recreate the cat from the copied seed value and save it to their device.

## UI

We need two UI updates to support this feature:

- Cat context menu: We need a new menu item called "share cat". When clicked, it should open a modal that contains an overview of the cat that includes its seed value and a button to copy the seed value.
- Cat creator: At the beginning of the cat creation flow, we need a button for "adopting" a cat. When clicked, we need to show a form that lets users paste the seed value. If possible, we should generate the cat from the pasted seed value in real time, then show another final adopt button that saves the imported cat to the new device.

## Questions:

1. **Share Modal Content**: For the "share cat" modal, what exactly should be in the "overview of the cat"? Should it include:
   Answer: the cat's SVG, name, description, and the seed value with a copy button

2. **Copy Mechanism**: Should we use the modern Clipboard API (`navigator.clipboard.writeText()`) with a fallback, or would you prefer a different approach? Should we show a toast/notification when the seed is copied?
   Answer: the modern clipboard API is great! We should definitely show some indication that the seed has been copied. Let's change the button text to checkmark and then transition it back to its original text after a few seconds.

3. **Adopt Flow UX**: For the "adopt" flow in cat-creator:
   - Should the adopt button be at the very top/beginning, or in a separate tab/section?
   - When they paste a seed and see the preview, should they be able to:
     - Just adopt as-is with only name/description editable?
     - Or also modify the appearance before adopting?
       Answer: Let's add a tab system. The default tab should be the cat creator and a new tab for adopting a cat. We won't allow any editing when adopting a cat.
4. **Validation Feedback**: When a user pastes an invalid seed in the adopt form, how should we handle it?

   - Show error message inline?
   - Disable the adopt button?
   - Answer: let's do both, but the adopt button should be disabled by default. It should only be enabled after a valid seed value is pasted into the form.

5. **Modal Component**: I don't see an existing modal component in the UI package. Should I:
   Answer: Look at `cat-creator.ts`, as it is already using the modal paradigm.

6. **Seed Display**: Should the seed be displayed in a read-only input field, a code block, or just plain text with a copy button?
   Answer: plain text with a copy button

## Implementation Plan

### 1. Share Cat Feature (Cat Context Menu)

**Files to modify:**

- `meowzer/ui/components/mb-cat-context-menu/mb-cat-context-menu.ts`

**New components to create:**

- `meowzer/ui/components/mb-share-cat-modal/`
  - `mb-share-cat-modal.ts`
  - `mb-share-cat-modal.style.ts`
  - `mb-share-cat-modal.test.ts`
  - `mb-share-cat-modal.stories.ts`
  - `README.md`

**Implementation details:**

- Add "Share Cat" menu item to context menu
- Dispatch `cat-share` event when clicked
- Create modal component that displays:
  - Cat's SVG preview
  - Name and description
  - Seed value (plain text)
  - Copy button using `navigator.clipboard.writeText()`
  - Button state changes to checkmark for 3 seconds after copying

### 2. Adopt Cat Feature (Cat Creator)

**Files to modify:**

- `meowzer/ui/components/cat-creator/cat-creator.ts`
- `meowzer/ui/components/cat-creator/cat-creator.style.ts`

**New partials to create:**

- `meowzer/ui/components/cat-creator/partials/adopt-section.ts`
- `meowzer/ui/components/cat-creator/partials/adopt-section.style.ts`

**New components to create:**

- `meowzer/ui/components/mb-tabs/`
  - `mb-tabs.ts`
  - `mb-tabs.style.ts`
  - `mb-tabs.test.ts`
  - `mb-tabs.stories.ts`
  - `README.md`

**Tabs Component Specification:**

- **Controlled component**: Parent manages active tab state
- **Data-driven API**: Accepts array of tab labels
- **Event-based**: Dispatches `tab-change` event when user clicks a tab
- **No content management**: Only handles tab UI, parent controls content display

Example usage:

```html
<mb-tabs
  .tabs=${["Create Cat", "Adopt Cat"]}
  activeIndex=${this.activeTab}
  @tab-change=${this.handleTabChange}
></mb-tabs>

<!-- Parent controls what content to show -->
${this.activeTab === 0 ? html`<create-section>` : html`<adopt-section>`}
```

**Implementation details:**

- Add tab system with two tabs:
  - "Create Cat" (default, existing flow)
  - "Adopt Cat" (new)
- Create adopt section partial with:
  - Text input for seed value
  - Real-time validation using `MeowzerUtils.validateSeed()`
  - Real-time cat preview using `MeowzerUtils.buildPreviewFromSeed()`
  - Name and description inputs (editable)
  - "Adopt Cat" button (disabled by default, enabled only when seed is valid)
  - Inline error message for invalid seeds
- When adopted, create cat using `meowzer.cats.create({ seed: validatedSeed, name, description })`

### 3. Technical Details

**SDK Methods to Use:**

- `MeowzerUtils.validateSeed(seed: string): boolean` - Validate seed format
- `MeowzerUtils.buildPreviewFromSeed(seed: string): ProtoCat` - Generate preview
- `meowzer.cats.create({ seed, name, description })` - Create cat from seed
- `cat.seed` - Get seed value from existing cat

**Existing Components to Reuse:**

- `mb-modal` - For share cat modal
- `mb-button` - For all buttons
- `mb-text-input` - For text inputs
- `mb-textarea` - For description input
- `cat-preview` - For displaying cat preview

**Browser APIs:**

- `navigator.clipboard.writeText()` - Copy seed to clipboard

**Event Flow:**

Share Cat:

1. User clicks cat → context menu opens
2. User clicks "Share Cat" → `cat-share` event
3. Parent component opens `mb-share-cat-modal` with cat data
4. User clicks copy button → seed copied to clipboard
5. Button text changes to checkmark for 3 seconds

Adopt Cat:

1. User opens cat creator
2. User clicks "Adopt Cat" tab
3. User pastes seed value → real-time validation and preview
4. User enters name and description (optional)
5. User clicks "Adopt Cat" button → cat created and saved
6. Modal closes, new cat appears in playground

### 4. File Structure

```
meowzer/ui/components/
├── mb-share-cat-modal/
│   ├── mb-share-cat-modal.ts
│   ├── mb-share-cat-modal.style.ts
│   ├── mb-share-cat-modal.test.ts
│   ├── mb-share-cat-modal.stories.ts
│   └── README.md
├── cat-creator/
│   ├── cat-creator.ts (modified - add tabs)
│   ├── cat-creator.style.ts (modified - tab styles)
│   └── partials/
│       ├── adopt-section.ts (new)
│       └── adopt-section.style.ts (new)
└── mb-cat-context-menu/
    └── mb-cat-context-menu.ts (modified - add share menu item)
```

### 5. Seed Format Reference

Example seed: `"tabby-FF9500-00FF00-m-short-v1"`

Format breakdown:

- Pattern: `tabby`
- Color: `FF9500` (hex without #)
- Eye color: `00FF00` (hex without #)
- Size: `m` (s/m/l)
- Fur length: `short`
- Version: `v1`

With hat: `"pattern-color-eyeColor-size-furLength-hatType-hatBase-hatAccent-v1"`
