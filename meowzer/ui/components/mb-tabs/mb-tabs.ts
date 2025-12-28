import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../../shared/base-styles.js";
import { mbTabsStyles } from "./mb-tabs.style.js";

/**
 * A controlled tabs component for switching between different views.
 *
 * This is a controlled component - the parent manages which tab is active
 * and responds to tab-change events.
 *
 * @element mb-tabs
 *
 * @fires tab-change - Fired when a tab is clicked. Detail: { index: number, label: string }
 *
 * @csspart tabs-container - The container for all tabs
 * @csspart tab - Individual tab button
 * @csspart tab-active - Active tab button
 *
 * @example
 * ```html
 * <mb-tabs
 *   .tabs=${["Create", "Adopt"]}
 *   activeIndex=${0}
 *   @tab-change=${(e) => this.activeTab = e.detail.index}
 * ></mb-tabs>
 * ```
 */
@customElement("mb-tabs")
export class MbTabs extends LitElement {
  static styles = [baseStyles, mbTabsStyles];

  /**
   * Array of tab labels
   */
  @property({ type: Array })
  tabs: string[] = [];

  /**
   * Index of the currently active tab (controlled by parent)
   */
  @property({ type: Number })
  activeIndex = 0;

  /**
   * Whether tabs are disabled
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Size variant
   */
  @property({ type: String })
  size: "sm" | "md" | "lg" = "md";

  /**
   * Handle tab click
   */
  private handleTabClick(index: number, label: string) {
    if (this.disabled || index === this.activeIndex) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("tab-change", {
        detail: { index, label },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="mb-tabs" part="tabs-container" role="tablist">
        ${this.tabs.map(
          (label, index) => html`
            <button
              part=${index === this.activeIndex
                ? "tab tab-active"
                : "tab"}
              class=${[
                "mb-tabs__tab",
                `mb-tabs__tab--${this.size}`,
                index === this.activeIndex
                  ? "mb-tabs__tab--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="tab"
              aria-selected=${index === this.activeIndex}
              aria-disabled=${this.disabled}
              tabindex=${index === this.activeIndex ? 0 : -1}
              ?disabled=${this.disabled}
              @click=${() => this.handleTabClick(index, label)}
            >
              ${label}
            </button>
          `
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-tabs": MbTabs;
  }
}
