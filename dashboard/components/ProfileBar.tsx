import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { viewProfile } from '../api';
import { DashboardColors, DashboardSpacing } from '../styles';

const USER_INITIALS = 'N';
const USERNAME = 'vram gh';

export function ProfileBar() {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.left, pressed && styles.pressed]}
        onPress={viewProfile}
      >
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{USER_INITIALS}</Text>
          </View>
          <View style={styles.notificationDot} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.username}>{USERNAME}</Text>
          <Text style={styles.viewProfile}>View Profile</Text>
        </View>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.helpButton, pressed && styles.helpPressed]}
        onPress={() => router.push('/chat')}
      >
        <Text style={styles.helpText}>Need Help?</Text>
        <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DashboardColors.background,
    borderRadius: DashboardSpacing.cardRadius,
    padding: DashboardSpacing.profileBarPadding,
    marginHorizontal: DashboardSpacing.screenPadding,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DashboardColors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  notificationDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: DashboardColors.notificationDot,
    borderWidth: 2,
    borderColor: DashboardColors.background,
  },
  textBlock: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: DashboardColors.textDark,
    marginBottom: 2,
  },
  viewProfile: {
    fontSize: 13,
    color: DashboardColors.textMedium,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DashboardColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  helpPressed: {
    opacity: 0.9,
  },
  helpText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
