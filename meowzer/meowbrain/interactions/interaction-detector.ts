/**
 * InteractionDetector - Handles polling-based detection of nearby interactions
 */

import type { Cat } from "../../meowtion/cat.js";
import type { Position } from "../../types/index.js";

export interface NearbyNeed {
  type: string;
  position: Position;
  id: string;
}

export interface NearbyYarn {
  type: string;
  position: Position;
  id: string;
  state: string;
}

export interface NearbyLaser {
  type: string;
  position: Position;
  id: string;
  isActive: boolean;
}

export interface DetectionConfig {
  needDetectionRange?: number;
  yarnDetectionRange?: number;
  laserDetectionRange?: number;
}

/**
 * Detects nearby interactions through polling
 */
export class InteractionDetector {
  private cat: Cat;
  private config: DetectionConfig;

  constructor(cat: Cat, config: DetectionConfig = {}) {
    this.cat = cat;
    this.config = {
      needDetectionRange: config.needDetectionRange ?? 150,
      yarnDetectionRange: config.yarnDetectionRange ?? 150,
      laserDetectionRange: config.laserDetectionRange ?? 300,
    };
  }

  /**
   * Check for nearby needs (hybrid detection: polling)
   */
  checkNearbyNeeds(): NearbyNeed[] {
    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];

      if (!interactions) return [];

      const needs = interactions.getNeedsNearPosition(
        this.cat.position
      );
      return needs.map((need: any) => ({
        type: need.type,
        position: need.position,
        id: need.id,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Check for nearby yarns (polling)
   */
  checkNearbyYarns(): NearbyYarn[] {
    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];

      if (!interactions) return [];

      const yarns = interactions.getYarnsNearPosition(
        this.cat.position
      );
      return yarns.map((yarn: any) => ({
        type: "yarn",
        position: yarn.position,
        id: yarn.id,
        state: yarn.state,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Check for nearby laser pointer (polling)
   */
  checkNearbyLaser(): NearbyLaser | null {
    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];

      if (!interactions || !interactions.getActiveLaser) return null;

      const laser = interactions.getActiveLaser();
      if (!laser || !laser.isActive) return null;

      // Check if laser is within detection range
      const dist = Math.hypot(
        laser.position.x - this.cat.position.x,
        laser.position.y - this.cat.position.y
      );

      if (dist > (this.config.laserDetectionRange ?? 300)) {
        return null;
      }

      return {
        type: "laser",
        position: laser.position,
        id: laser.id,
        isActive: laser.isActive,
      };
    } catch {
      return null;
    }
  }

  /**
   * Update detection configuration
   */
  updateConfig(config: Partial<DetectionConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
