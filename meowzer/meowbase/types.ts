export interface Collection {
  id: string;
  name: string;
  children: Cat[];
}

export interface Cat {
  id: string;
  name: string;
  image: string;
  birthday: Date;
  favoriteToy: Toy;
  description: string;
  currentEmotion: Emotion;
  importantHumans: Human[];
  /**
   * Appearance data including colors, patterns, and accessories (hats, etc.)
   * Optional for backward compatibility with existing stored cats
   */
  appearance?: {
    color: string;
    eyeColor: string;
    pattern: string;
    furLength: string;
    shadingColor: string;
    highlightColor: string;
    accessories?: {
      hat?: {
        type: string;
        baseColor: string;
        accentColor: string;
      };
    };
  };
}

export interface Toy {
  id: string;
  name: string;
  image: string;
  type: string;
  description: string;
}

export interface Human {
  id: string;
  name: string;
  isFoodGiver: boolean;
  isScary: boolean;
}

export interface Emotion {
  id: string;
  name: string;
}

export interface MeowbaseConfig {
  maxLoadedCollections: number;
  maxCollectionSize: number;
}

export interface MeowbaseError {
  success: false;
  message: string;
}

export interface MeowbaseSuccess<T = void> {
  success: true;
  data?: T;
  message?: string;
}

export interface LoadedCollectionMetadata {
  collection: Collection;
  lastAccessed: number;
  isDirty: boolean;
}

export type MeowbaseResult<T = void> =
  | MeowbaseSuccess<T>
  | MeowbaseError;
