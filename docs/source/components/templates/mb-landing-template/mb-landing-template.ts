import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mbLandingTemplateStyles } from "./mb-landing-template.styles";

interface Frontmatter {
  title: string;
  description?: string;
}

/**
 * Landing page template component (section overview pages)
 */
@customElement("mb-landing-template")
export class MeowbaseLandingTemplate extends LitElement {
  static styles = mbLandingTemplateStyles;

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
      <div class="landing-layout">
        <slot name="sidebar"></slot>

        <div class="landing-main">
          <header class="landing-header">
            <h1>${fm.title}</h1>
            ${fm.description
              ? html`<p class="landing-description">
                  ${fm.description}
                </p>`
              : ""}
          </header>

          <main class="landing-content">
            <slot name="content"></slot>
          </main>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-landing-template": MeowbaseLandingTemplate;
  }
}
