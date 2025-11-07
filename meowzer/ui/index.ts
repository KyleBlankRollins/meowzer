/**
 * @meowzer/ui - Web Components for Meowzer SDK
 *
 * Drop-in cat animations for any website using Lit Element and Quiet UI.
 * Inspired by Realm React's provider pattern.
 *
 * For automatic setup (stylesheets + component registration), import the setup module:
 * ```typescript
 * import '@meowzer/ui/setup';
 * ```
 */

// Contexts
export { meowzerContext } from "./contexts/index.js";
export type { MeowzerContext } from "./contexts/index.js";

// Providers
export { MeowzerProvider } from "./providers/index.js";

// Reactive Controllers
export {
  CatsController,
  CatController,
  StorageController,
  CursorController,
} from "./controllers/index.js";
export type {
  PlacementMode,
  PlacementOptions,
} from "./controllers/index.js";

// Components (Phase 2: Creation Components)
export {
  CatCreator,
  CatPersonalityPicker,
  CatPreview,
} from "./components/index.js";

// Components (Phase 3: Management Components)
// Note: Phase 3 components removed in UI refactor

// Components (Phase 4: Gallery & Storage Components)
export {
  CollectionPicker,
  CatThumbnail,
  CatExporter,
  CatImporter,
} from "./components/index.js";

// Components (Phase 5: Drop-in Solutions)
export {
  MbCatPlayground,
  MbWardrobeDialog,
} from "./components/index.js";

// Re-export Meowzer SDK types for convenience
export type {
  Meowzer,
  MeowzerCat,
  MeowzerConfig,
  CatSettings,
  Personality,
  PersonalityPreset,
  Position,
  Boundaries,
  CatStateType,
} from "meowzer";
