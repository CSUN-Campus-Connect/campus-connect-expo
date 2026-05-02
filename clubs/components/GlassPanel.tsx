import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = { children: React.ReactNode };

/** Frosted-glass panel — mirrors `GlassPanels.tsx` from the web client. */
export function GlassPanel({ children }: Props) {
  return <View style={styles.panel}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 12,
  },
});
