import "./style.css";
import { allDefined } from "@quietui/quiet";
import "@quietui/quiet/components/card/card.js";
import "@quietui/quiet/components/button/button.js";
import "@quietui/quiet/components/text-field/text-field.js";
import "@quietui/quiet/components/badge/badge.js";
import "@quietui/quiet/components/callout/callout.js";
import "@quietui/quiet/components/empty-state/empty-state.js";
import "@quietui/quiet/components/icon/icon.js";
import "@quietui/quiet/components/color-picker/color-picker.js";
import "@quietui/quiet/components/popover/popover.js";
import "@quietui/quiet/components/select/select.js";
import "@quietui/quiet/components/checkbox/checkbox.js";
import "@quietui/quiet/components/text-area/text-area.js";
import "@quietui/quiet/components/spinner/spinner.js";
import "@quietui/quiet/components/button-group/button-group.js";
import "@quietui/quiet/components/divider/divider.js";

// Import custom components
import "./components/mb-nav/mb-nav.js";
import "./components/mb-sidebar/mb-sidebar.js";
import "./components/templates/mb-home-template/mb-home-template.js";
import "./components/templates/mb-landing-template/mb-landing-template.js";
import "./components/templates/mb-doc-template/mb-doc-template.js";
import "./components/mb-meowbase-provider/mb-meowbase-provider.js";
import "./components/mb-crud-demo/mb-crud-demo.js";
import "./components/mb-cat-creator/mb-cat-creator.js";
import "./components/mb-cat-card/mb-cat-card.js";
import "./components/mb-meowzer-demo/mb-meowzer-demo.js";
import "./components/mb-color-picker/mb-color-picker.js";

try {
  await allDefined();
} catch (error) {
  console.error(error);
}
