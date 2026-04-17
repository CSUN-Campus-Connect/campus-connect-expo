function apiBase(): string {
  const u = process.env.EXPO_PUBLIC_API_URL;
  if (typeof u === 'string' && u.length > 0) return u.replace(/\/$/, '');
  return '';
}

export function isApiConfigured(): boolean {
  return apiBase().length > 0;
}

export async function postAddToEvents(program: string, email: string): Promise<Response> {
  const base = apiBase();
  if (!base) throw new Error('EXPO_PUBLIC_API_URL is not set');
  return fetch(`${base}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ program, email }),
  });
}

export async function postInvite(program: string, senderEmail: string, friendEmail: string): Promise<Response> {
  const base = apiBase();
  if (!base) throw new Error('EXPO_PUBLIC_API_URL is not set');
  return fetch(`${base}/api/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ program, senderEmail, friendEmail }),
  });
}
