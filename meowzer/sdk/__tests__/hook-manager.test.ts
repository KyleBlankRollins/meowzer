/**
 * HookManager Tests - Lifecycle hooks system
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  HookManager,
  LifecycleHook,
} from "../managers/hook-manager.js";

describe("HookManager", () => {
  let hookManager: HookManager;

  beforeEach(() => {
    hookManager = new HookManager();
  });

  describe("Hook Registration", () => {
    it("should register a hook", () => {
      const handler = vi.fn();

      hookManager.on("beforeCreate", handler);

      expect(hookManager.has("beforeCreate")).toBe(true);
    });

    it("should register multiple hooks for same event", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      hookManager.on("beforeCreate", handler1);
      hookManager.on("beforeCreate", handler2);

      expect(hookManager.count("beforeCreate")).toBe(2);
    });

    it("should register hooks for different events", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      hookManager.on("beforeCreate", handler1);
      hookManager.on("afterCreate", handler2);

      expect(hookManager.has("beforeCreate")).toBe(true);
      expect(hookManager.has("afterCreate")).toBe(true);
    });

    it("should allow same handler for multiple events", () => {
      const handler = vi.fn();

      hookManager.on("beforeCreate", handler);
      hookManager.on("afterCreate", handler);

      expect(hookManager.count("beforeCreate")).toBe(1);
      expect(hookManager.count("afterCreate")).toBe(1);
    });
  });

  describe("Hook Execution", () => {
    it("should execute hook with context", async () => {
      const handler = vi.fn();
      const context = { options: { name: "Test" } };

      hookManager.on("beforeCreate", handler);
      await hookManager._trigger(
        LifecycleHook.BEFORE_CREATE,
        context
      );

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          options: { name: "Test" },
          hook: "beforeCreate",
        })
      );
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should execute multiple hooks in order", async () => {
      const callOrder: number[] = [];
      const handler1 = vi.fn(() => {
        callOrder.push(1);
      });
      const handler2 = vi.fn(() => {
        callOrder.push(2);
      });
      const handler3 = vi.fn(() => {
        callOrder.push(3);
      });

      hookManager.on("beforeCreate", handler1);
      hookManager.on("beforeCreate", handler2);
      hookManager.on("beforeCreate", handler3);

      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});

      expect(callOrder).toEqual([1, 2, 3]);
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler3).toHaveBeenCalledTimes(1);
    });

    it("should handle async hooks", async () => {
      const handler = vi.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      hookManager.on("beforeCreate", handler);
      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should not throw if no hooks registered", async () => {
      await expect(
        hookManager._trigger(LifecycleHook.BEFORE_CREATE, {})
      ).resolves.not.toThrow();
    });

    it("should continue executing hooks if one throws", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn(() => {
        throw new Error("Hook error");
      });
      const handler3 = vi.fn();

      hookManager.on("beforeCreate", handler1);
      hookManager.on("beforeCreate", handler2);
      hookManager.on("beforeCreate", handler3);

      // Should not throw
      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler3).toHaveBeenCalledTimes(1);
    });
  });

  describe("Once Hooks", () => {
    it("should execute once hook only once", async () => {
      const handler = vi.fn();

      hookManager.once("beforeCreate", handler);

      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});
      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should remove once hook after execution", async () => {
      const handler = vi.fn();

      hookManager.once("beforeCreate", handler);
      expect(hookManager.has("beforeCreate")).toBe(true);

      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});
      expect(hookManager.has("beforeCreate")).toBe(false);
    });

    it("should handle multiple once hooks", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      hookManager.once("beforeCreate", handler1);
      hookManager.once("beforeCreate", handler2);

      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(hookManager.has("beforeCreate")).toBe(false);
    });
  });

  describe("Hook Removal", () => {
    it("should remove a specific hook by ID", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const id1 = hookManager.on("beforeCreate", handler1);
      hookManager.on("beforeCreate", handler2);

      const removed = hookManager.off(id1);

      expect(removed).toBe(true);
      expect(hookManager.count("beforeCreate")).toBe(1);
    });

    it("should return false when removing non-existent hook", () => {
      const removed = hookManager.off("non-existent-id");

      expect(removed).toBe(false);
    });

    it("should clear all hooks for an event", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      hookManager.on("beforeCreate", handler1);
      hookManager.on("beforeCreate", handler2);

      hookManager.clear("beforeCreate");

      expect(hookManager.has("beforeCreate")).toBe(false);
      expect(hookManager.count("beforeCreate")).toBe(0);
    });

    it("should clear all hooks for all events", () => {
      const handler = vi.fn();

      hookManager.on("beforeCreate", handler);
      hookManager.on("afterCreate", handler);
      hookManager.on("beforeSave", handler);

      hookManager.clearAll();

      expect(hookManager.has("beforeCreate")).toBe(false);
      expect(hookManager.has("afterCreate")).toBe(false);
      expect(hookManager.has("beforeSave")).toBe(false);
    });

    it("should not throw when clearing empty event", () => {
      expect(() => {
        hookManager.clear("beforeCreate");
      }).not.toThrow();
    });
  });

  describe("Hook Query", () => {
    it("should return false for non-existent hooks", () => {
      expect(hookManager.has("beforeCreate")).toBe(false);
    });

    it("should return 0 count for non-existent hooks", () => {
      expect(hookManager.count("beforeCreate")).toBe(0);
    });

    it("should return correct count", () => {
      const handler = vi.fn();

      hookManager.on("beforeCreate", handler);
      hookManager.on("beforeCreate", handler);
      hookManager.on("beforeCreate", handler);

      expect(hookManager.count("beforeCreate")).toBe(3);
    });
  });

  describe("All Lifecycle Hooks", () => {
    it("should support beforeCreate hook", async () => {
      const handler = vi.fn();
      hookManager.on("beforeCreate", handler);
      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});
      expect(handler).toHaveBeenCalled();
    });

    it("should support afterCreate hook", async () => {
      const handler = vi.fn();
      hookManager.on("afterCreate", handler);
      await hookManager._trigger(LifecycleHook.AFTER_CREATE, {});
      expect(handler).toHaveBeenCalled();
    });

    it("should support beforeSave hook", async () => {
      const handler = vi.fn();
      hookManager.on("beforeSave", handler);
      await hookManager._trigger(LifecycleHook.BEFORE_SAVE, {});
      expect(handler).toHaveBeenCalled();
    });

    it("should support afterSave hook", async () => {
      const handler = vi.fn();
      hookManager.on("afterSave", handler);
      await hookManager._trigger(LifecycleHook.AFTER_SAVE, {});
      expect(handler).toHaveBeenCalled();
    });

    it("should support afterLoad hook", async () => {
      const handler = vi.fn();
      hookManager.on("afterLoad", handler);
      await hookManager._trigger(LifecycleHook.AFTER_LOAD, {});
      expect(handler).toHaveBeenCalled();
    });

    it("should support beforeDelete hook", async () => {
      const handler = vi.fn();
      hookManager.on("beforeDelete", handler);
      await hookManager._trigger(LifecycleHook.BEFORE_DELETE, {});
      expect(handler).toHaveBeenCalled();
    });

    it("should support afterDelete hook", async () => {
      const handler = vi.fn();
      hookManager.on("afterDelete", handler);
      await hookManager._trigger(LifecycleHook.AFTER_DELETE, {});
      expect(handler).toHaveBeenCalled();
    });

    it("should support beforeDestroy hook", async () => {
      const handler = vi.fn();
      hookManager.on("beforeDestroy", handler);
      await hookManager._trigger(LifecycleHook.BEFORE_DESTROY, {});
      expect(handler).toHaveBeenCalled();
    });

    it("should support afterDestroy hook", async () => {
      const handler = vi.fn();
      hookManager.on("afterDestroy", handler);
      await hookManager._trigger(LifecycleHook.AFTER_DESTROY, {});
      expect(handler).toHaveBeenCalled();
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle mix of on and once hooks", async () => {
      const onHandler = vi.fn();
      const onceHandler = vi.fn();

      hookManager.on("beforeCreate", onHandler);
      hookManager.once("beforeCreate", onceHandler);

      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});
      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});

      expect(onHandler).toHaveBeenCalledTimes(2);
      expect(onceHandler).toHaveBeenCalledTimes(1);
    });

    it("should handle removing hook during execution", async () => {
      const handler1 = vi.fn();
      let hookId3: string;
      const handler2 = vi.fn(() => {
        hookManager.off(hookId3);
      });
      const handler3 = vi.fn();

      hookManager.on("beforeCreate", handler1);
      hookManager.on("beforeCreate", handler2);
      hookId3 = hookManager.on("beforeCreate", handler3);

      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      // handler3 execution depends on whether removal affects current iteration
    });

    it("should isolate hooks between different events", async () => {
      const createHandler = vi.fn();
      const saveHandler = vi.fn();

      hookManager.on("beforeCreate", createHandler);
      hookManager.on("beforeSave", saveHandler);

      await hookManager._trigger(LifecycleHook.BEFORE_CREATE, {});

      expect(createHandler).toHaveBeenCalledTimes(1);
      expect(saveHandler).not.toHaveBeenCalled();
    });
  });
});
