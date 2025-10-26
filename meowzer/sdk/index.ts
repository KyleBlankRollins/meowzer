/**
 * Meowzer SDK - Unified TypeScript SDK for creating and managing animated cats
 *
 * @example
 * ```ts
 * import { Meowzer } from '@meowzer/sdk';
 *
 * const meowzer = new Meowzer({
 *   storage: { adapter: 'indexeddb' }
 * });
 *
 * await meowzer.init();
 *
 * const cat = await meowzer.cats.create({
 *   name: "Whiskers",
 *   settings: { color: "orange", pattern: "tabby", size: "medium", furLength: "short", eyeColor: "green" }
 * });
 *
 * cat.place(document.body);
 * ```
 *
 * @packageDocumentation
 */

// Main SDK class
export { Meowzer } from "./meowzer-sdk.js";

// Core types
export { MeowzerCat } from "./meowzer-cat.js";
export { MeowzerEvent } from "./types.js";
export type {
  SaveOptions,
  MeowzerEventType,
  EventHandler,
  MeowzerCatConfig,
} from "./types.js";

// Configuration
export type {
  MeowzerConfig,
  StorageConfig,
  BehaviorConfig,
} from "./config.js";

// Managers
export {
  CatManager,
  type CreateCatOptions,
  type FindCatsOptions,
} from "./managers/cat-manager.js";
export {
  StorageManager,
  type SaveCatOptions,
  type LoadCollectionOptions,
  type CollectionInfo,
} from "./managers/storage-manager.js";
export {
  HookManager,
  LifecycleHook,
  type LifecycleHookType,
  type HookHandler,
  type HookContext,
  type CreateHookContext,
  type SaveHookContext,
  type LoadHookContext,
  type DeleteHookContext,
  type DestroyHookContext,
} from "./managers/hook-manager.js";

// Plugins
export {
  PluginManager,
  type MeowzerPlugin,
  type PluginContext,
  type PluginInstallOptions,
  type InstalledPlugin,
} from "./plugin.js";

// Utilities
export { MeowzerUtils } from "./utils.js";

// Errors
export {
  ErrorCode,
  MeowzerError,
  InvalidSettingsError,
  StorageError,
  NotFoundError,
  ValidationError,
  InitializationError,
  CollectionError,
  OperationFailedError,
  InvalidStateError,
  type ErrorCodeType,
} from "./errors.js";

// Re-export key types from shared types package
export type {
  // Primitives
  Position,
  Velocity,
  Boundaries,
  // Cat appearance
  CatSettings,
  CatPattern,
  CatSize,
  FurLength,
  ProtoCat,
  // Cat behavior
  Personality,
  PersonalityPreset,
  BehaviorType,
  Environment,
  // Cat animation
  CatStateType,
  AnimationOptions,
  // Cat metadata
  CatMetadata,
  CatJSON,
} from "../types/index.js";
