# Component Audit

**Date**: November 27, 2025  
**Purpose**: Audit all UI components for usage and adherence to scaffold reference patterns  
**Reference**: `meowzer/ui/components/mb-button/SCAFFOLD-REFERENCE.md`

---

## Summary

**Total Components**: 27 (28 directories including `meowzer-cat-element` which is empty)

### Adherence to Scaffold Reference

| Category                                   | Count | Percentage |
| ------------------------------------------ | ----- | ---------- |
| ✅ Fully Compliant (all 4 files + README)  | 15    | 56%        |
| ⚠️ Partially Compliant (missing 1-2 files) | 0     | 0%         |
| ❌ Non-Compliant (missing 3+ files)        | 12    | 44%        |

### Required Files per Scaffold Reference

- `component-name.ts` (component logic)
- `component-name.style.ts` (component styles)
- `component-name.test.ts` (unit tests)
- `component-name.stories.ts` (Storybook documentation)
- `README.md` (API documentation)

---

## Component Breakdown

### Phase 1: Core Components (3/3) ✅

#### 1. mb-button ✅ FULLY COMPLIANT - REFERENCE

**Status**: In use (7+ locations)  
**Files**: ✅ All required files present

- ✅ mb-button.ts
- ✅ mb-button.style.ts
- ✅ mb-button.test.ts (16 tests)
- ✅ mb-button.stories.ts (9 stories)
- ✅ README.md
- ✅ SCAFFOLD-REFERENCE.md

**Usage**:

- mb-playground-toolbar (7 instances)
- mb-cat-playground (multiple dialogs)
- cat-creator (navigation buttons)
- cat-personality-picker (preset buttons)
- mb-wardrobe-dialog (action buttons)

**Notes**: This is the reference component that all others should follow.

---

#### 2. mb-loading ✅ FULLY COMPLIANT

**Status**: In use (2 locations)  
**Files**: ✅ All required files present

- ✅ mb-loading.ts
- ✅ mb-loading.style.ts
- ✅ mb-loading.test.ts (11 tests)
- ✅ mb-loading.stories.ts
- ✅ README.md

**Usage**:

- mb-cat-playground (loading state)
- cat-preview (rendering state)

---

#### 3. mb-tag ✅ FULLY COMPLIANT

**Status**: In use (Storybook only)  
**Files**: ✅ All required files present

- ✅ mb-tag.ts
- ✅ mb-tag.style.ts
- ✅ mb-tag.test.ts (13 tests)
- ✅ mb-tag.stories.ts
- ✅ README.md

**Usage**: Currently only demonstrated in Storybook, no production usage found.

---

### Phase 2: Form Controls (5/5) ✅

#### 4. mb-text-input ✅ FULLY COMPLIANT

**Status**: In use (2 locations)  
**Files**: ✅ All required files present

- ✅ mb-text-input.ts
- ✅ mb-text-input.style.ts
- ✅ mb-text-input.test.ts (28 tests)
- ✅ mb-text-input.stories.ts
- ✅ README.md

**Usage**:

- mb-cat-playground (name input in dialogs)
- cat-creator → basic-info-section (cat name)

---

#### 5. mb-textarea ✅ FULLY COMPLIANT

**Status**: In use (1 location)  
**Files**: ✅ All required files present

- ✅ mb-textarea.ts
- ✅ mb-textarea.style.ts
- ✅ mb-textarea.test.ts (33 tests)
- ✅ mb-textarea.stories.ts
- ✅ README.md

**Usage**:

- cat-creator → basic-info-section (cat description)

---

#### 6. mb-checkbox ✅ FULLY COMPLIANT

**Status**: In use (1 location)  
**Files**: ✅ All required files present

- ✅ mb-checkbox.ts
- ✅ mb-checkbox.style.ts
- ✅ mb-checkbox.test.ts (27 tests)
- ✅ mb-checkbox.stories.ts
- ✅ README.md

**Usage**:

- cat-creator (random generation options)

---

#### 7. mb-slider ✅ FULLY COMPLIANT

**Status**: In use (1 location, 5 instances)  
**Files**: ✅ All required files present

- ✅ mb-slider.ts
- ✅ mb-slider.style.ts
- ✅ mb-slider.test.ts (24 tests)
- ✅ mb-slider.stories.ts
- ✅ README.md

**Usage**:

- cat-personality-picker (5 trait sliders: curiosity, energy, playfulness, sociability, independence)

---

#### 8. mb-select ✅ FULLY COMPLIANT

**Status**: Registered but rarely used  
**Files**: ✅ All required files present

- ✅ mb-select.ts
- ✅ mb-select.style.ts
- ✅ mb-select.test.ts (27 tests)
- ✅ mb-select.stories.ts
- ✅ README.md

**Usage**: Exported but no production usage found in codebase.

---

### Phase 3: Complex Components (3/3) ✅

#### 9. mb-modal ✅ FULLY COMPLIANT

**Status**: In use (2 locations, multiple instances)  
**Files**: ✅ All required files present

- ✅ mb-modal.ts
- ✅ mb-modal.style.ts
- ✅ mb-modal.test.ts (30 tests)
- ✅ mb-modal.stories.ts
- ✅ README.md

**Usage**:

- mb-cat-playground (rename, creator, statistics dialogs)
- mb-wardrobe-dialog (hat selection modal)

---

#### 10. mb-notification ✅ FULLY COMPLIANT

**Status**: In use (1 location)  
**Files**: ✅ All required files present

- ✅ mb-notification.ts
- ✅ mb-notification.style.ts
- ✅ mb-notification.test.ts (33 tests)
- ✅ mb-notification.stories.ts
- ✅ README.md

**Usage**:

- cat-creator (validation errors, success messages)

---

#### 11. mb-icon ✅ FULLY COMPLIANT

**Status**: Registered but minimal usage  
**Files**: ✅ All required files present

- ✅ mb-icon.ts
- ✅ mb-icon.style.ts
- ✅ mb-icon.test.ts (18 tests)
- ✅ mb-icon.stories.ts
- ✅ README.md

**Usage**: Exported but no direct production usage found (icons are embedded in other components).

---

### Phase 4: Specialized Components (4/4) ✅

#### 12. mb-color-picker ✅ FULLY COMPLIANT

**Status**: In use (2 locations)  
**Files**: ✅ All required files present

- ✅ mb-color-picker.ts
- ✅ mb-color-picker.style.ts
- ✅ mb-color-picker.test.ts (45 tests)
- ✅ mb-color-picker.stories.ts
- ✅ README.md

**Usage**:

- cat-creator → appearance-section (fur color, eye color)
- mb-wardrobe-dialog (base color, accent color)

---

#### 13. mb-tooltip ✅ FULLY COMPLIANT

**Status**: Registered but no usage  
**Files**: ✅ All required files present

- ✅ mb-tooltip.ts
- ✅ mb-tooltip.style.ts
- ✅ mb-tooltip.test.ts (32 tests)
- ✅ mb-tooltip.stories.ts
- ✅ README.md

**Usage**: Exported but no production usage found.

---

#### 14. mb-accordion ✅ FULLY COMPLIANT

**Status**: Registered but no usage  
**Files**: ✅ All required files present

- ✅ mb-accordion.ts
- ✅ mb-accordion-item.ts
- ✅ mb-accordion.style.ts
- ✅ mb-accordion.test.ts (37 tests)
- ✅ mb-accordion.stories.ts
- ✅ README.md

**Usage**: Exported but no production usage found.

---

#### 15. mb-popover ✅ FULLY COMPLIANT

**Status**: Registered but no usage  
**Files**: ✅ All required files present

- ✅ mb-popover.ts
- ✅ mb-popover.style.ts
- ✅ mb-popover.test.ts (35 tests)
- ✅ mb-popover.stories.ts
- ✅ README.md

**Usage**: Exported but no production usage found.

---

### Feature Components (12 components)

#### 16. cat-creator ❌ NON-COMPLIANT

**Status**: In use (Storybook + exported)  
**Files**: ❌ Missing test, stories in `/stories` folder, no README

- ✅ cat-creator.ts
- ✅ cat-creator.style.ts
- ❌ cat-creator.test.ts (MISSING)
- ⚠️ CatCreator.stories.ts (in `/stories` folder, not component folder)
- ❌ README.md (MISSING)
- ℹ️ Has `partials/` subfolder (basic-info-section, appearance-section)

**Usage**:

- Exported from index.ts
- Used in Storybook stories
- Integrated in mb-cat-playground

**Recommendation**: Add test file and README. Consider moving story to component folder.

---

#### 17. cat-personality-picker ❌ NON-COMPLIANT

**Status**: In use (1 location)  
**Files**: ❌ Missing test, stories in `/stories` folder, no README

- ✅ cat-personality-picker.ts
- ✅ cat-personality-picker.style.ts
- ❌ cat-personality-picker.test.ts (MISSING)
- ⚠️ CatPersonalityPicker.stories.ts (in `/stories` folder)
- ❌ README.md (MISSING)

**Usage**:

- cat-creator (personality selection step)

**Recommendation**: Add test file and README. Consider moving story to component folder.

---

#### 18. cat-preview ❌ NON-COMPLIANT

**Status**: In use (1 location)  
**Files**: ❌ Missing test, stories in `/stories` folder, no README

- ✅ cat-preview.ts
- ✅ cat-preview.style.ts
- ❌ cat-preview.test.ts (MISSING)
- ⚠️ CatPreview.stories.ts (in `/stories` folder)
- ❌ README.md (MISSING)

**Usage**:

- cat-creator (preview step)

**Recommendation**: Add test file and README. Consider moving story to component folder.

---

#### 19. cat-statistics ❌ NON-COMPLIANT

**Status**: In use (1 location)  
**Files**: ❌ Missing test, stories, README

- ✅ cat-statistics.ts
- ✅ cat-statistics.style.ts
- ❌ cat-statistics.test.ts (MISSING)
- ❌ cat-statistics.stories.ts (MISSING)
- ❌ README.md (MISSING)

**Usage**:

- mb-cat-playground (statistics dialog)

**Recommendation**: Add test file, Storybook stories, and README.

---

#### 20. mb-cat-playground ❌ NON-COMPLIANT

**Status**: In use (primary feature component)  
**Files**: ❌ Missing test, stories in `/stories` folder, no README

- ✅ mb-cat-playground.ts (636 lines)
- ✅ mb-cat-playground.style.ts
- ❌ mb-cat-playground.test.ts (MISSING)
- ⚠️ MbCatPlayground.stories.ts (in `/stories` folder)
- ❌ README.md (MISSING)

**Usage**:

- Primary exported component
- Used in Storybook
- Drop-in playground for cats

**Recommendation**: Add test file and README. This is a critical component that should be fully documented.

---

#### 21. mb-wardrobe-dialog ❌ NON-COMPLIANT

**Status**: In use (1 location)  
**Files**: ❌ Missing test, stories, README

- ✅ mb-wardrobe-dialog.ts (307 lines)
- ✅ mb-wardrobe-dialog.style.ts
- ❌ mb-wardrobe-dialog.test.ts (MISSING)
- ❌ mb-wardrobe-dialog.stories.ts (MISSING)
- ❌ README.md (MISSING)

**Usage**:

- mb-cat-playground (hat customization)

**Recommendation**: Add test file, Storybook stories, and README.

---

#### 22. mb-cat-context-menu ❌ NON-COMPLIANT

**Status**: Usage unclear  
**Files**: ❌ Missing test, stories, README

- ✅ mb-cat-context-menu.ts
- ✅ mb-cat-context-menu.style.ts
- ❌ mb-cat-context-menu.test.ts (MISSING)
- ❌ mb-cat-context-menu.stories.ts (MISSING)
- ❌ README.md (MISSING)

**Usage**: Exported but no clear usage found in grep search.

**Recommendation**: Verify if this component is still needed. If yes, add missing files. If not, consider removing.

---

#### 23. mb-playground-toolbar ❌ NON-COMPLIANT

**Status**: In use (1 location)  
**Files**: ❌ Missing test, stories, README

- ✅ mb-playground-toolbar.ts
- ✅ mb-playground-toolbar.style.ts
- ❌ mb-playground-toolbar.test.ts (MISSING)
- ❌ mb-playground-toolbar.stories.ts (MISSING)
- ❌ README.md (MISSING)

**Usage**:

- mb-cat-playground (vertical toolbar with interaction buttons)

**Recommendation**: Add test file, Storybook stories, and README.

---

#### 24. mb-yarn-visual ❌ NON-COMPLIANT

**Status**: In use (1 location)  
**Files**: ❌ Missing test, stories, README

- ✅ mb-yarn-visual.ts (206 lines)
- ✅ mb-yarn-visual.style.ts
- ❌ mb-yarn-visual.test.ts (MISSING)
- ❌ mb-yarn-visual.stories.ts (MISSING)
- ❌ README.md (MISSING)

**Usage**:

- mb-cat-playground (yarn interaction animation)

**Recommendation**: Add test file, Storybook stories, and README.

---

#### 25. mb-need-visual ❌ NON-COMPLIANT

**Status**: In use (1 location)  
**Files**: ❌ Missing test, stories, README

- ✅ mb-need-visual.ts (265 lines)
- ✅ mb-need-visual.style.ts
- ❌ mb-need-visual.test.ts (MISSING)
- ❌ mb-need-visual.stories.ts (MISSING)
- ❌ README.md (MISSING)

**Usage**:

- mb-cat-playground (food/water interaction animation)

**Recommendation**: Add test file, Storybook stories, and README.

---

#### 26. mb-laser-visual ❌ NON-COMPLIANT

**Status**: In use (1 location)  
**Files**: ❌ Missing test, stories, README

- ✅ mb-laser-visual.ts (143 lines)
- ✅ mb-laser-visual.style.ts
- ❌ mb-laser-visual.test.ts (MISSING)
- ❌ mb-laser-visual.stories.ts (MISSING)
- ❌ README.md (MISSING)

**Usage**:

- mb-cat-playground (laser interaction animation)

**Recommendation**: Add test file, Storybook stories, and README.

---

#### 27. meowzer-cat-element ❌ EMPTY/DEPRECATED

**Status**: ⚠️ Empty directory  
**Files**: ❌ No files present

**Recommendation**: **DELETE THIS DIRECTORY**. It appears to be deprecated or a leftover from refactoring.

---

## Analysis & Recommendations

### Usage Patterns

**Actively Used Components (18)**:

- All Phase 1-4 components (15 fully compliant)
- cat-creator, cat-personality-picker, cat-preview
- mb-cat-playground, mb-wardrobe-dialog, mb-playground-toolbar
- mb-yarn-visual, mb-need-visual, mb-laser-visual

**Unused/Storybook Only (4)**:

- mb-tag (Storybook only)
- mb-tooltip, mb-accordion, mb-popover (exported but not used)
- mb-icon (exported but icons embedded elsewhere)

**Unknown/Deprecated (2)**:

- mb-cat-context-menu (usage unclear)
- meowzer-cat-element (empty directory)

### Compliance Issues

**Missing Test Files (12 components)**:

- All feature components lack unit tests
- Visual components (yarn, need, laser) lack tests
- This represents significant technical debt

**Missing README Files (12 components)**:

- Same components missing tests also lack documentation
- Makes onboarding and API understanding difficult

**Missing Storybook Stories (7 components)**:

- cat-statistics, mb-wardrobe-dialog, mb-playground-toolbar
- mb-cat-context-menu
- mb-yarn-visual, mb-need-visual, mb-laser-visual

**Stories in Wrong Location (3 components)**:

- cat-creator, cat-personality-picker, cat-preview
- Stories are in `/stories` folder instead of component folder
- Violates scaffold reference pattern

### Priority Actions

#### High Priority (Critical Path)

1. **Delete `meowzer-cat-element`** - Empty directory, no longer needed
2. **Add tests for `mb-cat-playground`** - Most critical feature component
3. **Add README for `mb-cat-playground`** - Document primary API
4. **Add tests for `cat-creator`** - Core feature component
5. **Add README for `cat-creator`** - Document creation workflow

#### Medium Priority (Active Components)

6. Add tests + README for:

   - mb-wardrobe-dialog
   - mb-playground-toolbar
   - cat-personality-picker
   - cat-preview
   - cat-statistics

7. Add Storybook stories for:
   - mb-wardrobe-dialog
   - mb-playground-toolbar
   - cat-statistics

#### Low Priority (Visual/Animation Components)

8. Add tests + stories + README for:

   - mb-yarn-visual
   - mb-need-visual
   - mb-laser-visual

9. Move stories to component folders:
   - cat-creator
   - cat-personality-picker
   - cat-preview

#### Evaluation Needed

10. **Determine fate of unused components**:

    - Keep mb-tooltip, mb-accordion, mb-popover for future use?
    - Remove if not needed to reduce maintenance burden
    - Keep mb-tag as demo component or find usage

11. **Investigate mb-cat-context-menu**:
    - Is this component still needed?
    - If yes, add missing files
    - If no, remove it

### Test Coverage Goal

**Current**: 15/27 components have tests (56%)  
**Target**: 25/27 components have tests (93%)  
**Excluded**: meowzer-cat-element (delete), mb-cat-context-menu (evaluate)

### Documentation Coverage Goal

**Current**: 15/27 components have README (56%)  
**Target**: 25/27 components have README (93%)  
**Excluded**: Same as test coverage

---

## Scaffold Reference Compliance Checklist

Based on `mb-button/SCAFFOLD-REFERENCE.md`, each component should have:

### Required Files

- [ ] `component-name.ts` - Component logic
- [ ] `component-name.style.ts` - Component styles
- [ ] `component-name.test.ts` - Unit tests (Vitest)
- [ ] `component-name.stories.ts` - Storybook documentation
- [ ] `README.md` - API documentation

### Code Patterns

- [ ] Uses `@customElement()` decorator
- [ ] Extends `LitElement`
- [ ] Properties use `@property()` decorator
- [ ] Styles imported from separate `.style.ts` file
- [ ] Exports in `components/index.ts`
- [ ] TypeScript declaration for `HTMLElementTagNameMap`

### Style Organization

- [ ] Base styles first
- [ ] Variants second
- [ ] Sizes third
- [ ] States last (hover, active, disabled, etc.)
- [ ] Uses semantic design tokens (not primitives)

### Testing

- [ ] Minimum 10+ tests per component
- [ ] Tests custom element registration
- [ ] Tests property values and reactivity
- [ ] Tests events and interactions
- [ ] Tests accessibility (ARIA, keyboard nav)
- [ ] Tests CSS parts exposure

### Documentation (README)

- [ ] Features list
- [ ] Usage examples
- [ ] API documentation (properties, slots, events, CSS parts)
- [ ] Design tokens used
- [ ] Accessibility notes

### Accessibility

- [ ] Proper ARIA attributes
- [ ] Focus indicators
- [ ] Keyboard support
- [ ] Semantic HTML
- [ ] Screen reader friendly

---

## Next Steps

1. ✅ **Immediate**: Delete `meowzer-cat-element` directory
2. 🔴 **Week 1**: Add tests + README for mb-cat-playground and cat-creator
3. 🟡 **Week 2**: Add missing files for wardrobe-dialog, playground-toolbar, and statistics
4. 🟡 **Week 3**: Complete visual components (yarn, need, laser)
5. 🟢 **Week 4**: Evaluate unused components and clean up
6. 🟢 **Week 5**: Move stories from `/stories` to component folders

**Goal**: Achieve 90%+ compliance with scaffold reference by end of month.
