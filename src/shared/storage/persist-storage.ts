import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/**
 * Single place that decides where persisted stores live.
 * AsyncStorage works in Expo Go; swap for MMKV here once a development build is in use.
 */
export const persistStorage = createJSONStorage(() => AsyncStorage);
