import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mbDocTemplateStyles } from "./mb-doc-template.styles";

interface Frontmatter {
  title: string;
  description?: string;
  banner?: string;
  previous?: string;
  next?: string;
}

/**
 * Documentation page template component
 */
@customElement("mb-doc-template")
export class MeowbaseDocTemplate extends LitElement {
  static styles = mbDocTemplateStyles;

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
      <div class="doc-layout">
        <slot name="sidebar"></slot>

        <div class="doc-main">
          ${fm.banner
            ? html`<div class="doc-banner">${fm.banner}</div>`
            : ""}

          <header class="doc-header">
            <h1>${fm.title}</h1>
            ${fm.description
              ? html`<p class="doc-description">${fm.description}</p>`
              : ""}
          </header>

          <article class="doc-content">
            <slot name="content"></slot>
          </article>

          ${fm.previous || fm.next
            ? html`
                <nav class="doc-navigation">
                  ${fm.previous
                    ? html`<a href=${fm.previous} class="doc-nav-prev"
                        >← Previous</a
                      >`
                    : ""}
                  ${fm.next
                    ? html`<a href=${fm.next} class="doc-nav-next"
                        >Next →</a
                      >`
                    : ""}
                </nav>
              `
            : ""}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-doc-template": MeowbaseDocTemplate;
  }
}
