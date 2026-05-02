import React, { useMemo } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORY_COLOR_MAP } from '../data/constants';
import type { EventItem } from '../types';
import { BORDER, CRIMSON, TEXT_MUTED } from '../eventsTheme';

type Props = {
  events: EventItem[];
  onSelectEvent: (ev: EventItem) => void;
};

const MAX_NODE_R = 32;
const MIN_NODE_R = 12;

interface NodeData {
  event: EventItem;
  x: number;
  y: number;
  r: number;
  color: string;
}

function buildRadialLayout(events: EventItem[], W: number, H: number): { nodes: NodeData[] } {
  const cx = W / 2;
  const cy = H / 2;
  const outerR = Math.min(W, H) * 0.38;
  const innerR = outerR * 0.35;

  const categoryGroups = new Map<string, EventItem[]>();
  events.forEach((ev) => {
    const g = categoryGroups.get(ev.category) ?? [];
    g.push(ev);
    categoryGroups.set(ev.category, g);
  });

  const cats = [...categoryGroups.keys()];
  const sectorAngle = (Math.PI * 2) / Math.max(cats.length, 1);
  const nodes: NodeData[] = [];

  cats.forEach((cat, sectorIdx) => {
    const eventsInSector = categoryGroups.get(cat)!;
    const baseSectorAngle = sectorIdx * sectorAngle - Math.PI / 2;

    eventsInSector.forEach((ev, nodeIdx) => {
      const spread = sectorAngle * 0.7;
      const angleOffset =
        eventsInSector.length > 1 ? ((nodeIdx / (eventsInSector.length - 1)) - 0.5) * spread : 0;
      const angle = baseSectorAngle + angleOffset;

      const score = ev.engagementScore ?? 20;
      const normalised = Math.min(score / 80, 1);
      const radius = outerR - normalised * (outerR - innerR);

      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      const density = ev.capacity > 0 ? ev.registered / ev.capacity : 0.3;
      const r = Math.max(MIN_NODE_R, Math.min(MAX_NODE_R, MIN_NODE_R + density * (MAX_NODE_R - MIN_NODE_R)));

      nodes.push({
        event: ev,
        x,
        y,
        r,
        color: CATEGORY_COLOR_MAP[ev.category] ?? CRIMSON,
      });
    });
  });

  return { nodes };
}

export function EventGraphView({ events, onSelectEvent }: Props) {
  const W = Math.min(Dimensions.get('window').width - 32, 520);
  const H = Math.max(320, W * 0.62);

  const { nodes } = useMemo(() => buildRadialLayout(events, W, H), [events, W, H]);

  const legendCats = useMemo(() => [...new Set(events.map((ev) => ev.category))], [events]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>Algorithmic Cluster View</Text>
      <Text style={styles.title}>Event Engagement Graph</Text>
      <Text style={styles.body}>
        Nodes sized by RSVP density, placed by engagement score. Tap a node for details (edges omitted on
        mobile).
      </Text>

      <View style={styles.legend}>
        {legendCats.map((cat) => (
          <View key={cat} style={styles.legendRow}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: CATEGORY_COLOR_MAP[cat as keyof typeof CATEGORY_COLOR_MAP] ?? CRIMSON },
              ]}
            />
            <Text style={styles.legendText}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.canvas, { width: W, height: H, alignSelf: 'center' }]}>
        {nodes.map((n) => {
          const label = n.event.title
            .split(' ')
            .slice(0, 2)
            .join(' ');
          const short =
            label.length > 14 ? `${label.slice(0, 13)}…` : label;
          return (
            <Pressable
              key={n.event.id}
              onPress={() => onSelectEvent(n.event)}
              style={[
                styles.node,
                {
                  left: n.x - n.r,
                  top: n.y - n.r,
                  width: n.r * 2,
                  height: n.r * 2,
                  borderRadius: n.r,
                  backgroundColor: `${n.color}cc`,
                  borderColor: `${n.color}99`,
                },
              ]}
            >
              <Text style={[styles.nodeLabel, { fontSize: Math.max(8, n.r * 0.28) }]} numberOfLines={2}>
                {short}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
  body: { fontSize: 13, color: TEXT_MUTED, marginBottom: 14, lineHeight: 20 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  canvas: {
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.012)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    overflow: 'hidden',
  },
  node: {
    position: 'absolute',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  nodeLabel: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
});
