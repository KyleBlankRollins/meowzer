/**
 * Lit Context definitions for Meowzer UI
 *
 * These contexts allow child components to access the Meowzer SDK instance
 * without prop drilling, using Lit's @consume decorator.
 */

import { createContext } from "@lit/context";
import type { Meowzer } from "meowzer";

/**
 * Main Meowzer context - provides SDK instance to components
 */
export const meowzerContext = createContext<Meowzer | undefined>(
  Symbol("meowzer")
);

/**
 * Context type for TypeScript
 */
export type MeowzerContext = typeof meowzerContext;
