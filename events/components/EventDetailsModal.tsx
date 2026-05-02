import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CATEGORY_COLOR_MAP } from '../data/constants';
import type { EventItem } from '../types';
import { buildICS } from '../utils/calendar';
import { BORDER, CRIMSON, PANEL, TEXT_MUTED } from '../eventsTheme';

type Props = {
  event: EventItem | null;
  visible: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFav: (id: string) => void;
  onRegister: (ev: EventItem) => void;
};

export function EventDetailsModal({ event, visible, isFavorite, onClose, onToggleFav, onRegister }: Props) {
  const insets = useSafeAreaInsets();
  const catColor = event ? (CATEGORY_COLOR_MAP[event.category] ?? CRIMSON) : CRIMSON;
  const pct = event ? Math.min(Math.round((event.registered / event.capacity) * 100), 100) : 0;
  const full = event ? event.registered >= event.capacity : false;

  const handleCalendar = async () => {
    if (!event) return;
    const ics = buildICS(event);
    try {
      await Share.share({ message: ics, title: `${event.title}.ics` });
    } catch {
      /* ignore */
    }
  };

  return (
    <Modal visible={visible && !!event} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={styles.root}>
        {!event ? null : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Image source={{ uri: event.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={['rgba(0,0,0,0.25)', 'rgba(12,3,5,0.92)']}
              style={StyleSheet.absoluteFill}
            />

            <View style={[styles.heroTop, { paddingTop: 8 + insets.top }]}>
              <Pressable onPress={onClose} style={styles.roundBtn} accessibilityRole="button">
                <Ionicons name="close" size={18} color="#fff" />
              </Pressable>
              <Pressable
                onPress={() => onToggleFav(event.id)}
                style={[styles.roundBtn, { borderColor: isFavorite ? 'rgba(210,32,48,0.6)' : 'rgba(255,255,255,0.15)' }]}
              >
                <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={18} color={isFavorite ? CRIMSON : 'rgba(255,255,255,0.85)'} />
              </Pressable>
            </View>

            <View style={[styles.catBadge, { borderColor: `${catColor}55`, backgroundColor: `${catColor}22` }]}>
              <View style={[styles.dot, { backgroundColor: catColor }]} />
              <Text style={styles.catBadgeText}>{event.category}</Text>
            </View>
          </View>

          <View style={styles.body}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.fullDesc}>{event.fullDescription}</Text>

            <View style={styles.grid}>
              {[
                { label: 'Date', value: event.date },
                { label: 'Time', value: event.time },
                { label: 'Location', value: event.location },
                { label: 'Building', value: event.building },
                { label: 'Organizer', value: event.organizer },
                { label: 'Price', value: event.price },
                { label: 'Accessibility', value: event.accessibility },
                { label: 'Parking', value: event.parking },
              ].map(({ label, value }) => (
                <View key={label} style={styles.gridCell}>
                  <Text style={styles.gridLabel}>{label}</Text>
                  <Text style={styles.gridValue}>{value}</Text>
                </View>
              ))}
            </View>

            <View style={{ marginBottom: 20 }}>
              <View style={styles.capRow}>
                <Text style={styles.capLabel}>Attendance</Text>
                <Text style={styles.capVal}>
                  {event.registered.toLocaleString()} / {event.capacity.toLocaleString()} ({pct}%)
                </Text>
              </View>
              <View style={styles.capTrack}>
                <View style={[styles.capFill, { width: `${pct}%`, backgroundColor: pct > 90 ? '#ef4444' : CRIMSON }]} />
              </View>
            </View>

            {event.speakers.length > 0 ? (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.subSectionKicker}>Speakers</Text>
                {event.speakers.map((s) => (
                  <View key={s.name} style={styles.speakerRow}>
                    <View style={[styles.avatar, { borderColor: `${catColor}44`, backgroundColor: `${catColor}22` }]}>
                      <Text style={[styles.avatarText, { color: catColor }]}>
                        {s.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.speakerName}>{s.name}</Text>
                      <Text style={styles.speakerMeta}>
                        {s.title}
                        {s.affiliation ? ` · ${s.affiliation}` : ''}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}

            {event.agenda.length > 0 ? (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.subSectionKicker}>Agenda</Text>
                {event.agenda.map((item, i) => (
                  <View
                    key={`${item.time}-${i}`}
                    style={[styles.agendaRow, i < event.agenda.length - 1 ? styles.agendaBorder : null]}
                  >
                    <View style={styles.agendaRail}>
                      <View style={[styles.agendaDot, { backgroundColor: catColor }]} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.agendaTime, { color: catColor }]}>{item.time}</Text>
                      <Text style={styles.agendaActivity}>{item.activity}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.tags}>
              {event.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.ctaRow}>
              <Pressable
                onPress={() => onRegister(event)}
                disabled={full}
                style={[styles.ctaPrimary, full && { opacity: 0.45 }]}
              >
                <Text style={styles.ctaPrimaryText}>{full ? 'Sold Out' : 'Register Now'}</Text>
              </Pressable>
              <Pressable onPress={handleCalendar} style={styles.ctaSecondary}>
                <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.65)" />
                <Text style={styles.ctaSecondaryText}>Add</Text>
              </Pressable>
              {event.csunUrl ? (
                <Pressable onPress={() => void Linking.openURL(event.csunUrl!)} style={styles.ctaSecondary}>
                  <Ionicons name="open-outline" size={16} color="rgba(255,255,255,0.65)" />
                  <Text style={styles.ctaSecondaryText}>CSUN</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PANEL },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 36 },
  hero: { height: 240, position: 'relative' },
  heroTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  catBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 1, textTransform: 'uppercase' },
  body: { paddingHorizontal: 18, paddingTop: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 10, lineHeight: 28 },
  fullDesc: { fontSize: 13, color: TEXT_MUTED, lineHeight: 22, marginBottom: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  gridCell: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 12,
  },
  gridLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 4,
  },
  gridValue: { fontSize: 12, color: '#fff', fontWeight: '500' },
  capRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  capLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  capVal: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  capTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' },
  capFill: { height: '100%', borderRadius: 2 },
  subSectionKicker: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: CRIMSON,
    fontWeight: '700',
    marginBottom: 10,
  },
  speakerRow: { flexDirection: 'row', gap: 10, marginBottom: 12, alignItems: 'flex-start' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 12, fontWeight: '700' },
  speakerName: { fontSize: 13, fontWeight: '600', color: '#fff' },
  speakerMeta: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  agendaRow: { flexDirection: 'row', gap: 12, paddingBottom: 12, marginBottom: 12 },
  agendaBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.06)' },
  agendaRail: { width: 12, alignItems: 'center' },
  agendaDot: { width: 8, height: 8, borderRadius: 4, marginTop: 3 },
  agendaTime: { fontSize: 10, fontWeight: '700', marginBottom: 2 },
  agendaActivity: { fontSize: 13, color: 'rgba(255,255,255,0.78)' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 22 },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: { fontSize: 11, color: 'rgba(255,255,255,0.62)' },
  ctaRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  ctaPrimary: {
    flexGrow: 1,
    minWidth: '55%',
    backgroundColor: CRIMSON,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CRIMSON,
  },
  ctaPrimaryText: { fontSize: 13, fontWeight: '700', color: '#fff', letterSpacing: 0.4 },
  ctaSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  ctaSecondaryText: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
});
