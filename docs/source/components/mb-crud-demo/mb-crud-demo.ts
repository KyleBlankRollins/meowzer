import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { mbCrudDemoStyles } from "./mb-crud-demo.styles";

// Import Meowbase from the local package
import { Meowbase } from "meowbase";
import type { Cat } from "meowbase/types";

/**
 * Interactive CRUD demo component for Meowbase
 */
@customElement("mb-crud-demo")
export class MeowbaseCrudDemo extends LitElement {
  static styles = mbCrudDemoStyles;

  // Meowbase instance
  private db = new Meowbase();
  private readonly COLLECTION_NAME = "demo-cats";

  // Component state
  @state()
  private cats: Cat[] = [];

  @state()
  private editingId: string | null = null;

  @state()
  private formData = {
    name: "",
    image: "",
    description: "",
  };

  @state()
  private message = "";

  connectedCallback() {
    super.connectedCallback();
    this.initializeCollection();
  }

  private initializeCollection() {
    // Try to load existing collection
    let loadResult = this.db.loadCollection(this.COLLECTION_NAME);

    if (!loadResult.success) {
      // Collection doesn't exist, create it
      const createResult = this.db.createCollection(
        this.COLLECTION_NAME,
        []
      );
      if (!createResult.success) {
        this.message = `Error creating collection: ${createResult.message}`;
        return;
      }
      // Load the newly created collection
      loadResult = this.db.loadCollection(this.COLLECTION_NAME);
    }

    if (loadResult.success && loadResult.data) {
      this.cats = loadResult.data.children;
    }
  }

  private loadCats() {
    const result = this.db.loadCollection(this.COLLECTION_NAME);
    if (result.success && result.data) {
      this.cats = result.data.children;
    }
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    if (!this.formData.name || !this.formData.description) {
      this.message = "Please fill in name and description";
      return;
    }

    if (this.editingId) {
      // Update existing cat
      const existingCat = this.cats.find(
        (c) => c.id === this.editingId
      );
      if (!existingCat) {
        this.message = "Cat not found";
        return;
      }

      const updatedCat: Cat = {
        ...existingCat,
        name: this.formData.name,
        image: this.formData.image || existingCat.image,
        description: this.formData.description,
      };

      const result = this.db.updateCatInCollection(
        this.COLLECTION_NAME,
        updatedCat
      );

      if (result.success) {
        this.db.saveCollection(this.COLLECTION_NAME);
        this.message = `Updated ${this.formData.name}!`;
        this.editingId = null;
        this.loadCats();
      } else {
        this.message = `Error: ${result.message}`;
      }
    } else {
      // Create new cat
      const newCat: Cat = {
        id: crypto.randomUUID(),
        name: this.formData.name,
        image: this.formData.image || "🐱",
        birthday: new Date(),
        favoriteToy: {
          id: crypto.randomUUID(),
          name: "Toy Mouse",
          image: "🐭",
          type: "toy",
          description: "A simple toy mouse",
        },
        description: this.formData.description,
        currentEmotion: {
          id: crypto.randomUUID(),
          name: "Happy",
        },
        importantHumans: [],
      };

      const result = this.db.addCatToCollection(
        this.COLLECTION_NAME,
        newCat
      );

      if (result.success) {
        this.db.saveCollection(this.COLLECTION_NAME);
        this.message = `Added ${newCat.name}!`;
        this.loadCats();
      } else {
        this.message = `Error: ${result.message}`;
      }
    }

    this.resetForm();
  }

  private handleEdit(cat: Cat) {
    this.editingId = cat.id;
    this.formData = {
      name: cat.name,
      image: cat.image,
      description: cat.description,
    };
    this.message = "";
  }

  private handleDelete(catId: string) {
    const result = this.db.removeCatFromCollection(
      this.COLLECTION_NAME,
      catId
    );
    if (result.success) {
      this.db.saveCollection(this.COLLECTION_NAME);
      this.message = "Cat deleted successfully";
      this.loadCats();
    } else {
      this.message = `Error: ${result.message}`;
    }
  }

  private onCatEdit(e: CustomEvent) {
    this.handleEdit(e.detail.cat);
  }

  private onCatDelete(e: CustomEvent) {
    this.handleDelete(e.detail.id);
  }

  private handleCancel() {
    this.resetForm();
    this.editingId = null;
    this.message = "";
  }

  private resetForm() {
    this.formData = {
      name: "",
      image: "",
      description: "",
    };
  }

  private handleInput(
    field: keyof typeof this.formData,
    value: string
  ) {
    this.formData = {
      ...this.formData,
      [field]: value,
    };
  }

  render() {
    return html`
      <div class="crud-demo">
        ${this.message
          ? html`<quiet-callout variant="primary" class="message">
              ${this.message}
            </quiet-callout>`
          : ""}

        <quiet-card class="form-card">
          <h3 slot="header">
            ${this.editingId ? "Edit Cat" : "Add New Cat"}
          </h3>

          <form @submit=${this.handleSubmit}>
            <quiet-text-field
              label="Name"
              .value=${this.formData.name}
              @quiet-input=${(e: CustomEvent) =>
                this.handleInput("name", (e.target as any).value)}
              required
            ></quiet-text-field>

            <quiet-text-field
              label="Image (emoji or URL)"
              .value=${this.formData.image}
              @quiet-input=${(e: CustomEvent) =>
                this.handleInput("image", (e.target as any).value)}
              placeholder="🐱"
            ></quiet-text-field>

            <quiet-text-field
              label="Description"
              .value=${this.formData.description}
              @quiet-input=${(e: CustomEvent) =>
                this.handleInput(
                  "description",
                  (e.target as any).value
                )}
              required
            ></quiet-text-field>

            <div class="form-actions" slot="footer">
              ${this.editingId
                ? html`
                    <quiet-button
                      type="button"
                      @click=${this.handleCancel}
                    >
                      Cancel
                    </quiet-button>
                    <quiet-button variant="primary" type="submit">
                      Update Cat
                    </quiet-button>
                  `
                : html`
                    <quiet-button variant="primary" type="submit">
                      Add Cat
                    </quiet-button>
                  `}
            </div>
          </form>
        </quiet-card>

        <div class="cats-list">
          <h3>All Cats (${this.cats.length})</h3>

          ${this.cats.length === 0
            ? html`
                <quiet-empty-state>
                  <quiet-icon
                    class="empty-icon"
                    slot="illustration"
                    name="mood-empty"
                  ></quiet-icon>
                  <h4>No cats yet</h4>
                  <p>Add your first cat using the form above.</p>
                </quiet-empty-state>
              `
            : html`
                <div
                  class="cats-grid"
                  @cat-edit=${this.onCatEdit}
                  @cat-delete=${this.onCatDelete}
                >
                  ${this.cats.map(
                    (cat) =>
                      html`<mb-cat-card .cat=${cat}></mb-cat-card>`
                  )}
                </div>
              `}
        </div>
      </div>
    `;
  }
}
