/**
 * Cat Names Utility
 *
 * Provides food-themed and Star Wars themed cat names.
 * Names are cached in localStorage for quick access.
 */

import catNamesData from "../../../meta/cat-names.json";

const STORAGE_KEY = "meowbase-cat-names";

/**
 * Get all cat names (from localStorage or fallback to JSON)
 */
export function getAllCatNames(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn(
      "Failed to load cat names from localStorage:",
      error
    );
  }

  // Cache names in localStorage for next time
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(catNamesData.names)
    );
  } catch (error) {
    console.warn("Failed to cache cat names in localStorage:", error);
  }

  return catNamesData.names;
}

/**
 * Get a random cat name
 */
export function getRandomCatName(): string {
  const names = getAllCatNames();
  return names[Math.floor(Math.random() * names.length)];
}

/**
 * Add a custom cat name to the list
 */
export function addCatName(name: string): void {
  const names = getAllCatNames();
  if (!names.includes(name)) {
    names.push(name);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    } catch (error) {
      console.warn("Failed to save custom cat name:", error);
    }
  }
}
