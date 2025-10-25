/**
 * Generic event emitter system
 * Provides type-safe event handling for classes
 */

export type EventHandler<T = any> = (data: T) => void;

/**
 * EventEmitter class
 * Manages event subscriptions and emissions
 *
 * @example
 * ```ts
 * type MyEvents = 'start' | 'stop' | 'update';
 *
 * class MyClass {
 *   private events = new EventEmitter<MyEvents>();
 *
 *   on(event: MyEvents, handler: EventHandler) {
 *     this.events.on(event, handler);
 *   }
 *
 *   private doSomething() {
 *     this.events.emit('update', { value: 42 });
 *   }
 * }
 * ```
 */
export class EventEmitter<EventType extends string = string> {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();

  /**
   * Subscribe to an event
   */
  on(event: EventType, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: EventType, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler);
  }

  /**
   * Emit an event to all subscribers
   * Catches and logs errors in handlers to prevent one bad handler from breaking others
   */
  emit(event: EventType, data?: any): void {
    this.handlers.get(event)?.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in ${event} handler:`, error);
      }
    });
  }

  /**
   * Remove all event handlers
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Check if an event has any handlers
   */
  has(event: EventType): boolean {
    return (this.handlers.get(event)?.size ?? 0) > 0;
  }

  /**
   * Get the number of handlers for an event
   */
  listenerCount(event: EventType): number {
    return this.handlers.get(event)?.size ?? 0;
  }
}
