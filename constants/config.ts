export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api';

/** Full URL to `campus-connect-client` `POST /api/chat` (uses server `GEMINI_API_KEY`, same as the web widget). */
export const CHAT_API_URL = (process.env.EXPO_PUBLIC_CHAT_API_URL ?? '').trim();

export const EMAIL_AGENT_MAILTO =
  'mailto:vram.ghazourian.747@my.csun.edu?subject=Campus%20Connect%20Help&body=Hi%20Vram,%0A%0AI%20need%20help%20with:%0A%0A';
