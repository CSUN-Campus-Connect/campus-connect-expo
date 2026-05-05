import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = { children: React.ReactNode };

/**
 * Maroon aurora wash — same intent as `campus-connect-client` `AuroraBackground.tsx`,
 * implemented with stacked gradients (no CSS pseudo-elements in RN).
 */
export function AuroraBackground({ children }: Props) {
  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#3a0010', '#2a000c', '#3a0010']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(230,20,50,0.55)', 'transparent', 'rgba(180,0,40,0.45)']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[StyleSheet.absoluteFill, { opacity: 0.95 }]}
        />
        <LinearGradient
          colors={['transparent', 'rgba(255,80,100,0.22)', 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[StyleSheet.absoluteFill, { opacity: 0.7 }]}
        />
        <LinearGradient
          colors={['rgba(255,100,120,0.12)', 'transparent', 'rgba(200,20,55,0.18)']}
          start={{ x: 0.2, y: 0.8 }}
          end={{ x: 0.8, y: 0.2 }}
          style={[StyleSheet.absoluteFill, { opacity: 0.85 }]}
        />
      </View>
      <View style={styles.foreground}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#3a0010',
  },
  foreground: {
    position: 'relative',
    zIndex: 1,
  },
});
