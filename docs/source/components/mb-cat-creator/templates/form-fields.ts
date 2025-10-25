/**
 * Form field templates
 */

import { html, type TemplateResult } from "lit";
import type { CatSettings, PersonalityPreset } from "meowzer";

export interface FormFieldHandlers {
  onNameChange: (e: CustomEvent) => void;
  onDescriptionChange: (e: CustomEvent) => void;
  onColorChange: (e: CustomEvent) => void;
  onEyeColorChange: (e: CustomEvent) => void;
  onPatternChange: (e: CustomEvent) => void;
  onSizeChange: (e: CustomEvent) => void;
  onFurLengthChange: (e: CustomEvent) => void;
  onPersonalityChange: (e: CustomEvent) => void;
  onRoamingChange: (e: CustomEvent) => void;
}

export interface FormFieldValues {
  catName: string;
  catDescription: string;
  settings: CatSettings;
  selectedPersonality: PersonalityPreset;
  availablePersonalities: PersonalityPreset[];
  makeRoaming: boolean;
}

/**
 * Render basic info section
 */
export function renderBasicInfoSection(
  values: Pick<FormFieldValues, "catName" | "catDescription">,
  handlers: Pick<
    FormFieldHandlers,
    "onNameChange" | "onDescriptionChange"
  >
): TemplateResult {
  return html`
    <div class="form-section">
      <h4>Basic Info</h4>
      <quiet-text-field
        label="Name"
        .value=${values.catName}
        @quiet-input=${handlers.onNameChange}
        required
      ></quiet-text-field>

      <quiet-text-area
        label="Description"
        .value=${values.catDescription}
        @quiet-input=${handlers.onDescriptionChange}
        rows="3"
      ></quiet-text-area>
    </div>
  `;
}

/**
 * Render appearance section
 */
export function renderAppearanceSection(
  settings: CatSettings,
  handlers: Pick<
    FormFieldHandlers,
    | "onColorChange"
    | "onEyeColorChange"
    | "onPatternChange"
    | "onFurLengthChange"
  >
): TemplateResult {
  return html`
    <div class="form-section">
      <h4>Appearance</h4>

      <div class="appearance-grid">
        <mb-color-picker
          label="Fur Color"
          .value=${settings.color}
          @color-change=${handlers.onColorChange}
        ></mb-color-picker>

        <mb-color-picker
          label="Eye Color"
          .value=${settings.eyeColor}
          @color-change=${handlers.onEyeColorChange}
        ></mb-color-picker>

        <quiet-select
          label="Pattern"
          .value=${settings.pattern}
          @quiet-change=${handlers.onPatternChange}
        >
          <option value="solid">Solid</option>
          <option value="tabby">Tabby</option>
          <option value="calico">Calico</option>
          <option value="tuxedo">Tuxedo</option>
          <option value="spotted">Spotted</option>
        </quiet-select>

        <quiet-select
          label="Fur Length"
          .value=${settings.furLength}
          @quiet-change=${handlers.onFurLengthChange}
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </quiet-select>
      </div>
    </div>
  `;
}

/**
 * Render size section
 */
export function renderSizeSection(
  size: CatSettings["size"],
  onSizeChange: FormFieldHandlers["onSizeChange"]
): TemplateResult {
  return html`
    <div class="form-section">
      <h4>Size</h4>
      <quiet-select
        label="Body Size"
        .value=${size}
        @quiet-change=${onSizeChange}
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </quiet-select>
    </div>
  `;
}

/**
 * Render behavior section
 */
export function renderBehaviorSection(
  values: Pick<
    FormFieldValues,
    "selectedPersonality" | "availablePersonalities" | "makeRoaming"
  >,
  handlers: Pick<
    FormFieldHandlers,
    "onPersonalityChange" | "onRoamingChange"
  >
): TemplateResult {
  return html`
    <div class="form-section">
      <h4>Behavior</h4>
      <quiet-select
        label="Personality"
        .value=${values.selectedPersonality}
        @quiet-change=${handlers.onPersonalityChange}
      >
        ${values.availablePersonalities.map(
          (p) => html`
            <option value=${p}>
              ${p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          `
        )}
      </quiet-select>

      <quiet-checkbox
        .checked=${values.makeRoaming}
        @quiet-change=${handlers.onRoamingChange}
      >
        Make cat roam the viewport
      </quiet-checkbox>
    </div>
  `;
}
