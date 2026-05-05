import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { CATEGORY_COLOR_MAP } from '../data/constants';
import type { EventItem } from '../types';
import { BORDER, CRIMSON, TEXT_MUTED } from '../eventsTheme';

type Props = {
  allEvents: EventItem[];
  favorites: Set<string>;
  onOpen: (ev: EventItem) => void;
  onRemove: (id: string) => void;
  onDiscover: () => void;
};

function FavCard({
  event,
  onOpen,
  onRemove,
}: {
  event: EventItem;
  onOpen: (ev: EventItem) => void;
  onRemove: (id: string) => void;
}) {
  const catColor = CATEGORY_COLOR_MAP[event.category] ?? CRIMSON;
  const pct = event.capacity > 0 ? Math.min(Math.round((event.registered / event.capacity) * 100), 100) : 0;

  return (
    <Pressable onPress={() => onOpen(event)} style={styles.card}>
      <View style={styles.cardInner}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: event.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={['transparent', 'rgba(10,3,5,0.88)']} style={StyleSheet.absoluteFill} />
          <View style={[styles.catPill, { borderColor: `${catColor}44`, backgroundColor: `${catColor}20` }]}>
            <View style={[styles.dot, { backgroundColor: catColor }]} />
            <Text style={styles.catPillText}>{event.category}</Text>
          </View>
          <Pressable
            onPress={() => onRemove(event.id)}
            style={styles.removeBtn}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Remove from saved"
          >
            <Ionicons name="heart" size={14} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {event.date} · {event.time}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {event.location}
          </Text>

          <View style={{ marginVertical: 10 }}>
            <View style={styles.capRow}>
              <Text style={styles.capLabel}>Attendance</Text>
              <Text style={styles.capVal}>
                {event.registered} / {event.capacity}
              </Text>
            </View>
            <View style={styles.capTrack}>
              <View style={[styles.capFill, { width: `${pct}%`, backgroundColor: pct >= 90 ? '#ef4444' : catColor }]} />
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable onPress={() => onOpen(event)} style={[styles.primaryBtn, { backgroundColor: catColor }]}>
              <Text style={styles.primaryBtnText}>View Details</Text>
            </Pressable>
            {event.csunUrl ? (
              <Pressable onPress={() => void Linking.openURL(event.csunUrl!)} style={styles.iconBtn}>
                <Ionicons name="open-outline" size={16} color="rgba(255,255,255,0.55)" />
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function EmptyFavorites({ onDiscover }: { onDiscover: () => void }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name="heart-outline" size={36} color="rgba(210,32,48,0.55)" />
      </View>
      <Text style={styles.emptyTitle}>No saved events yet</Text>
      <Text style={styles.emptyBody}>
        Tap the heart on any event card to save it here for quick access.
      </Text>
      <Pressable onPress={onDiscover} style={styles.browseBtn}>
        <Text style={styles.browseBtnText}>Browse Events</Text>
      </Pressable>
    </View>
  );
}

export function FavoritesSection({ allEvents, favorites, onOpen, onRemove, onDiscover }: Props) {
  const favEvents = useMemo(
    () => allEvents.filter((ev) => favorites.has(ev.id)),
    [allEvents, favorites]
  );

  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    favEvents.forEach((ev) => {
      counts[ev.category] = (counts[ev.category] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [favEvents]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>Your Collection</Text>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          Saved Events
          {favEvents.length > 0 ? <Text style={styles.count}> ({favEvents.length})</Text> : null}
        </Text>
        {categoryBreakdown.length > 0 ? (
          <View style={styles.breakdown}>
            {categoryBreakdown.map(([cat, count]) => {
              const color = CATEGORY_COLOR_MAP[cat as keyof typeof CATEGORY_COLOR_MAP] ?? CRIMSON;
              return (
                <View key={cat} style={[styles.breakPill, { borderColor: `${color}30`, backgroundColor: `${color}12` }]}>
                  <View style={[styles.dot, { backgroundColor: color }]} />
                  <Text style={styles.breakText}>
                    {count} {cat}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>

      {favEvents.length > 0 ? <View style={styles.shimmerBar} /> : null}

      {favEvents.length === 0 ? (
        <EmptyFavorites onDiscover={onDiscover} />
      ) : (
        <View style={styles.grid}>
          {favEvents.map((ev) => (
            <FavCard key={ev.id} event={ev} onOpen={onOpen} onRemove={onRemove} />
          ))}
        </View>
      )}
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
    marginBottom: 8,
  },
  headerRow: { gap: 10, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff' },
  count: { color: CRIMSON },
  breakdown: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  breakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  breakText: { fontSize: 11, color: 'rgba(255,255,255,0.62)' },
  shimmerBar: {
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(210,32,48,0.35)',
    maxWidth: 120,
    marginBottom: 18,
  },
  grid: { gap: 16 },
  card: { borderRadius: 20, overflow: 'hidden' },
  cardInner: {
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageWrap: { height: 160, position: 'relative' },
  catPill: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  catPillText: { fontSize: 9, fontWeight: '700', color: '#fff', textTransform: 'uppercase' },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(210,32,48,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(210,32,48,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: 16, paddingVertical: 14 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 6 },
  meta: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  capRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  capLabel: { fontSize: 10, color: 'rgba(255,255,255,0.35)' },
  capVal: { fontSize: 10, color: 'rgba(255,255,255,0.45)' },
  capTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' },
  capFill: { height: '100%', borderRadius: 2 },
  actions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  primaryBtn: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 9,
    alignItems: 'center',
  },
  primaryBtnText: { fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 20 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(210,32,48,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(210,32,48,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 8 },
  emptyBody: { fontSize: 14, color: TEXT_MUTED, textAlign: 'center', lineHeight: 22, marginBottom: 22 },
  browseBtn: {
    backgroundColor: CRIMSON,
    borderRadius: 12,
    paddingHorizontal: 26,
    paddingVertical: 12,
  },
  browseBtnText: { fontSize: 13, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
});
