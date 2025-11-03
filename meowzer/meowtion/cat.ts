/**
 * Cat class - Animated cat instance with movement and physics
 * Refactored to use modular components for better maintainability
 */

import type {
  ProtoCat,
  Position,
  Velocity,
  Boundaries,
  CatState,
  CatStateType,
  PhysicsOptions,
  PathOptions,
} from "../types/index.js";
import { isValidTransition } from "./state-machine.js";
import {
  injectBaseStyles,
  CatAnimationManager,
} from "./animations/index.js";
import {
  EventEmitter,
  type EventHandler,
} from "../utilities/event-emitter.js";
import { CatDOM } from "./cat/dom.js";
import { CatMovement, type MovementState } from "./cat/movement.js";
import { CatPhysics, type PhysicsState } from "./cat/physics.js";

type CatEvent =
  | "stateChange"
  | "moveStart"
  | "moveEnd"
  | "boundaryHit";

export class Cat {
  public readonly id: string;
  public readonly element: HTMLElement;
  public readonly protoCat: ProtoCat;

  private _state: CatState;
  private _paused: boolean = false;
  private _destroyed: boolean = false;
  private _animationFrameId: number | null = null;
  private _lastFrameTime: number = 0;
  private _animationManager: CatAnimationManager | null = null;

  // Modular components
  private events: EventEmitter<CatEvent>;
  private dom: CatDOM;
  private movement: CatMovement;
  private physics: CatPhysics;

  // Shared state objects
  private _position: Position;
  private _velocity: Velocity;
  private _boundaries: Boundaries;
  private _physics: PhysicsOptions;
  private _facingRight: boolean = true;
  private _isTurning: boolean = false;
  private _currentMovement: any = null;

  constructor(
    protoCat: ProtoCat,
    options: {
      container?: HTMLElement;
      initialPosition?: Position;
      initialState?: CatStateType;
      physics?: PhysicsOptions;
      boundaries?: Boundaries;
    } = {}
  ) {
    this.protoCat = protoCat;
    this.id = protoCat.id;

    // Initialize state
    this._state = {
      type: options.initialState || "idle",
      startTime: Date.now(),
      loop: true,
    };

    // Initialize position and velocity (shared state)
    this._position = options.initialPosition || { x: 0, y: 0 };
    this._velocity = { x: 0, y: 0 };

    // Initialize boundaries
    this._boundaries = options.boundaries || {
      minX: 0,
      maxX: typeof window !== "undefined" ? window.innerWidth : 1000,
      minY: 0,
      maxY: typeof window !== "undefined" ? window.innerHeight : 1000,
    };

    // Initialize physics
    this._physics = {
      gravity: options.physics?.gravity ?? false,
      friction: options.physics?.friction ?? 0.1,
      maxSpeed: options.physics?.maxSpeed ?? 300,
    };

    // Inject base styles
    injectBaseStyles();

    // Initialize event system
    this.events = new EventEmitter<CatEvent>();

    // Initialize DOM module
    this.dom = new CatDOM(
      protoCat,
      this._position,
      options.container
    );
    this.element = this.dom.getElement();

    // Initialize movement module with shared state
    const movementState: MovementState = {
      position: this._position,
      facingRight: this._facingRight,
      isTurning: this._isTurning,
      boundaries: this._boundaries,
      currentMovement: this._currentMovement,
    };

    this.movement = new CatMovement(
      movementState,
      {
        onPositionUpdate: (x: number, y: number) =>
          this.dom.updatePosition(x, y),
        onStateChange: (state: CatStateType) => this.setState(state),
        getElement: () => this.element,
        getAnimationManager: () => this._animationManager,
      },
      this.events
    );

    // Initialize physics module with shared state
    const physicsState: PhysicsState = {
      position: this._position,
      velocity: this._velocity,
      boundaries: this._boundaries,
      physics: this._physics,
    };

    this.physics = new CatPhysics(
      physicsState,
      {
        onPositionUpdate: (x: number, y: number) =>
          this.dom.updatePosition(x, y),
      },
      this.events
    );

    // Initialize animation manager
    this._animationManager = new CatAnimationManager(this.element);

    // Start state animations
    this._animationManager.startStateAnimations(this._state.type);

    // Start animation loop
    this._startAnimationLoop();
  }

  // Public getters
  get state(): CatState {
    return { ...this._state };
  }

  get position(): Position {
    return { ...this._position };
  }

  get velocity(): Velocity {
    return { ...this._velocity };
  }

  get boundaries(): Boundaries {
    return { ...this._boundaries };
  }

  get isActive(): boolean {
    return !this._paused && !this._destroyed;
  }

  /** @internal */
  get _internalCat(): { dom: CatDOM } {
    return { dom: this.dom };
  }

  /**
   * Get human-readable state text
   */
  getStateText(): string {
    const stateTextMap: Record<CatStateType, string> = {
      idle: "Idle",
      walking: "Walking...",
      running: "Running...",
      sitting: "Sitting",
      sleeping: "Sleeping...",
      playing: "Playing...",
    };

    return this._paused
      ? "Paused"
      : stateTextMap[this._state.type] || this._state.type;
  }

  // State management
  setState(newState: CatStateType): void {
    if (this._destroyed) return;

    const oldState = this._state.type;
    if (oldState === newState) return;

    if (!isValidTransition(oldState, newState)) {
      console.warn(
        `Invalid state transition: ${oldState} -> ${newState}`
      );
      return;
    }

    this._state = {
      type: newState,
      startTime: Date.now(),
      loop: true,
    };

    // Update DOM
    this.dom.updateState(newState);
    this.dom.updateStateText(this.getStateText());

    // Update GSAP animations
    this._animationManager?.startStateAnimations(newState);

    // Emit event
    this.events.emit("stateChange", { oldState, newState });
  }

  // Movement methods
  async moveTo(
    x: number,
    y: number,
    duration: number = 1000
  ): Promise<void> {
    if (this._destroyed) {
      throw new Error("Cannot move destroyed cat");
    }

    return this.movement.moveTo(x, y, duration);
  }

  /**
   * Move cat along a curved path through multiple points
   */
  async moveAlongPath(
    points: Position[],
    duration: number = 2000,
    options: PathOptions = {}
  ): Promise<void> {
    if (this._destroyed) {
      throw new Error("Cannot move destroyed cat");
    }

    return this.movement.moveAlongPath(points, duration, options);
  }

  setPosition(x: number, y: number): void {
    if (this._destroyed) return;

    // Clamp to boundaries
    this._position.x = Math.max(
      this._boundaries.minX ?? -Infinity,
      Math.min(x, this._boundaries.maxX ?? Infinity)
    );
    this._position.y = Math.max(
      this._boundaries.minY ?? -Infinity,
      Math.min(y, this._boundaries.maxY ?? Infinity)
    );

    // Update DOM
    this.dom.updatePosition(this._position.x, this._position.y);
  }

  setVelocity(vx: number, vy: number): void {
    if (this._destroyed) return;

    this.physics.setVelocity(vx, vy);
  }

  stop(): void {
    if (this._destroyed) return;

    // Cancel movement
    this.movement.cancelMovement();

    // Stop velocity
    this.physics.setVelocity(0, 0);

    // Return to idle if moving
    if (
      this._state.type === "walking" ||
      this._state.type === "running"
    ) {
      this.setState("idle");
    }
  }

  // Lifecycle methods
  pause(): void {
    if (this._destroyed) return;
    this._paused = true;
    this.dom.updatePaused(true);
    this.dom.updateStateText("Paused");
    this._animationManager?.pause();
  }

  resume(): void {
    if (this._destroyed) return;
    this._paused = false;
    this.dom.updatePaused(false);
    this.dom.updateStateText(this.getStateText());
    this._animationManager?.resume();
  }

  destroy(): void {
    if (this._destroyed) return;

    this._destroyed = true;

    // Destroy animation manager
    this._animationManager?.destroy();
    this._animationManager = null;

    // Cancel animation loop
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    // Remove from DOM
    this.dom.remove();

    // Clear event handlers
    this.events.clear();
  }

  // Event system
  on(event: CatEvent, handler: EventHandler): void {
    this.events.on(event, handler);
  }

  off(event: CatEvent, handler: EventHandler): void {
    this.events.off(event, handler);
  }

  // Private methods
  private _startAnimationLoop(): void {
    const loop = (timestamp: number) => {
      if (this._destroyed) return;

      this._animationFrameId = requestAnimationFrame(loop);

      if (this._paused) return;

      const deltaTime = this._lastFrameTime
        ? (timestamp - this._lastFrameTime) / 1000
        : 0;
      this._lastFrameTime = timestamp;

      // Update movement animation (delegated to movement module)
      this.movement.updateMovement(timestamp);

      // Update physics-based movement (delegated to physics module)
      if (this._velocity.x !== 0 || this._velocity.y !== 0) {
        this.physics.update(deltaTime);
      }
    };

    this._animationFrameId = requestAnimationFrame(loop);
  }
}
