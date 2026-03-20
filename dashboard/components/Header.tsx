import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { openSettings } from '../api';
import { DashboardColors, DashboardSpacing } from '../styles';

export function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>T</Text>
        </View>
        <Text style={styles.title}>
          <Text style={styles.titleToro}>Toro</Text>
          <Text style={styles.titleCampus}> CAMPUS CONNECT</Text>
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsPressed]}
        onPress={openSettings}
        hitSlop={12}
      >
        <Ionicons name="settings-outline" size={24} color={DashboardColors.textDark} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DashboardSpacing.screenPadding,
    paddingVertical: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DashboardSpacing.headerGap,
    flex: 1,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: DashboardColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  title: {
    flexShrink: 0,
  },
  titleToro: {
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
    color: DashboardColors.textDark,
  },
  titleCampus: {
    fontSize: 14,
    fontWeight: '600',
    color: DashboardColors.textMedium,
    letterSpacing: 0.5,
  },
  settingsButton: {
    padding: 4,
  },
  settingsPressed: {
    opacity: 0.7,
  },
});
