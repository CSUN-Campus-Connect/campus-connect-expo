import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { usePathname, useRouter, useSegments } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { useAuth } from '@/context/AuthContext';

import { openSettings, viewProfile } from '../api';
import { DashboardSpacing } from '../styles';

const LOGO = require('@/assets/brand/ToroConnectLogoCircle.png');
const SRC_BADGE = require('@/assets/brand/SRCcard.png');

const SIDEBAR_BG = Brand.primary;
const SIDEBAR_FG = 'rgba(255,255,255,0.92)';

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon?: keyof typeof Ionicons.glyphMap;
  useSrcImage?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '/home', icon: 'home' },
  { id: 'social', label: 'Social', href: '/social', icon: 'chatbubbles-outline' },
  { id: 'messages', label: 'Messages', href: '/messages', icon: 'mail-outline' },
  { id: 'events', label: 'Events', href: '/events', icon: 'calendar-outline' },
  { id: 'clubs', label: 'Clubs', href: '/clubs', icon: 'people-circle-outline' },
  { id: 'academics', label: 'Academics', href: '/academics', icon: 'school-outline' },
  { id: 'marketplace', label: 'Marketplace', href: '/marketplace', icon: 'bag-outline' },
  { id: 'src', label: 'SRC', href: '/student-rec', useSrcImage: true },
];

function isRouteActive(pathname: string, segments: string[], href: string): boolean {
  const p = pathname || '/';
  if (href === '/home') {
    if (p === '/home' || p === '/') return true;
    if (segments[0] === 'home') return true;
    return false;
  }
  if (p === href) return true;
  if (p.startsWith(`${href}/`)) return true;
  return false;
}

type Props = {
  drawerWidth?: number;
  /** Permanent rail (wide layout) vs slide-out drawer — drawer uses a smaller logo and tighter spacing. */
  variant?: 'sidebar' | 'drawer';
  /** Called after navigating to a section (e.g. close mobile drawer). */
  onAfterNavigate?: () => void;
  /** Full-width drawer: explicit dismiss (backdrop is covered). */
  onDrawerClose?: () => void;
};

/** Mirrors web `DashboardSidebar` (`components/dashboard/sidebar.tsx`). */
export function DashboardSidebar({
  drawerWidth,
  variant = 'sidebar',
  onAfterNavigate,
  onDrawerClose,
}: Props) {
  const { width: screenW } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const segments = useSegments();
  const router = useRouter();
  const { signOut } = useAuth();

  const isDrawer = variant === 'drawer';

  const width =
    drawerWidth ??
    Math.min(200, Math.max(160, Math.round(screenW * 0.2)));

  const displayName = 'vram gh';

  const handleLogout = async () => {
    onAfterNavigate?.();
    await signOut();
    router.replace('/(auth)/login' as never);
  };

  return (
    <View
      style={[
        styles.root,
        isDrawer && styles.rootDrawer,
        {
          width,
          /** Status bar inset — parent shell does not double-apply top safe area. */
          paddingTop: insets.top + 4,
          /** Body ends above `BottomTabs`; home indicator is handled by the tab bar. */
          paddingBottom: 8,
          paddingLeft: Math.max(insets.left, 0),
          paddingRight: isDrawer ? Math.max(insets.right, 0) : 0,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.topRowLeft}>
          {isDrawer && onDrawerClose ? (
            <Pressable
              onPress={onDrawerClose}
              style={({ pressed }) => [styles.cornerBtn, pressed && styles.cornerPressed]}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
            >
              <Ionicons name="close" size={26} color="#fff" />
            </Pressable>
          ) : null}
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [styles.cornerBtn, pressed && styles.cornerPressed]}
            hitSlop={10}
          >
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </Pressable>
        </View>
        <Pressable
          onPress={() => {
            openSettings();
            onAfterNavigate?.();
          }}
          style={({ pressed }) => [styles.cornerBtn, pressed && styles.cornerPressed]}
          hitSlop={10}
        >
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={[styles.logoBlock, isDrawer && styles.logoBlockDrawer]}>
        <Image
          source={LOGO}
          style={[styles.logo, isDrawer ? styles.logoDrawer : styles.logoSidebar]}
          contentFit="contain"
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.lower}>
        <ScrollView
          style={styles.navScroll}
          contentContainerStyle={styles.navScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {NAV_ITEMS.map((item) => {
            const active = isRouteActive(pathname, segments as string[], item.href);
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  router.push(item.href as never);
                  onAfterNavigate?.();
                }}
                style={({ pressed }) => [
                  styles.navRow,
                  active && styles.navRowActive,
                  pressed && !active && styles.navRowPressed,
                ]}
              >
                {item.useSrcImage ? (
                  <Image source={SRC_BADGE} style={styles.srcIcon} contentFit="contain" />
                ) : (
                  <Ionicons name={item.icon!} size={22} color={SIDEBAR_FG} style={styles.navIcon} />
                )}
                <Text style={styles.navLabel} numberOfLines={1}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          onPress={() => {
            viewProfile();
            onAfterNavigate?.();
          }}
          style={({ pressed }) => [styles.profileBtn, pressed && styles.profilePressed]}
        >
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={22} color="#fff" />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileName} numberOfLines={1}>
              {displayName || 'Profile'}
            </Text>
            <Text style={styles.profileSub}>View Profile</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * In `DashboardShell` the parent row must not use `flex: 1` here: that grows on the
   * horizontal axis and splits the row ~50/50 with the main column. Fixed `width` only.
   * Drawer panels are a full-height column; use `rootDrawer` so the rail fills the modal.
   */
  root: {
    alignSelf: 'stretch',
    backgroundColor: SIDEBAR_BG,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  rootDrawer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  topRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cornerBtn: {
    padding: 8,
    borderRadius: 8,
  },
  cornerPressed: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  logoBlock: {
    alignItems: 'center',
    paddingHorizontal: DashboardSpacing.screenPadding * 0.4,
    paddingBottom: 8,
  },
  logoBlockDrawer: {
    paddingBottom: 4,
    paddingTop: 2,
  },
  logo: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1,
    borderRadius: 999,
  },
  logoDrawer: {
    maxWidth: 200,
  },
  logoSidebar: {
    maxWidth: 250,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 8,
    marginHorizontal: 8,
  },
  lower: {
    flex: 1,
    minHeight: 0,
  },
  navScroll: {
    flex: 1,
    minHeight: 0,
  },
  navScrollContent: {
    paddingBottom: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  navRowActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  navRowPressed: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  navIcon: {
    marginRight: 10,
    width: 28,
  },
  srcIcon: {
    width: 36,
    height: 36,
    marginRight: 8,
    marginLeft: -4,
  },
  navLabel: {
    flex: 1,
    color: SIDEBAR_FG,
    fontSize: 15,
    fontWeight: '600',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  profilePressed: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e11d48',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  profileSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 2,
  },
});
