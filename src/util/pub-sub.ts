import type { AvatarCharacterPath, AvatarData } from '../common/avatar';

type EventCallback<T> = (data: T) => void;

type EventCallbacks<Events extends Record<string, unknown>> = {
  [K in keyof Events]: Set<EventCallback<Events[K]>>;
};

class PubSub<Events extends Record<string, unknown>> {
  private events: Partial<EventCallbacks<Events>> = {};

  subscribe<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>
  ): void {
    (this.events[event] ??= new Set()).add(callback);
  }

  unsubscribe<K extends keyof Events>(
    event: K,
    callback: EventCallback<Events[K]>
  ): void {
    const set = this.events[event];
    if (!set) return;
    set.delete(callback);
    if (set.size === 0) delete this.events[event];
  }

  // ✅ Conditionally require data argument only if the event type’s payload isn’t undefined
  publish<K extends keyof Events>(
    ...args: Events[K] extends void | undefined
      ? [event: K, data?: Events[K], postCb?: () => void]
      : [event: K, data: Events[K], postCb?: () => void]
  ): void {
    const [event, data, postCb] = args;
    const callbacks = this.events[event];
    if (!callbacks) return;
    for (const cb of callbacks) {
      cb(data as Events[K]);
    }
    postCb?.();
  }
}

export type NativeEvents = {
  Avatar: AvatarData;
  'Avatar:ChangeCharacter': AvatarCharacterPath;
  'Animation:End': void;
  'Avatar:Hint': AvatarData;
};

export const pubSub = new PubSub<NativeEvents>();
