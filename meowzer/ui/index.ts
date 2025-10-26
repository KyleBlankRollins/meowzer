/**
 * @meowzer/ui - Web Components for Meowzer SDK
 *
 * Drop-in cat animations for any website using Lit Element and Quiet UI.
 * Inspired by Realm React's provider pattern.
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
} from "./controllers/index.js";

// Components (Phase 2: Creation Components)
export {
  CatCreator,
  CatAppearanceForm,
  CatPersonalityPicker,
  CatPreview,
} from "./components/index.js";

// Components (Phase 3: Management Components)
export {
  CatManager,
  CatCard,
  CatControls,
  CatListItem,
} from "./components/index.js";

// Components (Phase 4: Gallery & Storage Components)
export {
  CatGallery,
  CollectionPicker,
  CatThumbnail,
  CatExporter,
  CatImporter,
} from "./components/index.js";

// Components (Phase 5: Drop-in Solutions)
export { MbCatOverlay, MbCatPlayground } from "./components/index.js";

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
