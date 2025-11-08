/**
 * CatAccessories Component
 *
 * Manages cat accessories (hats, future: outfits) and sprite updates.
 * This component handles visual customization of the cat.
 */

import type { Cat } from "../../meowtion/cat.js";
import type { HatType, HatData } from "../../types/index.js";
import { generateCatSVG, isValidColor } from "../../meowkit/index.js";
import { EventEmitter } from "../../utilities/event-emitter.js";

export type AccessoryEvent = "hatApplied" | "hatRemoved" | "hatUpdated";

export interface AccessoryEventData {
  catId: string;
  hat?: HatData;
}

/**
 * Component that manages cat accessories (hats, outfits, etc.)
 */
export class CatAccessories extends EventEmitter<AccessoryEvent> {
  private cat: Cat;
  private catId: string;

  constructor(cat: Cat, catId: string) {
    super();
    this.cat = cat;
    this.catId = catId;
  }

  /**
   * Add or update the cat's hat
   *
   * @param type - Type of hat ("beanie", "cowboy", or "baseball")
   * @param baseColor - Primary color of the hat
   * @param accentColor - Secondary color for details
   *
   * @example
   * ```ts
   * cat.accessories.addHat("beanie", "#FF0000", "#FFFF00");
   * ```
   */
  addHat(
    type: HatType,
    baseColor: string,
    accentColor: string
  ): void {
    this.validateColors(baseColor, accentColor);

    // Update appearance data
    if (!this.cat.protoCat.appearance.accessories) {
      this.cat.protoCat.appearance.accessories = {};
    }

    this.cat.protoCat.appearance.accessories.hat = {
      type,
      baseColor,
      accentColor,
    };

    // Regenerate SVG with hat
    this.updateSprite();

    // Emit event
    this.emit("hatApplied", {
      catId: this.catId,
      hat: { type, baseColor, accentColor },
    });
  }

  /**
   * Remove the cat's hat
   *
   * @example
   * ```ts
   * cat.accessories.removeHat();
   * ```
   */
  removeHat(): void {
    if (!this.hasHat()) return;

    // Remove hat from appearance data
    if (this.cat.protoCat.appearance.accessories) {
      delete this.cat.protoCat.appearance.accessories.hat;
    }

    // Regenerate SVG without hat
    this.updateSprite();

    // Emit event
    this.emit("hatRemoved", { catId: this.catId });
  }

  /**
   * Update the colors of the cat's current hat
   *
   * @param baseColor - New primary color
   * @param accentColor - New secondary color
   *
   * @example
   * ```ts
   * cat.accessories.updateHatColors("#0000FF", "#FF00FF");
   * ```
   */
  updateHatColors(baseColor: string, accentColor: string): void {
    if (!this.hasHat()) {
      return; // Silently return if cat has no hat
    }

    this.validateColors(baseColor, accentColor);

    // Update colors
    const hat = this.cat.protoCat.appearance.accessories!.hat!;
    hat.baseColor = baseColor;
    hat.accentColor = accentColor;

    // Regenerate SVG with updated colors
    this.updateSprite();

    // Emit event
    this.emit("hatUpdated", {
      catId: this.catId,
      hat: { ...hat },
    });
  }

  /**
   * Check if the cat has a hat
   *
   * @returns True if cat has a hat
   *
   * @example
   * ```ts
   * if (cat.accessories.hasHat()) {
   *   console.log("Cat is wearing a hat!");
   * }
   * ```
   */
  hasHat(): boolean {
    return !!this.cat.protoCat.appearance.accessories?.hat;
  }

  /**
   * Get the cat's current hat data
   *
   * @returns Hat data or undefined if cat has no hat
   *
   * @example
   * ```ts
   * const hat = cat.accessories.getHat();
   * if (hat) {
   *   console.log(`Cat has a ${hat.type} hat`);
   * }
   * ```
   */
  getHat(): HatData | undefined {
    const hat = this.cat.protoCat.appearance.accessories?.hat;
    return hat ? { ...hat } : undefined;
  }

  /**
   * Update the cat's sprite after appearance changes
   */
  private updateSprite(): void {
    // Regenerate SVG sprite with current appearance
    const newSpriteData = generateCatSVG(
      this.cat.protoCat.appearance,
      this.cat.protoCat.dimensions
    );

    // Update the ProtoCat's sprite data
    this.cat.protoCat.spriteData = newSpriteData;

    // Update the DOM element
    const svgElement = this.cat._internalCat.dom?.getSVG();
    if (svgElement && svgElement.parentElement) {
      // Create temporary container for new SVG
      const temp = document.createElement("div");
      temp.innerHTML = newSpriteData.svg;
      const newSVG = temp.firstElementChild as SVGElement;

      if (newSVG) {
        // Replace old SVG with new one
        svgElement.parentElement.replaceChild(newSVG, svgElement);
      }
    }
  }

  /**
   * Validate color strings
   */
  private validateColors(baseColor: string, accentColor: string): void {
    if (!isValidColor(baseColor)) {
      throw new Error(`Invalid base color: ${baseColor}`);
    }
    if (!isValidColor(accentColor)) {
      throw new Error(`Invalid accent color: ${accentColor}`);
    }
  }
}
