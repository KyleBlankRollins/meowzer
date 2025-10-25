/**
 * Cat class - Animated cat instance with movement and physics
 */

import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import type {
  ProtoCat,
  Position,
  Velocity,
  Boundaries,
  CatState,
  CatStateType,
  PhysicsOptions,
  PathOptions,
} from "../types.js";
import { isValidTransition, easeOutQuad } from "./state-machine.js";
import {
  injectBaseStyles,
  CatAnimationManager,
} from "./animations.js";

// Register MotionPath plugin
gsap.registerPlugin(MotionPathPlugin);

type CatEvent =
  | "stateChange"
  | "moveStart"
  | "moveEnd"
  | "boundaryHit";
type EventHandler = (data: any) => void;

interface MovementAnimation {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  duration: number;
  startTime: number;
  promise: Promise<void>;
  resolve?: () => void;
  reject?: (error: Error) => void;
}

export class Cat {
  public readonly id: string;
  public readonly element: HTMLElement;
  public readonly protoCat: ProtoCat;

  private _state: CatState;
  private _position: Position;
  private _velocity: Velocity;
  private _boundaries: Boundaries;
  private _physics: PhysicsOptions;
  private _paused: boolean = false;
  private _destroyed: boolean = false;
  private _facingRight: boolean = true; // Track which direction cat is facing
  private _isTurning: boolean = false; // Track if currently turning around

  private _eventHandlers: Map<CatEvent, Set<EventHandler>> =
    new Map();
  private _animationFrameId: number | null = null;
  private _currentMovement: MovementAnimation | null = null;
  private _lastFrameTime: number = 0;
  private _animationManager: CatAnimationManager | null = null;

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

    // Initialize position
    this._position = options.initialPosition || { x: 0, y: 0 };

    // Initialize velocity
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

    // Create DOM element
    this.element = this._createElement();

    // Initialize animation manager
    this._animationManager = new CatAnimationManager(this.element);

    // Append to container
    const container =
      options.container ||
      (typeof document !== "undefined" ? document.body : null);
    if (container) {
      container.appendChild(this.element);
    }

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
    this.element.setAttribute("data-state", newState);

    // Update GSAP animations
    this._animationManager?.startStateAnimations(newState);

    // Emit event
    this._emit("stateChange", { oldState, newState });
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

    // Cancel current movement
    if (this._currentMovement) {
      this._currentMovement.reject?.(new Error("Movement cancelled"));
      this._currentMovement = null;
    }

    // Clamp to boundaries
    const targetX = Math.max(
      this._boundaries.minX ?? -Infinity,
      Math.min(x, this._boundaries.maxX ?? Infinity)
    );
    const targetY = Math.max(
      this._boundaries.minY ?? -Infinity,
      Math.min(y, this._boundaries.maxY ?? Infinity)
    );

    // Check if we need to turn around
    const deltaX = targetX - this._position.x;
    const shouldFaceRight = deltaX > 0;

    // If direction changed, turn around first
    if (
      Math.abs(deltaX) > 1 &&
      shouldFaceRight !== this._facingRight
    ) {
      await this._turnAround(shouldFaceRight);
    }

    // Create movement animation
    return new Promise<void>((resolve, reject) => {
      this._currentMovement = {
        startX: this._position.x,
        startY: this._position.y,
        targetX,
        targetY,
        duration,
        startTime: performance.now(), // Use performance.now() instead of Date.now()
        promise: Promise.resolve(),
        resolve,
        reject,
      };

      // Auto-set appropriate walking state based on speed
      const distance = Math.hypot(
        targetX - this._position.x,
        targetY - this._position.y
      );
      const speed = distance / (duration / 1000); // pixels per second

      if (speed > 200) {
        this.setState("running");
      } else if (speed > 50) {
        this.setState("walking");
      }

      this._emit("moveStart", {
        from: this._position,
        to: { x: targetX, y: targetY },
      });
    });
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

    if (points.length === 0) return;

    // Cancel current movement
    if (this._currentMovement) {
      this._currentMovement.reject?.(new Error("Movement cancelled"));
      this._currentMovement = null;
    }

    // Default options
    const {
      curviness = 1,
      autoRotate = false,
      ease = "power1.inOut",
    } = options as {
      curviness?: number;
      autoRotate?: boolean;
      ease?: string | ((progress: number) => number);
    };

    // Check if we need to turn around at the start
    const firstPoint = points[0];
    const deltaX = firstPoint.x - this._position.x;
    const shouldFaceRight = deltaX > 0;

    if (
      Math.abs(deltaX) > 1 &&
      shouldFaceRight !== this._facingRight
    ) {
      await this._turnAround(shouldFaceRight);
    }

    // Build path with current position as start
    const path = [
      { x: this._position.x, y: this._position.y },
      ...points,
    ];

    // Clamp all points to boundaries
    const clampedPath = path.map((point) => ({
      x: Math.max(
        this._boundaries.minX ?? -Infinity,
        Math.min(point.x, this._boundaries.maxX ?? Infinity)
      ),
      y: Math.max(
        this._boundaries.minY ?? -Infinity,
        Math.min(point.y, this._boundaries.maxY ?? Infinity)
      ),
    }));

    // Calculate approximate total distance for speed calculation
    let totalDistance = 0;
    for (let i = 0; i < clampedPath.length - 1; i++) {
      totalDistance += Math.hypot(
        clampedPath[i + 1].x - clampedPath[i].x,
        clampedPath[i + 1].y - clampedPath[i].y
      );
    }

    const speed = totalDistance / (duration / 1000); // pixels per second

    // Set appropriate state based on speed
    if (speed > 200) {
      this.setState("running");
    } else if (speed > 50) {
      this.setState("walking");
    } else {
      this.setState("idle");
    }

    this._emit("moveStart", {
      from: this._position,
      to: clampedPath[clampedPath.length - 1],
      path: clampedPath,
    });

    // Create custom ease that slows at waypoints (curve peaks)
    // This simulates realistic deceleration when changing direction
    const numWaypoints = clampedPath.length - 2; // Exclude start and end
    let customEase: string | ((progress: number) => number) = ease;

    if (speed > 150 && numWaypoints > 0) {
      // For fast movement with waypoints, create a speed variation ease
      // Slow down at each waypoint, accelerate between them
      const slowPoints: number[] = [];
      for (let i = 1; i <= numWaypoints; i++) {
        slowPoints.push(i / (numWaypoints + 1));
      }

      // Use custom ease function that slows near waypoints
      customEase = (progress: number) => {
        let modifiedProgress = progress;
        // Check distance to nearest waypoint
        let minDist = 1;
        for (const point of slowPoints) {
          const dist = Math.abs(progress - point);
          minDist = Math.min(minDist, dist);
        }

        // Apply slowdown near waypoints (within 0.1 of waypoint)
        if (minDist < 0.15) {
          const slowFactor = 0.6 + (minDist / 0.15) * 0.4; // 60% to 100% speed
          modifiedProgress =
            progress * slowFactor +
            progress * (1 - slowFactor) * progress;
        }

        return modifiedProgress;
      };
    }

    // Use GSAP MotionPath for smooth curved movement
    return new Promise<void>((resolve, reject) => {
      const positionProxy = {
        x: this._position.x,
        y: this._position.y,
      };

      gsap.to(positionProxy, {
        duration: duration / 1000,
        ease: customEase,
        motionPath: {
          path: clampedPath,
          curviness,
          autoRotate: autoRotate ? true : false,
        },
        onUpdate: () => {
          this._position.x = positionProxy.x;
          this._position.y = positionProxy.y;
          this._updatePosition();

          // Check for direction changes along the path
          const currentIndex = Math.floor(
            (gsap.getProperty(positionProxy, "progress") as number) *
              (clampedPath.length - 1)
          );
          if (
            currentIndex < clampedPath.length - 1 &&
            currentIndex >= 0
          ) {
            const nextPoint = clampedPath[currentIndex + 1];
            const dx = nextPoint.x - this._position.x;
            const newFacingRight = dx > 0;

            // Update facing without animation during path movement
            if (
              Math.abs(dx) > 5 &&
              newFacingRight !== this._facingRight
            ) {
              this._facingRight = newFacingRight;
              const svg = this.element.querySelector("svg");
              if (svg) {
                gsap.set(svg, { scaleX: this._facingRight ? 1 : -1 });
              }
            }
          }
        },
        onComplete: () => {
          this._emit("moveEnd", { position: this._position });
          this.stop();
          resolve();
        },
        onInterrupt: () => {
          reject(new Error("Path movement interrupted"));
        },
      });
    });
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
    this._updatePosition();
  }

  setVelocity(vx: number, vy: number): void {
    if (this._destroyed) return;

    const maxSpeed = this._physics.maxSpeed!;
    const speed = Math.hypot(vx, vy);

    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      this._velocity.x = vx * scale;
      this._velocity.y = vy * scale;
    } else {
      this._velocity.x = vx;
      this._velocity.y = vy;
    }
  }

  stop(): void {
    if (this._destroyed) return;

    // Cancel movement
    if (this._currentMovement) {
      this._currentMovement.resolve?.();
      this._currentMovement = null;
    }

    // Stop velocity
    this._velocity.x = 0;
    this._velocity.y = 0;

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
    this.element.setAttribute("data-paused", "true");
    this._animationManager?.pause();
  }

  resume(): void {
    if (this._destroyed) return;
    this._paused = false;
    this.element.setAttribute("data-paused", "false");
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

    // Cancel movement
    if (this._currentMovement) {
      this._currentMovement.reject?.(new Error("Cat destroyed"));
      this._currentMovement = null;
    }

    // Remove from DOM
    this.element.remove();

    // Clear event handlers
    this._eventHandlers.clear();
  }

  // Event system
  on(event: CatEvent, handler: EventHandler): void {
    if (!this._eventHandlers.has(event)) {
      this._eventHandlers.set(event, new Set());
    }
    this._eventHandlers.get(event)!.add(handler);
  }

  off(event: CatEvent, handler: EventHandler): void {
    this._eventHandlers.get(event)?.delete(handler);
  }

  private _emit(event: CatEvent, data: any): void {
    this._eventHandlers.get(event)?.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in ${event} handler:`, error);
      }
    });
  }

  // Private methods
  private _createElement(): HTMLElement {
    const div = document.createElement("div");
    div.className = "meowtion-cat";
    div.setAttribute("data-cat-id", this.id);
    div.setAttribute("data-state", this._state.type);
    div.setAttribute("data-paused", "false");
    div.innerHTML = this.protoCat.spriteData.svg;

    // Add name label below the cat
    const nameLabel = document.createElement("div");
    nameLabel.className = "meowtion-cat-name";
    nameLabel.textContent = this.protoCat.name || "Unknown Cat";
    div.appendChild(nameLabel);

    // Set initial position
    div.style.left = `${this._position.x}px`;
    div.style.top = `${this._position.y}px`;

    // Apply scale to the container div instead of SVG
    // This prevents conflicts with CSS animation transforms
    const scale = this.protoCat.dimensions.scale;
    if (scale !== 1) {
      div.style.transform = `scale(${scale})`;
      div.style.transformOrigin = "top left";
    }

    return div;
  }

  /**
   * Turn the cat around to face a new direction
   */
  private async _turnAround(shouldFaceRight: boolean): Promise<void> {
    if (this._isTurning || this._facingRight === shouldFaceRight) {
      return;
    }

    this._isTurning = true;
    const previousState = this._state.type;

    // Pause current animations
    this._animationManager?.stopAllAnimations();

    // Play turn animation using GSAP
    const svg = this.element.querySelector("svg");
    if (svg) {
      await new Promise<void>((resolve) => {
        // Turn animation: quick rotation with slight vertical bob
        const timeline = gsap.timeline({
          onComplete: () => {
            this._facingRight = shouldFaceRight;
            this._isTurning = false;
            // Restore previous state animations
            this._animationManager?.startStateAnimations(
              previousState
            );
            resolve();
          },
        });

        timeline
          // Slight crouch
          .to(svg, {
            scaleY: 0.9,
            y: 3,
            duration: 0.1,
            ease: "power2.in",
          })
          // Spin around (flip horizontally)
          .to(svg, {
            scaleX: shouldFaceRight ? 1 : -1,
            scaleY: 1,
            y: 0,
            duration: 0.2,
            ease: "power2.out",
          });
      });
    } else {
      this._facingRight = shouldFaceRight;
      this._isTurning = false;
    }
  }

  private _updatePosition(): void {
    this.element.style.left = `${this._position.x}px`;
    this.element.style.top = `${this._position.y}px`;
  }

  private _startAnimationLoop(): void {
    const loop = (timestamp: number) => {
      if (this._destroyed) return;

      this._animationFrameId = requestAnimationFrame(loop);

      if (this._paused) return;

      const deltaTime = this._lastFrameTime
        ? (timestamp - this._lastFrameTime) / 1000
        : 0;
      this._lastFrameTime = timestamp;

      // Update movement animation
      if (this._currentMovement) {
        this._updateMovement(timestamp);
      }

      // Update physics-based movement
      if (this._velocity.x !== 0 || this._velocity.y !== 0) {
        this._updatePhysics(deltaTime);
      }
    };

    this._animationFrameId = requestAnimationFrame(loop);
  }

  private _updateMovement(timestamp: number): void {
    if (!this._currentMovement) return;

    const elapsed = timestamp - this._currentMovement.startTime;
    const progress = Math.min(
      elapsed / this._currentMovement.duration,
      1
    );
    const eased = easeOutQuad(progress);

    // Interpolate position
    const newX =
      this._currentMovement.startX +
      (this._currentMovement.targetX - this._currentMovement.startX) *
        eased;
    const newY =
      this._currentMovement.startY +
      (this._currentMovement.targetY - this._currentMovement.startY) *
        eased;

    this._position.x = newX;
    this._position.y = newY;
    this._updatePosition();

    // Check if complete
    if (progress >= 1) {
      const movement = this._currentMovement;
      this._currentMovement = null;
      movement.resolve?.();
      this._emit("moveEnd", { position: this._position });
      this.stop();
    }
  }

  private _updatePhysics(deltaTime: number): void {
    if (deltaTime === 0) return;

    const friction = this._physics.friction!;

    // Apply friction
    this._velocity.x *= 1 - friction;
    this._velocity.y *= 1 - friction;

    // Stop if velocity is very small
    if (Math.abs(this._velocity.x) < 0.1) this._velocity.x = 0;
    if (Math.abs(this._velocity.y) < 0.1) this._velocity.y = 0;

    // Update position
    const newX = this._position.x + this._velocity.x * deltaTime;
    const newY = this._position.y + this._velocity.y * deltaTime;

    // Check boundaries
    let hitBoundary = false;
    let boundaryDirection: string | null = null;

    if (newX < (this._boundaries.minX ?? -Infinity)) {
      this._position.x = this._boundaries.minX!;
      this._velocity.x = 0;
      hitBoundary = true;
      boundaryDirection = "left";
    } else if (newX > (this._boundaries.maxX ?? Infinity)) {
      this._position.x = this._boundaries.maxX!;
      this._velocity.x = 0;
      hitBoundary = true;
      boundaryDirection = "right";
    } else {
      this._position.x = newX;
    }

    if (newY < (this._boundaries.minY ?? -Infinity)) {
      this._position.y = this._boundaries.minY!;
      this._velocity.y = 0;
      hitBoundary = true;
      boundaryDirection = boundaryDirection ? "corner" : "top";
    } else if (newY > (this._boundaries.maxY ?? Infinity)) {
      this._position.y = this._boundaries.maxY!;
      this._velocity.y = 0;
      hitBoundary = true;
      boundaryDirection = boundaryDirection ? "corner" : "bottom";
    } else {
      this._position.y = newY;
    }

    this._updatePosition();

    if (hitBoundary) {
      this._emit("boundaryHit", {
        direction: boundaryDirection,
        position: this._position,
      });
    }
  }
}
