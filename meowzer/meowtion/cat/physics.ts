/**
 * Cat physics module
 * Handles velocity, friction, and boundary collision detection
 */

import type {
  Position,
  Velocity,
  Boundaries,
  PhysicsOptions,
} from "../../types.js";
import type { EventEmitter } from "../../utilities/event-emitter.js";

export interface PhysicsState {
  position: Position;
  velocity: Velocity;
  boundaries: Boundaries;
  physics: PhysicsOptions;
}

interface PhysicsCallbacks {
  onPositionUpdate: (x: number, y: number) => void;
}

/**
 * CatPhysics class
 * Manages physics simulation for cat movement
 */
export class CatPhysics {
  private state: PhysicsState;
  private callbacks: PhysicsCallbacks;
  private events: EventEmitter;

  constructor(
    state: PhysicsState,
    callbacks: PhysicsCallbacks,
    events: EventEmitter
  ) {
    this.state = state;
    this.callbacks = callbacks;
    this.events = events;
  }

  /**
   * Update physics simulation
   * @param deltaTime Time delta in seconds
   */
  update(deltaTime: number): void {
    if (deltaTime === 0) return;

    const friction = this.state.physics.friction!;

    // Apply friction
    this.state.velocity.x *= 1 - friction;
    this.state.velocity.y *= 1 - friction;

    // Stop if velocity is very small
    if (Math.abs(this.state.velocity.x) < 0.1)
      this.state.velocity.x = 0;
    if (Math.abs(this.state.velocity.y) < 0.1)
      this.state.velocity.y = 0;

    // Update position
    const newX =
      this.state.position.x + this.state.velocity.x * deltaTime;
    const newY =
      this.state.position.y + this.state.velocity.y * deltaTime;

    // Check boundaries
    let hitBoundary = false;
    let boundaryDirection: string | null = null;

    if (newX < (this.state.boundaries.minX ?? -Infinity)) {
      this.state.position.x = this.state.boundaries.minX!;
      this.state.velocity.x = 0;
      hitBoundary = true;
      boundaryDirection = "left";
    } else if (newX > (this.state.boundaries.maxX ?? Infinity)) {
      this.state.position.x = this.state.boundaries.maxX!;
      this.state.velocity.x = 0;
      hitBoundary = true;
      boundaryDirection = "right";
    } else {
      this.state.position.x = newX;
    }

    if (newY < (this.state.boundaries.minY ?? -Infinity)) {
      this.state.position.y = this.state.boundaries.minY!;
      this.state.velocity.y = 0;
      hitBoundary = true;
      boundaryDirection = boundaryDirection ? "corner" : "top";
    } else if (newY > (this.state.boundaries.maxY ?? Infinity)) {
      this.state.position.y = this.state.boundaries.maxY!;
      this.state.velocity.y = 0;
      hitBoundary = true;
      boundaryDirection = boundaryDirection ? "corner" : "bottom";
    } else {
      this.state.position.y = newY;
    }

    this.callbacks.onPositionUpdate(
      this.state.position.x,
      this.state.position.y
    );

    if (hitBoundary) {
      this.events.emit("boundaryHit", {
        direction: boundaryDirection,
        position: this.state.position,
      });
    }
  }

  /**
   * Set velocity directly
   */
  setVelocity(x: number, y: number): void {
    const maxSpeed = this.state.physics.maxSpeed!;
    const speed = Math.hypot(x, y);

    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      this.state.velocity.x = x * scale;
      this.state.velocity.y = y * scale;
    } else {
      this.state.velocity.x = x;
      this.state.velocity.y = y;
    }
  }

  /**
   * Get current velocity
   */
  getVelocity(): Readonly<Velocity> {
    return { ...this.state.velocity };
  }

  /**
   * Apply an impulse (instant velocity change)
   */
  applyImpulse(x: number, y: number): void {
    this.state.velocity.x += x;
    this.state.velocity.y += y;
  }

  /**
   * Update boundaries
   */
  updateBoundaries(boundaries: Boundaries): void {
    this.state.boundaries = boundaries;
  }

  /**
   * Update physics options
   */
  updatePhysics(physics: PhysicsOptions): void {
    this.state.physics = physics;
  }
}
