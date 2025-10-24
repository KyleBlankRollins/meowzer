import type {
  Cat,
  Toy,
  Emotion,
  Human,
  Collection,
} from "../types.js";
import { generateUUID } from "../core/utils.js";

/**
 * Test fixtures and helpers for Meowbase tests
 */

export function createMockToy(overrides?: Partial<Toy>): Toy {
  return {
    id: generateUUID(),
    name: "Feather Wand",
    image: "https://example.com/toy.jpg",
    type: "interactive",
    description: "A fun feather toy",
    ...overrides,
  };
}

export function createMockEmotion(
  overrides?: Partial<Emotion>
): Emotion {
  return {
    id: generateUUID(),
    name: "content",
    ...overrides,
  };
}

export function createMockHuman(overrides?: Partial<Human>): Human {
  return {
    id: generateUUID(),
    name: "John Doe",
    isFoodGiver: true,
    isScary: false,
    ...overrides,
  };
}

export function createMockCat(overrides?: Partial<Cat>): Cat {
  return {
    id: generateUUID(),
    name: "Fluffy",
    image: "https://example.com/cat.jpg",
    birthday: new Date("2020-01-01"),
    favoriteToy: createMockToy(),
    description: "A fluffy cat",
    currentEmotion: createMockEmotion(),
    importantHumans: [createMockHuman()],
    ...overrides,
  };
}

export function createMockCollection(
  overrides?: Partial<Collection>
): Collection {
  return {
    id: generateUUID(),
    name: "Test Collection",
    children: [],
    ...overrides,
  };
}

/**
 * Clear localStorage before/after tests
 */
export function clearMeowbaseStorage(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("meowbase-")) {
      keys.push(key);
    }
  }
  keys.forEach((key) => localStorage.removeItem(key));
}

/**
 * Get all meowbase keys from localStorage
 */
export function getMeowbaseKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("meowbase-")) {
      keys.push(key);
    }
  }
  return keys;
}

/**
 * Count meowbase items in localStorage
 */
export function countMeowbaseItems(): number {
  return getMeowbaseKeys().length;
}
