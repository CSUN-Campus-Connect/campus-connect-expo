import { useMemo } from 'react';

import type { EventItem, RelatedEventSlot } from '../types';

export function useRelatedEvents(
  registeredEvent: EventItem | null,
  allEvents: EventItem[],
  max = 3
): RelatedEventSlot[] {
  return useMemo(() => {
    if (!registeredEvent) return [];

    return allEvents
      .filter((ev) => ev.id !== registeredEvent.id)
      .map((ev): { ev: EventItem; score: number; reason: RelatedEventSlot['reason'] } => {
        let score = 0;
        let reason: RelatedEventSlot['reason'] = 'trending';

        const sameCategory = ev.category === registeredEvent.category;
        const audienceOverlap = ev.audience.some((a) => registeredEvent.audience.includes(a));

        if (sameCategory) {
          score += 3;
          reason = 'same_category';
        }
        if (audienceOverlap) {
          score += 2;
          if (!sameCategory) reason = 'same_audience';
        }
        if (ev.trending) {
          score += 1;
        }
        score += ((ev.engagementScore ?? 0) / 100) * 0.5;

        return { ev, score, reason };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, max)
      .map(({ ev, reason }) => ({ event: ev, reason }));
  }, [registeredEvent, allEvents, max]);
}
