import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const DashboardColors = {
  /** Matches web dashboard sidebar (`#A80532`). */
  primary: Brand.primary,
  accent: Brand.accent,
  textDark: '#333333',
  textMedium: '#6B7280',
  textLight: '#9CA3AF',
  background: '#FFFFFF',
  /** Web `dashboard/page.tsx` main `<Box>` */
  mainBackground: '#fafafb',
  cardBackground: '#F4F4F5',
  cardBorder: '#E5E7EB',
  avatarBg: '#1F2937',
  notificationDot: '#EF4444',
} as const;

export const DashboardSpacing = {
  screenPadding: 20,
  headerGap: 12,
  cardPadding: 16,
  cardRadius: 12,
  menuItemHeight: 52,
  profileBarPadding: 14,
  tabBarHeight: 56,
} as const;

export const dashboardStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DashboardColors.background,
  },
  scrollContent: {
    /** Shell adds outer padding; keep this for nested scrolls that reuse the style. */
    paddingBottom: 0,
  },
  emptyMiddle: {
    minHeight: 24,
    flex: 1,
  },
});
