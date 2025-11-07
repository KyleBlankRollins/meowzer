/**
 * Cat appearance and visual properties (Meowkit)
 */

/**
 * Fur pattern types
 */
export type CatPattern =
  | "solid"
  | "tabby"
  | "calico"
  | "tuxedo"
  | "spotted";

/**
 * Size categories
 */
export type CatSize = "small" | "medium" | "large";

/**
 * Fur length styles
 */
export type FurLength = "short" | "medium" | "long";

/**
 * Hat types available for cats
 */
export type HatType = "beanie" | "cowboy" | "baseball";

/**
 * Base accessory properties
 */
export interface BaseAccessory {
  baseColor: string;
  accentColor: string;
}

/**
 * Hat accessory data
 */
export interface HatAccessory extends BaseAccessory {
  type: HatType;
}

/**
 * Data for a cat's hat
 */
export interface HatData {
  type: HatType;
  baseColor: string;
  accentColor: string;
}

/**
 * Accessory settings for cat customization
 */
export interface AccessorySettings {
  hat?: {
    type: HatType;
    baseColor: string;
    accentColor: string;
  };
}

/**
 * Settings for creating a cat's appearance
 */
export interface CatSettings {
  color: string;
  eyeColor: string;
  pattern: CatPattern;
  size: CatSize;
  furLength: FurLength;
}

/**
 * Derived appearance properties
 */
export interface AppearanceData {
  color: string;
  eyeColor: string;
  pattern: CatPattern;
  furLength: FurLength;
  shadingColor: string;
  highlightColor: string;
  accessories?: {
    hat?: {
      type: HatType;
      baseColor: string;
      accentColor: string;
    };
  };
}

/**
 * Size and hitbox information
 */
export interface DimensionData {
  size: CatSize;
  width: number;
  height: number;
  scale: number;
  hitbox: {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  };
}

/**
 * SVG element references for animation
 */
export interface SVGElements {
  body: string;
  head: string;
  ears: string[];
  eyes: string[];
  tail: string;
  legs?: string[];
  pattern?: string[];
  hat?: string;
}

/**
 * Generated SVG sprite data
 */
export interface SpriteData {
  svg: string;
  elements: SVGElements;
  viewBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Complete cat prototype before instantiation
 */
export interface ProtoCat {
  id: string;
  name?: string;
  seed: string;
  appearance: AppearanceData;
  dimensions: DimensionData;
  spriteData: SpriteData;
  metadata: {
    createdAt: Date;
    version: string;
  };
}

/**
 * Validation result for cat settings
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
