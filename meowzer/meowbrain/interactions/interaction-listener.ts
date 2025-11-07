/**
 * InteractionListener - Handles event-based interaction notifications
 */

import type { Cat } from "../../meowtion/cat.js";
import type { Position, Personality } from "../../types/index.js";

export interface InteractionEvent {
  id: string;
  position: Position;
  type?: string;
  state?: string;
  velocity?: { x: number; y: number };
}

/**
 * Manages event-based interaction listeners
 * Listens to global interaction events and notifies the brain
 */
export class InteractionListener {
  private cat: Cat;
  private personality: Personality;
  private evaluateInterest: (target: any) => number;
  private emitReaction: (type: string, data: any) => void;
  private running: boolean = false;
  private destroyed: boolean = false;

  // Bound handlers for cleanup
  private boundHandleNeedPlaced: (event: InteractionEvent) => void;
  private boundHandleYarnPlaced: (event: InteractionEvent) => void;
  private boundHandleYarnMoved: (event: InteractionEvent) => void;
  private boundHandleLaserActivated: (
    event: InteractionEvent
  ) => void;
  private boundHandleLaserMoved: (event: InteractionEvent) => void;
  private boundHandleLaserDeactivated: () => void;

  constructor(
    cat: Cat,
    personality: Personality,
    evaluateInterest: (target: any) => number,
    emitReaction: (type: string, data: any) => void
  ) {
    this.cat = cat;
    this.personality = personality;
    this.evaluateInterest = evaluateInterest;
    this.emitReaction = emitReaction;

    // Bind handlers for consistent cleanup
    this.boundHandleNeedPlaced = this.handleNeedPlaced.bind(this);
    this.boundHandleYarnPlaced = this.handleYarnPlaced.bind(this);
    this.boundHandleYarnMoved = this.handleYarnMoved.bind(this);
    this.boundHandleLaserActivated =
      this.handleLaserActivated.bind(this);
    this.boundHandleLaserMoved = this.handleLaserMoved.bind(this);
    this.boundHandleLaserDeactivated =
      this.handleLaserDeactivated.bind(this);
  }

  /**
   * Setup all event listeners
   */
  setup(): void {
    if (this.destroyed) return;
    if (this.running) return;

    this.setupNeedListener();
    this.setupYarnListener();
    this.setupLaserListener();

    this.running = true;
  }

  /**
   * Teardown all event listeners
   */
  teardown(): void {
    if (!this.running) return;

    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];

      if (interactions) {
        interactions.off("needPlaced", this.boundHandleNeedPlaced);
        interactions.off("yarnPlaced", this.boundHandleYarnPlaced);
        interactions.off("yarnMoved", this.boundHandleYarnMoved);
        interactions.off(
          "laser:activated",
          this.boundHandleLaserActivated
        );
        interactions.off("laser:moved", this.boundHandleLaserMoved);
        interactions.off(
          "laser:deactivated",
          this.boundHandleLaserDeactivated
        );
      }
    } catch {
      // Ignore cleanup errors
    }

    this.running = false;
  }

  /**
   * Destroy the listener (permanent teardown)
   */
  destroy(): void {
    this.teardown();
    this.destroyed = true;
  }

  /**
   * Setup listener for need placement events
   */
  private setupNeedListener(): void {
    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];

      if (interactions) {
        interactions.on("needPlaced", this.boundHandleNeedPlaced);
      }
    } catch {
      // Interactions not available - this is okay
    }
  }

  /**
   * Setup listener for yarn events
   */
  private setupYarnListener(): void {
    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];

      if (interactions) {
        interactions.on("yarnPlaced", this.boundHandleYarnPlaced);
        interactions.on("yarnMoved", this.boundHandleYarnMoved);
      }
    } catch (error) {
      console.error(
        "[InteractionListener] Error setting up yarn listener:",
        error
      );
    }
  }

  /**
   * Setup listener for laser pointer events
   */
  private setupLaserListener(): void {
    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];

      if (interactions) {
        interactions.on(
          "laser:activated",
          this.boundHandleLaserActivated
        );
        interactions.on("laser:moved", this.boundHandleLaserMoved);
        interactions.on(
          "laser:deactivated",
          this.boundHandleLaserDeactivated
        );
      } else {
        console.warn(
          `[InteractionListener ${this.cat.id.slice(
            0,
            8
          )}] Global interactions emitter not found during setup!`
        );
      }
    } catch (error) {
      console.error(
        `[InteractionListener ${this.cat.id.slice(
          0,
          8
        )}] Error setting up laser listener:`,
        error
      );
    }
  }

  /**
   * Handle need placed event
   */
  private handleNeedPlaced(event: InteractionEvent): void {
    if (!this.running || this.destroyed) return;

    const dist = Math.hypot(
      event.position.x - this.cat.position.x,
      event.position.y - this.cat.position.y
    );

    const detectionRange = 150;

    if (dist <= detectionRange) {
      const interest = this.evaluateInterest({
        type: event.type,
        position: event.position,
      });

      if (interest > 0.7 && this.personality.independence < 0.5) {
        this.emitReaction("reactionTriggered", {
          type: "needDetected",
          needId: event.id,
          interest,
        });
      }
    }
  }

  /**
   * Handle yarn placed event
   */
  private handleYarnPlaced(event: InteractionEvent): void {
    if (!this.running || this.destroyed) return;

    const dist = Math.hypot(
      event.position.x - this.cat.position.x,
      event.position.y - this.cat.position.y
    );

    const detectionRange = 150;

    if (dist <= detectionRange) {
      const interest = this.evaluateInterest({
        type: "yarn",
        position: event.position,
      });

      if (interest >= 0.5 && this.personality.curiosity >= 0.3) {
        this.emitReaction("reactionTriggered", {
          type: "yarnDetected",
          yarnId: event.id,
          interest,
        });
      }
    }
  }

  /**
   * Handle yarn movement
   */
  private handleYarnMoved(event: InteractionEvent): void {
    if (!this.running || this.destroyed) return;

    // Only react to rolling yarn
    if (event.state !== "rolling") return;

    const dist = Math.hypot(
      event.position.x - this.cat.position.x,
      event.position.y - this.cat.position.y
    );

    const detectionRange = 200; // Larger for moving objects

    if (dist <= detectionRange) {
      const interest = this.evaluateInterest({
        type: "yarn",
        position: event.position,
        state: event.state,
      });

      // Moving yarn is more interesting
      const adjustedInterest = interest * 1.3;

      if (adjustedInterest >= 0.6 && this.personality.energy >= 0.3) {
        this.emitReaction("reactionTriggered", {
          type: "yarnMoving",
          yarnId: event.id,
          interest: adjustedInterest,
        });
      }
    }
  }

  /**
   * Handle laser pointer activation
   */
  private handleLaserActivated(event: InteractionEvent): void {
    if (!this.running || this.destroyed) return;

    const interest = this.evaluateInterest({
      type: "laser",
      position: event.position,
    });

    if (interest > 0.5 && this.personality.curiosity > 0.3) {
      this.emitReaction("reactionTriggered", {
        type: "laserDetected",
        laserId: event.id,
        interest,
      });
    }
  }

  /**
   * Handle laser pointer movement
   */
  private handleLaserMoved(event: InteractionEvent): void {
    if (!this.running || this.destroyed) return;

    const dist = Math.hypot(
      event.position.x - this.cat.position.x,
      event.position.y - this.cat.position.y
    );

    const detectionRange = 300; // Large detection range for laser

    if (dist <= detectionRange) {
      const interest = this.evaluateInterest({
        type: "laser",
        position: event.position,
      });

      // Laser is highly interesting, especially when moving
      const adjustedInterest = interest * 1.5;

      if (adjustedInterest > 0.6 && this.personality.energy > 0.2) {
        // Set visual indicator
        this.cat.setLaserInterested(true);

        this.emitReaction("reactionTriggered", {
          type: "laserMoving",
          laserId: event.id,
          interest: adjustedInterest,
        });
      } else {
        // Not interested anymore
        this.cat.setLaserInterested(false);
      }
    } else {
      // Out of range
      this.cat.setLaserInterested(false);
    }
  }

  /**
   * Handle laser pointer deactivation
   */
  private handleLaserDeactivated(): void {
    // Clear visual indicator
    this.cat.setLaserInterested(false);

    this.emitReaction("reactionTriggered", {
      type: "laserDeactivated",
      interest: 0,
    });
  }
}
