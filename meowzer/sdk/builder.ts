import type { CreateCatOptions } from "./managers/cat-manager.js";
import type { CatSettings } from "../meowkit/index.js";
import type { CatMetadata } from "./types.js";

/**
 * Fluent builder for creating cats with better type inference
 *
 * @example
 * ```ts
 * const cat = await meowzer.cats.builder()
 *   .name("Whiskers")
 *   .description("A friendly orange tabby")
 *   .appearance({ color: "orange", pattern: "tabby" })
 *   .tag("playful")
 *   .tag("friendly")
 *   .create();
 * ```
 */
export class CatBuilder {
  private options: CreateCatOptions = {};

  /**
   * Set the cat's name
   */
  name(name: string): this {
    this.options.name = name;
    return this;
  }

  /**
   * Set the cat's description
   */
  description(description: string): this {
    this.options.description = description;
    return this;
  }

  /**
   * Set the cat's appearance using settings
   */
  appearance(settings: CatSettings): this {
    this.options.settings = settings;
    return this;
  }

  /**
   * Use a specific seed for the cat's appearance
   */
  fromSeed(seed: string): this {
    this.options.seed = seed;
    return this;
  }

  /**
   * Add a tag to the cat's metadata
   */
  tag(tag: string): this {
    if (!this.options.metadata) {
      this.options.metadata = {};
    }
    if (!this.options.metadata.tags) {
      this.options.metadata.tags = [];
    }
    (this.options.metadata.tags as string[]).push(tag);
    return this;
  }

  /**
   * Add multiple tags
   */
  tags(...tags: string[]): this {
    for (const tag of tags) {
      this.tag(tag);
    }
    return this;
  }

  /**
   * Set metadata field
   */
  meta<K extends string, V>(key: K, value: V): this {
    if (!this.options.metadata) {
      this.options.metadata = {};
    }
    this.options.metadata[key] = value;
    return this;
  }

  /**
   * Set all metadata at once
   */
  metadata(metadata: CatMetadata): this {
    this.options.metadata = metadata;
    return this;
  }

  /**
   * Get the built options without creating the cat
   * Useful for inspection or manual creation
   */
  build(): CreateCatOptions {
    return { ...this.options };
  }

  /**
   * Get the raw options reference
   * @internal
   */
  _getOptions(): CreateCatOptions {
    return this.options;
  }
}

/**
 * Generic metadata type helper
 *
 * Allows defining custom metadata types for better type safety
 *
 * @example
 * ```ts
 * interface CustomCatMetadata extends CatMetadata {
 *   adoptionDate?: Date;
 *   vetVisits?: Date[];
 *   favoriteToys?: string[];
 *   medicalNotes?: string;
 * }
 *
 * const cat = await meowzer.cats.create<CustomCatMetadata>({
 *   name: "Whiskers",
 *   metadata: {
 *     adoptionDate: new Date('2025-01-15'),
 *     favoriteToys: ["string", "laser pointer", "catnip mouse"],
 *     medicalNotes: "Regular checkups, no known allergies"
 *   }
 * });
 *
 * // Type-safe access
 * console.log(cat.metadata.adoptionDate); // Date | undefined
 * console.log(cat.metadata.favoriteToys); // string[] | undefined
 * ```
 */
export type WithMetadata<T extends CatMetadata = CatMetadata> = T;

/**
 * Typed cat creation options
 */
export type TypedCreateCatOptions<
  T extends CatMetadata = CatMetadata
> = Omit<CreateCatOptions, "metadata"> & {
  metadata?: T;
};
