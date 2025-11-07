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
 * Generates a baseball cap SVG
 * Base color: Cap crown and bill
 * Accent color: Button on top and optional details
 */
function generateBaseballCapHat(
  baseColor: string,
  accentColor: string,
  hatId: string
): string {
  return `
  <!-- Baseball Cap -->
  <g id="${hatId}">
    <!-- Cap crown (base color) -->
    <path d="M 56 20 Q 56 14 63 14 Q 70 14 70 20 L 68 22 L 58 22 Z" fill="${baseColor}"/>
    
    <!-- Bill/Visor (base color) -->
    <path d="M 58 22 L 56 24 L 72 24 L 70 22 Z" fill="${baseColor}"/>
    
    <!-- Crown segments (darker lines) -->
    <line x1="60" y1="14" x2="60" y2="22" stroke="black" stroke-width="0.5" opacity="0.3"/>
    <line x1="63" y1="14" x2="63" y2="22" stroke="black" stroke-width="0.5" opacity="0.3"/>
    <line x1="66" y1="14" x2="66" y2="22" stroke="black" stroke-width="0.5" opacity="0.3"/>
    
    <!-- Top button (accent color) -->
    <circle cx="63" cy="14" r="1.5" fill="${accentColor}"/>
    
    <!-- Bill shading -->
    <path d="M 58 23 L 56 24 L 72 24 L 70 23 Z" fill="black" opacity="0.2"/>
    
    <!-- Crown shading -->
    <path d="M 58 18 Q 58 22 63 22 Q 68 22 68 18" fill="black" opacity="0.1"/>
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
 */
export function getHatElementId(
  type: HatType,
  catId?: string
): string {
  return generateElementId(catId || "cat", `hat-${type}`);
}
