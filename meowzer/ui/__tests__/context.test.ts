/**
 * Tests for Meowzer UI contexts
 */

import { describe, it, expect } from "vitest";
import { meowzerContext } from "../contexts/meowzer-context.js";

describe("meowzerContext", () => {
  it("should be defined", () => {
    expect(meowzerContext).toBeDefined();
  });

  it("should have a symbol key", () => {
    expect(typeof meowzerContext).toBe("symbol");
  });
});
