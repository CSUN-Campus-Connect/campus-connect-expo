import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabs } from '@/dashboard/components/BottomTabs';

import { EventBentoCard } from '../components/EventBentoCard';
import { EventCalendarView } from '../components/EventCalendarView';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { EventGraphView } from '../components/EventGraphView';
import { EventRegisterModal } from '../components/EventRegisterModal';
import { EventTimeline } from '../components/EventTimeline';
import { FavoritesSection } from '../components/FavoritesSection';
import { PageBackground } from '../components/PageBackground';
import { AUDIENCES, CATEGORIES, NAV_SECTIONS } from '../data/constants';
import { SEED_EVENTS } from '../data/events';
import { useEventRanking } from '../hooks/useEventRanking';
import { useFavorites } from '../hooks/useFavorites';
import { useRelatedEvents } from '../hooks/useRelatedEvents';
import type { AudienceId, CategoryId, EventItem, NavSection } from '../types';
import { BG, CRIMSON, TEXT_MUTED } from '../eventsTheme';

function LiveDot() {
  return (
    <View style={styles.liveWrap}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>Live</Text>
    </View>
  );
}

export function EventsScreen() {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<NavSection>('discover');
  const [category, setCategory] = useState<CategoryId>('all');
  const [audience, setAudience] = useState<AudienceId>('all');
  const [showFree, setShowFree] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<EventItem[]>(SEED_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { rankedEvents } = useEventRanking(events);
  const relatedEvents = useRelatedEvents(registerEvent, rankedEvents);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rankedEvents.filter((ev) => {
      if (category !== 'all' && ev.category !== category) return false;
      if (audience !== 'all' && !ev.audience.includes(audience) && !ev.audience.includes('all')) return false;
      if (showFree && !ev.price.toLowerCase().includes('free')) return false;
      if (showTrending && !ev.trending) return false;
      if (q && ![ev.title, ev.location, ev.organizer, ...ev.tags].some((s) => s.toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [rankedEvents, category, audience, showFree, showTrending, search]);

  const openEvent = useCallback((ev: EventItem) => {
    setSelectedEvent(ev);
    setDrawerOpen(true);
  }, []);

  const handleRegister = useCallback((ev: EventItem) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === ev.id && e.registered < e.capacity ? { ...e, registered: e.registered + 1 } : e))
    );
  }, []);

  const categoryTitle =
    category === 'all' ? 'All Events' : CATEGORIES.find((c) => c.id === category)?.name ?? 'Events';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.bgWrap}>
        <PageBackground />
      </View>

      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <View style={styles.brand}>
          <View style={styles.brandMark}>
            <View style={styles.brandMarkInner} />
          </View>
          <Text style={styles.brandText}>
            CSUN <Text style={{ color: CRIMSON }}>Events</Text>
          </Text>
        </View>
        <LiveDot />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navScroll}
        style={styles.navBar}
      >
        {NAV_SECTIONS.map((s) => {
          const active = activeSection === s.id;
          const showBadge = s.id === 'favorites' && favorites.size > 0;
          return (
            <Pressable
              key={s.id}
              onPress={() => setActiveSection(s.id)}
              style={[styles.navPill, active && styles.navPillActive]}
            >
              <Text style={[styles.navLabel, active && styles.navLabelActive]}>{s.label}</Text>
              {showBadge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{favorites.size > 9 ? '9+' : favorites.size}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {activeSection === 'discover' ? (
          <View>
            <View style={styles.heroBadge}>
              <View style={styles.heroPulse} />
              <Text style={styles.heroBadgeText}>California State University, Northridge</Text>
            </View>

            <Text style={styles.heroTitle}>
              Campus{'\n'}
              <Text style={styles.heroOutline}>Events</Text>
              <Text style={{ color: CRIMSON }}> Nexus</Text>
            </Text>

            <Text style={styles.heroSub}>
              Every event at CSUN — algorithmically ranked by engagement, directly linked to the official event
              pages.
            </Text>

            <View style={styles.searchRow}>
              <View style={styles.searchField}>
                <Ionicons name="search" size={16} color="rgba(255,255,255,0.35)" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search events, buildings, organizers..."
                  placeholderTextColor="rgba(255,255,255,0.28)"
                  style={styles.searchInput}
                />
              </View>
              <Pressable style={styles.searchBtn}>
                <Text style={styles.searchBtnText}>Search</Text>
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              {[
                { value: String(filtered.length), label: 'Active events', accent: true },
                { value: '7', label: 'Categories' },
                { value: '5.2K+', label: 'Registered students' },
                { value: 'Free', label: 'Admission — most events' },
              ].map((stat, i, arr) => (
                <React.Fragment key={stat.label}>
                  <View style={styles.statBlock}>
                    <Text style={[styles.statValue, stat.accent && { color: CRIMSON }]}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                  {i < arr.length - 1 ? <View style={styles.statDivider} /> : null}
                </React.Fragment>
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {CATEGORIES.map((cat) => {
                const active = category === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    style={[
                      styles.filterChip,
                      active && { borderColor: cat.color, backgroundColor: `${cat.color}20` },
                    ]}
                  >
                    <View style={[styles.filterDot, { backgroundColor: cat.color, opacity: active ? 1 : 0.45 }]} />
                    <Text style={[styles.filterLabel, active && { color: '#fff', fontWeight: '600' }]}>
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}

              <View style={styles.filterSep} />

              <Pressable
                onPress={() => setShowTrending((v) => !v)}
                style={[
                  styles.filterChip,
                  showTrending && { borderColor: CRIMSON, backgroundColor: 'rgba(210,32,48,0.12)' },
                ]}
              >
                <Text style={[styles.filterLabel, showTrending && { color: CRIMSON, fontWeight: '600' }]}>
                  Trending
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowFree((v) => !v)}
                style={[
                  styles.filterChip,
                  showFree && { borderColor: '#16c878', backgroundColor: 'rgba(22,200,120,0.12)' },
                ]}
              >
                <Text style={[styles.filterLabel, showFree && { color: '#16c878', fontWeight: '600' }]}>Free</Text>
              </Pressable>
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.audienceScroll}>
              {AUDIENCES.map((a) => {
                const active = audience === a.id;
                return (
                  <Pressable
                    key={a.id}
                    onPress={() => setAudience(a.id)}
                    style={[styles.audienceChip, active && styles.audienceChipActive]}
                  >
                    <Text style={[styles.audienceLabel, active && { color: '#fff' }]}>{a.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.sectionHead}>
              <Text style={styles.sectionKicker}>Ranked by Engagement Score</Text>
              <Text style={styles.sectionTitle}>
                {categoryTitle} <Text style={{ color: CRIMSON }}>({filtered.length})</Text>
              </Text>
            </View>

            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No events found</Text>
                <Text style={styles.emptyBody}>Try adjusting your filters</Text>
              </View>
            ) : (
              filtered.map((ev) => (
                <EventBentoCard
                  key={ev.id}
                  event={ev}
                  isFavorite={isFavorite(ev.id)}
                  onOpen={openEvent}
                  onToggleFav={toggleFavorite}
                  onRegister={(e) => setRegisterEvent(e)}
                />
              ))
            )}
          </View>
        ) : null}

        {activeSection === 'graph' ? (
          <EventGraphView events={rankedEvents} onSelectEvent={openEvent} />
        ) : null}

        {activeSection === 'timeline' ? (
          <EventTimeline events={events} onSelectEvent={openEvent} />
        ) : null}

        {activeSection === 'calendar' ? (
          <EventCalendarView events={events} onSelectEvent={openEvent} />
        ) : null}

        {activeSection === 'favorites' ? (
          <FavoritesSection
            allEvents={rankedEvents}
            favorites={favorites}
            onOpen={openEvent}
            onRemove={toggleFavorite}
            onDiscover={() => setActiveSection('discover')}
          />
        ) : null}
      </ScrollView>

      <BottomTabs />

      <EventDetailsModal
        event={selectedEvent}
        visible={drawerOpen}
        isFavorite={selectedEvent ? isFavorite(selectedEvent.id) : false}
        onClose={() => setDrawerOpen(false)}
        onToggleFav={toggleFavorite}
        onRegister={(ev) => {
          setDrawerOpen(false);
          setRegisterEvent(ev);
        }}
      />

      <EventRegisterModal
        event={registerEvent}
        visible={!!registerEvent}
        relatedEvents={relatedEvents}
        onClose={() => setRegisterEvent(null)}
        onConfirm={handleRegister}
        onOpenRelated={(ev) => {
          setRegisterEvent(null);
          openEvent(ev);
        }}
      />
    </SafeAreaView>
  );
}

export default EventsScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  bgWrap: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  topBar: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(210,32,48,0.12)',
    backgroundColor: 'rgba(16,4,6,0.88)',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  brand: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: CRIMSON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.9)' },
  brandText: { fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  liveWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16c878',
  },
  liveText: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  navBar: {
    zIndex: 2,
    maxHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(14,4,6,0.82)',
  },
  navScroll: { paddingHorizontal: 12, paddingVertical: 8, gap: 8, alignItems: 'center' },
  navPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  navPillActive: {
    borderColor: 'rgba(210,32,48,0.45)',
    backgroundColor: 'rgba(210,32,48,0.1)',
  },
  navLabel: { fontSize: 13, color: 'rgba(255,255,255,0.45)' },
  navLabelActive: { color: '#fff', fontWeight: '600' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: CRIMSON,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  scroll: { flex: 1, zIndex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28 },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(210,32,48,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(210,32,48,0.24)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 14,
  },
  heroPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: CRIMSON,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: CRIMSON,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 42,
    letterSpacing: -1.5,
    marginBottom: 10,
  },
  heroOutline: {
    color: 'rgba(210,32,48,0.55)',
  },
  heroSub: { fontSize: 15, color: TEXT_MUTED, lineHeight: 24, marginBottom: 18, maxWidth: 520 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 18, alignItems: 'stretch' },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 13 },
  searchBtn: {
    backgroundColor: CRIMSON,
    borderRadius: 13,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 0, marginBottom: 22, alignItems: 'center' },
  statBlock: { paddingRight: 18 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 3 },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.07)', marginRight: 18 },
  filterScroll: { gap: 7, paddingVertical: 4, marginBottom: 10, alignItems: 'center' },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  filterDot: { width: 5, height: 5, borderRadius: 3 },
  filterLabel: { fontSize: 12, color: 'rgba(255,255,255,0.42)' },
  filterSep: { width: 1, height: 22, backgroundColor: 'rgba(255,255,255,0.07)', marginHorizontal: 4 },
  audienceScroll: { gap: 8, paddingBottom: 14 },
  audienceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  audienceChipActive: {
    borderColor: 'rgba(210,32,48,0.35)',
    backgroundColor: 'rgba(210,32,48,0.12)',
  },
  audienceLabel: { fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  sectionHead: { marginBottom: 12 },
  sectionKicker: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: CRIMSON,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: 'rgba(255,255,255,0.35)', marginBottom: 6 },
  emptyBody: { fontSize: 13, color: 'rgba(255,255,255,0.28)' },
});
