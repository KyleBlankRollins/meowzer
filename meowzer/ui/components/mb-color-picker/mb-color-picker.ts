import { LitElement, html, nothing } from "lit";
import {
  customElement,
  property,
  state,
  query,
} from "lit/decorators.js";
import { colorPickerStyles } from "./mb-color-picker.style.js";

/**
 * Color picker component with HSV color selection.
 *
 * @element mb-color-picker
 *
 * @fires mb-change - Fired when the color value changes
 * @fires mb-input - Fired during color value changes (while dragging)
 *
 * @cssprop --mb-color-background - Background color
 * @cssprop --mb-color-border - Border color
 * @cssprop --mb-color-focus - Focus outline color
 */
@customElement("mb-color-picker")
export class MbColorPicker extends LitElement {
  static styles = colorPickerStyles;

  /**
   * The current color value in hex format
   */
  @property({ type: String })
  declare value: string;

  /**
   * Color format (only hex supported currently)
   */
  @property({ type: String })
  declare format: "hex";

  /**
   * Display inline without border/shadow
   */
  @property({ type: Boolean, reflect: true })
  declare inline: boolean;

  /**
   * Disable the color picker
   */
  @property({ type: Boolean })
  declare disabled: boolean;

  /**
   * Label to display above the swatch (e.g., "Fur", "Eyes")
   */
  @property({ type: String })
  declare label: string;

  @state()
  private hue = 0;

  @state()
  private saturation = 100;

  @state()
  private value_hsv = 100;

  @state()
  private isDraggingGrid = false;

  @state()
  private isDraggingHue = false;

  @state()
  private isOpen = false;

  @query(".mb-color-picker__grid")
  private gridElement?: HTMLElement;

  @query(".mb-color-picker__hue-slider")
  private hueElement?: HTMLElement;

  @query(".mb-color-picker__native")
  private nativeInput?: HTMLInputElement;

  constructor() {
    super();
    this.value = "#000000";
    this.format = "hex";
    this.inline = false;
    this.disabled = false;
    this.label = "";
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.parseColor(this.value);
    document.addEventListener("click", this.handleDocumentClick);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("click", this.handleDocumentClick);
  }

  updated(changedProperties: Map<string, any>): void {
    if (
      changedProperties.has("value") &&
      !this.isDraggingGrid &&
      !this.isDraggingHue
    ) {
      this.parseColor(this.value);
    }
  }

  /**
   * Parse hex color to HSV
   */
  private parseColor(hex: string): void {
    const rgb = this.hexToRgb(hex);
    if (rgb) {
      const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);
      this.hue = hsv.h;
      this.saturation = hsv.s;
      this.value_hsv = hsv.v;
    }
  }

  /**
   * Convert HSV to RGB
   */
  private hsvToRgb(
    h: number,
    s: number,
    v: number
  ): { r: number; g: number; b: number } {
    s /= 100;
    v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  /**
   * Convert RGB to HSV
   */
  private rgbToHsv(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; v: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    const s = max === 0 ? 0 : (diff / max) * 100;
    const v = max * 100;

    if (diff !== 0) {
      if (max === r) {
        h = 60 * (((g - b) / diff) % 6);
      } else if (max === g) {
        h = 60 * ((b - r) / diff + 2);
      } else {
        h = 60 * ((r - g) / diff + 4);
      }
    }

    if (h < 0) h += 360;

    return { h, s, v };
  }

  /**
   * Convert RGB to hex
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  /**
   * Convert hex to RGB
   */
  private hexToRgb(
    hex: string
  ): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      hex
    );
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Get current color as hex
   */
  private getCurrentColor(): string {
    const rgb = this.hsvToRgb(
      this.hue,
      this.saturation,
      this.value_hsv
    );
    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  /**
   * Update color and emit events
   */
  private updateColor(emitChange = false): void {
    const newValue = this.getCurrentColor();
    this.value = newValue;

    if (this.nativeInput) {
      this.nativeInput.value = newValue;
    }

    const eventName = emitChange ? "mb-change" : "mb-input";
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { value: newValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle grid (saturation/value) interaction
   */
  private handleGridPointerDown = (e: PointerEvent): void => {
    if (this.disabled) return;
    this.isDraggingGrid = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this.updateGridPosition(e);
  };

  private handleGridPointerMove = (e: PointerEvent): void => {
    if (!this.isDraggingGrid) return;
    this.updateGridPosition(e);
  };

  private handleGridPointerUp = (e: PointerEvent): void => {
    if (!this.isDraggingGrid) return;
    this.isDraggingGrid = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    this.updateColor(true);
    this.isOpen = false;
  };

  private updateGridPosition(e: PointerEvent): void {
    if (!this.gridElement) return;

    const rect = this.gridElement.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(e.clientX - rect.left, rect.width)
    );
    const y = Math.max(
      0,
      Math.min(e.clientY - rect.top, rect.height)
    );

    this.saturation = (x / rect.width) * 100;
    this.value_hsv = 100 - (y / rect.height) * 100;

    this.updateColor(false);
  }

  /**
   * Handle hue slider interaction
   */
  private handleHuePointerDown = (e: PointerEvent): void => {
    if (this.disabled) return;
    this.isDraggingHue = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this.updateHuePosition(e);
  };

  private handleHuePointerMove = (e: PointerEvent): void => {
    if (!this.isDraggingHue) return;
    this.updateHuePosition(e);
  };

  private handleHuePointerUp = (e: PointerEvent): void => {
    if (!this.isDraggingHue) return;
    this.isDraggingHue = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    this.updateColor(true);
    this.isOpen = false;
  };

  private updateHuePosition(e: PointerEvent): void {
    if (!this.hueElement) return;

    const rect = this.hueElement.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(e.clientX - rect.left, rect.width)
    );
    this.hue = (x / rect.width) * 360;

    this.updateColor(false);
  }

  /**
   * Handle native color input (fallback)
   */
  private handleNativeInput = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.parseColor(input.value);
    this.updateColor(true);
  };

  /**
   * Handle swatch click (toggles picker)
   */
  private handleSwatchClick = (e: Event): void => {
    if (this.disabled) return;
    e.stopPropagation();
    this.isOpen = !this.isOpen;
  };

  /**
   * Handle clicks outside the color picker to close it
   */
  private handleDocumentClick = (e: Event): void => {
    if (!this.isOpen) return;

    const path = e.composedPath();
    if (!path.includes(this)) {
      this.isOpen = false;
    }
  };

  render() {
    const currentColor = this.getCurrentColor();
    const hueRgb = this.hsvToRgb(this.hue, 100, 100);
    const hueColor = this.rgbToHex(hueRgb.r, hueRgb.g, hueRgb.b);
    const gridHandleX = (this.saturation / 100) * 100;
    const gridHandleY = (1 - this.value_hsv / 100) * 100;
    const hueHandleX = (this.hue / 360) * 100;

    return html`
      <div class="mb-color-picker" part="base">
        ${this.label
          ? html`<label class="mb-color-picker__label" part="label"
              >${this.label}</label
            >`
          : nothing}
        <!-- Preview swatch -->
        <div
          class="mb-color-picker__swatch"
          part="swatch"
          @click=${this.handleSwatchClick}
          role="button"
          .tabIndex=${this.disabled ? -1 : 0}
          aria-label="${this.label || "Color swatch"}"
        >
          <div
            class="mb-color-picker__swatch-color"
            style="background: ${currentColor};"
          ></div>
        </div>

        <!-- Picker controls (absolutely positioned) -->
        ${this.isOpen
          ? html`
              <div class="mb-color-picker__controls" part="controls">
                <!-- Saturation/Value grid -->
                <div
                  class="mb-color-picker__grid"
                  part="grid"
                  style="background-color: ${hueColor};"
                  @pointerdown=${this.handleGridPointerDown}
                  @pointermove=${this.handleGridPointerMove}
                  @pointerup=${this.handleGridPointerUp}
                  role="slider"
                  aria-label="Color saturation and brightness"
                  .tabIndex=${this.disabled ? -1 : 0}
                >
                  <div class="mb-color-picker__grid-gradient"></div>
                  <div
                    class="mb-color-picker__grid-handle"
                    part="grid-handle"
                    style="left: ${gridHandleX}%; top: ${gridHandleY}%;"
                  ></div>
                </div>

                <!-- Hue slider -->
                <div
                  class="mb-color-picker__hue-slider"
                  part="hue-slider"
                  @pointerdown=${this.handleHuePointerDown}
                  @pointermove=${this.handleHuePointerMove}
                  @pointerup=${this.handleHuePointerUp}
                  role="slider"
                  aria-label="Color hue"
                  .tabIndex=${this.disabled ? -1 : 0}
                >
                  <div
                    class="mb-color-picker__hue-handle"
                    part="hue-handle"
                    style="left: ${hueHandleX}%;"
                  ></div>
                </div>
              </div>
            `
          : nothing}

        <!-- Native color input (hidden fallback) -->
        <input
          type="color"
          class="mb-color-picker__native"
          .value=${currentColor}
          @input=${this.handleNativeInput}
          ?disabled=${this.disabled}
          tabindex="-1"
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-color-picker": MbColorPicker;
  }
}
