import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { catContextMenuStyles } from "./mb-cat-context-menu.style.js";
import type { MeowzerCat } from "meowzer";

/**
 * Cat Context Menu Component
 *
 * A context menu that appears when clicking on a cat in the playground.
 * Provides actions like rename, remove, and change hat.
 *
 * @example
 * ```html
 * <mb-cat-context-menu
 *   .cat=${myCat}
 *   ?open=${true}
 *   @cat-remove=${handleRemove}
 *   @cat-rename=${handleRename}
 *   @cat-change-hat=${handleChangeHat}
 * ></mb-cat-context-menu>
 * ```
 *
 * @fires cat-remove - Dispatched when user clicks "Remove"
 * @fires cat-rename - Dispatched when user clicks "Rename"
 * @fires cat-change-hat - Dispatched when user clicks "Change Hat"
 * @fires menu-close - Dispatched when menu should close
 */
@customElement("mb-cat-context-menu")
export class MbCatContextMenu extends LitElement {
  static styles = catContextMenuStyles;

  /**
   * The cat this menu is for
   */
  @property({ type: Object })
  cat?: MeowzerCat;

  /**
   * Whether the menu is open
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Left position in pixels
   */
  @property({ type: Number })
  left = 0;

  /**
   * Top position in pixels
   */
  @property({ type: Number })
  top = 0;

  /**
   * Click outside listener reference for cleanup
   */
  private clickOutsideListener?: (e: MouseEvent) => void;

  /**
   * Set up click-outside handler when menu opens
   */
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("open")) {
      if (this.open) {
        this.setupClickOutside();
        this.adjustPosition();
      } else {
        this.cleanupClickOutside();
      }
    }
  }

  /**
   * Adjust position to stay within viewport bounds
   */
  private adjustPosition() {
    // Wait for next frame to ensure menu is rendered
    requestAnimationFrame(() => {
      const menuRect = this.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedLeft = this.left;
      let adjustedTop = this.top;

      // Check right edge
      if (this.left + menuRect.width > viewportWidth) {
        adjustedLeft = viewportWidth - menuRect.width - 8; // 8px padding
      }

      // Check left edge
      if (adjustedLeft < 8) {
        adjustedLeft = 8;
      }

      // Check bottom edge
      if (this.top + menuRect.height > viewportHeight) {
        adjustedTop = viewportHeight - menuRect.height - 8; // 8px padding
      }

      // Check top edge
      if (adjustedTop < 8) {
        adjustedTop = 8;
      }

      // Apply adjusted position
      this.style.left = `${adjustedLeft}px`;
      this.style.top = `${adjustedTop}px`;
    });
  }

  /**
   * Cleanup on disconnect
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanupClickOutside();
  }

  /**
   * Setup click outside handler
   */
  private setupClickOutside() {
    // Remove any existing listener
    this.cleanupClickOutside();

    // Create new listener
    this.clickOutsideListener = (e: MouseEvent) => {
      // Check if click is outside this element
      const path = e.composedPath();
      if (!path.includes(this)) {
        this.handleClose();
      }
    };

    // Add listener on next tick to avoid closing immediately
    setTimeout(() => {
      if (this.clickOutsideListener) {
        document.addEventListener("click", this.clickOutsideListener);
      }
    }, 0);
  }

  /**
   * Cleanup click outside handler
   */
  private cleanupClickOutside() {
    if (this.clickOutsideListener) {
      document.removeEventListener(
        "click",
        this.clickOutsideListener
      );
      this.clickOutsideListener = undefined;
    }
  }

  /**
   * Handle menu item click
   */
  private handleAction(action: "remove" | "rename" | "change-hat") {
    this.dispatchEvent(
      new CustomEvent(`cat-${action}`, {
        detail: { cat: this.cat },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle menu close
   */
  private handleClose() {
    this.dispatchEvent(
      new CustomEvent("menu-close", {
        detail: { cat: this.cat },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.open || !this.cat) {
      return html``;
    }

    // Set initial position from properties
    this.style.left = `${this.left}px`;
    this.style.top = `${this.top}px`;

    return html`
      <div class="context-menu-content">
        <button
          class="menu-item normal"
          @click=${() => this.handleAction("rename")}
        >
          Rename
        </button>
        <button
          class="menu-item normal"
          @click=${() => this.handleAction("change-hat")}
        >
          Change Hat
        </button>
        <hr />
        <button
          class="menu-item destructive"
          @click=${() => this.handleAction("remove")}
        >
          Remove
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-cat-context-menu": MbCatContextMenu;
  }
}
