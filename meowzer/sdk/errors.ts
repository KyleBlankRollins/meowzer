/**
 * Error handling for Meowzer SDK
 *
 * Provides consistent error types with codes and details for debugging
 */

/**
 * Error codes for Meowzer SDK errors
 * Use as: ErrorCode.INVALID_SETTINGS
 */
export const ErrorCode = {
  INVALID_SETTINGS: "INVALID_SETTINGS",
  STORAGE_ERROR: "STORAGE_ERROR",
  NOT_FOUND: "NOT_FOUND",
  INITIALIZATION_ERROR: "INITIALIZATION_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  COLLECTION_ERROR: "COLLECTION_ERROR",
  OPERATION_FAILED: "OPERATION_FAILED",
  INVALID_STATE: "INVALID_STATE",
} as const;

/**
 * Type for error codes
 */
export type ErrorCodeType =
  (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Base error class for all Meowzer SDK errors
 */
export class MeowzerError extends Error {
  code: ErrorCodeType;
  details?: unknown;
  timestamp: Date;

  constructor(
    code: ErrorCodeType,
    message: string,
    details?: unknown
  ) {
    super(message);
    this.name = "MeowzerError";
    this.code = code;
    this.details = details;
    this.timestamp = new Date();

    // Maintain proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serialize error for logging or transmission
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }

  /**
   * Check if error is recoverable (can be retried)
   */
  isRecoverable(): boolean {
    return false; // Override in subclasses
  }
}

/**
 * Error thrown when cat settings are invalid
 */
export class InvalidSettingsError extends MeowzerError {
  readonly invalidFields: string[];
  readonly providedValue?: unknown;
  readonly expectedType?: string;

  constructor(
    message: string,
    options?: {
      invalidFields?: string[];
      providedValue?: unknown;
      expectedType?: string;
      details?: unknown;
    }
  ) {
    super(ErrorCode.INVALID_SETTINGS, message, options?.details);
    this.name = "InvalidSettingsError";
    this.invalidFields = options?.invalidFields || [];
    this.providedValue = options?.providedValue;
    this.expectedType = options?.expectedType;
  }

  /**
   * Get user-friendly error message with field information
   */
  getFieldErrors(): string {
    if (this.invalidFields.length === 0) {
      return this.message;
    }
    return `${
      this.message
    }. Invalid fields: ${this.invalidFields.join(", ")}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      invalidFields: this.invalidFields,
      providedValue: this.providedValue,
      expectedType: this.expectedType,
    };
  }
}

/**
 * Error thrown when storage operations fail
 */
export class StorageError extends MeowzerError {
  readonly operation: "read" | "write" | "delete" | "init" | "close";
  readonly storageType?: string;
  readonly itemId?: string;

  constructor(
    message: string,
    options: {
      operation: "read" | "write" | "delete" | "init" | "close";
      storageType?: string;
      itemId?: string;
      details?: unknown;
    }
  ) {
    super(ErrorCode.STORAGE_ERROR, message, options.details);
    this.name = "StorageError";
    this.operation = options.operation;
    this.storageType = options.storageType;
    this.itemId = options.itemId;
  }

  /**
   * Storage errors are often recoverable with retry
   */
  override isRecoverable(): boolean {
    return this.operation === "read" || this.operation === "write";
  }

  /**
   * Get suggested action for recovery
   */
  getSuggestedAction(): string {
    switch (this.operation) {
      case "init":
        return "Ensure storage is available and try reinitializing the SDK";
      case "read":
        return "Check if the item exists and storage is accessible";
      case "write":
        return "Verify storage quota and permissions, then retry";
      case "delete":
        return "Check if the item exists before deletion";
      case "close":
        return "Ensure no pending operations before closing storage";
      default:
        return "Check storage connection and retry";
    }
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      operation: this.operation,
      storageType: this.storageType,
      itemId: this.itemId,
      suggestedAction: this.getSuggestedAction(),
    };
  }
}

/**
 * Error thrown when a requested resource is not found
 */
export class NotFoundError extends MeowzerError {
  readonly resourceType: "cat" | "collection" | "config" | "other";
  readonly resourceId?: string;
  readonly searchCriteria?: Record<string, unknown>;

  constructor(
    message: string,
    options: {
      resourceType: "cat" | "collection" | "config" | "other";
      resourceId?: string;
      searchCriteria?: Record<string, unknown>;
      details?: unknown;
    }
  ) {
    super(ErrorCode.NOT_FOUND, message, options.details);
    this.name = "NotFoundError";
    this.resourceType = options.resourceType;
    this.resourceId = options.resourceId;
    this.searchCriteria = options.searchCriteria;
  }

  /**
   * Get helpful message about what was being searched
   */
  getSearchInfo(): string {
    const parts: string[] = [];
    if (this.resourceId) {
      parts.push(`ID: ${this.resourceId}`);
    }
    if (this.searchCriteria) {
      const criteria = Object.entries(this.searchCriteria)
        .map(([key, value]) => `${key}=${value}`)
        .join(", ");
      parts.push(`Criteria: ${criteria}`);
    }
    return parts.length > 0
      ? parts.join(", ")
      : "No search criteria provided";
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      resourceType: this.resourceType,
      resourceId: this.resourceId,
      searchCriteria: this.searchCriteria,
    };
  }
}

/**
 * Error thrown when SDK initialization fails
 */
export class InitializationError extends MeowzerError {
  readonly component: string;
  readonly phase: "config" | "storage" | "manager" | "other";

  constructor(
    message: string,
    options: {
      component: string;
      phase: "config" | "storage" | "manager" | "other";
      details?: unknown;
    }
  ) {
    super(ErrorCode.INITIALIZATION_ERROR, message, options.details);
    this.name = "InitializationError";
    this.component = options.component;
    this.phase = options.phase;
  }

  /**
   * Get recovery steps based on initialization phase
   */
  getRecoverySteps(): string[] {
    const steps: string[] = [];
    switch (this.phase) {
      case "config":
        steps.push("Check your configuration options");
        steps.push("Ensure all required fields are provided");
        steps.push("Verify types match expected values");
        break;
      case "storage":
        steps.push("Verify storage adapter is supported");
        steps.push("Check browser storage availability");
        steps.push("Try a different storage adapter");
        break;
      case "manager":
        steps.push("Check for conflicting instances");
        steps.push("Ensure dependencies are loaded");
        break;
      default:
        steps.push("Review SDK documentation");
        steps.push("Check console for additional errors");
    }
    return steps;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      component: this.component,
      phase: this.phase,
      recoverySteps: this.getRecoverySteps(),
    };
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends MeowzerError {
  readonly field: string;
  readonly value: unknown;
  readonly constraints: string[];

  constructor(
    message: string,
    options: {
      field: string;
      value: unknown;
      constraints: string[];
      details?: unknown;
    }
  ) {
    super(ErrorCode.VALIDATION_ERROR, message, options.details);
    this.name = "ValidationError";
    this.field = options.field;
    this.value = options.value;
    this.constraints = options.constraints;
  }

  /**
   * Get detailed validation failure information
   */
  getValidationDetails(): string {
    return `Field "${
      this.field
    }" failed validation. Constraints: ${this.constraints.join(
      ", "
    )}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
      value: this.value,
      constraints: this.constraints,
      validationDetails: this.getValidationDetails(),
    };
  }
}

/**
 * Error thrown when collection operations fail
 */
export class CollectionError extends MeowzerError {
  readonly collectionName: string;
  readonly operation:
    | "create"
    | "read"
    | "update"
    | "delete"
    | "query";

  constructor(
    message: string,
    options: {
      collectionName: string;
      operation: "create" | "read" | "update" | "delete" | "query";
      details?: unknown;
    }
  ) {
    super(ErrorCode.COLLECTION_ERROR, message, options.details);
    this.name = "CollectionError";
    this.collectionName = options.collectionName;
    this.operation = options.operation;
  }

  /**
   * Collection errors are often recoverable
   */
  override isRecoverable(): boolean {
    return this.operation === "read" || this.operation === "query";
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      collectionName: this.collectionName,
      operation: this.operation,
    };
  }
}

/**
 * Error thrown when an operation fails
 */
export class OperationFailedError extends MeowzerError {
  readonly operationName: string;
  readonly retryable: boolean;

  constructor(
    message: string,
    options: {
      operationName: string;
      retryable?: boolean;
      details?: unknown;
    }
  ) {
    super(ErrorCode.OPERATION_FAILED, message, options.details);
    this.name = "OperationFailedError";
    this.operationName = options.operationName;
    this.retryable = options.retryable ?? false;
  }

  override isRecoverable(): boolean {
    return this.retryable;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      operationName: this.operationName,
      retryable: this.retryable,
    };
  }
}

/**
 * Error thrown when SDK is in invalid state for operation
 */
export class InvalidStateError extends MeowzerError {
  readonly currentState: string;
  readonly expectedState: string | string[];
  readonly attemptedOperation: string;

  constructor(
    message: string,
    options: {
      currentState: string;
      expectedState: string | string[];
      attemptedOperation: string;
      details?: unknown;
    }
  ) {
    super(ErrorCode.INVALID_STATE, message, options.details);
    this.name = "InvalidStateError";
    this.currentState = options.currentState;
    this.expectedState = options.expectedState;
    this.attemptedOperation = options.attemptedOperation;
  }

  /**
   * Get guidance on how to reach valid state
   */
  getStateGuidance(): string {
    const expected = Array.isArray(this.expectedState)
      ? this.expectedState.join(" or ")
      : this.expectedState;
    return `Operation "${this.attemptedOperation}" requires state: ${expected}, but current state is: ${this.currentState}`;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      currentState: this.currentState,
      expectedState: this.expectedState,
      attemptedOperation: this.attemptedOperation,
      stateGuidance: this.getStateGuidance(),
    };
  }
}
