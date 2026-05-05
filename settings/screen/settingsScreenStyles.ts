import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const settingsScreenStyles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Brand.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  rowPressed: {
    backgroundColor: Brand.surfaceMuted,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Brand.textDark,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '500',
    color: Brand.textLight,
    marginRight: 4,
    maxWidth: '42%',
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 16,
  },
});
