import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { initializeDatabase, closeDatabase, Meowbase } from "meowzer";
import { meowbaseContext } from "../../contexts/meowbase-context.js";
import { mbMeowbaseProviderStyles } from "./mb-meowbase-provider.styles";

/**
 * Meowbase Provider Component
 * Initializes and manages the Meowbase database instance via Meowzer SDK
 * Provides the database to child components via Lit context
 */
@customElement("mb-meowbase-provider")
export class MeowbaseProvider extends LitElement {
  static styles = mbMeowbaseProviderStyles;

  @provide({ context: meowbaseContext })
  @state()
  private meowbase: Meowbase | null = null;

  @state()
  private isInitialized = false;

  @state()
  private error: string | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.initializeDatabase();
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
    await closeDatabase();
  }

  private async initializeDatabase() {
    try {
      const db = await initializeDatabase();
      this.meowbase = db;
      this.isInitialized = true;
    } catch (err) {
      this.error = `Failed to initialize Meowbase: ${err}`;
      console.error("Meowbase initialization error:", err);
    }
  }

  render() {
    if (this.error) {
      return html`
        <div class="provider-error">
          <p><strong>Database Error:</strong> ${this.error}</p>
        </div>
      `;
    }

    if (!this.isInitialized || !this.meowbase) {
      return html`
        <div class="provider-loading">
          <p>Initializing database...</p>
        </div>
      `;
    }

    return html`<slot></slot>`;
  }
}
