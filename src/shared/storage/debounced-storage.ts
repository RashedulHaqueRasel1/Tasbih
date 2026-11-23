import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { createJSONStorage } from 'zustand/middleware';

/**
 * AsyncStorage with batched writes, for stores that change on every tap. The latest value is
 * written after `delayMs` of quiet, and immediately when the app leaves the foreground.
 */
export function createDebouncedStorage(delayMs: number) {
  const pending = new Map<string, string>();
  let timer: ReturnType<typeof setTimeout> | null = null;

  const flush = async () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    const entries = [...pending];
    pending.clear();
    await Promise.all(entries.map(([name, value]) => AsyncStorage.setItem(name, value)));
  };

  AppState.addEventListener('change', (state) => {
    if (state !== 'active') {
      void flush();
    }
  });

  return createJSONStorage(() => ({
    getItem: (name) => pending.get(name) ?? AsyncStorage.getItem(name),
    setItem: (name, value) => {
      pending.set(name, value);
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => void flush(), delayMs);
    },
    removeItem: (name) => {
      pending.delete(name);
      return AsyncStorage.removeItem(name);
    },
  }));
}
