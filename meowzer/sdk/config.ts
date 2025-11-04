/**
 * Configuration system for Meowzer SDK
 */

import type { Boundaries } from "../types/index.js";

/**
 * Storage configuration options
 */
export interface StorageConfig {
  /** Whether storage is enabled */
  enabled: boolean;
  /** Whether cats auto-save on changes */
  autoSave: boolean;
  /** Default collection name for saving cats */
  defaultCollection: string;
  /** Maximum number of collections to keep in cache */
  cacheSize: number;
}

/**
 * Behavior configuration options
 */
export interface BehaviorConfig {
  /** Whether to pause cats when page is hidden */
  pauseOnPageHide: boolean;
  /** Whether to cleanup cats on page unload */
  cleanupOnUnload: boolean;
}

/**
 * Interaction configuration options
 */
export interface InteractionConfig {
  /** Whether interactions are enabled */
  enabled: boolean;
  /** Detection ranges for different interaction types (px) */
  detectionRanges: {
    need: number;
    laser: number;
    rcCar: number;
    yarn: number;
  };
  /** Base response rates for needs (0-1) */
  responseRates: {
    basicFood: number;
    fancyFood: number;
    water: number;
  };
}

/**
 * Complete Meowzer SDK configuration
 */
export interface MeowzerConfig {
  /** Default container element for cats */
  container?: HTMLElement;
  /** Default boundaries for cat movement */
  boundaries?: Boundaries;
  /** Storage configuration */
  storage: StorageConfig;
  /** Behavior configuration */
  behavior: BehaviorConfig;
  /** Interaction configuration */
  interactions: InteractionConfig;
  /** Enable debug logging */
  debug: boolean;
}

/**
 * Partial configuration for user customization
 */
export type PartialMeowzerConfig = {
  container?: HTMLElement;
  boundaries?: Boundaries;
  storage?: Partial<StorageConfig>;
  behavior?: Partial<BehaviorConfig>;
  interactions?: Partial<InteractionConfig> & {
    detectionRanges?: Partial<InteractionConfig["detectionRanges"]>;
    responseRates?: Partial<InteractionConfig["responseRates"]>;
  };
  debug?: boolean;
};

/**
 * Default SDK configuration
 */
export const DEFAULT_CONFIG: MeowzerConfig = {
  container:
    typeof document !== "undefined" ? document.body : undefined,
  boundaries: {
    minX: 0,
    maxX: typeof window !== "undefined" ? window.innerWidth : 1920,
    minY: 0,
    maxY: typeof window !== "undefined" ? window.innerHeight : 1080,
  },
  storage: {
    enabled: true,
    autoSave: false,
    defaultCollection: "my-cats",
    cacheSize: 5,
  },
  behavior: {
    pauseOnPageHide: true,
    cleanupOnUnload: true,
  },
  interactions: {
    enabled: true,
    detectionRanges: {
      need: 150,
      laser: 200,
      rcCar: 250,
      yarn: 150,
    },
    responseRates: {
      basicFood: 0.7,
      fancyFood: 0.9,
      water: 0.5,
    },
  },
  debug: false,
};

/**
 * Merges user configuration with defaults
 */
export function mergeConfig(
  userConfig?: PartialMeowzerConfig
): MeowzerConfig {
  if (!userConfig) {
    return { ...DEFAULT_CONFIG };
  }

  return {
    container: userConfig.container ?? DEFAULT_CONFIG.container,
    boundaries: userConfig.boundaries ?? DEFAULT_CONFIG.boundaries,
    storage: {
      ...DEFAULT_CONFIG.storage,
      ...userConfig.storage,
    },
    behavior: {
      ...DEFAULT_CONFIG.behavior,
      ...userConfig.behavior,
    },
    interactions: {
      enabled:
        userConfig.interactions?.enabled ??
        DEFAULT_CONFIG.interactions.enabled,
      detectionRanges: {
        ...DEFAULT_CONFIG.interactions.detectionRanges,
        ...userConfig.interactions?.detectionRanges,
      },
      responseRates: {
        ...DEFAULT_CONFIG.interactions.responseRates,
        ...userConfig.interactions?.responseRates,
      },
    },
    debug: userConfig.debug ?? DEFAULT_CONFIG.debug,
  };
}

/**
 * Configuration manager class
 */
/**
 * ConfigManager handles SDK configuration with deep merging
 */
export class ConfigManager {
  private config: MeowzerConfig;

  constructor(userConfig: PartialMeowzerConfig = {}) {
    this.config = mergeConfig(userConfig);
  }

  /**
   * Get current configuration
   */
  get(): MeowzerConfig {
    return { ...this.config };
  }

  /**
   * Set new config values (deep merge with existing)
   */
  set(userConfig: PartialMeowzerConfig): void {
    // Merge new config with current config as base
    const merged = {
      container: userConfig.container ?? this.config.container,
      boundaries: userConfig.boundaries ?? this.config.boundaries,
      storage: {
        ...this.config.storage,
        ...userConfig.storage,
      },
      behavior: {
        ...this.config.behavior,
        ...userConfig.behavior,
      },
      interactions: {
        enabled:
          userConfig.interactions?.enabled ??
          this.config.interactions.enabled,
        detectionRanges: {
          ...this.config.interactions.detectionRanges,
          ...userConfig.interactions?.detectionRanges,
        },
        responseRates: {
          ...this.config.interactions.responseRates,
          ...userConfig.interactions?.responseRates,
        },
      },
      debug: userConfig.debug ?? this.config.debug,
    };
    this.config = merged;
  }

  /**
   * Update default settings
   */
  setDefaults(updates: {
    container?: HTMLElement;
    boundaries?: Boundaries;
  }): void {
    if (updates.container) {
      this.config.container = updates.container;
    }
    if (updates.boundaries) {
      this.config.boundaries = updates.boundaries;
    }
  }

  /**
   * Update storage configuration
   */
  setStorageDefaults(updates: Partial<StorageConfig>): void {
    this.config.storage = {
      ...this.config.storage,
      ...updates,
    };
  }

  /**
   * Update behavior configuration
   */
  setBehaviorDefaults(updates: Partial<BehaviorConfig>): void {
    this.config.behavior = {
      ...this.config.behavior,
      ...updates,
    };
  }

  /**
   * Enable or disable debug mode
   */
  setDebug(enabled: boolean): void {
    this.config.debug = enabled;
  }

  /**
   * Get container element
   */
  getContainer(): HTMLElement {
    if (!this.config.container) {
      throw new Error(
        "No container configured and document.body is not available"
      );
    }
    return this.config.container;
  }

  /**
   * Get boundaries
   */
  getBoundaries(): Boundaries {
    return { ...this.config.boundaries };
  }
}
