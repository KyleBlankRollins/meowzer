/**
 * MemoryManager - Manages short-term memory
 */

import type { Memory, Position } from "../../types/index.js";
import type { BehaviorType } from "../behaviors.js";

/**
 * Manages cat's short-term memory
 */
export class MemoryManager {
  private memory: Memory;
  private maxVisitedPositions: number;
  private maxPreviousBehaviors: number;

  constructor(
    initialMemory: Memory,
    options: {
      maxVisitedPositions?: number;
      maxPreviousBehaviors?: number;
    } = {}
  ) {
    this.memory = {
      visitedPositions: [...initialMemory.visitedPositions],
      lastInteractionTime: initialMemory.lastInteractionTime,
      boundaryHits: initialMemory.boundaryHits,
      previousBehaviors: [...initialMemory.previousBehaviors],
    };
    this.maxVisitedPositions = options.maxVisitedPositions ?? 10;
    this.maxPreviousBehaviors = options.maxPreviousBehaviors ?? 5;
  }

  /**
   * Get current memory
   */
  get current(): Memory {
    return {
      visitedPositions: [...this.memory.visitedPositions],
      lastInteractionTime: this.memory.lastInteractionTime,
      boundaryHits: this.memory.boundaryHits,
      previousBehaviors: [...this.memory.previousBehaviors],
    };
  }

  /**
   * Update memory with new position and behavior
   */
  update(
    newPosition: Position,
    newBehavior: BehaviorType,
    boundaryHit: boolean
  ): Memory {
    // Add position to visited positions
    this.memory.visitedPositions.push({ ...newPosition });

    // Limit visited positions
    if (
      this.memory.visitedPositions.length > this.maxVisitedPositions
    ) {
      this.memory.visitedPositions.shift();
    }

    // Add behavior to previous behaviors
    this.memory.previousBehaviors.push(newBehavior);

    // Limit previous behaviors
    if (
      this.memory.previousBehaviors.length > this.maxPreviousBehaviors
    ) {
      this.memory.previousBehaviors.shift();
    }

    // Update boundary hits (decay or increment)
    if (boundaryHit) {
      this.memory.boundaryHits = Math.min(
        5,
        this.memory.boundaryHits + 1
      );
    } else {
      // Decay boundary hits over time
      this.memory.boundaryHits = Math.max(
        0,
        this.memory.boundaryHits - 0.1
      );
    }

    return this.current;
  }

  /**
   * Record an interaction
   */
  recordInteraction(): void {
    this.memory.lastInteractionTime = Date.now();
  }

  /**
   * Increment boundary hits
   */
  incrementBoundaryHits(): void {
    this.memory.boundaryHits = Math.min(
      5,
      this.memory.boundaryHits + 1
    );
  }

  /**
   * Get boundary hits count
   */
  get boundaryHits(): number {
    return this.memory.boundaryHits;
  }

  /**
   * Reset boundary hits
   */
  resetBoundaryHits(): void {
    this.memory.boundaryHits = 0;
  }
}
