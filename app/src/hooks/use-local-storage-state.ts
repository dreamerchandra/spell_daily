import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

const LOCAL_STORAGE_KEYS = {
  GAME_TYPE: 'game_type',
  SOUND_ENABLED: 'sound_enabled',
} as const;

export const useLocalStorageState = <T>(
  _key: keyof typeof LOCAL_STORAGE_KEYS,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const key = LOCAL_STORAGE_KEYS[_key];
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? (JSON.parse(storedValue) as T) : defaultValue;
    } catch (error) {
      console.error('Error reading localStorage key “' + key + '”: ', error);
      return defaultValue;
    }
  });

  const setLocalStorageState: Dispatch<SetStateAction<T>> = useCallback(
    value => {
      try {
        const valueToStore = value instanceof Function ? value(state) : value;
        setState(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } else {
          console.warn(
            'Tried to set localStorage key “' +
              key +
              '” in a non-client environment'
          );
        }
      } catch (error) {
        console.error('Error setting localStorage key “' + key + '”: ', error);
      }
    },
    [key, state]
  );

  return [state, setLocalStorageState];
};
