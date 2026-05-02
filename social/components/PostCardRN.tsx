import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Post } from '../types/feed.types';
import type { SocialPalette } from '../theme/SocialThemeContext';
import { fmtCount, initials, timeAgo } from '../utils/feedHelpers';

type Props = {
  post: Post;
  colors: SocialPalette;
  currentUserId: string;
  isSaved: boolean;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
};

export function PostCardRN({ post, colors, currentUserId, isSaved, onLike, onSave, onDelete }: Props) {
  const inits = initials(post.User.firstName, post.User.lastName);
  const liked = post.isLikedByUser ?? false;
  const isOwner = post.User.id === currentUserId;
  const badge =
    post.User.userType === 'faculty' ? 'Faculty' : post.User.userType === 'alumni' ? 'Alumni' : 'Student';

  return (
    <View style={[styles.card, { borderBottomColor: colors.borderSubtle }]}>
      <View style={styles.topRow}>
        <View style={[styles.avatar, { backgroundColor: colors.csunRed }]}>
          <Text style={styles.avatarText}>{inits}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {post.User.firstName} {post.User.lastName}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: `${colors.csunRed}22` }]}>
              <Text style={[styles.badgeText, { color: colors.csunRed }]}>{badge}</Text>
            </View>
            <Text style={[styles.time, { color: colors.textMuted }]}> · {timeAgo(post.createdAt)}</Text>
          </View>
        </View>
        {isOwner ? (
          <Pressable onPress={() => onDelete(post.id)} hitSlop={10}>
            <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <Text style={[styles.body, { color: colors.textPrimary }]}>{post.content}</Text>

      {post.tags && post.tags.length > 0 ? (
        <View style={styles.tags}>
          {post.tags.slice(0, 4).map((t) => (
            <View key={t} style={[styles.tag, { borderColor: colors.borderSubtle }]}>
              <Text style={[styles.tagText, { color: colors.csunRed }]}>#{t}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {post.images?.length ? (
        <Image source={{ uri: post.images[0] }} style={styles.postImg} contentFit="cover" />
      ) : null}

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={() => onLike(post.id)}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? colors.csunRed : colors.textMuted} />
          <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{fmtCount(post._count.Like)}</Text>
        </Pressable>
        <View style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={19} color={colors.textMuted} />
          <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{fmtCount(post._count.Comment)}</Text>
        </View>
        <Pressable style={styles.actionBtn} onPress={() => onSave(post.id)}>
          <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={isSaved ? colors.csunRed : colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  meta: { flex: 1, minWidth: 0 },
  name: { fontSize: 15, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  badgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  time: { fontSize: 12 },
  body: { fontSize: 15, lineHeight: 22, marginTop: 10 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 12, fontWeight: '600' },
  postImg: { width: '100%', height: 200, borderRadius: 12, marginTop: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionLabel: { fontSize: 13, fontWeight: '600' },
});
