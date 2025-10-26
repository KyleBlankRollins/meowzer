/**
 * Error Classes Tests - Test all custom error types
 */

import { describe, it, expect } from "vitest";
import {
  ErrorCode,
  MeowzerError,
  InvalidSettingsError,
  StorageError,
  NotFoundError,
  InitializationError,
  ValidationError,
  CollectionError,
  OperationFailedError,
  InvalidStateError,
} from "../errors.js";

describe("Error Classes", () => {
  // ==========================================================================
  // BASE ERROR CLASS
  // ==========================================================================

  describe("MeowzerError", () => {
    it("should create error with code, message, and details", () => {
      const error = new MeowzerError(
        ErrorCode.INVALID_SETTINGS,
        "Test error message",
        { extra: "details" }
      );

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(MeowzerError);
      expect(error.name).toBe("MeowzerError");
      expect(error.code).toBe(ErrorCode.INVALID_SETTINGS);
      expect(error.message).toBe("Test error message");
      expect(error.details).toEqual({ extra: "details" });
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it("should create error without details", () => {
      const error = new MeowzerError(
        ErrorCode.OPERATION_FAILED,
        "Simple error"
      );

      expect(error.message).toBe("Simple error");
      expect(error.details).toBeUndefined();
    });

    it("should have proper stack trace", () => {
      const error = new MeowzerError(
        ErrorCode.INVALID_STATE,
        "Stack trace test"
      );

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("errors.test.ts");
    });

    it("should serialize to JSON correctly", () => {
      const error = new MeowzerError(
        ErrorCode.STORAGE_ERROR,
        "JSON test",
        { foo: "bar" }
      );

      const json = error.toJSON();

      expect(json.name).toBe("MeowzerError");
      expect(json.code).toBe(ErrorCode.STORAGE_ERROR);
      expect(json.message).toBe("JSON test");
      expect(json.details).toEqual({ foo: "bar" });
      expect(json.timestamp).toBeDefined();
      expect(json.stack).toBeDefined();
    });

    it("should not be recoverable by default", () => {
      const error = new MeowzerError(
        ErrorCode.INVALID_SETTINGS,
        "Test"
      );

      expect(error.isRecoverable()).toBe(false);
    });

    it("should be throwable", () => {
      expect(() => {
        throw new MeowzerError(
          ErrorCode.INVALID_STATE,
          "Thrown error"
        );
      }).toThrow(MeowzerError);
    });

    it("should be catchable as Error", () => {
      try {
        throw new MeowzerError(ErrorCode.NOT_FOUND, "Catchable");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(MeowzerError);
      }
    });
  });

  // ==========================================================================
  // INVALID SETTINGS ERROR
  // ==========================================================================

  describe("InvalidSettingsError", () => {
    it("should create error with invalid fields", () => {
      const error = new InvalidSettingsError(
        "Invalid configuration",
        {
          invalidFields: ["name", "seed"],
          providedValue: { name: 123 },
          expectedType: "string",
        }
      );

      expect(error).toBeInstanceOf(MeowzerError);
      expect(error.name).toBe("InvalidSettingsError");
      expect(error.code).toBe(ErrorCode.INVALID_SETTINGS);
      expect(error.message).toBe("Invalid configuration");
      expect(error.invalidFields).toEqual(["name", "seed"]);
      expect(error.providedValue).toEqual({ name: 123 });
      expect(error.expectedType).toBe("string");
    });

    it("should work with minimal options", () => {
      const error = new InvalidSettingsError("Minimal error");

      expect(error.invalidFields).toEqual([]);
      expect(error.providedValue).toBeUndefined();
      expect(error.expectedType).toBeUndefined();
    });

    it("should get field errors message", () => {
      const error = new InvalidSettingsError("Invalid config", {
        invalidFields: ["color", "size"],
      });

      const fieldErrors = error.getFieldErrors();

      expect(fieldErrors).toBe(
        "Invalid config. Invalid fields: color, size"
      );
    });

    it("should return base message when no invalid fields", () => {
      const error = new InvalidSettingsError("Base message");

      const fieldErrors = error.getFieldErrors();

      expect(fieldErrors).toBe("Base message");
    });

    it("should serialize with additional fields", () => {
      const error = new InvalidSettingsError("Serialization test", {
        invalidFields: ["field1"],
        providedValue: 42,
        expectedType: "string",
      });

      const json = error.toJSON();

      expect(json.invalidFields).toEqual(["field1"]);
      expect(json.providedValue).toBe(42);
      expect(json.expectedType).toBe("string");
    });
  });

  // ==========================================================================
  // STORAGE ERROR
  // ==========================================================================

  describe("StorageError", () => {
    it("should create error with operation details", () => {
      const error = new StorageError("Failed to save", {
        operation: "write",
        storageType: "indexeddb",
        itemId: "cat-123",
      });

      expect(error).toBeInstanceOf(MeowzerError);
      expect(error.name).toBe("StorageError");
      expect(error.code).toBe(ErrorCode.STORAGE_ERROR);
      expect(error.message).toBe("Failed to save");
      expect(error.operation).toBe("write");
      expect(error.storageType).toBe("indexeddb");
      expect(error.itemId).toBe("cat-123");
    });

    it("should work without optional fields", () => {
      const error = new StorageError("Init failed", {
        operation: "init",
      });

      expect(error.operation).toBe("init");
      expect(error.storageType).toBeUndefined();
      expect(error.itemId).toBeUndefined();
    });

    it("should be recoverable for read operations", () => {
      const readError = new StorageError("Read failed", {
        operation: "read",
      });

      expect(readError.isRecoverable()).toBe(true);
    });

    it("should be recoverable for write operations", () => {
      const writeError = new StorageError("Write failed", {
        operation: "write",
      });

      expect(writeError.isRecoverable()).toBe(true);
    });

    it("should not be recoverable for init operations", () => {
      const initError = new StorageError("Init failed", {
        operation: "init",
      });

      expect(initError.isRecoverable()).toBe(false);
    });

    it("should not be recoverable for delete operations", () => {
      const deleteError = new StorageError("Delete failed", {
        operation: "delete",
      });

      expect(deleteError.isRecoverable()).toBe(false);
    });

    it("should not be recoverable for close operations", () => {
      const closeError = new StorageError("Close failed", {
        operation: "close",
      });

      expect(closeError.isRecoverable()).toBe(false);
    });

    it("should provide suggested action for init", () => {
      const error = new StorageError("Init failed", {
        operation: "init",
      });

      const action = error.getSuggestedAction();

      expect(action).toContain("storage is available");
      expect(action).toContain("reinitializing");
    });

    it("should provide suggested action for read", () => {
      const error = new StorageError("Read failed", {
        operation: "read",
      });

      const action = error.getSuggestedAction();

      expect(action).toContain("item exists");
      expect(action).toContain("accessible");
    });

    it("should provide suggested action for write", () => {
      const error = new StorageError("Write failed", {
        operation: "write",
      });

      const action = error.getSuggestedAction();

      expect(action).toContain("quota");
      expect(action).toContain("permissions");
    });

    it("should provide suggested action for delete", () => {
      const error = new StorageError("Delete failed", {
        operation: "delete",
      });

      const action = error.getSuggestedAction();

      expect(action).toContain("item exists");
      expect(action).toContain("deletion");
    });

    it("should provide suggested action for close", () => {
      const error = new StorageError("Close failed", {
        operation: "close",
      });

      const action = error.getSuggestedAction();

      expect(action).toContain("pending operations");
      expect(action).toContain("closing");
    });

    it("should serialize with additional fields", () => {
      const error = new StorageError("Test", {
        operation: "write",
        storageType: "localstorage",
        itemId: "test-id",
      });

      const json = error.toJSON();

      expect(json.operation).toBe("write");
      expect(json.storageType).toBe("localstorage");
      expect(json.itemId).toBe("test-id");
      expect(json.suggestedAction).toBeDefined();
    });
  });

  // ==========================================================================
  // NOT FOUND ERROR
  // ==========================================================================

  describe("NotFoundError", () => {
    it("should create error with resource details", () => {
      const error = new NotFoundError("Cat not found", {
        resourceType: "cat",
        resourceId: "cat-123",
      });

      expect(error).toBeInstanceOf(MeowzerError);
      expect(error.name).toBe("NotFoundError");
      expect(error.code).toBe(ErrorCode.NOT_FOUND);
      expect(error.message).toBe("Cat not found");
      expect(error.resourceType).toBe("cat");
      expect(error.resourceId).toBe("cat-123");
    });

    it("should work with search criteria", () => {
      const error = new NotFoundError("Collection not found", {
        resourceType: "collection",
        searchCriteria: { name: "test", owner: "user1" },
      });

      expect(error.resourceType).toBe("collection");
      expect(error.searchCriteria).toEqual({
        name: "test",
        owner: "user1",
      });
    });

    it("should get search info with resource ID", () => {
      const error = new NotFoundError("Not found", {
        resourceType: "cat",
        resourceId: "cat-456",
      });

      const searchInfo = error.getSearchInfo();

      expect(searchInfo).toContain("ID: cat-456");
    });

    it("should get search info with criteria", () => {
      const error = new NotFoundError("Not found", {
        resourceType: "collection",
        searchCriteria: { name: "test", count: 5 },
      });

      const searchInfo = error.getSearchInfo();

      expect(searchInfo).toContain("Criteria:");
      expect(searchInfo).toContain("name=test");
      expect(searchInfo).toContain("count=5");
    });

    it("should get search info with both ID and criteria", () => {
      const error = new NotFoundError("Not found", {
        resourceType: "cat",
        resourceId: "cat-123",
        searchCriteria: { color: "orange" },
      });

      const searchInfo = error.getSearchInfo();

      expect(searchInfo).toContain("ID: cat-123");
      expect(searchInfo).toContain("color=orange");
    });

    it("should handle no search info", () => {
      const error = new NotFoundError("Not found", {
        resourceType: "other",
      });

      const searchInfo = error.getSearchInfo();

      expect(searchInfo).toBe("No search criteria provided");
    });

    it("should serialize with additional fields", () => {
      const error = new NotFoundError("Test", {
        resourceType: "config",
        resourceId: "config-1",
        searchCriteria: { key: "value" },
      });

      const json = error.toJSON();

      expect(json.resourceType).toBe("config");
      expect(json.resourceId).toBe("config-1");
      expect(json.searchCriteria).toEqual({ key: "value" });
    });
  });

  // ==========================================================================
  // INITIALIZATION ERROR
  // ==========================================================================

  describe("InitializationError", () => {
    it("should create error with component and phase", () => {
      const error = new InitializationError("Init failed", {
        component: "StorageManager",
        phase: "storage",
      });

      expect(error).toBeInstanceOf(MeowzerError);
      expect(error.name).toBe("InitializationError");
      expect(error.code).toBe(ErrorCode.INITIALIZATION_ERROR);
      expect(error.message).toBe("Init failed");
      expect(error.component).toBe("StorageManager");
      expect(error.phase).toBe("storage");
    });

    it("should provide recovery steps for config phase", () => {
      const error = new InitializationError("Config failed", {
        component: "Meowzer",
        phase: "config",
      });

      const steps = error.getRecoverySteps();

      expect(steps).toContain("Check your configuration options");
      expect(steps).toContain(
        "Ensure all required fields are provided"
      );
      expect(steps).toContain("Verify types match expected values");
    });

    it("should provide recovery steps for storage phase", () => {
      const error = new InitializationError("Storage failed", {
        component: "StorageManager",
        phase: "storage",
      });

      const steps = error.getRecoverySteps();

      expect(steps).toContain("Verify storage adapter is supported");
      expect(steps).toContain("Check browser storage availability");
      expect(steps).toContain("Try a different storage adapter");
    });

    it("should provide recovery steps for manager phase", () => {
      const error = new InitializationError("Manager failed", {
        component: "CatManager",
        phase: "manager",
      });

      const steps = error.getRecoverySteps();

      expect(steps).toContain("Check for conflicting instances");
      expect(steps).toContain("Ensure dependencies are loaded");
    });

    it("should provide recovery steps for other phase", () => {
      const error = new InitializationError("Unknown failed", {
        component: "Unknown",
        phase: "other",
      });

      const steps = error.getRecoverySteps();

      expect(steps).toContain("Review SDK documentation");
      expect(steps).toContain("Check console for additional errors");
    });

    it("should serialize with additional fields", () => {
      const error = new InitializationError("Test", {
        component: "TestComponent",
        phase: "config",
      });

      const json = error.toJSON();

      expect(json.component).toBe("TestComponent");
      expect(json.phase).toBe("config");
      expect(json.recoverySteps).toBeDefined();
      expect(Array.isArray(json.recoverySteps)).toBe(true);
    });
  });

  // ==========================================================================
  // VALIDATION ERROR
  // ==========================================================================

  describe("ValidationError", () => {
    it("should create error with field and constraints", () => {
      const error = new ValidationError("Validation failed", {
        field: "name",
        value: "",
        constraints: ["required", "min:3", "max:50"],
      });

      expect(error).toBeInstanceOf(MeowzerError);
      expect(error.name).toBe("ValidationError");
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe("Validation failed");
      expect(error.field).toBe("name");
      expect(error.value).toBe("");
      expect(error.constraints).toEqual([
        "required",
        "min:3",
        "max:50",
      ]);
    });

    it("should handle different value types", () => {
      const numberError = new ValidationError("Number validation", {
        field: "age",
        value: 150,
        constraints: ["max:100"],
      });

      expect(numberError.value).toBe(150);

      const objectError = new ValidationError("Object validation", {
        field: "metadata",
        value: { invalid: true },
        constraints: ["valid-structure"],
      });

      expect(objectError.value).toEqual({ invalid: true });
    });

    it("should get validation details", () => {
      const error = new ValidationError("Test", {
        field: "email",
        value: "not-an-email",
        constraints: ["email", "required"],
      });

      const details = error.getValidationDetails();

      expect(details).toContain('Field "email"');
      expect(details).toContain("email, required");
    });

    it("should serialize with additional fields", () => {
      const error = new ValidationError("Test", {
        field: "testField",
        value: "testValue",
        constraints: ["constraint1", "constraint2"],
      });

      const json = error.toJSON();

      expect(json.field).toBe("testField");
      expect(json.value).toBe("testValue");
      expect(json.constraints).toEqual([
        "constraint1",
        "constraint2",
      ]);
      expect(json.validationDetails).toBeDefined();
    });
  });

  // ==========================================================================
  // COLLECTION ERROR
  // ==========================================================================

  describe("CollectionError", () => {
    it("should create error with collection and operation", () => {
      const error = new CollectionError("Collection error", {
        collectionName: "my-cats",
        operation: "create",
      });

      expect(error).toBeInstanceOf(MeowzerError);
      expect(error.name).toBe("CollectionError");
      expect(error.code).toBe(ErrorCode.COLLECTION_ERROR);
      expect(error.message).toBe("Collection error");
      expect(error.collectionName).toBe("my-cats");
      expect(error.operation).toBe("create");
    });

    it("should be recoverable for read operations", () => {
      const error = new CollectionError("Read failed", {
        collectionName: "test",
        operation: "read",
      });

      expect(error.isRecoverable()).toBe(true);
    });

    it("should be recoverable for query operations", () => {
      const error = new CollectionError("Query failed", {
        collectionName: "test",
        operation: "query",
      });

      expect(error.isRecoverable()).toBe(true);
    });

    it("should not be recoverable for create operations", () => {
      const error = new CollectionError("Create failed", {
        collectionName: "test",
        operation: "create",
      });

      expect(error.isRecoverable()).toBe(false);
    });

    it("should not be recoverable for update operations", () => {
      const error = new CollectionError("Update failed", {
        collectionName: "test",
        operation: "update",
      });

      expect(error.isRecoverable()).toBe(false);
    });

    it("should not be recoverable for delete operations", () => {
      const error = new CollectionError("Delete failed", {
        collectionName: "test",
        operation: "delete",
      });

      expect(error.isRecoverable()).toBe(false);
    });

    it("should serialize with additional fields", () => {
      const error = new CollectionError("Test", {
        collectionName: "test-collection",
        operation: "update",
      });

      const json = error.toJSON();

      expect(json.collectionName).toBe("test-collection");
      expect(json.operation).toBe("update");
    });
  });

  // ==========================================================================
  // OPERATION FAILED ERROR
  // ==========================================================================

  describe("OperationFailedError", () => {
    it("should create error with operation name", () => {
      const error = new OperationFailedError("Operation failed", {
        operationName: "createCat",
      });

      expect(error).toBeInstanceOf(MeowzerError);
      expect(error.name).toBe("OperationFailedError");
      expect(error.code).toBe(ErrorCode.OPERATION_FAILED);
      expect(error.message).toBe("Operation failed");
      expect(error.operationName).toBe("createCat");
      expect(error.retryable).toBe(false);
    });

    it("should handle retryable operations", () => {
      const error = new OperationFailedError("Temporary failure", {
        operationName: "fetchData",
        retryable: true,
      });

      expect(error.retryable).toBe(true);
      expect(error.isRecoverable()).toBe(true);
    });

    it("should not be recoverable when not retryable", () => {
      const error = new OperationFailedError("Fatal error", {
        operationName: "criticalOp",
        retryable: false,
      });

      expect(error.isRecoverable()).toBe(false);
    });

    it("should serialize with additional fields", () => {
      const error = new OperationFailedError("Test", {
        operationName: "testOperation",
        retryable: true,
      });

      const json = error.toJSON();

      expect(json.operationName).toBe("testOperation");
      expect(json.retryable).toBe(true);
    });
  });

  // ==========================================================================
  // INVALID STATE ERROR
  // ==========================================================================

  describe("InvalidStateError", () => {
    it("should create error with state information", () => {
      const error = new InvalidStateError("Invalid state", {
        currentState: "uninitialized",
        expectedState: "initialized",
        attemptedOperation: "saveCat",
      });

      expect(error).toBeInstanceOf(MeowzerError);
      expect(error.name).toBe("InvalidStateError");
      expect(error.code).toBe(ErrorCode.INVALID_STATE);
      expect(error.message).toBe("Invalid state");
      expect(error.currentState).toBe("uninitialized");
      expect(error.expectedState).toBe("initialized");
      expect(error.attemptedOperation).toBe("saveCat");
    });

    it("should handle multiple expected states", () => {
      const error = new InvalidStateError("Wrong state", {
        currentState: "loading",
        expectedState: ["ready", "idle"],
        attemptedOperation: "process",
      });

      expect(error.expectedState).toEqual(["ready", "idle"]);
    });

    it("should get state guidance with single expected state", () => {
      const error = new InvalidStateError("Test", {
        currentState: "paused",
        expectedState: "running",
        attemptedOperation: "step",
      });

      const guidance = error.getStateGuidance();

      expect(guidance).toContain('Operation "step"');
      expect(guidance).toContain("requires state: running");
      expect(guidance).toContain("current state is: paused");
    });

    it("should get state guidance with multiple expected states", () => {
      const error = new InvalidStateError("Test", {
        currentState: "error",
        expectedState: ["ready", "idle", "waiting"],
        attemptedOperation: "execute",
      });

      const guidance = error.getStateGuidance();

      expect(guidance).toContain("ready or idle or waiting");
      expect(guidance).toContain("current state is: error");
    });

    it("should serialize with additional fields", () => {
      const error = new InvalidStateError("Test", {
        currentState: "test-current",
        expectedState: ["state1", "state2"],
        attemptedOperation: "testOp",
      });

      const json = error.toJSON();

      expect(json.currentState).toBe("test-current");
      expect(json.expectedState).toEqual(["state1", "state2"]);
      expect(json.attemptedOperation).toBe("testOp");
      expect(json.stateGuidance).toBeDefined();
    });
  });

  // ==========================================================================
  // ERROR CODE CONSTANTS
  // ==========================================================================

  describe("ErrorCode constants", () => {
    it("should have all expected error codes", () => {
      expect(ErrorCode.INVALID_SETTINGS).toBe("INVALID_SETTINGS");
      expect(ErrorCode.STORAGE_ERROR).toBe("STORAGE_ERROR");
      expect(ErrorCode.NOT_FOUND).toBe("NOT_FOUND");
      expect(ErrorCode.INITIALIZATION_ERROR).toBe(
        "INITIALIZATION_ERROR"
      );
      expect(ErrorCode.VALIDATION_ERROR).toBe("VALIDATION_ERROR");
      expect(ErrorCode.COLLECTION_ERROR).toBe("COLLECTION_ERROR");
      expect(ErrorCode.OPERATION_FAILED).toBe("OPERATION_FAILED");
      expect(ErrorCode.INVALID_STATE).toBe("INVALID_STATE");
    });

    it("should be type-safe constants", () => {
      // ErrorCode uses 'as const' for type safety
      // TypeScript prevents modification at compile time
      const codes = Object.values(ErrorCode);
      expect(codes).toContain("INVALID_SETTINGS");
      expect(codes).toContain("STORAGE_ERROR");
      expect(codes.length).toBe(8);
    });
  });

  // ==========================================================================
  // ERROR INHERITANCE
  // ==========================================================================

  describe("Error inheritance", () => {
    it("should maintain proper inheritance chain", () => {
      const errors = [
        new InvalidSettingsError("test", {}),
        new StorageError("test", { operation: "read" }),
        new NotFoundError("test", { resourceType: "cat" }),
        new InitializationError("test", {
          component: "test",
          phase: "config",
        }),
        new ValidationError("test", {
          field: "test",
          value: "test",
          constraints: [],
        }),
        new CollectionError("test", {
          collectionName: "test",
          operation: "read",
        }),
        new OperationFailedError("test", { operationName: "test" }),
        new InvalidStateError("test", {
          currentState: "a",
          expectedState: "b",
          attemptedOperation: "test",
        }),
      ];

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(MeowzerError);
      });
    });

    it("should distinguish between error types", () => {
      const storageError = new StorageError("test", {
        operation: "read",
      });
      const notFoundError = new NotFoundError("test", {
        resourceType: "cat",
      });

      expect(storageError).toBeInstanceOf(StorageError);
      expect(storageError).not.toBeInstanceOf(NotFoundError);
      expect(notFoundError).toBeInstanceOf(NotFoundError);
      expect(notFoundError).not.toBeInstanceOf(StorageError);
    });
  });

  // ==========================================================================
  // ERROR CATCHING PATTERNS
  // ==========================================================================

  describe("Error catching patterns", () => {
    it("should catch specific error types", () => {
      try {
        throw new NotFoundError("Cat not found", {
          resourceType: "cat",
          resourceId: "cat-123",
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        if (error instanceof NotFoundError) {
          expect(error.resourceId).toBe("cat-123");
        }
      }
    });

    it("should catch as MeowzerError base class", () => {
      const throwRandomError = () => {
        const errors = [
          new StorageError("test", { operation: "read" }),
          new NotFoundError("test", { resourceType: "cat" }),
          new ValidationError("test", {
            field: "test",
            value: "test",
            constraints: [],
          }),
        ];
        throw errors[0];
      };

      try {
        throwRandomError();
      } catch (error) {
        expect(error).toBeInstanceOf(MeowzerError);
        if (error instanceof MeowzerError) {
          expect(error.code).toBeDefined();
          expect(error.timestamp).toBeInstanceOf(Date);
        }
      }
    });

    it("should differentiate from regular Error", () => {
      const regularError = new Error("Regular error");
      const meowzerError = new MeowzerError(
        ErrorCode.INVALID_STATE,
        "Meowzer error"
      );

      expect(regularError).toBeInstanceOf(Error);
      expect(regularError).not.toBeInstanceOf(MeowzerError);
      expect(meowzerError).toBeInstanceOf(Error);
      expect(meowzerError).toBeInstanceOf(MeowzerError);
    });
  });
});
