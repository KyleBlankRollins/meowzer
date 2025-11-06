/**
 * Cat DOM module
 * Handles DOM element creation and manipulation
 */

import type { ProtoCat, Position } from "../../types/index.js";

/**
 * CatDOM class
 * Manages DOM-related operations for cats
 */
export class CatDOM {
  private element: HTMLElement;
  private position: Position;

  constructor(
    protoCat: ProtoCat,
    position: Position,
    container?: HTMLElement
  ) {
    this.position = position;
    this.element = this.createElement(protoCat);

    // Append to container
    const targetContainer = container || document.body;
    targetContainer.appendChild(this.element);
  }

  /**
   * Create the cat HTML element
   */
  private createElement(protoCat: ProtoCat): HTMLElement {
    const div = document.createElement("div");
    div.className = "meowtion-cat";
    div.setAttribute("data-cat-id", protoCat.id);
    div.setAttribute("data-state", "idle");
    div.setAttribute("data-paused", "false");
    div.innerHTML = protoCat.spriteData.svg;

    // Add info container
    const infoContainer = document.createElement("div");
    infoContainer.className = "meowtion-cat-info";

    // Add name label
    const nameLabel = document.createElement("div");
    nameLabel.className = "meowtion-cat-name";
    nameLabel.textContent = protoCat.name || "Unknown Cat";
    infoContainer.appendChild(nameLabel);

    // Add state label
    const stateLabel = document.createElement("div");
    stateLabel.className = "meowtion-cat-state";
    stateLabel.textContent = "Idle";
    infoContainer.appendChild(stateLabel);

    div.appendChild(infoContainer);

    // Set initial position
    div.style.left = `${this.position.x}px`;
    div.style.top = `${this.position.y}px`;

    // Apply scale to the container div instead of SVG
    // This prevents conflicts with CSS animation transforms
    const scale = protoCat.dimensions.scale;
    if (scale !== 1) {
      div.style.transform = `scale(${scale})`;
      div.style.transformOrigin = "top left";
    }

    return div;
  }

  /**
   * Update the cat's visual position in the DOM
   */
  updatePosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }

  /**
   * Update the cat's state attribute
   */
  updateState(state: string): void {
    this.element.setAttribute("data-state", state);
  }

  /**
   * Update the paused attribute
   */
  updatePaused(paused: boolean): void {
    this.element.setAttribute("data-paused", String(paused));
  }

  /**
   * Get the DOM element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Remove the element from the DOM
   */
  remove(): void {
    this.element.remove();
  }

  /**
   * Get the SVG element
   */
  getSVG(): SVGSVGElement | null {
    return this.element.querySelector("svg");
  }

  /**
   * Update the state text display
   */
  updateStateText(text: string): void {
    const stateLabel = this.element.querySelector(
      ".meowtion-cat-state"
    );
    if (stateLabel) {
      stateLabel.textContent = text;
    }
  }

  /**
   * Update the cat name display
   */
  updateNameText(name: string): void {
    const nameLabel = this.element.querySelector(
      ".meowtion-cat-name"
    );
    if (nameLabel) {
      nameLabel.textContent = name;
    }
  }

  /**
   * Set laser-interested attribute (for visual feedback)
   */
  setLaserInterested(interested: boolean): void {
    if (interested) {
      this.element.setAttribute("data-laser-interested", "true");
    } else {
      this.element.removeAttribute("data-laser-interested");
    }
  }
}
