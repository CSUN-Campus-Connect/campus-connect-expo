export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api';

export const CHAT_API_URL = (process.env.EXPO_PUBLIC_CHAT_API_URL ?? '').trim();

export const GEMINI_API_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '').trim();

export const EMAIL_AGENT_MAILTO =
  'mailto:vram.ghazourian.747@my.csun.edu?subject=Campus%20Connect%20Help&body=Hi%20Vram,%0A%0AI%20need%20help%20with:%0A%0A';
