import type { Position } from "../../types/index.js";
import { EventEmitter } from "../../utilities/event-emitter.js";
import type { EventHandler } from "../../utilities/event-emitter.js";

export type YarnState = "idle" | "dragging" | "rolling";
export type YarnEvent = "moved" | "stopped" | "removed";

export interface YarnOptions {
  duration?: number; // Auto-remove after duration (ms)
  friction?: number; // Physics friction coefficient (default: 0.95)
}

export class Yarn {
  readonly id: string;
  readonly type = "yarn" as const;

  private _position: Position;
  private _state: YarnState = "idle";
  private _velocity: { x: number; y: number } = { x: 0, y: 0 };
  private _friction: number;
  private _active: boolean = true;
  private _animationFrame?: number;
  private _removalTimer?: number;
  private _events: EventEmitter<YarnEvent>;
  private _playingCats: Set<string> = new Set();

  readonly timestamp: number;

  constructor(id: string, position: Position, options?: YarnOptions) {
    this.id = id;
    this._position = { ...position };
    this._friction = options?.friction ?? 0.95;
    this._events = new EventEmitter<YarnEvent>();
    this.timestamp = Date.now();

    // Setup auto-removal if duration specified
    if (options?.duration) {
      this._removalTimer = setTimeout(() => {
        this.remove();
      }, options.duration) as any;
    }
  }

  get position(): Position {
    return { ...this._position };
  }

  get state(): YarnState {
    return this._state;
  }

  get velocity(): { x: number; y: number } {
    return { ...this._velocity };
  }

  get isActive(): boolean {
    return this._active;
  }

  get isBeingPlayedWith(): boolean {
    return this._playingCats.size > 0;
  }

  /**
   * Start dragging yarn to a position
   */
  startDragging(targetPosition: Position): void {
    if (!this._active) return;

    this._state = "dragging";
    this._velocity = { x: 0, y: 0 };
    this._position = { ...targetPosition };

    this._emit("moved", {
      id: this.id,
      position: this._position,
      state: this._state,
      velocity: this._velocity,
      timestamp: Date.now(),
    });
  }

  /**
   * Update drag position
   */
  updateDragPosition(position: Position): void {
    if (!this._active || this._state !== "dragging") return;

    // Calculate velocity from movement
    this._velocity = {
      x: position.x - this._position.x,
      y: position.y - this._position.y,
    };

    this._position = { ...position };

    this._emit("moved", {
      id: this.id,
      position: this._position,
      state: this._state,
      velocity: this._velocity,
      timestamp: Date.now(),
    });
  }

  /**
   * Stop dragging - yarn may roll based on velocity
   */
  stopDragging(): void {
    if (!this._active || this._state !== "dragging") return;

    // If velocity is significant, start rolling
    const speed = Math.hypot(this._velocity.x, this._velocity.y);
    if (speed > 10) {
      this._state = "rolling";
      this._startPhysics();
    } else {
      this._state = "idle";
      this._velocity = { x: 0, y: 0 };
    }

    this._emit("moved", {
      id: this.id,
      position: this._position,
      state: this._state,
      velocity: this._velocity,
      timestamp: Date.now(),
    });
  }

  /**
   * Apply physics force to yarn (e.g., from cat batting)
   */
  applyForce(force: { x: number; y: number }): void {
    if (!this._active) return;

    this._velocity.x += force.x;
    this._velocity.y += force.y;

    // Clamp velocity to max
    const maxVelocity = 300;
    const speed = Math.hypot(this._velocity.x, this._velocity.y);
    if (speed > maxVelocity) {
      const scale = maxVelocity / speed;
      this._velocity.x *= scale;
      this._velocity.y *= scale;
    }

    this._state = "rolling";
    this._startPhysics();
  }

  /**
   * Track cat playing with yarn
   * @internal
   */
  _addPlayingCat(catId: string): void {
    this._playingCats.add(catId);
  }

  /**
   * Remove cat from playing set
   * @internal
   */
  _removePlayingCat(catId: string): void {
    this._playingCats.delete(catId);
  }

  /**
   * Start physics simulation
   */
  private _startPhysics(): void {
    if (this._animationFrame) return;

    const update = () => {
      if (!this._active || this._state !== "rolling") {
        this._animationFrame = undefined;
        return;
      }

      // Apply friction
      this._velocity.x *= this._friction;
      this._velocity.y *= this._friction;

      // Update position
      this._position.x += this._velocity.x / 60; // Assuming 60fps
      this._position.y += this._velocity.y / 60;

      // Boundary collision (simple bounce)
      if (
        this._position.x < 0 ||
        this._position.x > window.innerWidth
      ) {
        this._velocity.x *= -0.5; // Damped bounce
        this._position.x = Math.max(
          0,
          Math.min(window.innerWidth, this._position.x)
        );
      }
      if (
        this._position.y < 0 ||
        this._position.y > window.innerHeight
      ) {
        this._velocity.y *= -0.5;
        this._position.y = Math.max(
          0,
          Math.min(window.innerHeight, this._position.y)
        );
      }

      // Emit moved event
      this._emit("moved", {
        id: this.id,
        position: this._position,
        state: this._state,
        velocity: this._velocity,
        timestamp: Date.now(),
      });

      // Stop if velocity is too low
      const speed = Math.hypot(this._velocity.x, this._velocity.y);
      if (speed < 1) {
        this._state = "idle";
        this._velocity = { x: 0, y: 0 };
        this._emit("stopped", {
          id: this.id,
          position: this._position,
          timestamp: Date.now(),
        });
        return;
      }

      this._animationFrame = requestAnimationFrame(update);
    };

    this._animationFrame = requestAnimationFrame(update);
  }

  /**
   * Remove yarn from environment
   */
  remove(): void {
    if (!this._active) return;

    this._active = false;

    // Clear timers
    if (this._removalTimer) {
      clearTimeout(this._removalTimer);
    }

    // Stop physics
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
    }

    // Emit removed event
    this._emit("removed", {
      id: this.id,
      timestamp: Date.now(),
    });

    // Clear events
    this._events.clear();
  }

  on(event: YarnEvent, handler: EventHandler): void {
    this._events.on(event, handler);
  }

  off(event: YarnEvent, handler: EventHandler): void {
    this._events.off(event, handler);
  }

  private _emit(event: YarnEvent, data: any): void {
    this._events.emit(event, data);
  }
}
