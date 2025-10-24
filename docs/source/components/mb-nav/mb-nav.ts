import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mbNavStyles } from "./mb-nav.styles";

export interface NavLink {
  title: string;
  url: string;
}

/**
 * Top navigation bar component for Meowbase docs
 */
@customElement("mb-nav")
export class MeowbaseNav extends LitElement {
  static styles = mbNavStyles;

  @property({ type: Array })
  links?: NavLink[];

  @property({ type: String })
  currentUrl?: string;

  @property({ type: String })
  siteTitle?: string;

  connectedCallback() {
    super.connectedCallback();

    // Read data from attributes (for SSR)
    const linksData = this.getAttribute("data-links");
    if (linksData) {
      try {
        // Decode HTML entities
        const decodedData = linksData.replace(/&quot;/g, '"');
        this.links = JSON.parse(decodedData);
      } catch (e) {
        console.error("Failed to parse links data:", e);
        console.log("Raw links data:", linksData);
      }
    }

    const currentUrlData = this.getAttribute("data-current-url");
    if (currentUrlData) {
      this.currentUrl = currentUrlData;
    }

    const siteTitleData = this.getAttribute("data-site-title");
    if (siteTitleData) {
      this.siteTitle = siteTitleData;
    }
  }

  render() {
    return html`
      <nav class="top-nav">
        <div class="nav-links">
          ${(this.links || []).map(
            (link) => html`
              <a
                href=${link.url}
                class="nav-link ${this.isActive(link.url)
                  ? "active"
                  : ""}"
              >
                ${link.title}
              </a>
            `
          )}
        </div>

        <a href="/" class="site-title"
          >${this.siteTitle || "Meowbase Docs"}</a
        >
      </nav>
    `;
  }

  private isActive(url: string): boolean {
    const currentUrl = this.currentUrl || "/";
    // Check if current URL starts with the link URL
    // This makes section links active for all pages in that section
    if (url === "/") {
      return currentUrl === "/";
    }
    return currentUrl.startsWith(url);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-nav": MeowbaseNav;
  }
}
