/**
 * CatInteractions Component
 *
 * Manages cat interactions with needs, yarn, laser, and other interactive elements.
 * This component coordinates the cat's AI behavior responses to environmental stimuli.
 */

import type { Cat } from "../../meowtion/cat.js";
import type { Brain } from "../../meowbrain/brain.js";
import type { InteractionManager } from "../managers/interaction-manager.js";
import type { HookManager } from "../managers/hook-manager.js";
import { EventEmitter } from "../../utilities/event-emitter.js";

export type InteractionEvent =
  | "needResponded"
  | "yarnPlayStarted"
  | "yarnPlayEnded"
  | "laserChased"
  | "brainReaction";

export interface InteractionEventData {
  catId: string;
  interactionId?: string;
  interactionType?: string;
}

/**
 * Component that manages cat interactions (needs, yarn, laser, etc.)
 */
export class CatInteractions extends EventEmitter<InteractionEvent> {
  private brain: Brain;
  private catId: string;
  private interactions: InteractionManager;
  private hooks: HookManager;
  private isActive: boolean = false;

  constructor(
    _cat: Cat, // Reserved for future use
    brain: Brain,
    catId: string,
    interactions: InteractionManager,
    hooks: HookManager
  ) {
    super();
    this.brain = brain;
    this.catId = catId;
    this.interactions = interactions;
    this.hooks = hooks;

    // Setup brain reaction listener
    this.brain.on("reactionTriggered", this.handleBrainReaction);
  }

  /**
   * Set whether interactions are active (cat is running)
   * @internal
   */
  setActive(active: boolean): void {
    this.isActive = active;
  }

  /**
   * Respond to a placed need (food/water)
   *
   * Evaluates cat's interest based on personality, then approaches and consumes if interested.
   *
   * @param needId - ID of the need to respond to
   *
   * @example
   * ```ts
   * const need = await meowzer.interactions.placeNeed("food:fancy", { x: 500, y: 300 });
   * await cat.interactions.respondToNeed(need.id);
   * ```
   */
  async respondToNeed(needId: string): Promise<void> {
    const need = this.interactions.getNeed(needId);

    if (!need || !need.isActive()) return;

    // Evaluate interest
    const interest = this.brain.evaluateInterest(need);

    if (interest > 0.5) {
      // Personality-based delay (more independent cats take longer to respond)
      const personality = this.brain.personality;
      const delay = personality.independence * 2000; // 0-2 seconds

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // Verify need is still active after delay
      if (!need.isActive()) return;

      // Trigger lifecycle hook
      await this.hooks._trigger("beforeInteractionStart", {
        catId: this.catId,
        interactionId: needId,
        interactionType: "need",
      });

      // Register initial interest
      this.interactions._registerCatResponse(this.catId, needId, "interested");

      // Approach the need
      this.interactions._registerCatResponse(this.catId, needId, "approaching");
      await this.brain._approachTarget(need.position);

      // Verify need is still active after approach
      if (!need.isActive()) {
        // Need disappeared during approach - silently return
        return;
      }

      // Consume the need
      this.interactions._registerCatResponse(this.catId, needId, "consuming");
      need._addConsumingCat(this.catId);
      await this.brain._consumeNeed();

      // Mark as satisfied
      need._removeConsumingCat(this.catId);
      this.interactions._registerCatResponse(this.catId, needId, "satisfied");

      // Trigger lifecycle hook
      await this.hooks._trigger("afterInteractionEnd", {
        catId: this.catId,
        interactionId: needId,
        interactionType: "need",
      });

      // Emit event
      this.emit("needResponded", {
        catId: this.catId,
        interactionId: needId,
        interactionType: "need",
      });
    } else {
      // Not interested
      this.interactions._registerCatResponse(this.catId, needId, "ignoring");
    }
  }

  /**
   * Make cat play with yarn
   *
   * Cat evaluates interest in yarn, then may approach and bat/chase it.
   *
   * @param yarnId - ID of the yarn to play with
   *
   * @example
   * ```ts
   * const yarn = await meowzer.interactions.placeYarn({ x: 500, y: 300 });
   * await cat.interactions.playWithYarn(yarn.id);
   * ```
   */
  async playWithYarn(yarnId: string): Promise<void> {
    const yarn = this.interactions.getYarn(yarnId);

    if (!yarn || !yarn.isActive) return;

    // Evaluate interest (higher for moving yarn)
    let interest = this.brain.evaluateInterest({
      type: "yarn",
      position: yarn.position,
      state: yarn.state,
    });

    // Boost interest if yarn is moving
    if (yarn.state === "rolling" || yarn.state === "dragging") {
      interest *= 1.5;
    }

    if (interest > 0.5) {
      const personality = this.brain.personality;
      const delay = personality.independence * 1000; // 0-1 seconds

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // Verify yarn is still active
      if (!yarn.isActive) return;

      // Trigger lifecycle hook
      await this.hooks._trigger("beforeInteractionStart", {
        catId: this.catId,
        interactionId: yarnId,
        interactionType: "yarn",
      });

      // Emit start event
      this.emit("yarnPlayStarted", {
        catId: this.catId,
        interactionId: yarnId,
        interactionType: "yarn",
      });

      // Mark cat as playing with yarn
      yarn._addPlayingCat(this.catId);

      // Approach the yarn
      await this.brain._approachTarget(yarn.position);

      // Verify yarn is still there
      if (!yarn.isActive) {
        yarn._removePlayingCat(this.catId);
        return;
      }

      // Play session: batting and chasing
      const playDuration = personality.energy * 10000; // 0-10 seconds
      const startTime = Date.now();

      while (Date.now() - startTime < playDuration && yarn.isActive) {
        // Bat at yarn
        await this.brain._batAtYarn();

        // Apply force to yarn
        const force = {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
        };
        yarn.applyForce(force);

        // If yarn is now rolling, chase it
        if (yarn.state === "rolling") {
          await this.brain._approachTarget(yarn.position);
        }

        // Short pause between interactions
        await new Promise((resolve) =>
          setTimeout(resolve, 500 + Math.random() * 1000)
        );
      }

      // Done playing
      yarn._removePlayingCat(this.catId);

      // Trigger lifecycle hook
      await this.hooks._trigger("afterInteractionEnd", {
        catId: this.catId,
        interactionId: yarnId,
        interactionType: "yarn",
      });

      // Emit end event
      this.emit("yarnPlayEnded", {
        catId: this.catId,
        interactionId: yarnId,
        interactionType: "yarn",
      });
    }
  }

  /**
   * Chase laser pointer
   *
   * Makes the cat chase a specific position (like a laser pointer dot).
   * Cats will automatically react to laser pointer movements through
   * brain detection, but this method can be called manually.
   *
   * @param position - Target position to chase
   *
   * @example
   * ```ts
   * await cat.interactions.chaseLaser({ x: 500, y: 300 });
   * ```
   */
  async chaseLaser(position: { x: number; y: number }): Promise<void> {
    // Evaluate interest
    const interest = this.brain.evaluateInterest({
      type: "laser",
      position,
    });

    if (interest > 0.5) {
      const personality = this.brain.personality;

      // Trigger lifecycle hook
      await this.hooks._trigger("beforeInteractionStart", {
        catId: this.catId,
        interactionId: "laser",
        interactionType: "laser",
      });

      // Chase the laser position
      await this.brain._chaseTarget(position, {
        speed: 200 + personality.energy * 100,
      });

      // Trigger lifecycle hook
      await this.hooks._trigger("afterInteractionEnd", {
        catId: this.catId,
        interactionId: "laser",
        interactionType: "laser",
      });

      // Emit event
      this.emit("laserChased", {
        catId: this.catId,
        interactionId: "laser",
        interactionType: "laser",
      });
    }
  }

  /**
   * Handle brain reaction events (need detection, yarn detection, etc.)
   * Note: Laser detection removed - laser interaction manager not yet implemented
   */
  private handleBrainReaction = async (data: any): Promise<void> => {
    if (!this.isActive) return;

    // Handle need reactions
    if (data.type === "needDetected") {
      if (data.needId) {
        await this.respondToNeed(data.needId);
      }
    }

    // Handle yarn reactions
    if (data.type === "yarnDetected" || data.type === "yarnMoving") {
      if (data.yarnId) {
        await this.playWithYarn(data.yarnId);
      }
    }

    // Emit generic reaction event
    this.emit("brainReaction", {
      catId: this.catId,
    });
  };

  /**
   * Cleanup event listeners
   */
  destroy(): void {
    this.brain.off("reactionTriggered", this.handleBrainReaction);
    this.clear();
  }
}
