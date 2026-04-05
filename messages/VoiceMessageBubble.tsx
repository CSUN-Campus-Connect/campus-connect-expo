import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { RED } from './constants';

type Props = {
  uri: string;
  mine: boolean;
  durationSec?: number;
};

export function VoiceMessageBubble({ uri, mine, durationSec }: Props) {
  const soundRef = React.useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [positionSec, setPositionSec] = React.useState(0);

  const unload = React.useCallback(async () => {
    const s = soundRef.current;
    soundRef.current = null;
    if (s) {
      try {
        await s.unloadAsync();
      } catch {
        /* ignore */
      }
    }
    setPlaying(false);
    setPositionSec(0);
  }, []);

  const toggle = React.useCallback(async () => {
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          (st) => {
            if (!st.isLoaded) return;
            setPlaying(!!st.isPlaying);
            if ('positionMillis' in st && st.positionMillis != null) {
              setPositionSec(Math.floor(st.positionMillis / 1000));
            }
            if (st.didJustFinish) {
              void unload();
            }
          }
        );
        soundRef.current = sound;
        return;
      }
      const st = await soundRef.current.getStatusAsync();
      if (!st.isLoaded) return;
      if (st.isPlaying) await soundRef.current.pauseAsync();
      else await soundRef.current.playAsync();
    } catch {
      /* ignore */
    }
  }, [uri, unload]);

  React.useEffect(() => {
    return () => {
      void unload();
    };
  }, [uri, unload]);

  const label =
    playing && positionSec >= 0
      ? `${positionSec}s${durationSec != null ? ` / ${durationSec}s` : ''}`
      : durationSec != null
        ? `${durationSec}s`
        : 'Voice';

  return (
    <Pressable
      onPress={() => void toggle()}
      style={[
        styles.wrap,
        mine ? { alignSelf: 'flex-end', backgroundColor: 'rgba(168,5,50,0.15)' } : { alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.06)' },
      ]}
    >
      <Ionicons name={playing ? 'pause' : 'play'} size={20} color={mine ? RED : '#333'} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    maxWidth: 260,
  },
  label: { fontSize: 13, fontWeight: '700', color: '#333' },
});
