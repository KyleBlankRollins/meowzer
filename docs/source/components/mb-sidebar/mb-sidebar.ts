import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mbSidebarStyles } from "./mb-sidebar.styles";

export interface NavItem {
  title: string;
  url: string;
  children?: NavItem[];
  isMeta?: boolean;
}

/**
 * Sidebar navigation component for Meowbase docs
 */
@customElement("mb-sidebar")
export class MeowbaseSidebar extends LitElement {
  static styles = mbSidebarStyles;

  @property({ type: Array })
  navigation?: NavItem[];

  @property({ type: String })
  currentUrl?: string;

  connectedCallback() {
    super.connectedCallback();

    // Read data from attributes (for SSR)
    const navigationData = this.getAttribute("data-navigation");
    if (navigationData) {
      try {
        // Decode HTML entities
        const decodedData = navigationData.replace(/&quot;/g, '"');
        this.navigation = JSON.parse(decodedData);
      } catch (e) {
        console.error("Failed to parse navigation data:", e);
        console.log("Raw navigation data:", navigationData);
      }
    }

    const currentUrlData = this.getAttribute("data-current-url");
    if (currentUrlData) {
      this.currentUrl = currentUrlData;
    }
  }

  render() {
    if (!this.navigation || this.navigation.length === 0) {
      return html``;
    }

    const currentUrl = this.currentUrl || "/";

    // Separate regular nav items from meta items
    const regularItems = this.navigation.filter(
      (item) => !item.isMeta
    );
    const metaItems = this.navigation.filter((item) => item.isMeta);

    // Determine current section from URL
    // e.g., /getting-started/installation → /getting-started
    const urlParts = currentUrl.split("/").filter(Boolean);
    const currentSection =
      urlParts.length > 0 ? `/${urlParts[0]}` : null;

    // Filter to show only children of the current section
    let sidebarItems: NavItem[] = [];

    if (currentSection) {
      // Find the section in navigation
      const section = regularItems.find(
        (item) => item.url === currentSection
      );

      if (section && section.children) {
        // Show only the children of the current section
        sidebarItems = section.children;
      }
    }

    return html`
      <nav>
        <ul class="nav-list">
          ${sidebarItems.map((item) =>
            this.renderNavItem(item, currentUrl)
          )}
        </ul>
        ${metaItems.length > 0
          ? html`
              <hr class="nav-divider" />
              <ul class="nav-list nav-meta">
                ${metaItems.map((item) =>
                  this.renderNavItem(item, currentUrl)
                )}
              </ul>
            `
          : ""}
      </nav>
    `;
  }

  private renderNavItem(
    item: NavItem,
    currentUrl: string,
    level = 0
  ): TemplateResult {
    const isActive = item.url === currentUrl;

    return html`
      <li class=${isActive ? "active" : ""}>
        <a href=${item.url}>${item.title}</a>
        ${item.children && item.children.length > 0
          ? html`
              <ul class="nav-children">
                ${item.children.map((child) =>
                  this.renderNavItem(child, currentUrl, level + 1)
                )}
              </ul>
            `
          : ""}
      </li>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-sidebar": MeowbaseSidebar;
  }
}
