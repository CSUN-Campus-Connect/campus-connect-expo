import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { goToHome, goToMessages, goToMore } from '../api';
import { DashboardColors, DashboardSpacing } from '../styles';

type TabId = 'home' | 'messages' | 'more';

type TabConfig = {
  id: TabId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

const TABS: TabConfig[] = [
  { id: 'home', label: 'Home', icon: 'home', onPress: goToHome },
  { id: 'messages', label: 'Messages', icon: 'chatbubble-outline', onPress: goToMessages },
  { id: 'more', label: 'More', icon: 'ellipsis-horizontal', onPress: goToMore },
];

type Props = {
  activeTab?: TabId;
};

export function BottomTabs({ activeTab = 'home' }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        const color = isActive ? DashboardColors.primary : DashboardColors.textMedium;
        return (
          <Pressable
            key={tab.id}
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
            onPress={tab.onPress}
          >
            <Ionicons
              name={isActive && tab.id === 'home' ? 'home' : tab.icon}
              size={24}
              color={color}
            />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
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
    height: DashboardSpacing.tabBarHeight,
    backgroundColor: DashboardColors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: DashboardColors.cardBorder,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabPressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
