/**
 * Cat Names for Meowzer
 *
 * Provides random cat names from the cat-names.json file
 */

import catNamesData from "../../meta/cat-names.json";

/**
 * Get a random cat name from the list
 */
export function getRandomCatName(): string {
  const names = catNamesData.names;
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

/**
 * Get all available cat names
 */
export function getAllCatNames(): string[] {
  return [...catNamesData.names];
}
