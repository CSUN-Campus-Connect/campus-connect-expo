import { useMemo } from 'react';

import type { EventItem } from '../types';

interface RankingResult {
  rankedEvents: EventItem[];
}

export function useEventRanking(events: EventItem[]): RankingResult {
  const rankedEvents = useMemo(() => {
    const now = Date.now();

    const scored = events.map((ev): EventItem => {
      const rsvpDensity = ev.capacity > 0 ? ev.registered / ev.capacity : 0;
      const views = ev.viewCount ?? 0;
      const viewWeight = Math.log10(views + 1) / 4;
      const startMs = new Date(ev.startISO).getTime();
      const hoursUntil = Math.max(0, (startMs - now) / 3_600_000);
      const featuredBoost = ev.featured ? 15 : 0;
      const trendingBoost = ev.trending ? 10 : 0;

      const engagementScore =
        rsvpDensity * 40 +
        viewWeight * 20 -
        hoursUntil * 0.002 +
        featuredBoost +
        trendingBoost;

      const urgencyScore = hoursUntil / 24;

      return { ...ev, engagementScore, urgencyScore };
    });

    return scored.sort((a, b) => (b.engagementScore ?? 0) - (a.engagementScore ?? 0));
  }, [events]);

  return { rankedEvents };
}
