/**
 * CatAnimator - Builder pattern for Cat configuration
 */

import type {
  ProtoCat,
  CatStateType,
  Position,
  Boundaries,
  PhysicsOptions,
} from "../types.js";
import { Cat } from "./cat.js";

export interface AnimationOptions {
  container?: HTMLElement;
  initialPosition?: Position;
  initialState?: CatStateType;
  physics?: PhysicsOptions;
  boundaries?: Boundaries;
}

export class CatAnimator {
  private _protoCat: ProtoCat;
  private _options: AnimationOptions = {};

  constructor(protoCat: ProtoCat) {
    this._protoCat = protoCat;
  }

  /**
   * Set the container element
   */
  in(container: HTMLElement): CatAnimator {
    this._options.container = container;
    return this;
  }

  /**
   * Set initial position
   */
  at(x: number, y: number): CatAnimator {
    this._options.initialPosition = { x, y };
    return this;
  }

  /**
   * Set initial animation state
   */
  withState(state: CatStateType): CatAnimator {
    this._options.initialState = state;
    return this;
  }

  /**
   * Configure physics options
   */
  withPhysics(options: PhysicsOptions): CatAnimator {
    this._options.physics = options;
    return this;
  }

  /**
   * Set movement boundaries
   */
  withinBounds(boundaries: Boundaries): CatAnimator {
    this._options.boundaries = boundaries;
    return this;
  }

  /**
   * Create the animated Cat instance
   */
  animate(): Cat {
    return new Cat(this._protoCat, this._options);
  }
}
