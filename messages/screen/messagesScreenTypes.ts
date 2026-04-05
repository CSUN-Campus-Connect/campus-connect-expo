import type { Attachment } from '../types';

export type LocalAsset = { uri: string; name: string; mime: string; durationSec?: number };

export type DraftState = { text: string; locals: LocalAsset[]; gifs: Attachment[] };

export function emptyDraft(): DraftState {
  return { text: '', locals: [], gifs: [] };
}
