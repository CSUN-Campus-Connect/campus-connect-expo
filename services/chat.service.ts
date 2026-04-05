import { CHAT_API_URL, GEMINI_API_KEY } from '@/constants/config';

export type ChatHistoryItem = { role: 'user' | 'assistant'; content: string };

const MAX_MESSAGE_CHARS = 2000;

const EMAIL_AGENT_REPLY =
  'For help from a real person, use the **Email Agent** link in this chat. ' +
  'A team member will reply within 24 hours. Not official CSUN advice—verify with CSUN sources when needed.';

const HUMAN_AGENT_TRIGGERS = [
  'human',
  'real person',
  'real people',
  'agent',
  'representative',
  'talk to someone',
  'speak to someone',
  'connect me to',
  'transfer to',
  'live agent',
  'live chat',
  'customer service',
  'staff',
  'actual person',
];

function safeString(x: unknown): string {
  return typeof x === 'string' ? x : '';
}

function wantsHumanOrAgent(message: string): boolean {
  const lower = message.toLowerCase().trim();
  if (!lower) return false;
  return HUMAN_AGENT_TRIGGERS.some((phrase) => lower.includes(phrase));
}

function systemInstruction(): string {
  return [
    'You are a helpful campus assistant for general CSUN guidance.',
    'Be honest: if you are unsure, say you are unsure.',
    'Do not invent exact dates, deadlines, office hours, fees, or policies.',
    'Encourage users to verify details on official CSUN sources and with the relevant office.',
    'Keep answers concise and user-friendly.',
    'Include a short disclaimer: Not official CSUN advice.',
    '',
    'If the user asks to speak to a human, agent, representative, real person, or for more help from staff, tell them: Use the "Email Agent" link in this chat—a team member will reply within 24 hours.',
  ].join('\n');
}

async function callGemini(args: {
  apiKey: string;
  message: string;
  history: ChatHistoryItem[];
}): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
    args.apiKey
  )}`;

  const contents = [
    ...args.history.map((h) => ({
      role: h.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: h.content }],
    })),
    { role: 'user' as const, parts: [{ text: args.message }] },
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction() }] },
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 512,
      },
    }),
  });

  const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok) {
    const errObj = json && typeof json === 'object' && json.error && typeof (json.error as { message?: string }).message === 'string'
      ? (json.error as { message: string }).message
      : null;
    const msg =
      safeString(errObj) ||
      safeString(json && typeof json === 'object' && typeof json.message === 'string' ? json.message : null) ||
      `Gemini request failed (HTTP ${res.status}).`;
    throw new Error(msg);
  }

  const candidates = json && typeof json === 'object' && Array.isArray(json.candidates) ? json.candidates : [];
  const first = candidates[0] as Record<string, unknown> | undefined;
  const parts =
    first &&
    first.content &&
    typeof first.content === 'object' &&
    Array.isArray((first.content as { parts?: unknown }).parts)
      ? (first.content as { parts: Array<{ text?: string }> }).parts
      : [];

  const text = parts
    .map((p) => safeString(p?.text))
    .join('')
    .trim();

  return text || "Not official CSUN advice. I'm not sure—please verify on official CSUN sources.";
}

async function sendViaNextChatApi(message: string, history: ChatHistoryItem[]): Promise<string> {
  const res = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history.map((h) => ({ role: h.role, content: h.content })),
    }),
  });

  const data = (await res.json().catch(() => null)) as { reply?: string; error?: string } | null;
  if (!res.ok || !data?.reply) {
    const msg = typeof data?.error === 'string' ? data.error : `Chat request failed (${res.status}).`;
    throw new Error(msg);
  }
  return String(data.reply);
}

async function sendViaGeminiClient(message: string, history: ChatHistoryItem[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error(
      'Chat not configured. Set EXPO_PUBLIC_CHAT_API_URL to your Next.js /api/chat URL, or set EXPO_PUBLIC_GEMINI_API_KEY for direct Gemini (dev only).'
    );
  }
  if (wantsHumanOrAgent(message)) {
    return EMAIL_AGENT_REPLY;
  }
  const parsedHistory = history
    .slice(-20)
    .map((h) => ({
      role: h.role,
      content: h.content.slice(0, MAX_MESSAGE_CHARS).trim(),
    }))
    .filter((h) => h.content.length > 0);

  return callGemini({ apiKey: GEMINI_API_KEY, message, history: parsedHistory });
}

export async function sendChatMessage(message: string, history: ChatHistoryItem[]): Promise<string> {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new Error('Message is required.');
  }
  if (trimmed.length > MAX_MESSAGE_CHARS) {
    throw new Error(`Message too long (max ${MAX_MESSAGE_CHARS} characters).`);
  }

  if (CHAT_API_URL) {
    return sendViaNextChatApi(trimmed, history);
  }
  return sendViaGeminiClient(trimmed, history);
}
