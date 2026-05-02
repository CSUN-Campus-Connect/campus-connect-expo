import { StyleSheet } from 'react-native';

export const CRIMSON = '#D22030';
export const BG = '#100608';
export const PANEL = '#130608';
export const TEXT = '#ffffff';
export const TEXT_MUTED = 'rgba(255,255,255,0.45)';
export const BORDER = 'rgba(255,255,255,0.07)';

export const eventsTheme = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  sectionKicker: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    color: CRIMSON,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 20,
    marginBottom: 16,
  },
});
