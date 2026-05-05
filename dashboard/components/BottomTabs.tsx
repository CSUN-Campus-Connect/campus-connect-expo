import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBottomBar } from '@/context/BottomBarContext';
import { useLocale } from '@/context/LocaleContext';
import type { BottomBarOptionalId, BottomBarTabId } from '@/dashboard/bottomBarTypes';
import { bottomBarTabFromPathname } from '@/dashboard/bottomBarTypes';
import type { SettingsStringKey } from '@/i18n/settingsStrings';

import {
  goToHome,
  goToMessages,
  goToMore,
  navigateToAcademics,
  navigateToClubs,
  navigateToEvents,
  navigateToSocial,
  navigateToSRC,
} from '../api';
import { DashboardColors, DashboardSpacing } from '../styles';

type TabRow = {
  id: BottomBarTabId;
  labelKey: SettingsStringKey;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

function optionalTab(id: BottomBarOptionalId): TabRow {
  const labelKeyMap: Record<BottomBarOptionalId, SettingsStringKey> = {
    social: 'bottomBarSocial',
    events: 'bottomBarEvents',
    clubs: 'bottomBarClubs',
    academics: 'bottomBarAcademics',
    src: 'bottomBarSrc',
  };
  const iconMap: Record<BottomBarOptionalId, keyof typeof Ionicons.glyphMap> = {
    social: 'chatbubbles-outline',
    events: 'calendar-outline',
    clubs: 'people-circle-outline',
    academics: 'school-outline',
    src: 'fitness-outline',
  };
  const onPressMap: Record<BottomBarOptionalId, () => void> = {
    social: navigateToSocial,
    events: navigateToEvents,
    clubs: navigateToClubs,
    academics: navigateToAcademics,
    src: navigateToSRC,
  };
  return {
    id,
    labelKey: labelKeyMap[id],
    icon: iconMap[id],
    onPress: onPressMap[id],
  };
}

type Props = {
  onMessagesHubPress?: () => void;
};

export function BottomTabs({ onMessagesHubPress }: Props) {
  const pathname = usePathname();
  const activeTab = bottomBarTabFromPathname(pathname);
  const insets = useSafeAreaInsets();
  const { slots } = useBottomBar();
  const { tSettings } = useLocale();

  const tabs = useMemo((): TabRow[] => {
    const rows: TabRow[] = [
      {
        id: 'home',
        labelKey: 'bottomBarHome',
        icon: 'home',
        onPress: goToHome,
      },
      {
        id: 'messages',
        labelKey: 'bottomBarMessages',
        icon: 'chatbubble-outline',
        onPress: goToMessages,
      },
    ];
    if (slots.slot1) rows.push(optionalTab(slots.slot1));
    if (slots.slot2) rows.push(optionalTab(slots.slot2));
    rows.push({
      id: 'more',
      labelKey: 'bottomBarMore',
      icon: 'settings-outline',
      onPress: goToMore,
    });
    return rows;
  }, [slots.slot1, slots.slot2]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const color = isActive ? DashboardColors.primary : DashboardColors.textMedium;
        const label = tSettings(tab.labelKey);
        const handlePress = () => {
          if (tab.id === 'messages' && activeTab === 'messages' && onMessagesHubPress) {
            onMessagesHubPress();
            return;
          }
          tab.onPress();
        };
        return (
          <Pressable
            key={tab.id}
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
            onPress={handlePress}
          >
            <Ionicons
              name={
                tab.id === 'more'
                  ? isActive
                    ? 'settings'
                    : 'settings-outline'
                  : isActive && tab.id === 'home'
                    ? 'home'
                    : isActive && tab.id === 'src'
                      ? 'fitness'
                      : tab.icon
              }
              size={24}
              color={color}
            />
            <Text style={[styles.label, { color }]} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: DashboardColors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: DashboardColors.cardBorder,
    paddingTop: 10,
    minHeight: DashboardSpacing.tabBarHeight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 0,
    paddingHorizontal: 2,
  },
  tabPressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});
