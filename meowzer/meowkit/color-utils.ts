/**
 * Color validation and normalization utilities
 */

/**
 * Checks if a color string is valid
 */
export function isValidColor(color: string): boolean {
  // Check for hex color
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return true;
  }

  // Check for named colors (basic set)
  const namedColors = [
    "black",
    "white",
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "gray",
    "grey",
    "cyan",
    "magenta",
    "lime",
    "navy",
  ];

  return namedColors.includes(color.toLowerCase());
}

/**
 * Normalizes color to hex format without #
 */
export function normalizeColor(color: string): string {
  // If already hex, remove # and return
  if (color.startsWith("#")) {
    return color.substring(1).toUpperCase();
  }

  // Convert named colors to hex
  const namedColorMap: Record<string, string> = {
    black: "000000",
    white: "FFFFFF",
    red: "FF0000",
    green: "008000",
    blue: "0000FF",
    yellow: "FFFF00",
    orange: "FFA500",
    purple: "800080",
    pink: "FFC0CB",
    brown: "A52A2A",
    gray: "808080",
    grey: "808080",
    cyan: "00FFFF",
    magenta: "FF00FF",
    lime: "00FF00",
    navy: "000080",
  };

  const hex = namedColorMap[color.toLowerCase()];
  if (!hex) {
    throw new Error(`Unknown color name: ${color}`);
  }

  return hex;
}
