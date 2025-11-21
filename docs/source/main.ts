import "./style.css";
import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/tag/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/icon/index.js";
import "@carbon/web-components/es/components/popover/index.js";
import "@carbon/web-components/es/components/select/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import "@carbon/web-components/es/components/loading/index.js";

// Import custom components
import "./components/mb-nav/mb-nav.js";
import "./components/mb-sidebar/mb-sidebar.js";
import "./components/templates/mb-home-template/mb-home-template.js";
import "./components/templates/mb-landing-template/mb-landing-template.js";
import "./components/templates/mb-doc-template/mb-doc-template.js";
import "./components/mb-meowbase-provider/mb-meowbase-provider.js";
import "./components/mb-cat-creator/mb-cat-creator.js";
import "./components/mb-cat-card/mb-cat-card.js";
import "./components/mb-color-picker/mb-color-picker.js";
import "./components/mb-meowzer-controls/mb-meowzer-controls.js";

// Import client-side router for navigation without page reloads
import { initializeRouter } from "./utilities/router.js";

// Initialize client-side router to preserve cat state across navigation
initializeRouter();
