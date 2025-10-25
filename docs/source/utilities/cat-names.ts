/**
 * Cat Names Utility
 *
 * Provides food-themed and Star Wars themed cat names.
 */

import catNamesData from "../../../meta/cat-names.json";

/**
 * Get all cat names from the JSON data
 */
export function getAllCatNames(): string[] {
  return catNamesData.names;
}

/**
 * Get a random cat name
 */
export function getRandomCatName(): string {
  const names = getAllCatNames();
  return names[Math.floor(Math.random() * names.length)];
}
