/**
 * Tests for reactive controllers
 */

import { describe, it, expect } from "vitest";
import {
  CatsController,
  CatController,
} from "../controllers/reactive-controllers.js";

// Simple mock host for testing that implements ReactiveControllerHost
class MockHost {
  private _controllers: Set<any> = new Set();
  meowzer?: any;

  addController(controller: any) {
    this._controllers.add(controller);
  }

  removeController(controller: any) {
    this._controllers.delete(controller);
  }

  requestUpdate() {
    // Mock update
  }
}

describe("CatsController", () => {
  it("should initialize with empty cats array", () => {
    const host = new MockHost();
    const controller = new CatsController(host as any);
    expect(controller.cats).toEqual([]);
  });

  it("should be a ReactiveController", () => {
    const host = new MockHost();
    const controller = new CatsController(host as any);
    expect(controller).toHaveProperty("hostConnected");
    expect(controller).toHaveProperty("hostDisconnected");
  });
});

describe("CatController", () => {
  it("should initialize with undefined cat", () => {
    const host = new MockHost();
    const controller = new CatController(host as any, "test-id");
    expect(controller.cat).toBeUndefined();
  });

  it("should accept a cat ID", () => {
    const host = new MockHost();
    const controller = new CatController(host as any, "my-cat-123");
    expect(controller).toBeDefined();
  });

  it("should have updateCatId method", () => {
    const host = new MockHost();
    const controller = new CatController(host as any, "test-id");
    expect(controller.updateCatId).toBeInstanceOf(Function);
  });
});
