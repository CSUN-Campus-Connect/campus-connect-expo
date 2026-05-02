import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import type { Club } from '@/clubs/data/clubs';

const MAROON = '#B4002E';

const CATEGORY_COLOR: Record<string, string> = {
  STEM: 'rgba(59,130,246,0.92)',
  Business: 'rgba(16,185,129,0.92)',
  Arts: 'rgba(236,72,153,0.92)',
  Cultural: 'rgba(245,158,11,0.92)',
  Sports: 'rgba(239,68,68,0.92)',
  Literature: 'rgba(139,92,246,0.92)',
  Fraternity: 'rgba(20,184,166,0.92)',
  Sorority: 'rgba(244,114,182,0.92)',
};

const BANNER_GRADIENT: Record<string, [string, string]> = {
  STEM: ['#1e3a8a', '#3b82f6'],
  Business: ['#064e3b', '#10b981'],
  Arts: ['#831843', '#ec4899'],
  Cultural: ['#78350f', '#f59e0b'],
  Sports: ['#7f1d1d', '#ef4444'],
  Literature: ['#4c1d95', '#8b5cf6'],
  Fraternity: ['#134e4a', '#14b8a6'],
  Sorority: ['#831843', '#f472b6'],
};

type Props = {
  club: Club;
  isMember?: boolean;
  onLeaveSuccess?: (clubId: string) => void;
};

export function FlipClubCard({ club, isMember = false, onLeaveSuccess }: Props) {
  const flipped = useSharedValue(0);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${flipped.value * 180}deg` }],
  }));

  const toggle = () => {
    flipped.value = withTiming(flipped.value === 0 ? 1 : 0, { duration: 540 });
  };

  const initials = useMemo(() => {
    const parts = (club.name ?? '').split(' ').filter(Boolean);
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');
  }, [club.name]);

  const cat = club.category ?? '';
  const catColor = CATEGORY_COLOR[cat] ?? 'rgba(100,100,100,0.85)';
  const grad = BANNER_GRADIENT[cat] ?? ['#b4002e', '#7a0018'];

  const onLeavePress = () => {
    Alert.alert('Leave club', `Leave ${club.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: () => onLeaveSuccess?.(club.id),
      },
    ]);
  };

  const onViewPress = () => {
    Alert.alert(
      club.name,
      'Officers, meeting times, and announcements will appear here in a future update.',
    );
  };

  return (
    <Pressable onPress={toggle} style={styles.wrap}>
      <Animated.View style={[styles.cardInner, spinStyle]}>
        <View style={[styles.face, styles.front]}>
          <View style={styles.banner}>
            {club.bannerUrl ? (
              <Image source={{ uri: club.bannerUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
            ) : (
              <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            )}
            <View style={[styles.badge, styles.badgeRight, { backgroundColor: catColor }]}>
              <Text style={styles.badgeText}>{cat || 'Club'}</Text>
            </View>
            {isMember ? (
              <View style={[styles.badge, styles.badgeLeft, { backgroundColor: 'rgba(16,185,129,0.88)' }]}>
                <Text style={styles.badgeText}>✓ Member</Text>
              </View>
            ) : null}
            <View style={styles.flipHint}>
              <Text style={styles.flipHintText}>TAP TO FLIP</Text>
            </View>
          </View>

          <View style={[styles.avatar, { borderColor: '#fff', backgroundColor: catColor }]}>
            {club.logoUrl ? (
              <Image source={{ uri: club.logoUrl }} style={styles.avatarImg} contentFit="cover" />
            ) : (
              <Text style={styles.avatarInitials}>{initials}</Text>
            )}
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {club.name}
            </Text>
            <Text style={styles.tagline} numberOfLines={2}>
              {club.tagline ?? ''}
            </Text>
          </View>
        </View>

        <View style={[styles.face, styles.back]}>
          <View style={styles.backInner}>
            <Text style={styles.backTitle} numberOfLines={2}>
              {club.card?.headline ?? club.name}
            </Text>
            <Text style={styles.backBody} numberOfLines={4}>
              {club.card?.blurb ?? club.description ?? 'Tap View club to learn more.'}
            </Text>

            {club.card?.chips && club.card.chips.length > 0 ? (
              <View style={styles.chipRow}>
                {club.card.chips.map((chip) => (
                  <View key={chip} style={styles.chip}>
                    <Text style={styles.chipText}>{chip}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.spacer} />

            <View style={styles.actions}>
              <Text style={styles.hintSmall}>Tap to flip back</Text>
              <View style={styles.actionBtns}>
                {isMember ? (
                  <Pressable onPress={onLeavePress} style={({ pressed }) => [styles.leaveBtn, pressed && { opacity: 0.85 }]}>
                    <Text style={styles.leaveBtnText}>Leave</Text>
                  </Pressable>
                ) : null}
                <Pressable
                  onPress={onViewPress}
                  style={({ pressed }) => [styles.viewBtn, pressed && { opacity: 0.9 }]}
                >
                  <Text style={styles.viewBtnText}>View club →</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: 300,
    marginBottom: 4,
  },
  cardInner: {
    flex: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.96)',
    backfaceVisibility: 'hidden',
  },
  front: {},
  back: {
    transform: [{ rotateY: '180deg' }],
  },
  banner: {
    height: 120,
    backgroundColor: '#222',
  },
  badge: {
    position: 'absolute',
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  badgeLeft: { left: 10 },
  badgeRight: { right: 10 },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  flipHint: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  flipHintText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  avatar: {
    position: 'absolute',
    top: 84,
    left: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInitials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  info: {
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1a0408',
  },
  tagline: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(45,16,18,0.65)',
    lineHeight: 18,
  },
  backInner: {
    flex: 1,
    padding: 18,
    justifyContent: 'flex-start',
  },
  backTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1a0408',
    lineHeight: 22,
  },
  backBody: {
    marginTop: 8,
    fontSize: 13,
    color: 'rgba(45,16,18,0.72)',
    lineHeight: 20,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(180,0,46,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(180,0,46,0.18)',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '800',
    color: MAROON,
  },
  spacer: { flex: 1 },
  actions: {
    marginTop: 8,
    gap: 8,
  },
  hintSmall: {
    fontSize: 11,
    color: 'rgba(45,16,18,0.45)',
    fontWeight: '700',
  },
  actionBtns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leaveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(180,0,46,0.45)',
    backgroundColor: 'rgba(180,0,46,0.08)',
  },
  leaveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: MAROON,
  },
  viewBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: MAROON,
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
});
