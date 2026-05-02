import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/clubs/components/AuroraBackground';
import { ClubPanelGallery } from '@/clubs/components/ClubPanelGallery';
import { FlipClubCard } from '@/clubs/components/FlipClubCard';
import { GlassPanel } from '@/clubs/components/GlassPanel';
import { CLUBS, CLUB_CATEGORIES, type Club } from '@/clubs/data/clubs';
import { clubsScreenStyles as s, MAROON } from '@/clubs/screen/clubsScreenStyles';
import { BottomTabs } from '@/dashboard/components/BottomTabs';

const CATEGORY_COLORS: Record<string, string> = {
  STEM: 'rgba(59,130,246,0.80)',
  Business: 'rgba(16,185,129,0.80)',
  Arts: 'rgba(236,72,153,0.80)',
  Cultural: 'rgba(245,158,11,0.80)',
  Sports: 'rgba(239,68,68,0.80)',
  Literature: 'rgba(139,92,246,0.80)',
  Fraternity: 'rgba(20,184,166,0.80)',
  Sorority: 'rgba(244,114,182,0.80)',
};

function FilterChip({
  label,
  active,
  accent,
  onPress,
}: {
  label: string;
  active: boolean;
  accent?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        s.chip,
        active
          ? {
              backgroundColor: accent ?? 'rgba(255,255,255,0.92)',
              borderColor: accent ?? 'rgba(255,255,255,0.6)',
            }
          : {
              backgroundColor: 'rgba(255,255,255,0.07)',
              borderColor: 'rgba(255,255,255,0.14)',
            },
      ]}
    >
      <Text
        style={[
          s.chipText,
          { color: active ? (accent ? '#fff' : MAROON) : 'rgba(255,255,255,0.78)' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ClubsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [tab, setTab] = useState<'discover' | 'mine'>('discover');
  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [myClubIds, setMyClubIds] = useState<Set<string>>(() => new Set<string>(['club-001', 'club-002']));

  const handleLeaveSuccess = useCallback((clubId: string) => {
    setMyClubIds((prev) => {
      const next = new Set(prev);
      next.delete(clubId);
      return next;
    });
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setActiveCategories(new Set());
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CLUBS.filter((c) => (tab === 'mine' ? myClubIds.has(c.id) : true))
      .filter((c) => (activeCategories.size === 0 ? true : activeCategories.has(c.category ?? '')))
      .filter((c) => {
        if (!q) return true;
        const blob = [
          c.name,
          c.tagline,
          c.description,
          c.category,
          ...(c.tags ?? []),
          c.card?.headline,
          c.card?.blurb,
          ...(c.card?.chips ?? []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return blob.includes(q);
      });
  }, [tab, myClubIds, search, activeCategories]);

  const galleryUrls = useMemo(
    () => CLUBS.map((c) => c.bannerUrl).filter(Boolean) as string[],
    []
  );

  const pad = 12;
  const gap = 10;
  const cardWidth = (width - pad * 2 - gap) / 2;

  const renderClub = useCallback(
    (c: Club) => (
      <View key={c.id} style={{ width: cardWidth }}>
        <FlipClubCard club={c} isMember={myClubIds.has(c.id)} onLeaveSuccess={handleLeaveSuccess} />
      </View>
    ),
    [cardWidth, myClubIds, handleLeaveSuccess]
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={s.backPill}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={16} color="#fff" />
          <Text style={s.backPillText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuroraBackground>
          <View style={s.hero}>
            <Text style={s.heroTitle}>Club Connect</Text>
            <Text style={s.heroSubtitle}>
              Discover communities, join clubs, find events, and build your network.
            </Text>

            <View style={s.galleryWrap}>
              <ClubPanelGallery imageUrls={galleryUrls} height={260} />
            </View>

            <View style={s.tabRow}>
              <Pressable
                onPress={() => setTab('discover')}
                style={tab === 'discover' ? s.tabPrimary : s.tabGhost}
              >
                <Text style={tab === 'discover' ? s.tabPrimaryText : s.tabGhostText}>Discover</Text>
              </Pressable>
              <Pressable onPress={() => setTab('mine')} style={tab === 'mine' ? s.tabPrimary : s.tabGhost}>
                <Text style={tab === 'mine' ? s.tabPrimaryText : s.tabGhostText}>My Clubs</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  Alert.alert('Create a club', 'Club registration opens soon — we’ll email your org address when it’s ready.')
                }
                style={s.tabCreate}
              >
                <Text style={s.tabCreateText}>+ Create Club</Text>
              </Pressable>
            </View>
          </View>

          <View style={s.filterSection}>
            <GlassPanel>
              <View style={s.searchRow}>
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search clubs, tags, keywords..."
                  placeholderTextColor="rgba(255,255,255,0.45)"
                  style={s.searchInput}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                <Pressable onPress={clearFilters} style={s.clearBtn}>
                  <Text style={s.clearBtnText}>Clear</Text>
                </Pressable>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipScroll}>
                <View style={s.chipRowInner}>
                  <FilterChip label="All" active={activeCategories.size === 0} onPress={() => setActiveCategories(new Set())} />
                  {CLUB_CATEGORIES.map((cat) => (
                    <FilterChip
                      key={cat}
                      label={cat}
                      active={activeCategories.has(cat)}
                      accent={CATEGORY_COLORS[cat]}
                      onPress={() => toggleCategory(cat)}
                    />
                  ))}
                </View>
              </ScrollView>

              <View style={s.metaRow}>
                <Text style={s.metaLeft}>
                  {filtered.length} club{filtered.length !== 1 ? 's' : ''}
                </Text>
                <Text style={s.metaRight}>Tap a card to flip it</Text>
              </View>
            </GlassPanel>
          </View>

          <View style={s.gridSection}>
            <View style={s.divider} />

            {filtered.length === 0 ? (
              <View style={s.empty}>
                <Text style={s.emptyText}>No clubs match your search.</Text>
                <Pressable onPress={clearFilters} style={s.tabGhost}>
                  <Text style={s.tabGhostText}>Clear filters</Text>
                </Pressable>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap, justifyContent: 'flex-start' }}>
                {filtered.map((c) => renderClub(c))}
              </View>
            )}
          </View>
        </AuroraBackground>
      </ScrollView>

      <BottomTabs />
    </SafeAreaView>
  );
}

export default ClubsScreen;
