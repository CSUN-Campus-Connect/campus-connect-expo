import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SRC_TINT_COLORS } from '@/studentRec/constants';

/**
 * Aurora-inspired stack: dark base + CSUN red tint (matches web `StudentRecCenter/layout.tsx`).
 */
export function SrcBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={['#050508', '#12060a', '#1a0a0e']} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={[...SRC_TINT_COLORS]} style={StyleSheet.absoluteFill} />
    </View>
  );
}
