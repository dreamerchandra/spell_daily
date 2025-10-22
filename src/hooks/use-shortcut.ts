import { useEffect } from 'react';

export const useShortcut = (
  key: string,
  callback: () => void,
  options: {
    triggerKey: 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' | null;
  } = {
    triggerKey: 'metaKey',
  }
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isTriggerKey = options.triggerKey
        ? (event as any)[options.triggerKey]
        : true;
      if (event.key === key && isTriggerKey) {
        event.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, options.triggerKey]);
};
