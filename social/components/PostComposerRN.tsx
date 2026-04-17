import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { SocialPalette } from '../theme/SocialThemeContext';

const MAX = 500;

type Props = {
  colors: SocialPalette;
  userInitials: string;
  onPost: (body: string, images?: string[]) => Promise<void>;
};

export function PostComposerRN({ colors, userInitials, onPost }: Props) {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const remaining = MAX - value.length;
  const over = remaining < 0;
  const progress = Math.min(value.length / MAX, 1);

  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 4 - images.length,
      quality: 0.85,
    });
    if (res.canceled) return;
    const uris = res.assets.map((a) => a.uri).filter(Boolean) as string[];
    setImages((prev) => [...prev, ...uris].slice(0, 4));
  }

  async function submit() {
    const text = value.trim();
    if ((!text && images.length === 0) || over || submitting) return;
    setSubmitting(true);
    try {
      await onPost(text, images.length ? images : undefined);
      setValue('');
      setImages([]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={[styles.wrap, { backgroundColor: colors.bgSurface, borderColor: colors.borderSubtle }]}>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: colors.csunRed }]}>
          <Text style={styles.avatarText}>{userInitials}</Text>
        </View>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder="What's happening on campus?"
          placeholderTextColor={colors.textMuted}
          multiline
          value={value}
          onChangeText={setValue}
          maxLength={MAX + 50}
        />
      </View>

      {images.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imgRow}>
          {images.map((uri, i) => (
            <View key={uri} style={styles.thumbWrap}>
              <Image source={{ uri }} style={styles.thumb} />
              <Pressable style={styles.removeImg} onPress={() => setImages((p) => p.filter((_, j) => j !== i))}>
                <Ionicons name="close-circle" size={22} color="#fff" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : null}

      <View style={[styles.toolbar, { borderTopColor: colors.borderSubtle }]}>
        <Pressable onPress={pickImage} hitSlop={8}>
          <Ionicons name="image-outline" size={22} color={colors.csunRed} />
        </Pressable>
        <View style={styles.spacer} />
        <View style={styles.ringWrap}>
          <View style={[styles.ringTrack, { borderColor: colors.borderSubtle }]}>
            <View
              style={[
                styles.ringFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: over ? '#ef4444' : remaining < 30 ? '#f59e0b' : colors.csunRed,
                },
              ]}
            />
          </View>
          <Text style={[styles.count, { color: over ? '#ef4444' : colors.textMuted }]}>{remaining}</Text>
        </View>
        <Pressable
          style={[styles.postBtn, { backgroundColor: over ? colors.textMuted : colors.csunRed }]}
          onPress={submit}
          disabled={submitting || over || (!value.trim() && images.length === 0)}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.postBtnText}>Post</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  input: { flex: 1, minHeight: 72, fontSize: 15, lineHeight: 22, paddingTop: 6, textAlignVertical: 'top' },
  imgRow: { marginTop: 10, marginBottom: 4 },
  thumbWrap: { marginRight: 8, position: 'relative' },
  thumb: { width: 72, height: 72, borderRadius: 10 },
  removeImg: { position: 'absolute', top: -4, right: -4 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  spacer: { flex: 1 },
  ringWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 10 },
  ringTrack: {
    width: 36,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  ringFill: { height: '100%', borderRadius: 2 },
  count: { fontSize: 12, fontWeight: '600', minWidth: 28, textAlign: 'right' },
  postBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    minWidth: 72,
    alignItems: 'center',
  },
  postBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
