/**
 * @meowzer/ui - Web Components for Meowzer SDK
 *
 * Drop-in cat animations for any website using Lit Element and Carbon Web Components.
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

// UI components
export {
  MbButton,
  MbLoading,
  MbTag,
  MbSlider,
  MbTextInput,
  MbTextarea,
  MbCheckbox,
  MbSelect,
  CatCreator,
  CatPersonalityPicker,
  CatPreview,
  CatStatistics,
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
