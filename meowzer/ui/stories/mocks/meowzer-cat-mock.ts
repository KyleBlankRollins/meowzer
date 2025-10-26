/**
 * Mock MeowzerCat for Storybook stories
 *
 * Creates a mock object that implements the MeowzerCat interface
 * with all required properties and methods for component testing.
 */

import type { MeowzerCat } from "meowzer";

export interface MockCatOptions {
  id?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  state?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create a mock MeowzerCat instance for testing
 */
export function createMockCat(
  options: MockCatOptions = {}
): MeowzerCat {
  const {
    id = `cat-${Math.random().toString(36).substr(2, 9)}`,
    name = "Mock Cat",
    description = undefined,
    isActive = true,
    state = "idle",
    createdAt = new Date(),
    updatedAt = new Date(),
  } = options;

  const mockElement = document.createElement("div");

  // Create a mock that satisfies the MeowzerCat interface
  const mock = {
    // Identity
    id,
    seed: `seed-${id}`,
    element: mockElement,

    // Mutable properties (getters)
    get name() {
      return name;
    },
    get description() {
      return description;
    },
    get isActive() {
      return isActive;
    },
    get state() {
      return state;
    },
    get createdAt() {
      return createdAt;
    },
    get updatedAt() {
      return updatedAt;
    },

    // Additional getters
    get position() {
      return { x: 0, y: 0 };
    },
    get personality() {
      return {
        curiosity: 0.7,
        playfulness: 0.8,
        independence: 0.6,
        energy: 0.7,
      };
    },
    get metadata() {
      return {
        createdAt,
        updatedAt,
      };
    },

    // Configuration methods
    setName: (newName: string) => {
      console.log(`Mock: setName(${newName})`);
    },
    setDescription: (newDesc: string) => {
      console.log(`Mock: setDescription(${newDesc})`);
    },
    setPersonality: (personality: any) => {
      console.log("Mock: setPersonality", personality);
    },
    setEnvironment: (environment: any) => {
      console.log("Mock: setEnvironment", environment);
    },
    updateMetadata: (metadata: Record<string, unknown>) => {
      console.log("Mock: updateMetadata", metadata);
    },

    // Lifecycle methods
    pause: () => {
      console.log(`Mock: pause() called on ${name}`);
    },
    resume: () => {
      console.log(`Mock: resume() called on ${name}`);
    },
    destroy: () => {
      console.log(`Mock: destroy() called on ${name}`);
    },

    // Persistence methods
    save: async (options?: any) => {
      console.log(`Mock: save() called on ${name}`, options);
    },
    delete: async () => {
      console.log(`Mock: delete() called on ${name}`);
    },

    // Utilities
    clone: async () => {
      throw new Error("Mock: clone() not implemented");
    },
    toJSON: () => ({
      id,
      seed: `seed-${id}`,
      name,
      description,
      position: { x: 0, y: 0 },
      state,
      personality: {
        curiosity: 0.7,
        playfulness: 0.8,
        independence: 0.6,
        energy: 0.7,
      },
      isActive,
      metadata: {
        createdAt,
        updatedAt,
      },
    }),
    getBoundaries: () => ({
      minX: 0,
      maxX: 1000,
      minY: 0,
      maxY: 1000,
    }),

    // Event system
    on: (event: any, handler: any) => {
      console.log(`Mock: on(${event})`, handler);
    },
    off: (event: any, handler: any) => {
      console.log(`Mock: off(${event})`, handler);
    },

    // Internal properties (prefixed with _)
    _collectionName: undefined,
    _internalCat: {} as any,
    _internalBrain: {} as any,
    _setCollectionName: (collectionName: string) => {
      console.log(`Mock: _setCollectionName(${collectionName})`);
    },
    _getInternalMetadata: () => ({
      createdAt,
      updatedAt,
    }),
  };

  // Cast to unknown first, then to MeowzerCat since we're mocking private members
  // This is safe for Storybook because we implement all public API methods
  return mock as unknown as MeowzerCat;
}

/**
 * Predefined mock cats for common scenarios
 */
export const mockCats = {
  active: createMockCat({
    id: "cat-active",
    name: "Whiskers",
    description: "A playful and curious cat",
    isActive: true,
    state: "idle",
  }),

  paused: createMockCat({
    id: "cat-paused",
    name: "Mittens",
    description: "A calm and relaxed cat",
    isActive: false,
    state: "sitting",
  }),

  walking: createMockCat({
    id: "cat-walking",
    name: "Shadow",
    isActive: true,
    state: "walking",
  }),

  playing: createMockCat({
    id: "cat-playing",
    name: "Luna",
    isActive: true,
    state: "playing",
  }),
};
