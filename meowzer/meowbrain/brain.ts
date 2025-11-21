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
  calculateBehaviorWeights,
  chooseBehavior,
  isValidBehaviorTransition,
} from "./decision-engine.js";
import { EventEmitter } from "../utilities/event-emitter.js";
import type { EventHandler } from "../utilities/event-emitter.js";
import { InteractionDetector } from "./interactions/interaction-detector.js";
import { InteractionListener } from "./interactions/interaction-listener.js";
import { InterestEvaluator } from "./interactions/interest-evaluator.js";
import { BehaviorOrchestrator } from "./behavior-orchestrator.js";
import { MotivationManager, MemoryManager } from "./state/index.js";

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
  private _decisionInterval: [number, number];

  private _running: boolean = false;
  private _destroyed: boolean = false;
  private _decisionTimeoutId: any = null;
  private _lastUpdateTime: number = Date.now();
  private _boundaryHitCount: number = 0;

  private events: EventEmitter<BrainEvent>;

  // New component instances
  private detector: InteractionDetector;
  private listener: InteractionListener;
  private evaluator: InterestEvaluator;
  private orchestrator: BehaviorOrchestrator;
  private motivationManager: MotivationManager;
  private memoryManager: MemoryManager;

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

    // Initialize motivation decay rates
    const motivationDecay = options.motivationDecay || {
      rest: 0.001,
      stimulation: 0.002,
      exploration: 0.0015,
    };

    // Initialize memory
    const initialMemory: Memory = {
      visitedPositions: [{ ...cat.position }],
      lastInteractionTime: Date.now(),
      boundaryHits: 0,
      previousBehaviors: [],
    };

    // Create component instances
    this.detector = new InteractionDetector(cat);
    this.evaluator = new InterestEvaluator(
      this._personality,
      () => this.state,
      cat
    );
    this.listener = new InteractionListener(
      cat,
      this._personality,
      (target) => this.evaluator.evaluateInterest(target),
      (event, data) => this._emit(event as BrainEvent, data)
    );
    this.orchestrator = new BehaviorOrchestrator(
      cat,
      this._personality
    );
    this.motivationManager = new MotivationManager(
      this._state.motivation,
      motivationDecay
    );
    this.memoryManager = new MemoryManager(initialMemory);

    // Listen to cat events
    this.cat.on("boundaryHit", this._handleBoundaryHit.bind(this));

    // Setup interaction listeners
    this.listener.setup();
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
    return this.memoryManager.current;
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

    // Clean up listener
    this.listener.destroy();

    // Destroy components
    this.orchestrator.destroy();

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

    // Update components with new personality
    this.orchestrator.updatePersonality(this._personality);
    this.evaluator.updatePersonality(this._personality);
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

    // Update motivations based on time passed
    const now = Date.now();
    const deltaTime = (now - this._lastUpdateTime) / 1000; // Convert to seconds
    this._lastUpdateTime = now;

    this._state.motivation = this.motivationManager.update(
      deltaTime,
      this._state.currentBehavior
    );

    // Calculate behavior weights
    const weights = calculateBehaviorWeights(
      this._personality,
      this._state.motivation,
      this.memoryManager.current,
      this._environment
    );

    // Check for nearby needs
    const nearbyNeeds = this.detector.checkNearbyNeeds();
    if (nearbyNeeds.length > 0) {
      // Evaluate interest in nearest need
      const nearest = nearbyNeeds[0];
      const interest = this.evaluator.evaluateInterest(nearest);

      if (interest > 0.5) {
        // Boost approaching behavior weight
        weights.approaching += interest * 2;
      }
    }

    // Check for nearby yarns
    const nearbyYarns = this.detector.checkNearbyYarns();
    if (nearbyYarns.length > 0) {
      const nearest = nearbyYarns[0];
      const interest = this.evaluator.evaluateInterest(nearest);

      if (interest > 0.5) {
        // Moving yarn triggers chasing, idle yarn triggers approaching
        if (nearest.state === "rolling") {
          weights.chasing += interest * 2.5;
        } else {
          weights.approaching += interest * 1.5;
        }
      }
    }

    // Check for nearby laser pointer
    const nearbyLaser = this.detector.checkNearbyLaser();
    if (nearbyLaser) {
      const interest = this.evaluator.evaluateInterest(nearbyLaser);

      if (interest > 0.5) {
        // Laser is highly interesting and triggers chasing
        weights.chasing += interest * 3.0;
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

    if (oldBehavior !== chosenBehavior) {
      this._emit("behaviorChange", {
        oldBehavior,
        newBehavior: chosenBehavior,
        motivation: { ...this._state.motivation },
      });
    }

    // Update memory
    this.memoryManager.update(
      { ...this.cat.position },
      chosenBehavior,
      this._boundaryHitCount > 0
    );
    this._boundaryHitCount = 0;

    // Build context with target information
    const context: any = {
      visitedPositions: this.memoryManager.current.visitedPositions,
    };

    // Add target information for chasing/approaching behaviors
    if (chosenBehavior === "chasing" || chosenBehavior === "approaching") {
      // Priority: laser > yarn > need
      if (nearbyLaser && chosenBehavior === "chasing") {
        context.target = nearbyLaser.position;
      } else if (nearbyYarns.length > 0) {
        context.target = nearbyYarns[0].position;
      } else if (nearbyNeeds.length > 0) {
        context.target = nearbyNeeds[0].position;
      }
    }

    // Execute behavior
    await this._executeBehavior(chosenBehavior, context);

    // Schedule next decision
    this._scheduleNextDecision();
  }

  private async _executeBehavior(
    behavior: BehaviorType,
    context: any = {}
  ): Promise<void> {
    if (!this._running || this._destroyed) return;

    try {
      await this.orchestrator.execute(behavior, context);
    } catch (error) {
      // Behavior was interrupted or cat was destroyed
    }
  }

  private _handleBoundaryHit(): void {
    this._boundaryHitCount++;
    this.memoryManager.incrementBoundaryHits();

    this._emit("reactionTriggered", {
      type: "boundaryHit",
      count: this._boundaryHitCount,
    });
  }

  /**
   * Evaluate whether cat is interested in a need or yarn
   *
   * Takes into account personality, current state, and target type.
   * Returns a number 0-1 representing interest level.
   *
   * @param target - The target object with type, position, and optional state
   * @returns Interest level (0-1), where values > 0.5 indicate interest
   */
  evaluateInterest(target: {
    type: string;
    position: Position;
    state?: string;
  }): number {
    return this.evaluator.evaluateInterest(target);
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
    return this.orchestrator.executeApproaching(target, options);
  }

  /**
   * Trigger consuming behavior
   * Used by interaction system
   *
   * @internal
   */
  async _consumeNeed(duration?: number): Promise<void> {
    if (this._destroyed) return;
    return this.orchestrator.executeConsuming(duration);
  }

  /**
   * Trigger batting behavior
   * Used by yarn interaction system
   *
   * @internal
   */
  async _batAtYarn(duration?: number): Promise<void> {
    if (this._destroyed) return;
    return this.orchestrator.executeBatting(duration);
  }

  /**
   * Trigger chasing behavior toward a moving target
   * Used by yarn interaction system
   *
   * @internal
   */
  async _chaseTarget(
    target: Position,
    options?: { speed?: number }
  ): Promise<void> {
    if (this._destroyed) return;
    return this.orchestrator.executeChasing(target, options);
  }
}
