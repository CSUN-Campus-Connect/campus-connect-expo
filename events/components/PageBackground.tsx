import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { BG } from '../eventsTheme';

/**
 * Dark crimson ambient layers matching the web Events Nexus backdrop.
 */
export function PageBackground() {
  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.base} />
      <LinearGradient
        colors={['rgba(180,18,28,0.32)', 'rgba(130,10,18,0.12)', 'transparent']}
        style={styles.blobLeft}
        start={{ x: 0.2, y: 1 }}
        end={{ x: 1, y: 0 }}
      />
      <LinearGradient
        colors={['rgba(210,32,48,0.2)', 'rgba(160,24,36,0.06)', 'transparent']}
        style={styles.blobRight}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <LinearGradient
        colors={['rgba(8,2,3,0.65)', 'transparent']}
        style={styles.vignetteTop}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  base: { ...StyleSheet.absoluteFillObject, backgroundColor: BG },
  blobLeft: {
    position: 'absolute',
    bottom: '-18%',
    left: '-12%',
    width: '70%',
    aspectRatio: 1,
    borderRadius: 9999,
    opacity: 0.95,
  },
  blobRight: {
    position: 'absolute',
    top: '-14%',
    right: '-14%',
    width: '55%',
    aspectRatio: 1,
    borderRadius: 9999,
    opacity: 0.9,
  },
  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '26%',
  },
});
