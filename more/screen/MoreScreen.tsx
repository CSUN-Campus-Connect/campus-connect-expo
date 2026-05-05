import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Brand } from '@/constants/brand';
import { useAuth } from '@/context/AuthContext';
import { FeatureScreenShell } from '@/shell/FeatureScreenShell';

import { moreScreenStyles as styles } from './moreScreenStyles';

type Row = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: string;
};

const ROWS: Row[] = [
  { label: 'Profile', icon: 'person-outline', href: '/profile' },
  { label: 'Messages', icon: 'mail-outline', href: '/messages' },
  { label: 'Settings', icon: 'settings-outline', href: '/settings' },
  { label: 'Social', icon: 'chatbubbles-outline', href: '/social' },
  { label: 'Events', icon: 'calendar-outline', href: '/events' },
  { label: 'Clubs', icon: 'people-outline', href: '/clubs' },
  { label: 'Academics', icon: 'school-outline', href: '/academics' },
  { label: 'Marketplace', icon: 'bag-outline', href: '/marketplace' },
  { label: 'SRC', icon: 'business-outline', href: '/student-rec' },
  { label: 'Need help?', icon: 'help-buoy-outline', href: '/chat' },
];

export function MoreScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <FeatureScreenShell title="More">
      <Text style={styles.intro}>
        Shortcuts to campus areas, messages, and your account.
      </Text>

      <View style={styles.card}>
        {ROWS.map((row, i) => (
          <Pressable
            key={row.href}
            style={({ pressed }) => [
              styles.row,
              i < ROWS.length - 1 && styles.rowBorder,
              pressed && styles.rowPressed,
            ]}
            onPress={() => router.push(row.href as never)}
          >
            <Ionicons name={row.icon} size={22} color={Brand.primary} style={styles.rowIcon} />
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={Brand.textLight} />
          </Pressable>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed]}
        onPress={async () => {
          await signOut();
          router.replace('/(auth)/login');
        }}
      >
        <Ionicons name="log-out-outline" size={22} color="#FFFFFF" style={styles.rowIcon} />
        <Text style={styles.logoutLabel}>Log out</Text>
      </Pressable>
    </FeatureScreenShell>
  );
}

export default MoreScreen;
