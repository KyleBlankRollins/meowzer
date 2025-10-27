import { generateId as meowkitGenerateId } from "../meowkit/utils.js";
import { buildCat, buildCatFromSeed } from "../meowkit/index.js";
import type { CatSettings, ProtoCat } from "../meowkit/index.js";

/**
 * Utility functions for working with cats and seeds
 */
export class MeowzerUtils {
  /**
   * Generate a unique ID
   *
   * @example
   * ```ts
   * const id = meowzer.utils.generateId();
   * console.log(id); // "cat-abc123"
   * ```
   */
  static generateId(): string {
    return meowkitGenerateId();
  }

  /**
   * Build a preview cat from settings without creating a MeowzerCat instance
   *
   * This is useful for previewing cat appearance before creation.
   * Returns a ProtoCat with SVG data that can be rendered directly.
   *
   * @param settings - Cat appearance settings
   * @returns ProtoCat with sprite data and metadata
   *
   * @example
   * ```ts
   * const preview = MeowzerUtils.buildPreview({
   *   color: "orange",
   *   pattern: "tabby",
   *   size: "medium",
   *   furLength: "short",
   *   eyeColor: "green"
   * });
   *
   * // Render the SVG
   * element.innerHTML = preview.spriteData.svg;
   * ```
   */
  static buildPreview(settings: CatSettings): ProtoCat {
    return buildCat(settings);
  }

  /**
   * Build a preview cat from a seed string
   *
   * @param seed - Seed string to build from
   * @returns ProtoCat with sprite data and metadata
   *
   * @example
   * ```ts
   * const preview = MeowzerUtils.buildPreviewFromSeed("abc123");
   * element.innerHTML = preview.spriteData.svg;
   * ```
   */
  static buildPreviewFromSeed(seed: string): ProtoCat {
    return buildCatFromSeed(seed);
  }

  /**
   * Generate a seed from cat settings
   *
   * @param settings - Cat appearance settings
   * @returns Generated seed string
   *
   * @example
   * ```ts
   * const seed = meowzer.utils.generateSeed({
   *   color: "orange",
   *   pattern: "tabby",
   *   size: "medium"
   * });
   * ```
   */
  static generateSeed(settings: CatSettings): string {
    const protoCat = buildCat(settings);
    return protoCat.seed;
  }

  /**
   * Validate a seed string
   *
   * @param seed - Seed to validate
   * @returns True if seed is valid
   *
   * @example
   * ```ts
   * if (meowzer.utils.validateSeed(userInput)) {
   *   const cat = await meowzer.cats.create({ seed: userInput });
   * }
   * ```
   */
  static validateSeed(seed: string): boolean {
    if (typeof seed !== "string" || seed.length === 0) {
      return false;
    }

    try {
      buildCatFromSeed(seed);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get seed representation of settings
   *
   * Useful for comparing or storing cat appearances
   *
   * @param seed - Seed to get info about
   * @returns Seed string (same as input, validated)
   *
   * @example
   * ```ts
   * const info = meowzer.utils.getSeedInfo("abc123");
   * console.log(info); // "abc123"
   * ```
   */
  static getSeedInfo(seed: string): string {
    const protoCat = buildCatFromSeed(seed);
    return protoCat.seed;
  }

  /**
   * Validate cat name
   *
   * @param name - Name to validate
   * @returns True if name is valid
   *
   * @example
   * ```ts
   * if (meowzer.utils.validateName(userInput)) {
   *   cat.setName(userInput);
   * }
   * ```
   */
  static validateName(name: string): boolean {
    if (typeof name !== "string") {
      return false;
    }

    const trimmed = name.trim();
    return trimmed.length > 0 && trimmed.length <= 100;
  }

  /**
   * Validate cat description
   *
   * @param description - Description to validate
   * @returns True if description is valid
   */
  static validateDescription(description: string): boolean {
    if (typeof description !== "string") {
      return false;
    }

    return description.length <= 1000;
  }

  /**
   * Sanitize cat name (trim, limit length)
   *
   * @param name - Name to sanitize
   * @returns Sanitized name
   *
   * @example
   * ```ts
   * const clean = meowzer.utils.sanitizeName("  Whiskers  ");
   * console.log(clean); // "Whiskers"
   * ```
   */
  static sanitizeName(name: string): string {
    if (typeof name !== "string") {
      return "";
    }

    const trimmed = name.trim();
    return trimmed.substring(0, 100);
  }

  /**
   * Sanitize cat description
   *
   * @param description - Description to sanitize
   * @returns Sanitized description
   */
  static sanitizeDescription(description: string): string {
    if (typeof description !== "string") {
      return "";
    }

    return description.substring(0, 1000);
  }

  /**
   * Generate random cat name
   *
   * @returns Random cat name
   *
   * @example
   * ```ts
   * const name = meowzer.utils.randomName();
   * console.log(name); // "Whiskers" or "Mittens" etc.
   * ```
   */
  static randomName(): string {
    const names = [
      "Biscuit",
      "Mochi",
      "Waffles",
      "Noodle",
      "Pepper",
      "Ginger",
      "Cookie",
      "Dumpling",
      "Pickles",
      "Nacho",
      "Taco",
      "Sushi",
      "Tofu",
      "Bean",
      "Pudding",
      "Muffin",
      "Peanut",
      "Butterscotch",
      "Marshmallow",
      "Cinnamon",
      "Honey",
      "Olive",
      "Basil",
      "Paprika",
      "Cayenne",
      "Luke Skywhisker",
      "Princess Leia Pawgana",
      "Obi-Wan Catnobi",
      "Darth Mewlius",
      "Han Solo-mon",
      "Chew-cat-ca",
      "Yoda",
      "Anakin Skywhisker",
      "Padmé Meowdala",
      "Mace Winpurr",
      "Qui-Gon Kitten",
      "Count Mewku",
      "Paw-patine",
      "Boba Fett-us",
      "Jango Fett-us",
      "Rey Skywhisker",
      "Kylo Ren",
      "Finn-egan",
      "Poe Damepurr",
      "BB-Cat",
      "R2-Mew2",
      "C-3PO-nce",
      "Meowbacca",
      "Lando Catissian",
      "Admiral Ackpurr",
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  /**
   * Format timestamp for display
   *
   * @param date - Date to format
   * @returns Formatted string
   *
   * @example
   * ```ts
   * const formatted = meowzer.utils.formatDate(cat.createdAt);
   * console.log(formatted); // "2025-10-25 14:30:00"
   * ```
   */
  static formatDate(date: Date): string {
    return date.toISOString().replace("T", " ").substring(0, 19);
  }

  /**
   * Calculate age of cat in days
   *
   * @param createdAt - Creation timestamp
   * @returns Age in days
   *
   * @example
   * ```ts
   * const age = meowzer.utils.getAge(cat.createdAt);
   * console.log(`${age} days old`);
   * ```
   */
  static getAge(createdAt: Date): number {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
