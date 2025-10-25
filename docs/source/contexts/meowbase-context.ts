import { createContext } from "@lit/context";
import type { Meowbase } from "meowzer";

/**
 * Context for providing Meowbase database instance to components
 */
export const meowbaseContext = createContext<Meowbase | null>(
  Symbol("meowbase")
);
