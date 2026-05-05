import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RED } from './constants';

const MAX_MS = 15000;

type Props = {
  disabled?: boolean;
  onRecorded: (uri: string, durationSec: number, name: string) => void;
};

export function VoiceRecordButton({ disabled, onRecorded }: Props) {
  const [active, setActive] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const recordingRef = React.useRef<Audio.Recording | null>(null);
  const tickRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const capRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = React.useRef<number>(0);

  const clearTimers = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    if (capRef.current) clearTimeout(capRef.current);
    capRef.current = null;
  };

  const onRecordedRef = React.useRef(onRecorded);
  onRecordedRef.current = onRecorded;

  const stopRecording = React.useCallback(async () => {
    const rec = recordingRef.current;
    if (!rec) return;
    recordingRef.current = null;
    clearTimers();
    setActive(false);
    setElapsed(0);
    try {
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      const durationSec = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
      if (uri) onRecordedRef.current(uri, durationSec, `voice-${Date.now()}.m4a`);
    } catch {
      /* ignore */
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
  }, []);

  const startRecording = React.useCallback(async () => {
    if (disabled || recordingRef.current) return;
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) return;
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording: rec } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recordingRef.current = rec;
    startedAt.current = Date.now();
    setActive(true);
    setElapsed(0);
    tickRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    capRef.current = setTimeout(() => {
      void stopRecording();
    }, MAX_MS);
  }, [disabled, stopRecording]);

  React.useEffect(() => {
    return () => {
      clearTimers();
      const r = recordingRef.current;
      recordingRef.current = null;
      void r?.stopAndUnloadAsync();
    };
  }, []);

  if (active) {
    return (
      <Pressable
        onPress={() => void stopRecording()}
        style={({ pressed }) => [styles.recording, pressed && styles.pressed]}
      >
        <View style={styles.recDot} />
        <Text style={styles.recText}>{elapsed}s · Tap to stop</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={disabled}
      onPress={() => void startRecording()}
      style={({ pressed }) => [styles.idle, disabled && styles.disabled, pressed && styles.pressed]}
    >
      <Ionicons name="mic" size={22} color={disabled ? '#ccc' : RED} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  idle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  recording: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(168,5,50,0.12)',
    maxWidth: 200,
  },
  recDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: RED,
  },
  recText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
    flexShrink: 1,
  },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.75 },
});
