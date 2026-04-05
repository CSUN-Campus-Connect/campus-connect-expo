import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import type { DimensionValue } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export type AnimatedBg =
  | { type: 'grainient'; color1: string; color2: string; color3: string }
  | { type: 'gridscan' }
  | { type: 'lightning'; color: string }
  | { type: 'particles'; colors: string[] }
  | null;

export function hexToHue(hex: string): number {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 260;
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const c = max - min;
  if (c === 0) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / c) % 6;
  else if (max === g) h = (b - r) / c + 2;
  else h = (r - g) / c + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

function hueToRgb(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rp = 0,
    gp = 0,
    bp = 0;
  if (h < 60) {
    rp = c;
    gp = x;
  } else if (h < 120) {
    rp = x;
    gp = c;
  } else if (h < 180) {
    gp = c;
    bp = x;
  } else if (h < 240) {
    gp = x;
    bp = c;
  } else if (h < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }
  const r = Math.round((rp + m) * 255);
  const g = Math.round((gp + m) * 255);
  const b = Math.round((bp + m) * 255);
  return `rgb(${r},${g},${b})`;
}

type Props = { config: AnimatedBg };

function GrainientLayer({
  color1,
  color2,
  color3,
}: {
  color1: string;
  color2: string;
  color3: string;
}) {
  const shift = useSharedValue(0);
  React.useEffect(() => {
    shift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [shift]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: 0.12 + shift.value * 0.1,
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[color1, color2, color3]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, overlayStyle]}
      >
        <LinearGradient
          colors={[color3, color1, color2]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { opacity: 0.35 }]}
        />
      </Animated.View>
    </View>
  );
}

function GridScanLayer() {
  const [cw, setCw] = React.useState(0);
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: 3200, easing: Easing.linear }),
      -1,
      false
    );
  }, [cw, progress]);

  const barStyle = useAnimatedStyle(() => {
    if (cw <= 0) return { transform: [{ translateX: 0 }] };
    const travel = cw * 1.1;
    const x = -cw * 0.08 + progress.value * travel;
    return { transform: [{ translateX: x }] };
  });

  return (
    <LinearGradient colors={['#1a1028', '#2d1f4a', '#1a1028']} style={StyleSheet.absoluteFill}>
      <View
        style={styles.gridClip}
        onLayout={(e) => setCw(e.nativeEvent.layout.width)}
      >
        <Animated.View
          style={[
            styles.scanBarMoving,
            { width: Math.max(cw * 0.22, 48) },
            barStyle,
          ]}
        />
      </View>
    </LinearGradient>
  );
}

function LightningLayer({ color }: { color: string }) {
  const h = hexToHue(color);
  const c1 = hueToRgb(h, 0.55, 0.25);
  const c2 = hueToRgb((h + 40) % 360, 0.5, 0.15);
  const flash = useSharedValue(0);
  const bolt = useSharedValue(0);

  React.useEffect(() => {
    flash.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1200 }),
        withTiming(0.72, { duration: 70 }),
        withTiming(0.08, { duration: 50 }),
        withTiming(0, { duration: 90 }),
        withTiming(0, { duration: 400 }),
        withTiming(0.55, { duration: 55 }),
        withTiming(0, { duration: 700 }),
        withTiming(0.4, { duration: 45 }),
        withTiming(0, { duration: 180 }),
        withTiming(0, { duration: 900 + Math.floor(h % 5) * 120 })
      ),
      -1,
      false
    );
    bolt.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 800 }),
        withTiming(1, { duration: 120 }),
        withTiming(0, { duration: 200 }),
        withTiming(0, { duration: 1600 })
      ),
      -1,
      false
    );
  }, [flash, bolt, h]);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flash.value,
  }));

  const boltStyle = useAnimatedStyle(() => ({
    opacity: bolt.value * 0.85,
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={[c1, c2, '#0f172a']} style={StyleSheet.absoluteFill} />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.lightningFlash, flashStyle]}
      />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: `${color}55` }, flashStyle]}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.bolt1, { backgroundColor: color }, boltStyle]}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.bolt2, { backgroundColor: '#ffffff' }, boltStyle]}
      />
    </View>
  );
}

function ParticlesLayer({ colors }: { colors: string[] }) {
  const drift = useSharedValue(0);
  React.useEffect(() => {
    drift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 14000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [drift]);

  const dots = React.useMemo(() => {
    const cols = colors.length ? colors : ['#ffffff', '#c7d2fe', '#a78bfa'];
    return Array.from({ length: 36 }, (_, i) => ({
      key: i,
      left: `${(i * 17) % 100}%` as DimensionValue,
      top: `${(i * 23 + 7) % 100}%` as DimensionValue,
      size: 4 + (i % 5),
      color: cols[i % cols.length],
      opacity: 0.35 + (i % 4) * 0.12,
    }));
  }, [colors]);

  const driftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (drift.value - 0.5) * 8 }],
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#111827' }]}>
      <Animated.View style={[StyleSheet.absoluteFill, driftStyle]}>
        {dots.map((d) => (
          <View
            key={d.key}
            style={{
              position: 'absolute',
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              borderRadius: d.size / 2,
              backgroundColor: d.color,
              opacity: d.opacity,
            }}
          />
        ))}
      </Animated.View>
    </View>
  );
}

export function AnimatedBackgroundLayer({ config }: Props) {
  if (!config) return null;
  if (config.type === 'grainient') {
    return (
      <GrainientLayer
        color1={config.color1}
        color2={config.color2}
        color3={config.color3}
      />
    );
  }
  if (config.type === 'gridscan') {
    return <GridScanLayer />;
  }
  if (config.type === 'lightning') {
    return <LightningLayer color={config.color} />;
  }
  if (config.type === 'particles') {
    return <ParticlesLayer colors={config.colors} />;
  }
  return null;
}

const styles = StyleSheet.create({
  gridClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  scanBarMoving: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,159,252,0.42)',
    opacity: 0.75,
    shadowColor: '#ff9ffc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
  },
  lightningFlash: {
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  bolt1: {
    position: 'absolute',
    width: 4,
    height: '55%',
    top: '8%',
    left: '38%',
    transform: [{ rotate: '18deg' }],
    borderRadius: 2,
    opacity: 0.9,
  },
  bolt2: {
    position: 'absolute',
    width: 3,
    height: '40%',
    top: '22%',
    left: '52%',
    transform: [{ rotate: '-12deg' }],
    borderRadius: 2,
  },
});
