import { Platform } from 'react-native';

/**
 * Secure token storage. Uses expo-secure-store on iOS/Android (native only).
 * On web, expo-secure-store has no native module and would throw; we fall back
 * to in-memory storage so the app runs. For web token persistence, use
 * AsyncStorage (e.g. install @react-native-async-storage/async-storage) and
 * extend this module.
 */
const memoryStore: Record<string, string> = {};

async function getItemWeb(key: string): Promise<string | null> {
  return memoryStore[key] ?? null;
}

async function setItemWeb(key: string, value: string): Promise<void> {
  memoryStore[key] = value;
}

async function deleteItemWeb(key: string): Promise<void> {
  delete memoryStore[key];
}

export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return getItemWeb(key);
    }
    const SecureStore = await import('expo-secure-store');
    return SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      return setItemWeb(key, value);
    }
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      return deleteItemWeb(key);
    }
    const SecureStore = await import('expo-secure-store');
    await SecureStore.deleteItemAsync(key);
  },
};
