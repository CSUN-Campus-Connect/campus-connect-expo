import AsyncStorage from '@react-native-async-storage/async-storage';

const GIF_KEY = 'cc_expo_gif_favs';

export async function loadGifFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(GIF_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    const arr = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
    return Array.from(new Set(arr));
  } catch {
    return [];
  }
}

export async function saveGifFavorites(urls: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(GIF_KEY, JSON.stringify(Array.from(new Set(urls))));
  } catch {
    /* ignore */
  }
}
