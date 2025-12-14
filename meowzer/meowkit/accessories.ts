/**
 * Hat and accessory SVG generation for cats
 */

import type { HatType } from "../types/index.js";
import { generateElementId } from "./utils.js";

/**
 * Generates a beanie hat SVG
 * Base color: Main knit portion
 * Accent color: Folded brim and pom-pom on top
 */
function generateBeanieHat(
  baseColor: string,
  accentColor: string,
  hatId: string
): string {
  return `
  <!-- Beanie Hat -->
  <g id="${hatId}">
    <!-- Main knit body (base color) -->
    <rect x="56" y="16" width="14" height="10" fill="${baseColor}"/>
    
    <!-- Folded brim (accent color) -->
    <rect x="56" y="14" width="14" height="3" fill="${accentColor}"/>
    
    <!-- Pom-pom on top (accent color) -->
    <circle cx="63" cy="14" r="2.5" fill="${accentColor}"/>
    
    <!-- Knit texture lines (darker shade) -->
    <line x1="58" y1="18" x2="68" y2="18" stroke="${baseColor}" stroke-width="0.5" opacity="0.6"/>
    <line x1="58" y1="21" x2="68" y2="21" stroke="${baseColor}" stroke-width="0.5" opacity="0.6"/>
    <line x1="58" y1="24" x2="68" y2="24" stroke="${baseColor}" stroke-width="0.5" opacity="0.6"/>
  </g>
  `.trim();
}

/**
 * Generates a cowboy hat SVG
 * Base color: Crown and brim
 * Accent color: Hat band around crown
 */
function generateCowboyHat(
  baseColor: string,
  accentColor: string,
  hatId: string
): string {
  return `
  <!-- Cowboy Hat -->
  <g id="${hatId}">
    <!-- Wide brim (base color) -->
    <ellipse cx="63" cy="22" rx="12" ry="3" fill="${baseColor}"/>
    
    <!-- Crown (base color) -->
    <rect x="58" y="12" width="10" height="10" fill="${baseColor}" rx="1"/>
    
    <!-- Crown top indent -->
    <path d="M 60 12 Q 63 14 66 12" fill="${baseColor}" stroke="${baseColor}" stroke-width="1"/>
    
    <!-- Hat band (accent color) -->
    <rect x="58" y="20" width="10" height="2" fill="${accentColor}"/>
    
    <!-- Brim shading -->
    <ellipse cx="63" cy="22" rx="11" ry="2.5" fill="${baseColor}" opacity="0.3"/>
    
    <!-- Crown shading -->
    <rect x="59" y="13" width="8" height="7" fill="black" opacity="0.1"/>
  </g>
  `.trim();
}

/**
 * Generates a baseball cap SVG (side profile view)
 * Base color: Cap crown
 * Accent color: Bill/visor
 * Cap faces right to match cat's profile orientation
 */
function generateBaseballCapHat(
  baseColor: string,
  accentColor: string,
  hatId: string
): string {
  return `
  <!-- Baseball Cap (Side Profile) -->
  <g id="${hatId}">
    <!-- Cap crown (base color) - side profile -->
    <path d="M 56 18 Q 56 14 60 14 Q 64 14 66 16 Q 68 18 68 20 L 68 22 L 56 22 Z" fill="${baseColor}"/>
    
    <!-- Bill/Visor extending forward (accent color) -->
    <path d="M 56 20 L 48 22 L 48 24 L 56 23 Z" fill="${accentColor}"/>
    
    <!-- Crown seam/panel line -->
    <line x1="60" y1="14" x2="60" y2="22" stroke="black" stroke-width="0.5" opacity="0.3"/>
    <line x1="64" y1="15" x2="64" y2="22" stroke="black" stroke-width="0.5" opacity="0.3"/>
    
    <!-- Bill curve and depth (accent color) -->
    <path d="M 56 21.5 L 49 23 L 49 24 L 56 22.5 Z" fill="${accentColor}" opacity="0.7"/>
    
    <!-- Bill shading/underside -->
    <path d="M 56 23 L 48 24 L 56 24 Z" fill="black" opacity="0.3"/>
    
    <!-- Crown shading -->
    <path d="M 57 16 Q 58 20 62 21 Q 66 20 67 18" fill="black" opacity="0.1"/>
    
    <!-- Top edge highlight -->
    <path d="M 58 14 Q 60 14 64 15" stroke="${baseColor}" stroke-width="0.5" opacity="0.5" fill="none"/>
  </g>
  `.trim();
}

/**
 * Main hat SVG generator dispatcher
 * Generates the appropriate hat SVG based on type
 */
export function generateHatSVG(
  type: HatType,
  baseColor: string,
  accentColor: string,
  catId?: string
): string {
  const hatId = generateElementId(catId || "cat", `hat-${type}`);

  switch (type) {
    case "beanie":
      return generateBeanieHat(baseColor, accentColor, hatId);
    case "cowboy":
      return generateCowboyHat(baseColor, accentColor, hatId);
    case "baseball":
      return generateBaseballCapHat(baseColor, accentColor, hatId);
    default:
      throw new Error(`Unknown hat type: ${type}`);
  }
}

/**
 * Gets the element ID that will be used for a hat
 * @internal - For internal package use only
 */
export function getHatElementId(
  type: HatType,
  catId?: string
): string {
  return generateElementId(catId || "cat", `hat-${type}`);
}
