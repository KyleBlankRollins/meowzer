import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { initializeDatabase, Meowbase } from "meowzer";
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
  meowbase: Meowbase | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.initializeDatabase();
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
    // Don't close the database - it's a singleton that may be used by other providers
    // The database will persist for the lifetime of the application
  }

  private async initializeDatabase() {
    try {
      const db = await initializeDatabase();
      this.meowbase = db;
      this.requestUpdate("meowbase");
    } catch (err) {
      console.error("Meowbase initialization error:", err);
    }
  }

  render() {
    // Always render slot to allow children to receive context when it becomes available
    return html`<slot></slot>`;
  }
}
