/**
 * Shared TypeScript types for the Meowzer project
 *
 * This file contains all type definitions used across:
 * - Meowkit (cat creation)
 * - Meowtion (animation)
 * - Meowbrain (AI)
 * - Meowzer (wrapper API)
 */

// ============================================================================
// SHARED PRIMITIVES
// ============================================================================

export interface Position {
  x: number; // X coordinate (pixels)
  y: number; // Y coordinate (pixels)
}

export interface Velocity {
  x: number; // X velocity (pixels/second)
  y: number; // Y velocity (pixels/second)
}

export interface Boundaries {
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
}

// ============================================================================
// MEOWKIT TYPES (Cat Creation)
// ============================================================================

export interface CatSettings {
  color: string; // Primary fur color (hex or named color)
  eyeColor: string; // Eye color (hex or named color)
  pattern: CatPattern; // Fur pattern type
  size: CatSize; // Overall size category
  furLength: FurLength; // Fur length style
}

export type CatPattern =
  | "solid"
  | "tabby"
  | "calico"
  | "tuxedo"
  | "spotted";
export type CatSize = "small" | "medium" | "large";
export type FurLength = "short" | "medium" | "long";

export interface ProtoCat {
  id: string; // Unique identifier
  name?: string; // Optional cat name
  seed: string; // Compact seed for regeneration
  appearance: AppearanceData; // Visual properties
  dimensions: DimensionData; // Size and hitbox information
  spriteData: SpriteData; // Generated SVG data (not persisted)
  metadata: MetadataInfo; // Creation timestamp, version, etc.
}

export interface AppearanceData {
  color: string;
  eyeColor: string;
  pattern: CatPattern;
  furLength: FurLength;
  shadingColor: string; // Derived color for shading
  highlightColor: string; // Derived color for highlights
}

export interface DimensionData {
  size: CatSize;
  width: number; // Base width in viewBox units
  height: number; // Base height in viewBox units
  scale: number; // Display scale multiplier
  hitbox: {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  };
}

export interface SpriteData {
  svg: string; // Complete SVG markup
  elements: SVGElements; // Named SVG elements for animation
  viewBox: ViewBox; // SVG coordinate system
}

export interface SVGElements {
  body: string; // Body shape element ID
  head: string; // Head shape element ID
  ears: string[]; // Ear element IDs
  eyes: string[]; // Eye element IDs
  tail: string; // Tail element ID
  legs?: string[]; // Leg element IDs [back-left, back-right, front-left, front-right]
  pattern?: string[]; // Pattern overlay element IDs (if applicable)
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MetadataInfo {
  createdAt: Date;
  version: string; // Meowkit version used to create
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ============================================================================
// MEOWTION TYPES (Animation)
// ============================================================================

export interface Cat {
  id: string; // Unique identifier
  element: HTMLElement; // DOM element containing the cat
  state: CatState; // Current animation state
  position: Position; // Current position on page
  velocity: Velocity; // Current movement velocity
  boundaries: Boundaries; // Movement constraints

  // Low-level animation methods (controlled by Meowbrain)
  moveTo(x: number, y: number, duration?: number): Promise<void>;
  moveAlongPath(
    points: Position[],
    duration?: number,
    options?: PathOptions
  ): Promise<void>;
  setPosition(x: number, y: number): void;
  setVelocity(vx: number, vy: number): void;
  setState(state: CatStateType): void;
  stop(): void;

  // Lifecycle methods
  destroy(): void;
  pause(): void;
  resume(): void;

  // Event listeners (for Meowbrain to observe)
  on(event: CatEvent, handler: EventHandler): void;
  off(event: CatEvent, handler: EventHandler): void;
}

export interface PathOptions {
  curviness?: number; // How curved the path should be (0-2, default: 1)
  autoRotate?: boolean; // Auto-rotate cat to face direction of movement (default: false)
  ease?: string; // GSAP easing function (default: "power1.inOut")
}

export type CatStateType =
  | "idle"
  | "walking"
  | "running"
  | "sitting"
  | "sleeping"
  | "playing";

export interface CatState {
  type: CatStateType;
  startTime: number; // When this state began
  loop: boolean; // Whether animation loops
}

export type CatEvent =
  | "stateChange"
  | "moveStart"
  | "moveEnd"
  | "boundaryHit";

export interface AnimationOptions {
  container?: HTMLElement; // Where to append cat (default: document.body)
  initialPosition?: Position; // Starting position (default: {x: 0, y: 0})
  initialState?: CatStateType; // Starting animation state (default: 'idle')
  physics?: PhysicsOptions; // Movement physics configuration
  boundaries?: Boundaries; // Keep cat within certain bounds
}

export interface PhysicsOptions {
  gravity?: boolean; // Apply gravity effect (default: false)
  friction?: number; // Movement friction 0-1 (default: 0.1)
  maxSpeed?: number; // Maximum velocity (default: 300)
}

export interface StateTransition {
  from: CatStateType;
  to: CatStateType;
  duration: number; // Transition time in ms
  easing?: EasingFunction;
}

export type EasingFunction = (t: number) => number;

// ============================================================================
// MEOWBRAIN TYPES (AI)
// ============================================================================

export interface Brain {
  id: string; // Unique identifier
  cat: Cat; // The cat being controlled
  personality: Personality; // Behavioral traits
  state: BrainState; // Current decision state
  memory: Memory; // Short-term memory for decision-making

  // Lifecycle methods
  start(): void; // Begin autonomous behavior
  stop(): void; // Pause autonomous behavior
  destroy(): void; // Clean up and remove

  // Configuration
  setPersonality(personality: Partial<Personality>): void;
  setEnvironment(environment: Environment): void;

  // Observation (for debugging/monitoring)
  on(event: BrainEvent, handler: EventHandler): void;
  off(event: BrainEvent, handler: EventHandler): void;
}

export interface Personality {
  energy: number; // 0-1: Low energy = more resting, high = more active
  curiosity: number; // 0-1: How likely to explore and investigate
  playfulness: number; // 0-1: Frequency of playful behaviors
  independence: number; // 0-1: How much cat ignores vs reacts to stimuli
  sociability: number; // 0-1: Attraction to other cats/elements
}

export type PersonalityPreset =
  | "lazy"
  | "playful"
  | "curious"
  | "aloof"
  | "energetic"
  | "balanced";

export type BehaviorType =
  | "wandering"
  | "resting"
  | "playing"
  | "observing"
  | "exploring";

export interface BrainState {
  currentBehavior: BehaviorType; // What the cat is currently doing
  motivation: Motivation; // Current motivations/needs
  lastDecisionTime: number; // When last decision was made
  decisionCooldown: number; // Time until next decision
}

export interface Motivation {
  rest: number; // 0-1: Need to rest/sleep (increases over time)
  stimulation: number; // 0-1: Need for activity/play (increases when idle)
  exploration: number; // 0-1: Desire to explore new areas
}

export interface Memory {
  visitedPositions: Position[]; // Recently visited locations
  lastInteractionTime: number; // Last time cat reacted to stimulus
  boundaryHits: number; // Number of recent boundary collisions
  previousBehaviors: BehaviorType[]; // Recent behavior history
}

export interface Environment {
  boundaries: Boundaries; // Movement constraints
  obstacles?: Obstacle[]; // Things to avoid
  attractors?: Attractor[]; // Things to approach
  otherCats?: Cat[]; // Other cats to interact with
}

export interface Obstacle {
  position: Position;
  radius: number;
}

export interface Attractor {
  position: Position;
  strength: number; // 0-1: How attractive
  type: "point" | "area";
}

export type BrainEvent =
  | "behaviorChange"
  | "decisionMade"
  | "reactionTriggered";

export interface BrainOptions {
  personality?: Personality | PersonalityPreset;
  environment?: Environment;
  decisionInterval?: number; // MS between decisions (default: 2000-5000 random)
  motivationDecay?: MotivationDecay; // How fast motivations change
}

export interface MotivationDecay {
  rest: number; // Rate rest need increases (default: 0.001/sec)
  stimulation: number; // Rate stimulation need increases (default: 0.002/sec)
  exploration: number; // Rate exploration desire increases (default: 0.0015/sec)
}

export interface BehaviorWeights {
  wandering: number;
  resting: number;
  playing: number;
  observing: number;
  exploring: number;
}

// ============================================================================
// MEOWZER TYPES (Public API)
// ============================================================================

export interface MeowzerCat {
  id: string; // Unique identifier
  seed: string; // Cat seed (for recreation/sharing)
  element: HTMLElement; // DOM element containing the cat

  // State (read-only)
  readonly position: Position;
  readonly state: CatStateType;
  readonly personality: Personality;
  readonly isActive: boolean;

  // Lifecycle
  pause(): void; // Pause autonomous behavior
  resume(): void; // Resume autonomous behavior
  destroy(): void; // Remove cat completely

  // Configuration
  setPersonality(personality: Personality | PersonalityPreset): void;
  setEnvironment(environment: Environment): void;

  // Events
  on(event: MeowzerEvent, handler: EventHandler): void;
  off(event: MeowzerEvent, handler: EventHandler): void;
}

export type MeowzerEvent =
  | "behaviorChange"
  | "stateChange"
  | "pause"
  | "resume"
  | "destroy";

export interface MeowzerOptions {
  name?: string; // Optional cat name (default: random from cat-names.json)
  container?: HTMLElement; // Where to append cat (default: document.body)
  position?: Position; // Starting position (default: random)
  personality?: Personality | PersonalityPreset; // Behavior traits (default: 'balanced')
  boundaries?: Boundaries; // Movement constraints (default: viewport)
  environment?: Environment; // Obstacles, attractors, etc.
  autoStart?: boolean; // Start autonomous behavior immediately (default: true)
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type EventHandler = (data: any) => void;
