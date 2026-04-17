import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORY_COLOR_MAP } from '../data/constants';
import type { EventItem } from '../types';
import { BORDER, CRIMSON, TEXT_MUTED } from '../eventsTheme';

type Props = {
  events: EventItem[];
  onSelectEvent: (ev: EventItem) => void;
};

export function EventTimeline({ events, onSelectEvent }: Props) {
  const sorted = useMemo(
    () => [...events].sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime()),
    [events]
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>Chronological View</Text>
      <Text style={styles.title}>Events Timeline</Text>
      <Text style={styles.body}>
        Explore upcoming events organized by date. Tap any event to see full details.
      </Text>

      {sorted.map((event, idx) => {
        const catColor = CATEGORY_COLOR_MAP[event.category] ?? CRIMSON;
        const eventDate = new Date(event.startISO);
        const dateStr = eventDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        });
        const timeStr = eventDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <View
            key={event.id}
            style={[styles.row, idx < sorted.length - 1 ? styles.rowBorder : null]}
          >
            <View style={styles.timeCol}>
              <Text style={[styles.time, { color: catColor }]}>{timeStr}</Text>
              <Text style={styles.dateSmall}>{dateStr}</Text>
            </View>
            <Pressable onPress={() => onSelectEvent(event)} style={styles.card}>
              <View style={styles.cardInner}>
                <Image source={{ uri: event.image }} style={styles.thumb} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <View style={styles.cardTop}>
                    <View style={[styles.miniPill, { borderColor: `${catColor}44`, backgroundColor: `${catColor}22` }]}>
                      <View style={[styles.dot, { backgroundColor: catColor }]} />
                      <Text style={styles.miniPillText}>{event.category}</Text>
                    </View>
                    {event.featured ? (
                      <Text style={styles.featured}>Featured</Text>
                    ) : null}
                  </View>
                  <Text style={styles.cardTitle}>{event.title}</Text>
                  <Text style={styles.cardMeta} numberOfLines={2}>
                    {event.location} · {event.organizer}
                  </Text>
                  <Text style={styles.cardReg}>
                    {event.registered} / {event.capacity} registered
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 8 },
  kicker: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: CRIMSON,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 6 },
  body: { fontSize: 13, color: TEXT_MUTED, marginBottom: 20, lineHeight: 20 },
  row: { marginBottom: 22, paddingBottom: 22 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.06)' },
  timeCol: { marginBottom: 10 },
  time: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  dateSmall: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardInner: { flexDirection: 'row', gap: 12, padding: 14 },
  thumb: { width: 100, height: 100, borderRadius: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' },
  miniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  miniPillText: { fontSize: 9, fontWeight: '700', color: '#fff', textTransform: 'uppercase' },
  featured: { fontSize: 9, fontWeight: '700', color: '#fbbf24', textTransform: 'uppercase' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 6 },
  cardMeta: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 },
  cardReg: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
});
