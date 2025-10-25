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
} from "../types.js";
import { resolvePersonality } from "./personality.js";
import type { BehaviorType } from "./behaviors.js";
import {
  wandering,
  resting,
  playing,
  observing,
  exploring,
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
}
