/**
 * Cat movement controller
 * Handles movement animations, path following, and directional turning
 */

import gsap from "gsap";
import type {
  Position,
  Boundaries,
  PathOptions,
  CatStateType,
} from "../../types.js";
import type { CatAnimationManager } from "../animations/index.js";
import type { EventEmitter } from "../utilities/event-emitter.js";

export interface MovementAnimation {
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

export interface MovementState {
  position: Position;
  facingRight: boolean;
  isTurning: boolean;
  boundaries: Boundaries;
  currentMovement: MovementAnimation | null;
}

interface MovementCallbacks {
  onPositionUpdate: (x: number, y: number) => void;
  onStateChange: (state: CatStateType) => void;
  getElement: () => HTMLElement;
  getAnimationManager: () => CatAnimationManager | null;
}

/**
 * CatMovement class
 * Manages all movement-related functionality for cats
 */
export class CatMovement {
  private state: MovementState;
  private callbacks: MovementCallbacks;
  private events: EventEmitter;

  constructor(
    state: MovementState,
    callbacks: MovementCallbacks,
    events: EventEmitter
  ) {
    this.state = state;
    this.callbacks = callbacks;
    this.events = events;
  }

  /**
   * Move cat to a specific position over time
   */
  async moveTo(
    x: number,
    y: number,
    duration: number = 1000
  ): Promise<void> {
    // Cancel current movement
    if (this.state.currentMovement) {
      this.state.currentMovement.reject?.(
        new Error("Movement cancelled")
      );
      this.state.currentMovement = null;
    }

    // Clamp to boundaries
    const targetX = this.clampX(x);
    const targetY = this.clampY(y);

    // Check if we need to turn around
    const deltaX = targetX - this.state.position.x;
    const shouldFaceRight = deltaX > 0;

    // If direction changed, turn around first
    if (
      Math.abs(deltaX) > 1 &&
      shouldFaceRight !== this.state.facingRight
    ) {
      await this.turnAround(shouldFaceRight);
    }

    // Create movement animation
    return new Promise<void>((resolve, reject) => {
      this.state.currentMovement = {
        startX: this.state.position.x,
        startY: this.state.position.y,
        targetX,
        targetY,
        duration,
        startTime: performance.now(),
        promise: Promise.resolve(),
        resolve,
        reject,
      };

      // Auto-set appropriate walking state based on speed
      const distance = Math.hypot(
        targetX - this.state.position.x,
        targetY - this.state.position.y
      );
      const speed = distance / (duration / 1000); // pixels per second

      if (speed > 200) {
        this.callbacks.onStateChange("running");
      } else if (speed > 50) {
        this.callbacks.onStateChange("walking");
      }

      this.events.emit("moveStart", {
        from: this.state.position,
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
    if (points.length === 0) return;

    // Cancel current movement
    if (this.state.currentMovement) {
      this.state.currentMovement.reject?.(
        new Error("Movement cancelled")
      );
      this.state.currentMovement = null;
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
    const deltaX = firstPoint.x - this.state.position.x;
    const shouldFaceRight = deltaX > 0;

    if (
      Math.abs(deltaX) > 1 &&
      shouldFaceRight !== this.state.facingRight
    ) {
      await this.turnAround(shouldFaceRight);
    }

    // Build path with current position as start
    const path = [
      { x: this.state.position.x, y: this.state.position.y },
      ...points,
    ];

    // Clamp all points to boundaries
    const clampedPath = path.map((point) => ({
      x: this.clampX(point.x),
      y: this.clampY(point.y),
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
      this.callbacks.onStateChange("running");
    } else if (speed > 50) {
      this.callbacks.onStateChange("walking");
    } else {
      this.callbacks.onStateChange("idle");
    }

    this.events.emit("moveStart", {
      from: this.state.position,
      to: clampedPath[clampedPath.length - 1],
      path: clampedPath,
    });

    // Create custom ease that slows at waypoints (curve peaks)
    const numWaypoints = clampedPath.length - 2;
    let customEase: string | ((progress: number) => number) = ease;

    if (speed > 150 && numWaypoints > 0) {
      const slowPoints: number[] = [];
      for (let i = 1; i <= numWaypoints; i++) {
        slowPoints.push(i / (numWaypoints + 1));
      }

      customEase = (progress: number) => {
        let modifiedProgress = progress;
        let minDist = 1;
        for (const point of slowPoints) {
          const dist = Math.abs(progress - point);
          minDist = Math.min(minDist, dist);
        }

        if (minDist < 0.15) {
          const slowFactor = 0.6 + (minDist / 0.15) * 0.4;
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
        x: this.state.position.x,
        y: this.state.position.y,
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
          this.state.position.x = positionProxy.x;
          this.state.position.y = positionProxy.y;
          this.callbacks.onPositionUpdate(
            positionProxy.x,
            positionProxy.y
          );

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
            const dx = nextPoint.x - this.state.position.x;
            const newFacingRight = dx > 0;

            // Update facing without animation during path movement
            if (
              Math.abs(dx) > 5 &&
              newFacingRight !== this.state.facingRight
            ) {
              this.state.facingRight = newFacingRight;
              const svg = this.callbacks
                .getElement()
                .querySelector("svg");
              if (svg) {
                gsap.set(svg, {
                  scaleX: this.state.facingRight ? 1 : -1,
                });
              }
            }
          }
        },
        onComplete: () => {
          this.events.emit("moveEnd", {
            position: this.state.position,
          });
          this.callbacks.onStateChange("idle");
          resolve();
        },
        onInterrupt: () => {
          reject(new Error("Path movement interrupted"));
        },
      });
    });
  }

  /**
   * Turn the cat around to face a new direction
   */
  async turnAround(shouldFaceRight: boolean): Promise<void> {
    if (
      this.state.isTurning ||
      this.state.facingRight === shouldFaceRight
    ) {
      return;
    }

    this.state.isTurning = true;
    const animationManager = this.callbacks.getAnimationManager();

    // Pause current animations
    animationManager?.stopAllAnimations();

    // Play turn animation using GSAP
    const svg = this.callbacks.getElement().querySelector("svg");
    if (svg) {
      await new Promise<void>((resolve) => {
        // Turn animation: quick rotation with slight vertical bob
        const timeline = gsap.timeline({
          onComplete: () => {
            this.state.facingRight = shouldFaceRight;
            this.state.isTurning = false;
            // Restore previous state animations - need to get current state
            animationManager?.stopAllAnimations();
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
      this.state.facingRight = shouldFaceRight;
      this.state.isTurning = false;
    }
  }

  /**
   * Update movement animation (called from animation loop)
   */
  updateMovement(timestamp: number): void {
    if (!this.state.currentMovement) return;

    const elapsed = timestamp - this.state.currentMovement.startTime;
    const progress = Math.min(
      elapsed / this.state.currentMovement.duration,
      1
    );

    // Ease function (quadratic ease-out)
    const eased = progress * (2 - progress);

    // Interpolate position
    const newX =
      this.state.currentMovement.startX +
      (this.state.currentMovement.targetX -
        this.state.currentMovement.startX) *
        eased;
    const newY =
      this.state.currentMovement.startY +
      (this.state.currentMovement.targetY -
        this.state.currentMovement.startY) *
        eased;

    this.state.position.x = newX;
    this.state.position.y = newY;
    this.callbacks.onPositionUpdate(newX, newY);

    // Check if complete
    if (progress >= 1) {
      const movement = this.state.currentMovement;
      this.state.currentMovement = null;
      movement.resolve?.();
      this.events.emit("moveEnd", { position: this.state.position });
      this.callbacks.onStateChange("idle");
    }
  }

  /**
   * Cancel current movement
   */
  cancelMovement(): void {
    if (this.state.currentMovement) {
      this.state.currentMovement.resolve?.();
      this.state.currentMovement = null;
    }
  }

  /**
   * Check if currently moving
   */
  isMoving(): boolean {
    return this.state.currentMovement !== null;
  }

  /**
   * Clamp X coordinate to boundaries
   */
  private clampX(x: number): number {
    return Math.max(
      this.state.boundaries.minX ?? -Infinity,
      Math.min(x, this.state.boundaries.maxX ?? Infinity)
    );
  }

  /**
   * Clamp Y coordinate to boundaries
   */
  private clampY(y: number): number {
    return Math.max(
      this.state.boundaries.minY ?? -Infinity,
      Math.min(y, this.state.boundaries.maxY ?? Infinity)
    );
  }
}
