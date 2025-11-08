/**
 * Types and interfaces for cat component system
 */

import type { StorageManager } from "../managers/storage-manager.js";
import type { InteractionManager } from "../managers/interaction-manager.js";
import type { HookManager } from "../managers/hook-manager.js";

/**
 * Manager dependencies required by cat components
 */
export interface CatManagers {
  storage: StorageManager;
  interactions: InteractionManager;
  hooks: HookManager;
}
