import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { needHelp } from '../api';
import { DashboardColors, DashboardSpacing } from '../styles';

import { SetupBanner } from './SetupBanner';

/** At-a-glance academic snapshot for the home hub. */
function KpiStrip() {
  return (
    <View style={styles.kpiRow}>
      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>Current GPA</Text>
        <Text style={styles.kpiValue}>3.67</Text>
        <Text style={styles.kpiHint}>+0.12 from last semester</Text>
      </View>
      <View style={styles.kpiCard}>
        <Text style={styles.kpiLabel}>Assignments Done</Text>
        <Text style={styles.kpiValue}>18</Text>
        <Text style={styles.kpiHint}>this term</Text>
      </View>
    </View>
  );
}

function NeedHelpRow() {
  return (
    <Pressable
      style={({ pressed }) => [styles.helpRow, pressed && styles.helpPressed]}
      onPress={needHelp}
    >
      <View style={styles.helpTextBlock}>
        <Text style={styles.helpTitle}>Need help?</Text>
        <Text style={styles.helpSub}>Chat with the campus assistant</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={DashboardColors.primary} />
    </Pressable>
  );
}

export function DashboardHomeContent() {
  return (
    <View style={styles.stack}>
      <SetupBanner />
      <KpiStrip />
      <View style={styles.widgetPlaceholder}>
        <Text style={styles.placeholderTitle}>Your week at a glance</Text>
        <Text style={styles.placeholderBody}>
          Track deadlines, announcements, and shortcuts to what matters. Open the menu to jump to Social,
          Events, Academics, Marketplace, and more.
        </Text>
      </View>
      <NeedHelpRow />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 16,
    paddingTop: 4,
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 96,
    backgroundColor: DashboardColors.background,
    borderRadius: DashboardSpacing.cardRadius,
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    padding: DashboardSpacing.cardPadding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DashboardColors.textMedium,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '700',
    color: DashboardColors.textDark,
    marginBottom: 4,
  },
  kpiHint: {
    fontSize: 11,
    color: DashboardColors.textLight,
  },
  widgetPlaceholder: {
    backgroundColor: DashboardColors.background,
    borderRadius: DashboardSpacing.cardRadius,
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    padding: DashboardSpacing.cardPadding,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DashboardColors.textDark,
    marginBottom: 8,
  },
  placeholderBody: {
    fontSize: 14,
    color: DashboardColors.textMedium,
    lineHeight: 20,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DashboardColors.background,
    borderRadius: DashboardSpacing.cardRadius,
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    padding: 14,
  },
  helpPressed: {
    opacity: 0.85,
  },
  helpTextBlock: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DashboardColors.textDark,
  },
  helpSub: {
    fontSize: 13,
    color: DashboardColors.textMedium,
    marginTop: 2,
  },
});
