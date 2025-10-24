import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mbHomeTemplateStyles } from "./mb-home-template.styles";

interface Frontmatter {
  title: string;
  description?: string;
}

/**
 * Home page template component
 */
@customElement("mb-home-template")
export class MeowbaseHomeTemplate extends LitElement {
  static styles = mbHomeTemplateStyles;

  @property({ type: Object })
  frontmatter?: Frontmatter;

  connectedCallback() {
    super.connectedCallback();

    const frontmatterData = this.getAttribute("data-frontmatter");
    if (frontmatterData) {
      try {
        const decodedData = frontmatterData.replace(/&quot;/g, '"');
        this.frontmatter = JSON.parse(decodedData);
      } catch (e) {
        console.error("Failed to parse frontmatter data:", e);
      }
    }
  }

  render() {
    const fm = this.frontmatter || { title: "", description: "" };

    return html`
      <div class="home-layout">
        <header class="home-header">
          <h1>${fm.title}</h1>
          ${fm.description
            ? html`<p class="home-description">${fm.description}</p>`
            : ""}
        </header>

        <main class="home-content">
          <slot name="content"></slot>
        </main>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-home-template": MeowbaseHomeTemplate;
  }
}
