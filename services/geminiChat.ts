/**
 * CSUN campus assistant — same contract as `campus-connect-client` `POST /api/chat`
 * (server-side `GEMINI_API_KEY`, model, prompts, rate limits). Do not embed API keys in the app.
 */

import { CHAT_API_URL } from '@/constants/config';

export type ChatTurn = { role: 'user' | 'assistant'; text: string };

/** Map Expo app locale codes to `parseSiteLang` codes on the Next route. */
function mapLanguageForChatApi(locale: string): string {
  if (locale === 'zh') return 'zh-CN';
  return locale;
}

/**
 * Sends the conversation to the Next.js `/api/chat` proxy (must end with a `user` message).
 */
export async function sendGeminiMessage(
  turns: ChatTurn[],
  options?: { language?: string },
): Promise<{ text: string } | { error: string }> {
  const url = CHAT_API_URL.trim();
  if (!url) {
    return {
      error:
        'Chat is not configured. Set EXPO_PUBLIC_CHAT_API_URL to your campus-connect-client URL, e.g. http://YOUR_LAN_IP:3000/api/chat (same place GEMINI_API_KEY is set for the web app).',
    };
  }

  if (turns.length === 0 || turns[turns.length - 1].role !== 'user') {
    return { error: 'Invalid conversation state.' };
  }

  const last = turns[turns.length - 1];
  const history = turns.slice(0, -1).map((t) => ({
    role: t.role,
    content: t.text,
  }));

  const language = mapLanguageForChatApi(options?.language ?? 'en');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: last.text,
        history,
        language,
      }),
    });

    const data = (await res.json().catch(() => null)) as { reply?: unknown; error?: unknown } | null;
    if (!res.ok) {
      const msg =
        data && typeof data.error === 'string' ? data.error : `Chat request failed (${res.status}).`;
      return { error: msg };
    }
    if (data == null || typeof data.reply !== 'string') {
      const msg =
        data && typeof data.error === 'string' ? data.error : 'Invalid response from chat service.';
      return { error: msg };
    }

    return { text: data.reply };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    return { error: msg };
  }
}
