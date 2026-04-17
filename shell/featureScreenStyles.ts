import { StyleSheet } from 'react-native';

import { DashboardColors } from '@/dashboard/styles';

/**
 * Top bar + screen chrome aligned with `messages/screen/messagesScreenStyles.ts`
 * (`screen`, `topBar`, `backBtn`, `topTitle`).
 */
export const featureScreenStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fafafb' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DashboardColors.cardBorder,
    backgroundColor: '#fff',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '800', color: '#111' },
  /** Wide enough for a compact icon + label (e.g. marketplace favorites). */
  topBarRight: { minWidth: 40, maxWidth: 120, minHeight: 40, alignItems: 'flex-end', justifyContent: 'center' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
});
