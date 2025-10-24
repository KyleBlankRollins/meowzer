/**
 * Utility functions for Meowkit
 */

/**
 * Generates a unique ID for cats
 */
export function generateId(): string {
  return `cat-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

/**
 * Darkens a hex color by a given amount (0-1)
 */
export function darkenColor(hex: string, amount: number): string {
  const color = hex.replace("#", "");
  const num = parseInt(color, 16);

  const r = Math.max(
    0,
    Math.floor(((num >> 16) & 255) * (1 - amount))
  );
  const g = Math.max(
    0,
    Math.floor(((num >> 8) & 255) * (1 - amount))
  );
  const b = Math.max(0, Math.floor((num & 255) * (1 - amount)));

  return `#${((r << 16) | (g << 8) | b)
    .toString(16)
    .padStart(6, "0")}`;
}

/**
 * Lightens a hex color by a given amount (0-1)
 */
export function lightenColor(hex: string, amount: number): string {
  const color = hex.replace("#", "");
  const num = parseInt(color, 16);

  const r = Math.min(
    255,
    Math.floor(
      ((num >> 16) & 255) + (255 - ((num >> 16) & 255)) * amount
    )
  );
  const g = Math.min(
    255,
    Math.floor(
      ((num >> 8) & 255) + (255 - ((num >> 8) & 255)) * amount
    )
  );
  const b = Math.min(
    255,
    Math.floor((num & 255) + (255 - (num & 255)) * amount)
  );

  return `#${((r << 16) | (g << 8) | b)
    .toString(16)
    .padStart(6, "0")}`;
}

/**
 * Generates a random hex color
 */
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

/**
 * Generates a unique element ID for SVG elements
 */
export function generateElementId(
  catId: string,
  element: string
): string {
  return `${catId}-${element}`;
}
