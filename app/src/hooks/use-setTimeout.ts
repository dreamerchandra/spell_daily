import { useCallback, useEffect, useRef } from 'react';

export const useSetTimeout = () => {
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  return useCallback((fn: () => void, delay: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      fn();
    }, delay);
  }, []);
};
