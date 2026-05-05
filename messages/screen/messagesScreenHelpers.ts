import type { Attachment, Thread } from '../types';

export function isGroupThread(t: Thread): boolean {
  return t.participantIds.length > 2;
}

export function isVoiceAttachment(a: Attachment): boolean {
  const n = (a.name || '').toLowerCase();
  return (
    a.type === 'audio' ||
    a.durationSec != null ||
    n.endsWith('.m4a') ||
    n.endsWith('.caf') ||
    n.endsWith('.webm') ||
    n.includes('voice')
  );
}
