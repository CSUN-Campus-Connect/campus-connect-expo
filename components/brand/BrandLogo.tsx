import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

const SOURCE = require('@/assets/brand/ToroConnectLogoCircle.png');

type Props = {
  /** Width and height in dp. Default 216. */
  size?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * `circle` — round badge for compact UI (header). Crops the square asset to a circle.
   * `lockup` — full square asset (auth); no circular crop so the wordmark is not clipped.
   */
  variant?: 'circle' | 'lockup';
};

/**
 * Toro Connect mark — use instead of text placeholders for consistent branding.
 */
export function BrandLogo({ size = 216, style, variant = 'circle' }: Props) {
  const isCircle = variant === 'circle';
  const dim = {
    width: size,
    height: size,
    borderRadius: isCircle ? size / 2 : 0,
  };
  return (
    <View
      style={[isCircle ? styles.clipCircle : styles.lockup, dim, style]}
      accessibilityRole="image"
      accessibilityLabel="Campus Connect logo"
    >
      <Image source={SOURCE} style={dim} contentFit="contain" transition={120} />
    </View>
  );
}

const styles = StyleSheet.create({
  clipCircle: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  lockup: {
    backgroundColor: 'transparent',
  },
});
