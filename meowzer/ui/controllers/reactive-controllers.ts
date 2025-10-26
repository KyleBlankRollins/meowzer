/**
 * Reactive Controllers for Meowzer UI
 *
 * These controllers provide reactive state management similar to React hooks,
 * but designed for Lit's reactive controller system.
 */

import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { Meowzer, MeowzerCat } from "meowzer";

/**
 * CatsController - Manages a reactive list of all cats
 *
 * Subscribes to lifecycle hooks and automatically updates the host component
 * when cats are created or destroyed.
 *
 * Equivalent to useQuery() in Realm React.
 *
 * @example
 * ```typescript
 * class MyComponent extends LitElement {
 *   private catsController = new CatsController(this);
 *
 *   render() {
 *     return html`
 *       <div>Active Cats: ${this.catsController.cats.length}</div>
 *     `;
 *   }
 * }
 * ```
 */
export class CatsController implements ReactiveController {
  private host: ReactiveControllerHost;
  private meowzer?: Meowzer;

  /**
   * Array of all active cats
   */
  cats: MeowzerCat[] = [];

  private cleanupFns: (() => void)[] = [];

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    // Get Meowzer from context (assuming host has meowzer property)
    this.meowzer = (this.host as any).meowzer;

    if (this.meowzer) {
      // Subscribe to lifecycle hooks for cat creation/deletion
      const afterCreateId = this.meowzer.hooks.on(
        "afterCreate",
        (ctx) => {
          if (ctx.cat) {
            this.cats = [...this.cats, ctx.cat];
            this.host.requestUpdate();
          }
        }
      );

      const afterDeleteId = this.meowzer.hooks.on(
        "afterDelete",
        (ctx) => {
          this.cats = this.cats.filter(
            (c) => c.id !== (ctx as any).catId
          );
          this.host.requestUpdate();
        }
      );

      // Store cleanup functions
      this.cleanupFns.push(
        () => this.meowzer!.hooks.off(afterCreateId),
        () => this.meowzer!.hooks.off(afterDeleteId)
      );

      // Initial load
      this.cats = this.meowzer.cats.getAll();
    }
  }

  hostDisconnected() {
    // Cleanup listeners
    this.cleanupFns.forEach((cleanup) => cleanup());
    this.cleanupFns = [];
  }
}

/**
 * CatController - Manages a single cat reactively
 *
 * Subscribes to a specific cat's events and updates the host
 * when the cat's state changes.
 *
 * Equivalent to useObject() in Realm React.
 *
 * @example
 * ```typescript
 * class CatCard extends LitElement {
 *   @property() catId!: string;
 *   private catController?: CatController;
 *
 *   updated(changed) {
 *     if (changed.has('catId')) {
 *       this.catController = new CatController(this, this.catId);
 *     }
 *   }
 *
 *   render() {
 *     const cat = this.catController?.cat;
 *     return html`<div>${cat?.name}</div>`;
 *   }
 * }
 * ```
 */
export class CatController implements ReactiveController {
  private host: ReactiveControllerHost;
  private meowzer?: Meowzer;
  private _catId: string;

  /**
   * The cat instance (undefined if not found)
   */
  cat?: MeowzerCat;

  constructor(host: ReactiveControllerHost, catId: string) {
    this.host = host;
    this._catId = catId;
    host.addController(this);
  }

  hostConnected() {
    this.meowzer = (this.host as any).meowzer;

    if (this.meowzer) {
      this.cat = this.meowzer.cats.get(this._catId);

      if (this.cat) {
        // Subscribe to cat updates via the cat's event emitter
        this.cat.on("stateChange", this.handleUpdate);
        this.cat.on("behaviorChange", this.handleUpdate);
        this.cat.on("move", this.handleUpdate);
      }
    }
  }

  hostDisconnected() {
    if (this.cat) {
      this.cat.off("stateChange", this.handleUpdate);
      this.cat.off("behaviorChange", this.handleUpdate);
      this.cat.off("move", this.handleUpdate);
    }
  }

  private handleUpdate = () => {
    this.host.requestUpdate();
  };

  /**
   * Update the cat ID (useful when ID changes)
   */
  updateCatId(newCatId: string) {
    if (this._catId === newCatId) return;

    // Unsubscribe from old cat
    if (this.cat) {
      this.cat.off("stateChange", this.handleUpdate);
      this.cat.off("behaviorChange", this.handleUpdate);
      this.cat.off("move", this.handleUpdate);
    }

    // Subscribe to new cat
    this._catId = newCatId;
    if (this.meowzer) {
      this.cat = this.meowzer.cats.get(this._catId);
      if (this.cat) {
        this.cat.on("stateChange", this.handleUpdate);
        this.cat.on("behaviorChange", this.handleUpdate);
        this.cat.on("move", this.handleUpdate);
      }
    }

    this.host.requestUpdate();
  }
}

/**
 * StorageController - Manages storage and collections reactively
 *
 * Provides access to storage operations and keeps track of collections.
 * Auto-updates when collections are created, deleted, or modified.
 *
 * @example
 * ```typescript
 * class GalleryComponent extends LitElement {
 *   private storageController = new StorageController(this);
 *
 *   render() {
 *     return html`
 *       <div>Collections: ${this.storageController.collections.length}</div>
 *     `;
 *   }
 * }
 * ```
 */
export class StorageController implements ReactiveController {
  private host: ReactiveControllerHost;
  private meowzer?: Meowzer;

  /**
   * List of all collections in storage
   */
  collections: Array<{ id: string; name: string; catCount: number }> =
    [];

  /**
   * Current error if any
   */
  error?: Error;

  /**
   * Loading state
   */
  loading = false;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  async hostConnected() {
    this.meowzer = (this.host as any).meowzer;
    await this.refresh();
  }

  hostDisconnected() {
    // No cleanup needed currently
  }

  /**
   * Refresh collections list from storage
   */
  async refresh() {
    if (!this.meowzer?.storage) {
      this.collections = [];
      return;
    }

    this.loading = true;
    this.error = undefined;
    this.host.requestUpdate();

    try {
      this.collections =
        await this.meowzer.storage.listCollections();
    } catch (err) {
      this.error = err as Error;
      this.collections = [];
    } finally {
      this.loading = false;
      this.host.requestUpdate();
    }
  }

  /**
   * Create a new collection
   */
  async createCollection(name: string) {
    if (!this.meowzer?.storage) {
      throw new Error("Storage not available");
    }

    await this.meowzer.storage.createCollection(name);
    await this.refresh();
  }

  /**
   * Delete a collection
   */
  async deleteCollection(identifier: string) {
    if (!this.meowzer?.storage) {
      throw new Error("Storage not available");
    }

    await this.meowzer.storage.deleteCollection(identifier);
    await this.refresh();
  }

  /**
   * Get a collection info by identifier
   */
  async getCollectionInfo(identifier: string) {
    if (!this.meowzer?.storage) {
      throw new Error("Storage not available");
    }

    return await this.meowzer.storage.getCollectionInfo(identifier);
  }

  /**
   * Load cats from a collection
   */
  async loadCollection(identifier: string) {
    if (!this.meowzer?.storage) {
      throw new Error("Storage not available");
    }

    const cats = await this.meowzer.storage.loadCollection(identifier);

    await this.refresh();
    return cats;
  }

  /**
   * Save a cat to a collection
   */
  async saveCat(cat: MeowzerCat, collection?: string) {
    if (!this.meowzer?.storage) {
      throw new Error("Storage not available");
    }

    await this.meowzer.storage.saveCat(cat, { collection });
    await this.refresh();
  }
}
