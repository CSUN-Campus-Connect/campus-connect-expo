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
  onMessagesHubPress?: () => void;
};

export function BottomTabs({ activeTab = 'home', onMessagesHubPress }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        const color = isActive ? DashboardColors.primary : DashboardColors.textMedium;
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
  },
  tabPressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
