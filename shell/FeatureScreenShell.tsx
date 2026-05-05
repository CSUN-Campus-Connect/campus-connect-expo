import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabs } from '@/dashboard/components/BottomTabs';

import { featureScreenStyles as styles } from './featureScreenStyles';

type Props = {
  title: string;
  children: React.ReactNode;
  /** Optional node on the right side of the top bar (e.g. settings icon). */
  rightSlot?: React.ReactNode;
  refreshControl?: ScrollViewProps['refreshControl'];
  /**
   * When true, body is a plain `View` (flex 1) instead of `ScrollView` — for chat, maps, etc.
   */
  noScrollBody?: boolean;
};

/**
 * Same outer structure as `messages/screen/MessagesScreen.tsx`: safe area, top bar + back,
 * scrollable body, bottom tab bar.
 */
export function FeatureScreenShell({
  title,
  children,
  rightSlot,
  refreshControl,
  noScrollBody,
}: Props) {
  const router = useRouter();

  const body = noScrollBody ? (
    <View style={styles.scroll}>{children}</View>
  ) : (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color="#111" />
        </Pressable>
        <Text style={styles.topTitle}>{title}</Text>
        {rightSlot != null ? (
          <View style={styles.topBarRight}>{rightSlot}</View>
        ) : (
          <View style={styles.topBarRight} />
        )}
      </View>

      {body}

      <BottomTabs />
    </SafeAreaView>
  );
}
