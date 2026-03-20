import { StyleSheet } from 'react-native';

export const DashboardColors = {
  primary: '#B0003A',
  textDark: '#333333',
  textMedium: '#6B7280',
  textLight: '#9CA3AF',
  background: '#FFFFFF',
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
    paddingBottom: 24,
  },
  emptyMiddle: {
    minHeight: 24,
    flex: 1,
  },
});
