import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { CATEGORY_COLOR_MAP } from '../data/constants';
import type { EventItem } from '../types';
import { BORDER, CRIMSON } from '../eventsTheme';

type Props = {
  event: EventItem;
  isFavorite: boolean;
  onOpen: (ev: EventItem) => void;
  onToggleFav: (id: string) => void;
  onRegister: (ev: EventItem) => void;
};

function isFreeEvent(price: string) {
  return price === 'Free' || price.toLowerCase().startsWith('free');
}

function CapacityBar({ registered, capacity }: { registered: number; capacity: number }) {
  if (capacity === 0) return null;
  const pct = Math.min(Math.round((registered / capacity) * 100), 100);
  const full = registered >= capacity;
  const color = full ? '#ef4444' : pct > 80 ? '#f59e0b' : CRIMSON;

  return (
    <View style={capStyles.row}>
      <View style={capStyles.track}>
        <View style={[capStyles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={capStyles.meta}>
        {registered.toLocaleString()} / {capacity.toLocaleString()}
      </Text>
    </View>
  );
}

const capStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  track: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
  meta: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
});

function StatusBadge({ label, bg, border, color }: { label: string; bg: string; border: string; color: string }) {
  return (
    <View style={[badgeStyles.wrap, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[badgeStyles.text, { color }]}>{label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderWidth: 1,
  },
  text: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
});

export function EventBentoCard({ event, isFavorite, onOpen, onToggleFav, onRegister }: Props) {
  const catColor = CATEGORY_COLOR_MAP[event.category] ?? CRIMSON;
  const full = event.capacity > 0 && event.registered >= event.capacity;

  return (
    <Pressable
      onPress={() => onOpen(event)}
      style={({ pressed }) => [styles.cardOuter, pressed && { opacity: 0.92 }]}
    >
      <View
        style={[
          styles.card,
          { borderColor: event.featured ? 'rgba(210,32,48,0.28)' : BORDER },
        ]}
      >
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: event.image }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />
          <LinearGradient
            colors={['transparent', 'rgba(10,3,5,0.88)']}
            style={StyleSheet.absoluteFill}
            locations={[0.35, 1]}
          />

          <View style={styles.badgeRow}>
            {event.featured ? (
              <StatusBadge label="Featured" bg="rgba(251,191,36,0.2)" border="rgba(251,191,36,0.4)" color="#fbbf24" />
            ) : null}
            {event.trending ? (
              <StatusBadge label="Trending" bg="rgba(210,32,48,0.22)" border="rgba(210,32,48,0.45)" color="#ff6b6b" />
            ) : null}
            {isFreeEvent(event.price) ? (
              <StatusBadge label="Free" bg="rgba(22,200,120,0.18)" border="rgba(22,200,120,0.35)" color="#16c878" />
            ) : null}
            {full ? (
              <StatusBadge label="Sold Out" bg="rgba(255,255,255,0.08)" border="rgba(255,255,255,0.15)" color="rgba(255,255,255,0.45)" />
            ) : null}
          </View>

          <Pressable
            onPress={() => onToggleFav(event.id)}
            style={[styles.favBtn, { borderColor: isFavorite ? 'rgba(210,32,48,0.6)' : 'rgba(255,255,255,0.15)' }]}
            hitSlop={8}
          >
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={16} color={isFavorite ? CRIMSON : 'rgba(255,255,255,0.75)'} />
          </Pressable>

          <View style={[styles.catPill, { borderColor: `${catColor}44`, backgroundColor: `${catColor}1a` }]}>
            <View style={[styles.dot, { backgroundColor: catColor }]} />
            <Text style={styles.catText}>{event.category}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {event.shortDescription}
          </Text>

          <View style={styles.metaBlock}>
            <Text style={styles.metaLine} numberOfLines={1}>
              {event.date} · {event.time}
            </Text>
            <Text style={styles.metaLine} numberOfLines={1}>
              {event.location}
            </Text>
            <Text style={styles.metaLine} numberOfLines={1}>
              {event.organizer}
            </Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <CapacityBar registered={event.registered} capacity={event.capacity} />
          </View>

          {event.engagementScore !== undefined ? (
            <View style={styles.scoreChip}>
              <View style={styles.scoreDot} />
              <Text style={styles.scoreText}>Score {Math.round(event.engagementScore)}</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              onPress={() => {
                if (!full) onRegister(event);
              }}
              disabled={full}
              style={[
                styles.registerBtn,
                { backgroundColor: full ? 'rgba(255,255,255,0.04)' : catColor, borderColor: full ? BORDER : catColor },
              ]}
            >
              <Text style={[styles.registerLabel, { color: full ? 'rgba(255,255,255,0.28)' : '#fff' }]}>
                {full ? 'Sold Out' : 'Register'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onOpen(event)}
              style={styles.iconBtn}
            >
              <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.55)" />
            </Pressable>

            {event.csunUrl ? (
              <Pressable
                onPress={() => void Linking.openURL(event.csunUrl!)}
                style={styles.iconBtn}
              >
                <Ionicons name="open-outline" size={16} color="rgba(255,255,255,0.55)" />
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardOuter: { marginBottom: 16 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageWrap: { height: 180, position: 'relative' },
  badgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    maxWidth: '78%',
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.52)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catPill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: '78%',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  catText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  body: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  title: { fontSize: 15, fontWeight: '800', color: '#fff', marginBottom: 6, lineHeight: 20 },
  desc: { fontSize: 12, color: 'rgba(255,255,255,0.48)', marginBottom: 12, lineHeight: 18 },
  metaBlock: { marginBottom: 10, gap: 5 },
  metaLine: { fontSize: 11, color: 'rgba(255,255,255,0.52)' },
  scoreChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(210,32,48,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(210,32,48,0.14)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 14,
  },
  scoreDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: CRIMSON },
  scoreText: { fontSize: 10, fontWeight: '700', color: 'rgba(210,32,48,0.85)' },
  actions: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  registerBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
  },
  registerLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
});
