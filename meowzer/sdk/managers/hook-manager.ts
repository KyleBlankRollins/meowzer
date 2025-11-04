import type { MeowzerCat } from "../meowzer-cat.js";
import type { SaveCatOptions } from "./storage-manager.js";
import type { CreateCatOptions } from "./cat-manager.js";

/**
 * Lifecycle hook types
 */
export const LifecycleHook = {
  BEFORE_CREATE: "beforeCreate",
  AFTER_CREATE: "afterCreate",
  BEFORE_SAVE: "beforeSave",
  AFTER_SAVE: "afterSave",
  AFTER_LOAD: "afterLoad",
  BEFORE_DELETE: "beforeDelete",
  AFTER_DELETE: "afterDelete",
  BEFORE_DESTROY: "beforeDestroy",
  AFTER_DESTROY: "afterDestroy",
  // Interaction hooks
  BEFORE_NEED_PLACE: "beforeNeedPlace",
  AFTER_NEED_PLACE: "afterNeedPlace",
  BEFORE_NEED_REMOVE: "beforeNeedRemove",
  AFTER_NEED_REMOVE: "afterNeedRemove",
  BEFORE_INTERACTION_START: "beforeInteractionStart",
  AFTER_INTERACTION_START: "afterInteractionStart",
  BEFORE_INTERACTION_END: "beforeInteractionEnd",
  AFTER_INTERACTION_END: "afterInteractionEnd",
} as const;

export type LifecycleHookType =
  (typeof LifecycleHook)[keyof typeof LifecycleHook];

/**
 * Context passed to lifecycle hooks
 */
export interface HookContext {
  /**
   * The hook being executed
   */
  hook: LifecycleHookType;

  /**
   * Timestamp when hook was triggered
   */
  timestamp: Date;

  /**
   * Custom data that can be passed between hooks
   */
  data?: Record<string, unknown>;
}

/**
 * Context for create hooks
 */
export interface CreateHookContext extends HookContext {
  hook:
    | typeof LifecycleHook.BEFORE_CREATE
    | typeof LifecycleHook.AFTER_CREATE;
  options: CreateCatOptions;
  cat?: MeowzerCat; // Only available in afterCreate
}

/**
 * Context for save hooks
 */
export interface SaveHookContext extends HookContext {
  hook:
    | typeof LifecycleHook.BEFORE_SAVE
    | typeof LifecycleHook.AFTER_SAVE;
  cat: MeowzerCat;
  options?: SaveCatOptions;
}

/**
 * Context for load hooks
 */
export interface LoadHookContext extends HookContext {
  hook: typeof LifecycleHook.AFTER_LOAD;
  cat: MeowzerCat;
  catId: string;
}

/**
 * Context for delete hooks
 */
export interface DeleteHookContext extends HookContext {
  hook:
    | typeof LifecycleHook.BEFORE_DELETE
    | typeof LifecycleHook.AFTER_DELETE;
  catId: string;
  cat?: MeowzerCat; // Only available if cat is loaded
}

/**
 * Context for destroy hooks
 */
export interface DestroyHookContext extends HookContext {
  hook:
    | typeof LifecycleHook.BEFORE_DESTROY
    | typeof LifecycleHook.AFTER_DESTROY;
  cat: MeowzerCat;
}

/**
 * Context for need placement hooks
 */
export interface NeedPlaceHookContext extends HookContext {
  hook:
    | typeof LifecycleHook.BEFORE_NEED_PLACE
    | typeof LifecycleHook.AFTER_NEED_PLACE;
  needId?: string; // Only available in afterNeedPlace
  type: string;
  position: { x: number; y: number };
  options?: Record<string, unknown>;
}

/**
 * Context for need removal hooks
 */
export interface NeedRemoveHookContext extends HookContext {
  hook:
    | typeof LifecycleHook.BEFORE_NEED_REMOVE
    | typeof LifecycleHook.AFTER_NEED_REMOVE;
  needId: string;
}

/**
 * Context for interaction start/end hooks
 */
export interface InteractionHookContext extends HookContext {
  hook:
    | typeof LifecycleHook.BEFORE_INTERACTION_START
    | typeof LifecycleHook.AFTER_INTERACTION_START
    | typeof LifecycleHook.BEFORE_INTERACTION_END
    | typeof LifecycleHook.AFTER_INTERACTION_END;
  catId: string;
  interactionId: string;
  interactionType: "need" | "laser" | "rcCar" | "yarn";
}

/**
 * Union of all hook context types
 */
export type AnyHookContext =
  | CreateHookContext
  | SaveHookContext
  | LoadHookContext
  | DeleteHookContext
  | DestroyHookContext
  | NeedPlaceHookContext
  | NeedRemoveHookContext
  | InteractionHookContext;

/**
 * Hook handler function
 */
export type HookHandler<T extends AnyHookContext = AnyHookContext> = (
  context: T
) => void | Promise<void>;

/**
 * Registered hook with metadata
 */
interface RegisteredHook {
  id: string;
  hook: LifecycleHookType;
  handler: HookHandler;
  once?: boolean;
}

/**
 * HookManager manages lifecycle hooks for the SDK
 *
 * Provides a way to tap into cat lifecycle events:
 * - Creation (before/after)
 * - Saving (before/after)
 * - Loading (after)
 * - Deletion (before/after)
 * - Destruction (before/after)
 *
 * @example
 * ```ts
 * // Add a hook
 * meowzer.hooks.on('beforeSave', async (ctx) => {
 *   console.log('Saving cat:', ctx.cat.name);
 *   ctx.cat.metadata.lastSaved = new Date();
 * });
 *
 * // Remove a hook
 * const id = meowzer.hooks.on('afterCreate', handler);
 * meowzer.hooks.off(id);
 *
 * // One-time hook
 * meowzer.hooks.once('afterCreate', handler);
 * ```
 */
export class HookManager {
  private hooks: Map<LifecycleHookType, RegisteredHook[]> = new Map();
  private hookIdCounter = 0;

  /**
   * Register a lifecycle hook
   *
   * @param hook - The lifecycle hook to listen to
   * @param handler - Function to call when hook fires
   * @returns Hook ID that can be used to unregister
   */
  on<T extends AnyHookContext = AnyHookContext>(
    hook: LifecycleHookType,
    handler: HookHandler<T>
  ): string {
    const id = `hook-${++this.hookIdCounter}`;
    const registered: RegisteredHook = {
      id,
      hook,
      handler: handler as HookHandler,
      once: false,
    };

    if (!this.hooks.has(hook)) {
      this.hooks.set(hook, []);
    }

    this.hooks.get(hook)!.push(registered);
    return id;
  }

  /**
   * Register a one-time lifecycle hook
   *
   * Hook will be automatically removed after first execution.
   *
   * @param hook - The lifecycle hook to listen to
   * @param handler - Function to call when hook fires
   * @returns Hook ID that can be used to unregister
   */
  once<T extends AnyHookContext = AnyHookContext>(
    hook: LifecycleHookType,
    handler: HookHandler<T>
  ): string {
    const id = `hook-${++this.hookIdCounter}`;
    const registered: RegisteredHook = {
      id,
      hook,
      handler: handler as HookHandler,
      once: true,
    };

    if (!this.hooks.has(hook)) {
      this.hooks.set(hook, []);
    }

    this.hooks.get(hook)!.push(registered);
    return id;
  }

  /**
   * Unregister a lifecycle hook by ID
   *
   * @param id - Hook ID returned from on() or once()
   * @returns True if hook was removed, false if not found
   */
  off(id: string): boolean {
    for (const handlers of this.hooks.values()) {
      const index = handlers.findIndex((h) => h.id === id);
      if (index !== -1) {
        handlers.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Remove all hooks for a specific lifecycle event
   *
   * @param hook - The lifecycle hook to clear
   */
  clear(hook: LifecycleHookType): void {
    this.hooks.delete(hook);
  }

  /**
   * Remove all registered hooks
   */
  clearAll(): void {
    this.hooks.clear();
  }

  /**
   * Execute all registered hooks for a lifecycle event
   *
   * @param hook - The lifecycle hook to trigger
   * @param context - Context to pass to hook handlers
   * @internal
   */
  async _trigger(
    hook: LifecycleHookType,
    context: Record<string, unknown>
  ): Promise<void> {
    const handlers = this.hooks.get(hook);
    if (!handlers || handlers.length === 0) {
      return;
    }

    const fullContext: AnyHookContext = {
      ...context,
      hook,
      timestamp: new Date(),
    } as AnyHookContext;

    // Execute hooks in order
    const toRemove: string[] = [];
    for (const registered of handlers) {
      try {
        await registered.handler(fullContext);

        // Mark one-time hooks for removal
        if (registered.once) {
          toRemove.push(registered.id);
        }
      } catch (error) {
        console.error(`Error in lifecycle hook ${hook}:`, error);
        // Continue executing other hooks even if one fails
      }
    }

    // Remove one-time hooks
    for (const id of toRemove) {
      this.off(id);
    }
  }

  /**
   * Get count of registered hooks
   *
   * @param hook - Optional specific hook to count, or all if not provided
   */
  count(hook?: LifecycleHookType): number {
    if (hook) {
      return this.hooks.get(hook)?.length ?? 0;
    }

    let total = 0;
    for (const handlers of this.hooks.values()) {
      total += handlers.length;
    }
    return total;
  }

  /**
   * Check if any hooks are registered for a lifecycle event
   *
   * @param hook - The lifecycle hook to check
   */
  has(hook: LifecycleHookType): boolean {
    const handlers = this.hooks.get(hook);
    return handlers !== undefined && handlers.length > 0;
  }

  /**
   * Get list of all registered lifecycle hooks
   *
   * @returns Array of hook types that have registered handlers
   */
  getRegisteredHooks(): LifecycleHookType[] {
    return Array.from(this.hooks.keys());
  }
}
