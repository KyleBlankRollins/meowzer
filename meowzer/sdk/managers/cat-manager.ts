import { MeowzerCat } from "../meowzer-cat.js";
import {
  buildCat,
  buildCatFromSeed,
  type CatSettings,
} from "../../meowkit/index.js";
import { Brain } from "../../meowbrain/index.js";
import { Cat } from "../../meowtion/cat.js";
import { InvalidSettingsError } from "../errors.js";
import type { CatMetadata } from "../../types/index.js";
import type { ConfigManager } from "../config.js";
import type { HookManager } from "./hook-manager.js";
import { LifecycleHook } from "./hook-manager.js";
import { generateId } from "../../meowkit/utils.js";

/**
 * Options for creating a new cat
 */
export interface CreateCatOptions {
  name?: string;
  description?: string;
  seed?: string;
  settings?: CatSettings;
  metadata?: CatMetadata;
}

/**
 * Options for finding cats
 */
export interface FindCatsOptions {
  name?: string;
  tags?: string[];
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  limit?: number;
}

/**
 * CatManager handles cat lifecycle and coordinates between
 * MeowKit (generation), MeowBrain (AI), Meowtion (animation), and storage.
 *
 * This is the primary interface for creating, retrieving, and managing cats.
 */
export class CatManager {
  private cats = new Map<string, MeowzerCat>();
  private hooks: HookManager;

  constructor(_config: ConfigManager, hooks: HookManager) {
    // Config will be used in future for default behaviors and boundaries
    this.hooks = hooks;
  }

  /**
   * Create a new cat with optional configuration
   *
   * @example
   * ```ts
   * const cat = await catManager.create({
   *   name: "Whiskers",
   *   description: "A friendly orange tabby",
   *   settings: { color: "orange", pattern: "tabby", ... }
   * });
   * ```
   */
  async create(options: CreateCatOptions = {}): Promise<MeowzerCat> {
    // Trigger beforeCreate hook
    await this.hooks._trigger(LifecycleHook.BEFORE_CREATE, {
      options,
    });

    // Generate ID
    const id = generateId();

    // Generate or use provided seed
    let seed: string;
    let protoCat;

    if (options.seed) {
      // Use provided seed
      seed = options.seed;
      protoCat = buildCatFromSeed(seed);
    } else if (options.settings) {
      // Generate from settings
      protoCat = buildCat(options.settings);
      seed = protoCat.seed;
    } else {
      // Generate random cat
      const randomSettings: CatSettings = {
        color:
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
            .toUpperCase(),
        eyeColor:
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
            .toUpperCase(),
        pattern: ["solid", "tabby", "calico", "tuxedo", "spotted"][
          Math.floor(Math.random() * 5)
        ] as any,
        size: ["small", "medium", "large"][
          Math.floor(Math.random() * 3)
        ] as any,
        furLength: ["short", "medium", "long"][
          Math.floor(Math.random() * 3)
        ] as any,
      };
      protoCat = buildCat(randomSettings);
      seed = protoCat.seed;
    }

    // Create Meowtion Cat for animation
    const meowtionCat = new Cat(protoCat);

    // Create MeowBrain for AI behavior
    const brain = new Brain(meowtionCat);

    // Create MeowzerCat wrapper
    const cat = new MeowzerCat({
      id,
      cat: meowtionCat,
      brain,
      seed,
      name: options.name,
      description: options.description,
      metadata: options.metadata,
    });

    // Register in memory
    this.cats.set(cat.id, cat);

    // Trigger afterCreate hook
    await this.hooks._trigger(LifecycleHook.AFTER_CREATE, {
      options,
      cat,
    });

    return cat;
  }

  /**
   * Create multiple cats at once
   *
   * @example
   * ```ts
   * const cats = await catManager.createMany([
   *   { name: "Whiskers" },
   *   { name: "Mittens" },
   *   { seed: "abc123" }
   * ]);
   * ```
   */
  async createMany(
    optionsArray: CreateCatOptions[]
  ): Promise<MeowzerCat[]> {
    const cats: MeowzerCat[] = [];
    for (const options of optionsArray) {
      const cat = await this.create(options);
      cats.push(cat);
    }
    return cats;
  }

  /**
   * Get a cat by ID
   *
   * Returns undefined if cat doesn't exist
   *
   * @example
   * ```ts
   * const cat = catManager.get("cat-123");
   * if (cat) {
   *   console.log(cat.name);
   * }
   * ```
   */
  get(id: string): MeowzerCat | undefined {
    return this.cats.get(id);
  }

  /**
   * Check if a cat exists
   *
   * @example
   * ```ts
   * if (catManager.has("cat-123")) {
   *   const cat = catManager.get("cat-123");
   * }
   * ```
   */
  has(id: string): boolean {
    return this.cats.has(id);
  }

  /**
   * Get all cats currently in memory
   *
   * @example
   * ```ts
   * const allCats = catManager.getAll();
   * console.log(`${allCats.length} cats in memory`);
   * ```
   */
  getAll(): MeowzerCat[] {
    return Array.from(this.cats.values());
  }

  /**
   * Find cats matching criteria
   *
   * @example
   * ```ts
   * // Find cats with "playful" tag
   * const playfulCats = catManager.find({ tags: ["playful"] });
   *
   * // Find cats sorted by creation date
   * const recentCats = catManager.find({
   *   sortBy: "createdAt",
   *   sortOrder: "desc",
   *   limit: 10
   * });
   * ```
   */
  find(options: FindCatsOptions = {}): MeowzerCat[] {
    let results = this.getAll();

    // Filter by name
    if (options.name) {
      const searchName = options.name.toLowerCase();
      results = results.filter((cat) =>
        cat.name?.toLowerCase().includes(searchName)
      );
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter((cat) => {
        const catTags =
          (cat.metadata.tags as string[] | undefined) || [];
        return options.tags!.some((tag) => catTags.includes(tag));
      });
    }

    // Sort
    if (options.sortBy) {
      const sortOrder = options.sortOrder || "asc";
      results.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (options.sortBy) {
          case "name":
            aVal = a.name || "";
            bVal = b.name || "";
            break;
          case "createdAt":
            aVal = a.createdAt;
            bVal = b.createdAt;
            break;
          case "updatedAt":
            aVal = a.updatedAt;
            bVal = b.updatedAt;
            break;
          default:
            return 0;
        }

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Limit
    if (options.limit && options.limit > 0) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Destroy a cat by ID
   *
   * This removes the cat from memory and stops all animations/AI processing.
   * Note: This does NOT delete from storage. Use storage.deleteCat() for that.
   *
   * @example
   * ```ts
   * await catManager.destroy("cat-123");
   * ```
   */
  async destroy(id: string): Promise<void> {
    const cat = this.get(id);
    if (!cat) {
      return; // Cat doesn't exist, nothing to do
    }

    // Trigger beforeDelete hook
    await this.hooks._trigger(LifecycleHook.BEFORE_DELETE, {
      catId: id,
      cat,
    });

    cat.destroy();
    this.cats.delete(id);

    // Trigger afterDelete hook
    await this.hooks._trigger(LifecycleHook.AFTER_DELETE, {
      catId: id,
    });
  }

  /**
   * Destroy multiple cats by ID
   *
   * @example
   * ```ts
   * await catManager.destroyMany(["cat-1", "cat-2", "cat-3"]);
   * ```
   */
  async destroyMany(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.destroy(id);
    }
  }

  /**
   * Destroy all cats and clean up resources
   *
   * @example
   * ```ts
   * await catManager.destroyAll();
   * ```
   */
  async destroyAll(): Promise<void> {
    const ids = Array.from(this.cats.keys());
    for (const id of ids) {
      await this.destroy(id);
    }
  }

  /**
   * Register a cat in memory (used by storage manager when loading)
   * @internal
   */
  _register(cat: MeowzerCat): void {
    if (this.cats.has(cat.id)) {
      throw new InvalidSettingsError(
        `Cat with id "${cat.id}" already registered`,
        {
          invalidFields: ["id"],
          providedValue: cat.id,
        }
      );
    }
    this.cats.set(cat.id, cat);
  }

  /**
   * Unregister a cat from memory (used by storage manager)
   * @internal
   */
  _unregister(id: string): void {
    this.cats.delete(id);
  }
}
