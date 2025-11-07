/**
 * SVG generation for cat sprites
 */

import type {
  AppearanceData,
  DimensionData,
  SpriteData,
  SVGElements,
} from "../types/index.js";
import { generateElementId } from "./utils.js";
import { generateHatSVG, getHatElementId } from "./accessories.js";

/**
 * Generates complete SVG sprite data for a cat
 */
export function generateCatSVG(
  appearance: AppearanceData,
  dimensions: DimensionData
): SpriteData {
  const catId = `cat-${Date.now()}`;

  const elements: SVGElements = {
    body: generateElementId(catId, "body"),
    head: generateElementId(catId, "head"),
    ears: [
      generateElementId(catId, "ear-left"),
      generateElementId(catId, "ear-right"),
    ],
    eyes: [
      generateElementId(catId, "eye-left"),
      generateElementId(catId, "eye-right"),
    ],
    tail: generateElementId(catId, "tail"),
    legs: [
      generateElementId(catId, "leg-back-left"),
      generateElementId(catId, "leg-back-right"),
      generateElementId(catId, "leg-front-left"),
      generateElementId(catId, "leg-front-right"),
    ],
  };

  // Add pattern elements if not solid
  if (appearance.pattern !== "solid") {
    elements.pattern = [
      generateElementId(catId, "pattern-1"),
      generateElementId(catId, "pattern-2"),
      generateElementId(catId, "pattern-3"),
    ];
  }

  // Add hat element if cat has a hat
  if (appearance.accessories?.hat) {
    elements.hat = getHatElementId(
      appearance.accessories.hat.type,
      catId
    );
  }

  const svg = buildSVGMarkup(appearance, dimensions, elements, catId);

  return {
    svg,
    elements,
    viewBox: {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    },
  };
}

/**
 * Builds the complete SVG markup
 * Cat is shown in profile (side view) standing on all fours, facing right
 * Uses pixel-art style with blocky, rectangular geometry
 */
function buildSVGMarkup(
  appearance: AppearanceData,
  dimensions: DimensionData,
  elements: SVGElements,
  catId: string
): string {
  const { color, eyeColor, shadingColor, pattern } = appearance;
  const { width, height } = dimensions;

  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges">
  <defs>
    ${generatePatternDefs(pattern, color, shadingColor)}
  </defs>
  
  <!-- Back legs (drawn first for depth) -->
  <g id="back-legs">
    <!-- Back left leg -->
    <g id="${elements.legs![0]}">
      <rect x="30" y="50" width="5" height="20" fill="${color}"/>
      <rect x="29" y="69" width="7" height="3" fill="${color}"/>
    </g>
    
    <!-- Back right leg -->
    <g id="${elements.legs![1]}">
      <rect x="40" y="50" width="5" height="20" fill="${color}"/>
      <rect x="39" y="69" width="7" height="3" fill="${color}"/>
    </g>
  </g>
  
  <!-- Tail (behind body) - blocky segments -->
  <path id="${
    elements.tail
  }" d="M 25 45 L 18 42 L 14 38 L 12 32 L 10 26 L 12 22" 
        stroke="${color}" stroke-width="5" fill="none" stroke-linecap="square" stroke-linejoin="miter"/>
  
  <!-- Body (blocky rectangle) -->
  <g id="${elements.body}-group">
    <rect id="${
      elements.body
    }" x="26" y="33" width="42" height="24" fill="${color}"/>
    
    <!-- Body shading (bottom stripe) -->
    <rect x="28" y="50" width="38" height="6" fill="${shadingColor}" opacity="0.3"/>
  </g>
  
  <!-- Front legs (in front of body) -->
  <g id="front-legs">
    <!-- Front left leg -->
    <g id="${elements.legs![2]}">
      <rect x="52" y="50" width="5" height="20" fill="${color}"/>
      <rect x="51" y="69" width="7" height="3" fill="${color}"/>
    </g>
    
    <!-- Front right leg -->
    <g id="${elements.legs![3]}">
      <rect x="62" y="50" width="5" height="20" fill="${color}"/>
      <rect x="61" y="69" width="7" height="3" fill="${color}"/>
    </g>
  </g>
  
  <!-- Head (profile, facing right) - blocky -->
  <g id="${elements.head}-group">
    <!-- Head (rectangular) -->
    <rect id="${
      elements.head
    }" x="58" y="28" width="18" height="18" fill="${color}"/>
    
    <!-- Snout (rectangular protrusion) -->
    <rect x="74" y="34" width="8" height="10" fill="${color}"/>
    
    <!-- Head shading -->
    <rect x="60" y="40" width="14" height="5" fill="${shadingColor}" opacity="0.3"/>
    
    <!-- Ears (triangular, pixel style) -->
    <polygon id="${
      elements.ears[0]
    }" points="60,28 58,20 64,26" fill="${color}"/>
    <polygon points="61,27 60,22 63,25" fill="${shadingColor}" opacity="0.3"/>
    
    <polygon id="${
      elements.ears[1]
    }" points="72,28 70,20 76,26" fill="${color}"/>
    <polygon points="73,27 72,22 75,25" fill="${shadingColor}" opacity="0.3"/>
    
    <!-- Eye (square pixel style) -->
    <rect id="${
      elements.eyes[0]
    }" x="68" y="34" width="4" height="4" fill="${eyeColor}"/>
    <rect x="69" y="34" width="2" height="2" fill="#FFFFFF" opacity="0.8"/>
    
    <!-- Far eye (barely visible) -->
    <rect id="${
      elements.eyes[1]
    }" x="64" y="35" width="2" height="3" fill="${eyeColor}" opacity="0.4"/>
    
    <!-- Nose (small square) -->
    <rect x="79" y="39" width="2" height="2" fill="#FF9999"/>
    
    <!-- Mouth (angular line) -->
    <line x1="79" y1="42" x2="76" y2="44" stroke="${shadingColor}" stroke-width="1" stroke-linecap="square"/>
    
    <!-- Whiskers (straight lines) -->
    <line x1="76" y1="36" x2="88" y2="34" stroke="${shadingColor}" stroke-width="1" opacity="0.8"/>
    <line x1="77" y1="39" x2="90" y2="39" stroke="${shadingColor}" stroke-width="1" opacity="0.8"/>
    <line x1="76" y1="42" x2="88" y2="44" stroke="${shadingColor}" stroke-width="1" opacity="0.8"/>
  </g>
  
  ${generateHatMarkup(appearance, catId)}
  
  ${generatePatternOverlay(pattern, elements, color, shadingColor)}
</svg>
  `.trim();

  return svgContent;
}

/**
 * Generates hat markup if cat has a hat
 */
function generateHatMarkup(
  appearance: AppearanceData,
  catId: string
): string {
  if (!appearance.accessories?.hat) {
    return "";
  }

  const { type, baseColor, accentColor } = appearance.accessories.hat;
  return generateHatSVG(type, baseColor, accentColor, catId);
}

/**
 * Generates pattern definitions
 */
function generatePatternDefs(
  pattern: string,
  color: string,
  shadingColor: string
): string {
  if (pattern === "solid") {
    return "";
  }

  return `
    <pattern id="pattern-${pattern}" patternUnits="userSpaceOnUse" width="10" height="10">
      <rect width="10" height="10" fill="${color}" opacity="0"/>
      <path d="M 0 5 L 10 5" stroke="${shadingColor}" stroke-width="2" opacity="0.4"/>
    </pattern>
  `;
}

/**
 * Generates pattern overlay elements
 * Adjusted for side profile view
 */
function generatePatternOverlay(
  pattern: string,
  elements: SVGElements,
  color: string,
  shadingColor: string
): string {
  if (pattern === "solid" || !elements.pattern) {
    return "";
  }

  switch (pattern) {
    case "tabby":
      return `
        <g id="pattern-overlay">
          <!-- Tabby stripes on body (blocky vertical stripes) -->
          <rect id="${elements.pattern[0]}" x="31" y="38" width="3" height="16" fill="${shadingColor}" opacity="0.6"/>
          <rect id="${elements.pattern[1]}" x="41" y="36" width="3" height="20" fill="${shadingColor}" opacity="0.6"/>
          <rect id="${elements.pattern[2]}" x="51" y="38" width="3" height="16" fill="${shadingColor}" opacity="0.6"/>
          
          <!-- Tabby stripe on head -->
          <rect x="65" y="30" width="2" height="10" fill="${shadingColor}" opacity="0.6"/>
        </g>
      `;

    case "calico":
      return `
        <g id="pattern-overlay">
          <!-- Calico patches on body (blocky squares) -->
          <rect id="${elements.pattern[0]}" x="30" y="40" width="10" height="8" fill="${shadingColor}" opacity="0.7"/>
          <rect id="${elements.pattern[1]}" x="48" y="43" width="8" height="8" fill="#FFFFFF" opacity="0.8"/>
          <rect id="${elements.pattern[2]}" x="66" y="33" width="6" height="5" fill="${color}" opacity="0.9"/>
        </g>
      `;

    case "tuxedo":
      return `
        <g id="pattern-overlay">
          <!-- Tuxedo white patches (blocky rectangles) -->
          <rect id="${elements.pattern[0]}" x="40" y="45" width="14" height="10" fill="#FFFFFF" opacity="0.9"/>
          <rect id="${elements.pattern[1]}" x="55" y="48" width="8" height="8" fill="#FFFFFF" opacity="0.9"/>
          <rect id="${elements.pattern[2]}" x="73" y="38" width="4" height="4" fill="#FFFFFF" opacity="0.9"/>
        </g>
      `;

    case "spotted":
      return `
        <g id="pattern-overlay">
          <!-- Spots (pixel squares) -->
          <rect id="${elements.pattern[0]}" x="34" y="40" width="4" height="4" fill="${shadingColor}" opacity="0.6"/>
          <rect id="${elements.pattern[1]}" x="46" y="44" width="3" height="3" fill="${shadingColor}" opacity="0.6"/>
          <rect id="${elements.pattern[2]}" x="54" y="42" width="5" height="5" fill="${shadingColor}" opacity="0.6"/>
          <rect x="69" y="32" width="3" height="3" fill="${shadingColor}" opacity="0.6"/>
        </g>
      `;

    default:
      return "";
  }
}
