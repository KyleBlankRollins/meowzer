/**
 * Database management module
 * Provides high-level API for Meowbase operations
 */

import { Meowbase } from "../meowbase/meowbase.js";
import type { MeowbaseConfig } from "../meowbase/types.js";
import type { IStorageAdapter } from "../meowbase/storage/adapter-interface.js";

// Re-export Meowbase class for direct use
export { Meowbase };

/**
 * Singleton Meowbase instance for the application
 * Initialize before use with initializeDatabase()
 */
let databaseInstance: Meowbase | null = null;
let initializationPromise: Promise<Meowbase> | null = null;

/**
 * Initialize the Meowbase database
 * Must be called before any database operations
 *
 * @param config - Optional configuration for Meowbase
 * @param storage - Optional custom storage adapter
 * @returns Promise that resolves when database is ready
 */
export async function initializeDatabase(
  config?: Partial<MeowbaseConfig>,
  storage?: IStorageAdapter
): Promise<Meowbase> {
  // If initialization is already in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // If already initialized, return existing instance
  if (databaseInstance) {
    return databaseInstance;
  }

  // Start initialization
  initializationPromise = (async () => {
    databaseInstance = new Meowbase(config, storage);
    await databaseInstance.initialize();
    initializationPromise = null; // Clear promise after completion
    return databaseInstance;
  })();

  return initializationPromise;
}

/**
 * Get the current database instance
 * Throws error if database hasn't been initialized
 *
 * @returns The Meowbase instance
 */
export function getDatabase(): Meowbase {
  if (!databaseInstance) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return databaseInstance;
}

/**
 * Check if database has been initialized
 *
 * @returns True if database is ready
 */
export function isDatabaseInitialized(): boolean {
  return databaseInstance !== null;
}

/**
 * Close the database connection
 * Should be called when shutting down the application
 *
 * @returns Promise that resolves when database is closed
 */
export async function closeDatabase(): Promise<void> {
  if (databaseInstance) {
    await databaseInstance.close();
    databaseInstance = null;
    initializationPromise = null;
  }
}

/**
 * Reset the database instance (useful for testing)
 * Closes existing connection and clears the singleton
 */
export async function resetDatabase(): Promise<void> {
  await closeDatabase();
}
