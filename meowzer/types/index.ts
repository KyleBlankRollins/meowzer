/**
 * Meowzer Shared Types
 *
 * Centralized type definitions for all Meowzer packages.
 * Organized by domain for clarity and maintainability.
 */

// ============================================================================
// PRIMITIVES - Foundational types used everywhere
// ============================================================================
export type {
  Position,
  Velocity,
  Boundaries,
  EventHandler,
  EasingFunction,
  ViewBox,
} from "./primitives.js";

// ============================================================================
// CAT APPEARANCE - Visual properties (Meowkit)
// ============================================================================
export type {
  CatPattern,
  CatSize,
  FurLength,
  CatSettings,
  AppearanceData,
  DimensionData,
  SVGElements,
  SpriteData,
  ProtoCat,
  ValidationResult,
} from "./cat/appearance.js";

// ============================================================================
// CAT BEHAVIOR - AI and personality (Meowbrain)
// ============================================================================
export type {
  Personality,
  PersonalityPreset,
  BehaviorType,
  Motivation,
  BrainState,
  Memory,
  Obstacle,
  Attractor,
  Environment,
  BrainEvent,
  BrainOptions,
  BehaviorWeights,
} from "./cat/behavior.js";

// ============================================================================
// CAT ANIMATION - Movement and states (Meowtion)
// ============================================================================
export type {
  CatStateType,
  CatState,
  CatEvent,
  PathOptions,
  PhysicsOptions,
  AnimationOptions,
  StateTransition,
} from "./cat/animation.js";

// ============================================================================
// CAT METADATA - Persistence and serialization
// ============================================================================
export type {
  CatMetadata,
  CatJSON,
  CatSeed,
} from "./cat/metadata.js";

// ============================================================================
// SDK EVENTS - Event system types
// ============================================================================
export { MeowzerEvent } from "./sdk/events.js";

export type {
  MeowzerEventType,
  EventHandler as MeowzerEventHandler,
} from "./sdk/events.js";

// ============================================================================
// SDK OPTIONS - Configuration and creation options
// ============================================================================
export type {
  CreateCatOptions,
  SaveOptions,
  LoadOptions,
  FindCatsOptions,
  MeowzerConfig,
  MeowzerCatConfig,
} from "./sdk/options.js";

// ============================================================================
// STORAGE - Collections and persistence
// ============================================================================
export type {
  CollectionInfo,
  StorageAdapter,
  SaveManyOptions,
  CollectionOptions,
} from "./storage/collections.js";

// ============================================================================
// INTERACTIONS - Cat interaction system
// ============================================================================
export type {
  NeedTypeIdentifier,
  PlaceNeedOptions,
  NeedData,
  NeedPlacedEvent,
  NeedRemovedEvent,
  NeedResponseType,
  NeedResponseEvent,
  LaserPattern,
  LaserPatternOptions,
  LaserMovedEvent,
  LaserResponseType,
  LaserResponseEvent,
  DetectionRanges,
  ResponseRates,
  InteractionConfig,
  InteractionEvent,
} from "./sdk/interactions.js";
