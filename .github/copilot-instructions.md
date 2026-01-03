# Copilot Instructions for this Project

Generated code should always prioritize readability. For example, more verbose variable names are preferable to cryptic variable names. Do not attempt to make code shorter by using one or two letter variable or function names.

## Code style

Prioritize readable code over concision. Especially in the case of variable names. Variable names should be descriptive. Never use obscure one or two letter variable names unless there's a very good reason to do so.

## CSS

This project uses custom UI tokens and components. There are a couple of high level things to always consider:

- NEVER use inline CSS styles. All CSS styles should live in dedicated style files.
- NEVER use fallback values in `var()`. We need to make sure what we pass to `var()` works. Fallback values make debugging significantly harder.

## Web components

This project uses Lit Element for all web components.

### LitElement Component Conventions

All components use **Lit Element** with **Shadow DOM**:

#### Component Structure

```
src/components/
├── component-name/
│   ├── component-name.ts            # Component logic
│   ├── component-name.test.ts       # Unit tests (Vitest)
│   ├── component-name.stories.ts    # Storybook documentation
│   ├── component-name.style.ts      # Dedicated styles
│   └── README.md                    # API documentation
```

#### Naming Conventions

- **Custom element**: `mb-component-name` (kebab-case)
- **Component file**: `mb-component-name.ts`
- **Styles file**: `mb-component-name.style.ts`
- **Style export**: `componentNameStyles` (camelCase + "Styles")

#### Component Pattern

```typescript
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { componentNameStyles } from "./component-name.style.js";
import {
  typographyStyles,
  buttonStyles,
} from "../../styles/shared-styles.js";

@customElement("ga-component-name")
export class GaComponentName extends LitElement {
  @property({ type: String }) declare someProp: string;

  static styles = [
    typographyStyles,
    buttonStyles,
    componentNameStyles,
  ];

  render() {
    return html`<div>${this.someProp}</div>`;
  }
}
```

#### Component Registration

All components must be imported in `docs/source/main.ts` to be available globally.

#### Lit Element docs

- Component composition: https://lit.dev/docs/composition/component-composition/
- Context: https://lit.dev/docs/data/context/

## Backwards compatibility

We NEVER care about backwards compatibility. This is a greenfield project with 0 users. When implementing refactors or planning work, DO NOT spend any time thinking about backwards compatibility.

DO NOT deprecate features, APIs, or UI. We want to REMOVE any code related to older iterations.
