import type { AvatarData } from '../components/common/avatar';

type EventCallback<T = unknown> = (data: T) => void;

type EventCallbacks<Events extends Record<string, unknown>> = {
  [K in keyof Events]: Set<EventCallback<Events[K]>>;
};

class PubSub<Events extends Record<string, unknown>> {
  private events: Partial<EventCallbacks<Events>>;

  constructor() {
    this.events = {};
  }

  subscribe<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>
  ): void {
    if (!this.events[event]) {
      this.events[event] = new Set();
    }
    const eventSet = this.events[event];
    if (eventSet) {
      eventSet.add(callback);
    }
  }

  unsubscribe<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>
  ): void {
    const eventSet = this.events[event];
    if (eventSet) {
      eventSet.delete(callback);
      if (eventSet.size === 0) {
        delete this.events[event];
      }
    }
  }

  publish<K extends keyof Events>(
    event: K,
    data?: Events[K],
    postCb?: () => void
  ): void {
    const callbacks = this.events[event];
    if (callbacks) {
      for (const callback of callbacks) {
        callback(data!);
      }
      if (postCb) {
        postCb();
      }
    }
  }
}

export type NativeEvents = {
  Avatar: AvatarData;
};

const pubSub = new PubSub<NativeEvents>();

export { pubSub };
