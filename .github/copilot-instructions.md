# Copilot Instructions for this Project

Generated code should always prioritize readability. For example, more verbose variable names are preferable to cryptic variable names. Do not attempt to make code shorter by using one or two letter variable or function names.

## Code style

Prioritize readable code over concision. Especially in the case of variable names. Variable names should be descriptive. Never use obscure one or two letter variable names unless there's a very good reason to do so.

## CSS

Generally, this project relies on Quiet UI's built-in CSS. There are a couple of high level things to always consider:

- NEVER use inline CSS styles. All CSS styles should live in dedicated style files or be Quiet UI classes.
- NEVER use fallback values in `var()`. We need to make sure what we pass to `var()` works. Fallback values make debugging significantly harder.

## Web components

This project uses a mix of Quiet UI and Lit Element. Quiet UI is preferred whenever possible. However, we sometimes need to use Lit Element when Quiet UI doesn't provide what we need. For example, when we need to use providers and context.

### Quiet UI

When asked about web components or projects, refer to the Quiet UI `llms.txt` file. The file is located at this path: `node_modules/@quietui/quiet/dist/llms.txt`.

### LitElement Component Conventions

All components use **Lit Element** with **Shadow DOM**:

#### Component Structure

```
src/components/
├── component-name/
│   ├── component-name.ts       # Component logic
│   └── component-name.style.ts # Dedicated styles
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
