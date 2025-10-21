import { useEffect } from 'react';
import { pubSub, type NativeEvents } from '../util/pub-sub';

export const useSubscribe = <K extends keyof NativeEvents>(
  event: K,
  callback: (data: NativeEvents[K]) => void
) => {
  useEffect(() => {
    pubSub.subscribe(event, callback);
    return () => {
      pubSub.unsubscribe(event, callback);
    };
  }, [callback, event]);
};
