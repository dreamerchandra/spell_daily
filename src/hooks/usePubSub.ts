import { useEffect } from 'react';
import { pubSub, type NativeEvents } from '../util/pub-sub';

export const useSubscribe = (
  event: keyof NativeEvents,
  callback: (data: NativeEvents[keyof NativeEvents]) => void
) => {
  useEffect(() => {
    pubSub.subscribe(event, callback);
    return () => {
      pubSub.unsubscribe(event, callback);
    };
  }, [callback, event]);
};
