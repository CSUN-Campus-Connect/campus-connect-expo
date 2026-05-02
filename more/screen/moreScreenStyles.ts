import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const moreScreenStyles = StyleSheet.create({
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    overflow: 'hidden',
    marginBottom: 16,
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
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  logoutPressed: {
    opacity: 0.92,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
