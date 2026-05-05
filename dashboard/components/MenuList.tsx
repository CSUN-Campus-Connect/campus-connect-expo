import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  navigateToSocial,
  navigateToMessages,
  navigateToEvents,
  navigateToClubs,
  navigateToAcademics,
  navigateToMarketplace,
  navigateToSRC,
} from '../api';
import { DashboardColors, DashboardSpacing } from '../styles';

type MenuItemConfig = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

/** Order matches web `DashboardSidebar` (`navItems`) after Home. */
const MENU_ITEMS: MenuItemConfig[] = [
  { id: 'social', label: 'Social', icon: 'chatbubbles-outline', onPress: navigateToSocial },
  { id: 'messages', label: 'Messages', icon: 'mail-outline', onPress: navigateToMessages },
  { id: 'events', label: 'Events', icon: 'calendar-outline', onPress: navigateToEvents },
  { id: 'clubs', label: 'Clubs', icon: 'people-outline', onPress: navigateToClubs },
  { id: 'academics', label: 'Academics', icon: 'school-outline', onPress: navigateToAcademics },
  { id: 'marketplace', label: 'Marketplace', icon: 'bag-outline', onPress: navigateToMarketplace },
  { id: 'src', label: 'SRC', icon: 'business-outline', onPress: navigateToSRC },
];

function MenuRow({ item, isLast }: { item: MenuItemConfig; isLast: boolean }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={item.onPress}
    >
      <Ionicons name={item.icon} size={22} color={DashboardColors.textDark} style={styles.icon} />
      <Text style={styles.label}>{item.label}</Text>
      <Ionicons name="chevron-forward" size={20} color={DashboardColors.textLight} />
      {!isLast && <View style={styles.divider} />}
    </Pressable>
  );
}

export function MenuList() {
  return (
    <View style={styles.container}>
      {MENU_ITEMS.map((item, index) => (
        <MenuRow key={item.id} item={item} isLast={index === MENU_ITEMS.length - 1} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: DashboardSpacing.screenPadding,
    backgroundColor: DashboardColors.background,
    borderRadius: DashboardSpacing.cardRadius,
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: DashboardSpacing.menuItemHeight,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowPressed: {
    backgroundColor: DashboardColors.cardBackground,
  },
  icon: {
    marginRight: 14,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: DashboardColors.textDark,
    fontWeight: '500',
  },
  divider: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: DashboardColors.cardBorder,
  },
});
