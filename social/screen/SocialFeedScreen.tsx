import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabs } from '@/dashboard/components/BottomTabs';

import { PostCardRN } from '../components/PostCardRN';
import { PostComposerRN } from '../components/PostComposerRN';
import {
  CAMPUS_RESOURCES,
  CLUBS_PREVIEW,
  FOLLOWING_USERS,
  NAV_ITEMS,
  QUICK_LINKS,
  SEARCH_INDEX,
  TRENDING,
} from '../constants/socialData';
import { useSocialFeed } from '../hooks/useSocialFeed';
import { useSocialTheme } from '../theme/SocialThemeContext';
import type { AppPage, FeedTab } from '../types/feed.types';

const CURRENT_USER_ID = 'u-self';
const TAB_LABELS: Record<FeedTab, string> = {
  'for-you': 'For You',
  campus: 'Campus',
  clubs: 'Clubs',
  following: 'Following',
};

export function SocialFeedScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, isDark, toggleTheme } = useSocialTheme();
  const {
    posts,
    savedPostIds,
    handleLike,
    handleCreate,
    handleDelete,
    handleSave,
  } = useSocialFeed();

  const [page, setPage] = useState<AppPage>('feed');
  const [feedTab, setFeedTab] = useState<FeedTab>('for-you');
  const [searchQuery, setSearchQuery] = useState('');
  const [followState, setFollowState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(FOLLOWING_USERS.map((u) => [u.id, true])),
  );

  const centerMax = Math.min(width - 32, 680);

  const filteredSearch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter((i) => i.label.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQuery]);

  const userInitials = 'Y';

  const navigateInternal = useCallback(
    (href: string) => {
      router.push(href as never);
    },
    [router],
  );

  const openHref = useCallback((href: string, internal?: boolean) => {
    if (internal) {
      navigateInternal(href);
    } else {
      Linking.openURL(href).catch(() => Alert.alert('Could not open link'));
    }
  }, [navigateInternal]);

  const onSearchPick = useCallback(
    (item: (typeof SEARCH_INDEX)[0]) => {
      setSearchQuery('');
      if (item.page) setPage(item.page);
      else if (item.href) openHref(item.href, item.internal);
    },
    [openHref],
  );

  function renderFeedTabs() {
    return (
      <View style={[styles.feedTabs, { backgroundColor: colors.bgSurface, borderBottomColor: colors.borderSubtle }]}>
        {(['for-you', 'campus', 'clubs', 'following'] as FeedTab[]).map((tab) => {
          const active = feedTab === tab;
          return (
            <Pressable
              key={tab}
              style={[
                styles.feedTabBtn,
                active && { borderBottomWidth: 2, borderBottomColor: colors.csunRed, marginBottom: -1 },
              ]}
              onPress={() => setFeedTab(tab)}
            >
              <Text
                style={[
                  styles.feedTabText,
                  { color: active ? colors.textPrimary : colors.textMuted, fontWeight: active ? '800' : '400' },
                ]}
              >
                {TAB_LABELS[tab]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  function renderFollowing() {
    return (
      <View style={styles.pad}>
        <Text style={[styles.h2, { color: colors.textPrimary }]}>People You Follow</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          {FOLLOWING_USERS.length} teammates · their posts appear in your For You feed
        </Text>
        {FOLLOWING_USERS.map((u) => (
          <View
            key={u.id}
            style={[styles.personRow, { backgroundColor: colors.bgSurface, borderColor: colors.borderSubtle }]}
          >
            <View style={[styles.avatarSm, { backgroundColor: colors.csunRed }]}>
              <Text style={styles.avatarSmText}>{u.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.personName, { color: colors.textPrimary }]}>{u.name}</Text>
              <View style={[styles.roleBadge, { backgroundColor: `${colors.csunRed}22` }]}>
                <Text style={[styles.roleBadgeText, { color: colors.csunRed }]}>{u.role}</Text>
              </View>
            </View>
            <Pressable
              style={[
                styles.followBtn,
                followState[u.id]
                  ? { borderColor: colors.borderMedium, borderWidth: 1 }
                  : { backgroundColor: colors.csunRed },
              ]}
              onPress={() => setFollowState((p) => ({ ...p, [u.id]: !p[u.id] }))}
            >
              <Text
                style={[
                  styles.followBtnText,
                  { color: followState[u.id] ? colors.textSecondary : '#fff' },
                ]}
              >
                {followState[u.id] ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    );
  }

  function renderCampus() {
    return (
      <View style={styles.pad}>
        <View style={styles.sectionHead}>
          <View>
            <Text style={[styles.h2, { color: colors.textPrimary }]}>Student Resources</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>Everything you need at CSUN, in one place</Text>
          </View>
        </View>
        {CAMPUS_RESOURCES.map((r) => (
          <Pressable
            key={r.id}
            style={[styles.resourceRow, { backgroundColor: colors.bgSurface, borderColor: colors.borderSubtle }]}
            onPress={() => Linking.openURL(r.url)}
          >
            <View style={[styles.resourceIcon, { backgroundColor: `${r.color}22` }]}>
              <Ionicons name="open-outline" size={18} color={r.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cat, { color: r.color }]}>{r.category}</Text>
              <Text style={[styles.resourceTitle, { color: colors.textPrimary }]}>{r.title}</Text>
              <Text style={[styles.resourceDesc, { color: colors.textMuted }]}>{r.desc}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    );
  }

  function renderClubs() {
    return (
      <View style={styles.pad}>
        <View style={styles.sectionHead}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.h2, { color: colors.textPrimary }]}>Campus Clubs</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>Discover clubs and organizations at CSUN</Text>
          </View>
          <Pressable style={[styles.outlineBtn, { borderColor: colors.csunRed }]} onPress={() => navigateInternal('/clubs')}>
            <Text style={[styles.outlineBtnText, { color: colors.csunRed }]}>Browse All →</Text>
          </Pressable>
        </View>
        {CLUBS_PREVIEW.map((club) => (
          <Pressable
            key={club.id}
            style={[styles.clubCard, { backgroundColor: colors.bgSurface, borderColor: colors.borderSubtle }]}
            onPress={() => navigateInternal('/clubs')}
          >
            <Text style={[styles.clubCat, { color: colors.csunRed, backgroundColor: `${colors.csunRed}18` }]}>
              {club.category}
            </Text>
            <Text style={[styles.clubName, { color: colors.textPrimary }]}>{club.name}</Text>
            <Text style={[styles.clubTag, { color: colors.textMuted }]}>{club.tagline}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  function renderFeedMain() {
    if (feedTab === 'following') {
      return (
        <>
          {renderFeedTabs()}
          {renderFollowing()}
        </>
      );
    }
    if (feedTab === 'campus') {
      return (
        <>
          {renderFeedTabs()}
          {renderCampus()}
        </>
      );
    }
    if (feedTab === 'clubs') {
      return (
        <>
          {renderFeedTabs()}
          {renderClubs()}
        </>
      );
    }

    return (
      <>
        {renderFeedTabs()}
        <View style={styles.padH}>
          <PostComposerRN colors={colors} userInitials={userInitials} onPost={handleCreate} />
        </View>
        {posts.map((p) => (
          <View key={p.id} style={[styles.padH, { maxWidth: centerMax, alignSelf: 'center', width: '100%' }]}>
            <PostCardRN
              post={p}
              colors={colors}
              currentUserId={CURRENT_USER_ID}
              isSaved={savedPostIds.has(p.id)}
              onLike={handleLike}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          </View>
        ))}
      </>
    );
  }

  function renderCenter() {
    switch (page) {
      case 'notifications':
        return (
          <View style={styles.pad}>
            <Text style={[styles.h2, { color: colors.textPrimary }]}>Notifications</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>
              Likes, comments, and follows from other students will show up here.
            </Text>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[styles.notifRow, { borderColor: colors.borderSubtle, backgroundColor: colors.bgSurface }]}>
                <Ionicons name="heart" size={18} color={colors.csunRed} />
                <Text style={[styles.notifText, { color: colors.textSecondary }]}>
                  Someone liked your post · {i}h ago
                </Text>
              </View>
            ))}
          </View>
        );
      case 'saved':
        return (
          <View style={styles.pad}>
            <Text style={[styles.h2, { color: colors.textPrimary }]}>Saved posts</Text>
            {posts
              .filter((p) => savedPostIds.has(p.id))
              .map((p) => (
                <PostCardRN
                  key={p.id}
                  post={p}
                  colors={colors}
                  currentUserId={CURRENT_USER_ID}
                  isSaved
                  onLike={handleLike}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              ))}
            {posts.filter((p) => savedPostIds.has(p.id)).length === 0 ? (
              <Text style={{ color: colors.textMuted, marginTop: 12 }}>No saved posts yet.</Text>
            ) : null}
          </View>
        );
      case 'events':
        return (
          <View style={styles.pad}>
            <Text style={[styles.h2, { color: colors.textPrimary }]}>Campus Events</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>
              For the full calendar with search and filters, open Events from the menu.
            </Text>
            <Pressable style={[styles.primaryBtn, { backgroundColor: colors.csunRed }]} onPress={() => navigateInternal('/events')}>
              <Text style={styles.primaryBtnText}>Open Events</Text>
            </Pressable>
          </View>
        );
      case 'marketplace':
        return (
          <View style={styles.pad}>
            <Text style={[styles.h2, { color: colors.textPrimary }]}>Marketplace</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>Browse listings on the Marketplace tab.</Text>
            <Pressable style={[styles.primaryBtn, { backgroundColor: colors.csunRed }]} onPress={() => navigateInternal('/marketplace')}>
              <Text style={styles.primaryBtnText}>Open Marketplace</Text>
            </Pressable>
          </View>
        );
      case 'profile':
        return (
          <View style={styles.pad}>
            <Text style={[styles.h2, { color: colors.textPrimary }]}>Your profile</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>Posts you’ve shared from this device.</Text>
            {posts
              .filter((p) => p.User.id === CURRENT_USER_ID)
              .map((p) => (
                <PostCardRN
                  key={p.id}
                  post={p}
                  colors={colors}
                  currentUserId={CURRENT_USER_ID}
                  isSaved={savedPostIds.has(p.id)}
                  onLike={handleLike}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              ))}
          </View>
        );
      case 'settings':
        return (
          <View style={styles.pad}>
            <Text style={[styles.h2, { color: colors.textPrimary }]}>Settings</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>Account and app preferences.</Text>
            <Pressable style={[styles.primaryBtn, { backgroundColor: colors.csunRed }]} onPress={() => navigateInternal('/settings')}>
              <Text style={styles.primaryBtnText}>Open Settings</Text>
            </Pressable>
          </View>
        );
      default:
        return renderFeedMain();
    }
  }

  const unreadCount = 3;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgBase }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top: back + MatadorConnect (web shell header) */}
        <View style={[styles.topRow, { borderBottomColor: colors.borderSubtle }]}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.logoRow}>
            <Ionicons name="layers" size={24} color={isDark ? '#fff' : colors.csunRed} />
            <Text style={[styles.logoText, { color: isDark ? '#fff' : colors.csunRed }]}>MatadorConnect</Text>
          </View>
          <Pressable onPress={toggleTheme} hitSlop={12}>
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={22} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Left nav → horizontal scroll (web left column) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navScroll}>
          {NAV_ITEMS.map((item) => {
            const active = page === item.page;
            return (
              <Pressable
                key={item.page}
                style={[
                  styles.navPill,
                  {
                    backgroundColor: active ? colors.csunRed : 'transparent',
                    borderColor: active ? colors.csunRed : colors.borderSubtle,
                  },
                ]}
                onPress={() => setPage(item.page)}
              >
                <Text style={[styles.navPillText, { color: active ? '#fff' : colors.textSecondary }]}>
                  {item.label}
                </Text>
                {item.page === 'notifications' && unreadCount > 0 ? (
                  <View style={[styles.badge, { backgroundColor: active ? 'rgba(255,255,255,0.35)' : colors.csunRed }]}>
                    <Text style={[styles.badgeText, { color: active ? colors.csunRed : '#fff' }]}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          style={[styles.liveRow, { borderColor: colors.borderSubtle }]}
          onPress={() =>
            Alert.alert('Live', 'Campus livestreams open in your browser when an event is streaming.')
          }
        >
          <Ionicons name="radio-button-on" size={18} color={colors.csunRed} />
          <Text style={[styles.liveText, { color: colors.textSecondary }]}>Live</Text>
          <View style={[styles.newTag, { backgroundColor: `${colors.csunRed}22` }]}>
            <Text style={[styles.newTagText, { color: colors.csunRed }]}>NEW</Text>
          </View>
        </Pressable>

        {/* Center column (max ~680 like web) */}
        <View style={[styles.centerCol, { maxWidth: centerMax }]}>
          {renderCenter()}
        </View>

        {/* Right column → stacked: search, trending, quick links */}
        <View style={[styles.sideSection, { maxWidth: centerMax, alignSelf: 'center' }]}>
          <Text style={[styles.sideTitle, { color: colors.textMuted }]}>Search</Text>
          <View style={[styles.searchBox, { backgroundColor: colors.bgElevated, borderColor: colors.borderSubtle }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search Campus Connect..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {filteredSearch.length > 0 ? (
            <View style={[styles.searchDrop, { backgroundColor: colors.bgSurface, borderColor: colors.borderMedium }]}>
              {filteredSearch.map((item) => (
                <Pressable key={item.label} style={styles.searchItem} onPress={() => onSearchPick(item)}>
                  <Text style={{ color: colors.textPrimary, fontSize: 13 }}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <Text style={[styles.sideTitle, { color: colors.textMuted, marginTop: 18 }]}>Trending at CSUN</Text>
          <View style={[styles.card, { backgroundColor: colors.bgSurface, borderColor: colors.borderSubtle }]}>
            {TRENDING.map(({ tag, count }) => (
              <View key={tag} style={[styles.trendRow, { borderBottomColor: colors.borderSubtle }]}>
                <Ionicons name="flame-outline" size={14} color={colors.csunRed} />
                <View>
                  <Text style={[styles.trendTag, { color: colors.textPrimary }]}>{tag}</Text>
                  <Text style={[styles.trendCount, { color: colors.textMuted }]}>{count}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={[styles.sideTitle, { color: colors.textMuted, marginTop: 18 }]}>Campus Quick Links</Text>
          <View style={styles.quickGrid}>
            {QUICK_LINKS.map((link) => (
              <Pressable
                key={link.label}
                style={[styles.quickCell, { backgroundColor: colors.bgElevated, borderColor: colors.borderSubtle }]}
                onPress={() => openHref(link.href, link.internal)}
              >
                <Ionicons name="link-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.quickLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                  {link.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.footer, { color: colors.textMuted }]}>Matador Connect © 2026 — CSUN</Text>
        </View>
      </ScrollView>

      <BottomTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  logoRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
  logoText: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  navScroll: { paddingHorizontal: 12, paddingVertical: 10, gap: 8, flexDirection: 'row', alignItems: 'center' },
  navPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
  },
  navPillText: { fontSize: 13, fontWeight: '600' },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 10, fontWeight: '800' },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  liveText: { flex: 1, fontSize: 14, fontWeight: '600' },
  newTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  newTagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  centerCol: { width: '100%', alignSelf: 'center', paddingHorizontal: 16 },
  feedTabs: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  feedTabBtn: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  feedTabText: { fontSize: 14 },
  pad: { padding: 16 },
  padH: { paddingHorizontal: 16 },
  h2: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  sub: { fontSize: 13, lineHeight: 18, marginBottom: 14 },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 8 },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  avatarSm: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarSmText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  personName: { fontSize: 14, fontWeight: '700' },
  roleBadge: { alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99 },
  roleBadgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  followBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  followBtnText: { fontSize: 12, fontWeight: '700' },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  resourceIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cat: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  resourceTitle: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  resourceDesc: { fontSize: 12, lineHeight: 18 },
  outlineBtn: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  outlineBtnText: { fontSize: 12, fontWeight: '700' },
  clubCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  clubCat: { alignSelf: 'flex-start', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, overflow: 'hidden' },
  clubName: { fontSize: 15, fontWeight: '800', marginTop: 8, marginBottom: 4 },
  clubTag: { fontSize: 13, lineHeight: 18 },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  notifText: { fontSize: 13, flex: 1 },
  primaryBtn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, alignSelf: 'flex-start', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  sideSection: { width: '100%', paddingHorizontal: 16, marginTop: 8 },
  sideTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 13, padding: 0 },
  searchDrop: { borderRadius: 10, borderWidth: 1, marginTop: 6, overflow: 'hidden' },
  searchItem: { paddingVertical: 12, paddingHorizontal: 14 },
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  trendTag: { fontSize: 13, fontWeight: '700' },
  trendCount: { fontSize: 11, marginTop: 2 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickCell: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  quickLabel: { fontSize: 12, fontWeight: '600', flex: 1 },
  footer: { fontSize: 11, textAlign: 'center', marginTop: 20, marginBottom: 8 },
});
