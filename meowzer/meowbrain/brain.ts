/**
 * Brain class - Controls autonomous cat behavior
 */

import type { Cat } from "../meowtion/cat.js";
import type {
  Personality,
  PersonalityPreset,
  Memory,
  Environment,
  BrainState,
  Position,
} from "../types/index.js";
import { resolvePersonality } from "./personality.js";
import type { BehaviorType } from "./behaviors.js";
import {
  wandering,
  resting,
  playing,
  observing,
  exploring,
  approaching,
  consuming,
  getBehaviorDuration,
} from "./behaviors.js";
import {
  calculateBehaviorWeights,
  chooseBehavior,
  updateMotivations,
  updateMemory,
  isValidBehaviorTransition,
} from "./decision-engine.js";
import { EventEmitter } from "../utilities/event-emitter.js";
import type { EventHandler } from "../utilities/event-emitter.js";

type BrainEvent =
  | "behaviorChange"
  | "decisionMade"
  | "reactionTriggered";

export interface BrainOptions {
  personality?: Personality | PersonalityPreset;
  environment?: Environment;
  decisionInterval?: [number, number]; // [min, max] in milliseconds
  motivationDecay?: {
    rest: number;
    stimulation: number;
    exploration: number;
  };
}

export class Brain {
  public readonly id: string;
  public readonly cat: Cat;

  private _personality: Personality;
  private _environment: Environment;
  private _state: BrainState;
  private _memory: Memory;
  private _motivationDecay: {
    rest: number;
    stimulation: number;
    exploration: number;
  };
  private _decisionInterval: [number, number];

  private _running: boolean = false;
  private _destroyed: boolean = false;
  private _decisionTimeoutId: any = null;
  private _behaviorPromise: Promise<void> | null = null;
  private _lastUpdateTime: number = Date.now();
  private _boundaryHitCount: number = 0;

  private events: EventEmitter<BrainEvent>;

  constructor(cat: Cat, options: BrainOptions = {}) {
    this.cat = cat;
    this.id = `brain-${cat.id}`;

    // Initialize event system
    this.events = new EventEmitter<BrainEvent>();

    // Initialize personality
    this._personality = options.personality
      ? resolvePersonality(options.personality)
      : resolvePersonality("balanced");

    // Initialize environment
    this._environment = options.environment || {
      boundaries: cat.boundaries,
    };

    // Initialize decision interval
    this._decisionInterval = options.decisionInterval || [2000, 5000];

    // Initialize motivation decay rates
    this._motivationDecay = options.motivationDecay || {
      rest: 0.001,
      stimulation: 0.002,
      exploration: 0.0015,
    };

    // Initialize state
    this._state = {
      currentBehavior: "wandering",
      motivation: {
        rest: 0.2,
        stimulation: 0.3,
        exploration: 0.4,
      },
      lastDecisionTime: Date.now(),
      decisionCooldown: this._randomDecisionInterval(),
    };

    // Initialize memory
    this._memory = {
      visitedPositions: [{ ...cat.position }],
      lastInteractionTime: Date.now(),
      boundaryHits: 0,
      previousBehaviors: [],
    };

    // Listen to cat events
    this.cat.on("boundaryHit", this._handleBoundaryHit.bind(this));

    // Listen for need placement events (hybrid detection: broadcast)
    this._setupNeedListener();
  }

  // Public getters
  get personality(): Personality {
    return { ...this._personality };
  }

  get state(): BrainState {
    return {
      ...this._state,
      motivation: { ...this._state.motivation },
    };
  }

  get memory(): Memory {
    return {
      ...this._memory,
      visitedPositions: [...this._memory.visitedPositions],
      previousBehaviors: [...this._memory.previousBehaviors],
    };
  }

  get environment(): Environment {
    return { ...this._environment };
  }

  get isRunning(): boolean {
    return this._running && !this._destroyed;
  }

  // Lifecycle methods
  start(): void {
    if (this._destroyed) {
      throw new Error("Cannot start destroyed brain");
    }

    if (this._running) return;

    this._running = true;
    this._lastUpdateTime = Date.now();

    console.log("Brain started:", {
      catId: this.cat.id,
      personality: this._personality,
      currentBehavior: this._state.currentBehavior,
      decisionInterval: this._decisionInterval,
    });

    this._scheduleNextDecision();
  }

  stop(): void {
    if (!this._running) return;

    this._running = false;

    if (this._decisionTimeoutId !== null) {
      clearTimeout(this._decisionTimeoutId);
      this._decisionTimeoutId = null;
    }

    // Stop the cat
    this.cat.stop();
  }

  destroy(): void {
    if (this._destroyed) return;

    this.stop();

    // Clean up need listener
    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];
      if (interactions) {
        interactions.off("needPlaced", this._handleNeedPlaced);
      }
    } catch {
      // Ignore - interactions may not be available
    }

    this._destroyed = true;
    this.events.clear();
  }

  // Configuration methods
  setPersonality(
    personality: Partial<Personality> | PersonalityPreset
  ): void {
    if (this._destroyed) return;

    if (typeof personality === "string") {
      this._personality = resolvePersonality(personality);
    } else {
      this._personality = { ...this._personality, ...personality };
    }
  }

  setEnvironment(environment: Environment): void {
    if (this._destroyed) return;
    this._environment = { ...this._environment, ...environment };
  }

  // Event system
  on(event: BrainEvent, handler: EventHandler): void {
    this.events.on(event, handler);
  }

  off(event: BrainEvent, handler: EventHandler): void {
    this.events.off(event, handler);
  }

  private _emit(event: BrainEvent, data: any): void {
    this.events.emit(event, data);
  }

  // Private methods
  private _randomDecisionInterval(): number {
    const [min, max] = this._decisionInterval;
    return Math.random() * (max - min) + min;
  }

  private _scheduleNextDecision(): void {
    if (!this._running || this._destroyed) return;

    const cooldown = this._randomDecisionInterval();
    this._state.decisionCooldown = cooldown;

    this._decisionTimeoutId = setTimeout(() => {
      this._makeDecision();
    }, cooldown);
  }

  private async _makeDecision(): Promise<void> {
    if (!this._running || this._destroyed) return;

    console.log("Making decision for cat:", this.cat.id);

    // Update motivations based on time passed
    const now = Date.now();
    const deltaTime = (now - this._lastUpdateTime) / 1000; // Convert to seconds
    this._lastUpdateTime = now;

    this._state.motivation = updateMotivations(
      this._state.motivation,
      this._state.currentBehavior,
      deltaTime,
      this._motivationDecay
    );

    // Calculate behavior weights
    const weights = calculateBehaviorWeights(
      this._personality,
      this._state.motivation,
      this._memory,
      this._environment
    );

    // Check for nearby needs (hybrid detection: polling)
    const nearbyNeeds = this._checkNearbyNeeds();
    if (nearbyNeeds.length > 0) {
      // Evaluate interest in nearest need
      const nearest = nearbyNeeds[0];
      const interest = this.evaluateInterest(nearest);

      if (interest > 0.5) {
        // Boost approaching behavior weight
        weights.approaching += interest * 2;
      }
    }

    // Choose a behavior
    let chosenBehavior = chooseBehavior(weights);

    // Ensure valid transition
    if (
      !isValidBehaviorTransition(
        this._state.currentBehavior,
        chosenBehavior
      )
    ) {
      // Fall back to wandering if transition is invalid
      chosenBehavior = "wandering";
    }

    this._emit("decisionMade", {
      chosen: chosenBehavior,
      weights,
      motivation: { ...this._state.motivation },
    });

    // Update state
    const oldBehavior = this._state.currentBehavior;
    this._state.currentBehavior = chosenBehavior;
    this._state.lastDecisionTime = now;

    console.log("New cat behavior: ", this._state.currentBehavior);

    if (oldBehavior !== chosenBehavior) {
      this._emit("behaviorChange", {
        oldBehavior,
        newBehavior: chosenBehavior,
        motivation: { ...this._state.motivation },
      });
    }

    // Update memory
    this._memory = updateMemory(
      this._memory,
      { ...this.cat.position },
      chosenBehavior,
      this._boundaryHitCount > 0
    );
    this._boundaryHitCount = 0;

    // Execute behavior
    await this._executeBehavior(chosenBehavior);

    // Schedule next decision
    this._scheduleNextDecision();
  }

  private async _executeBehavior(
    behavior: BehaviorType
  ): Promise<void> {
    if (!this._running || this._destroyed) return;

    const duration = getBehaviorDuration(
      behavior,
      this._personality.energy
    );

    try {
      switch (behavior) {
        case "wandering":
          this._behaviorPromise = wandering(this.cat, duration);
          break;
        case "resting":
          this._behaviorPromise = resting(this.cat, duration);
          break;
        case "playing":
          this._behaviorPromise = playing(this.cat, duration);
          break;
        case "observing":
          this._behaviorPromise = observing(this.cat, duration);
          break;
        case "exploring":
          this._behaviorPromise = exploring(
            this.cat,
            duration,
            this._memory.visitedPositions
          );
          break;
        case "approaching":
          // Approaching requires a target, which should be set elsewhere
          // For now, skip if no target is available
          console.warn(
            "Approaching behavior requires external target management"
          );
          break;
        case "consuming":
          // Consuming will be triggered by interaction system
          console.warn(
            "Consuming behavior should be triggered by interaction system"
          );
          break;
      }

      await this._behaviorPromise;
    } catch (error) {
      // Behavior was interrupted or cat was destroyed
    } finally {
      this._behaviorPromise = null;
    }
  }

  private _handleBoundaryHit(): void {
    this._boundaryHitCount++;
    this._memory.boundaryHits = Math.min(
      5,
      this._memory.boundaryHits + 1
    );

    this._emit("reactionTriggered", {
      type: "boundaryHit",
      count: this._boundaryHitCount,
    });
  }

  /**
   * Check for nearby needs (hybrid detection: polling)
   * @internal
   */
  private _checkNearbyNeeds(): Array<{
    type: string;
    position: Position;
    id: string;
  }> {
    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];

      if (!interactions) return [];

      const needs = interactions.getNeedsNearPosition(
        this.cat.position
      );
      return needs.map((need: any) => ({
        type: need.type,
        position: need.position,
        id: need.id,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Setup listener for need placement events (hybrid detection: broadcast)
   * @internal
   */
  private _setupNeedListener(): void {
    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];

      if (interactions) {
        interactions.on(
          "needPlaced",
          this._handleNeedPlaced.bind(this)
        );
      }
    } catch {
      // Interactions not available - this is okay
    }
  }

  /**
   * Handle need placed event (immediate reaction for nearby needs)
   * @internal
   */
  private _handleNeedPlaced = (event: {
    id: string;
    type: string;
    position: Position;
  }): void => {
    if (!this._running || this._destroyed) return;

    // Check if need is nearby
    const dist = Math.hypot(
      event.position.x - this.cat.position.x,
      event.position.y - this.cat.position.y
    );

    const detectionRange = 150; // From default config

    if (dist <= detectionRange) {
      // Evaluate immediate interest
      const interest = this.evaluateInterest({
        type: event.type,
        position: event.position,
      });

      // If very interested and not too independent, react immediately
      if (interest > 0.7 && this._personality.independence < 0.5) {
        this._emit("reactionTriggered", {
          type: "needDetected",
          needId: event.id,
          interest,
        });
      }
    }
  };

  /**
   * Evaluate whether cat is interested in a need
   *
   * Takes into account personality, current state, and need type.
   * Returns a number 0-1 representing interest level.
   *
   * @param need - The need object with type and position
   * @returns Interest level (0-1), where values > 0.5 indicate interest
   */
  evaluateInterest(need: {
    type: string;
    position: Position;
  }): number {
    if (this._destroyed) return 0;

    // Start with base interest from personality traits
    let interest = 0;

    // Different need types have different base appeal
    if (need.type === "food:basic") {
      // Basic food: Appeals to lower energy cats
      interest = 0.5 + (1 - this._personality.energy) * 0.3;
      // Independent cats are less interested
      interest *= 1 - this._personality.independence * 0.3;
    } else if (need.type === "food:fancy") {
      // Fancy food: More universally appealing
      interest = 0.7 + this._personality.curiosity * 0.2;
      // Curious cats love fancy food
      interest *= 1 + this._personality.curiosity * 0.3;
    } else if (need.type === "water") {
      // Water: Moderate appeal, increases after activity
      interest = 0.4;
      // More appealing after active behaviors
      if (
        this._state.currentBehavior === "playing" ||
        this._state.currentBehavior === "exploring"
      ) {
        interest += 0.3;
      }
    }

    // Current state affects interest
    switch (this._state.currentBehavior) {
      case "resting":
        // Very low interest when resting unless it's fancy food
        interest *= need.type === "food:fancy" ? 0.5 : 0.2;
        break;
      case "consuming":
        // Already eating, no interest in more food
        return 0;
      case "playing":
        // Moderate interest, may finish playing first
        interest *= 0.6;
        break;
      case "approaching":
        // Already approaching something, lower interest
        interest *= 0.3;
        break;
    }

    // Rest motivation increases food interest
    interest += this._state.motivation.rest * 0.2;

    // Distance affects interest (farther = less interested)
    const dist = Math.hypot(
      need.position.x - this.cat.position.x,
      need.position.y - this.cat.position.y
    );
    const distanceFactor = Math.max(0, 1 - dist / 500); // Loses interest beyond 500px
    interest *= 0.7 + distanceFactor * 0.3;

    // Clamp to 0-1
    return Math.min(1, Math.max(0, interest));
  }

  /**
   * Trigger approaching behavior toward a target
   * Used by interaction system
   *
   * @internal
   */
  async _approachTarget(
    target: Position,
    options?: { speed?: number }
  ): Promise<void> {
    if (this._destroyed) return;

    const duration = getBehaviorDuration(
      "approaching",
      this._personality.energy
    );

    try {
      this._behaviorPromise = approaching(
        this.cat,
        target,
        duration,
        options
      );
      await this._behaviorPromise;
    } catch (error) {
      // Behavior was interrupted
    } finally {
      this._behaviorPromise = null;
    }
  }

  /**
   * Trigger consuming behavior
   * Used by interaction system
   *
   * @internal
   */
  async _consumeNeed(duration?: number): Promise<void> {
    if (this._destroyed) return;

    const consumeDuration =
      duration ??
      getBehaviorDuration("consuming", this._personality.energy);

    try {
      this._behaviorPromise = consuming(this.cat, consumeDuration);
      await this._behaviorPromise;
    } catch (error) {
      // Behavior was interrupted
    } finally {
      this._behaviorPromise = null;
    }
  }
}
