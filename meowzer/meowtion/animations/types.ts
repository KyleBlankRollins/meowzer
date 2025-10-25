/**
 * Type definitions for animation system
 */

/**
 * Cached SVG element references for animations
 */
export interface AnimationElements {
  tailElement: SVGElement | null;
  bodyElement: SVGElement | null;
  svgElement: SVGSVGElement | null;
  headElement: SVGElement | null;
  eyeElements: SVGElement[];
  legElements: SVGElement[];
}
