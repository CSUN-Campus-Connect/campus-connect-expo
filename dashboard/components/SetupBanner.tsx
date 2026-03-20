import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { finishSetup } from '../api';
import { DashboardColors, DashboardSpacing } from '../styles';

export function SetupBanner() {
  return (
    <View style={styles.card}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>Finish setting up account?</Text>
        <Text style={styles.subtitle}>Add your profile info so other students can find you.</Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={finishSetup}
      >
        <Text style={styles.ctaText}>FINISH SETUP</Text>
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
    padding: DashboardSpacing.cardPadding,
    marginHorizontal: DashboardSpacing.screenPadding,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  textBlock: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: DashboardColors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: DashboardColors.textMedium,
    lineHeight: 18,
  },
  cta: {
    backgroundColor: DashboardColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
