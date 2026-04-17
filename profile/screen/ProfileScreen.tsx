import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { SECTION_COPY } from '@/constants/sectionCopy';
import { MOCK_PROFILE, MOCK_PROFILE_POSTS } from '@/profile/data/mockProfile';
import { FeatureScreenShell } from '@/shell/FeatureScreenShell';

import { profileScreenStyles as styles } from './profileScreenStyles';

dayjs.extend(relativeTime);

function displayName(p: typeof MOCK_PROFILE) {
  return [p.first, p.middle, p.last].filter(Boolean).join(' ');
}

export function ProfileScreen() {
  const c = SECTION_COPY.profile;
  const p = MOCK_PROFILE;

  return (
    <FeatureScreenShell title={c.title}>
      <Text style={styles.intro}>{c.body}</Text>

      <View style={styles.bannerWrap}>
        <Image source={{ uri: p.banner }} style={styles.bannerImg} contentFit="cover" />
      </View>

      <View style={styles.avatarRow}>
        <Image source={{ uri: p.avatar }} style={styles.avatar} contentFit="cover" />
        <View style={styles.nameBlock}>
          <Text style={styles.displayName}>{displayName(p)}</Text>
          <View style={styles.subRow}>
            {p.username ? <Text style={styles.username}>@{p.username}</Text> : null}
            {p.pronouns ? <Text style={styles.pronouns}>{p.pronouns}</Text> : null}
            <View style={styles.verifiedPill}>
              <Ionicons name="checkmark-circle" size={14} color="#A80532" />
              <Text style={styles.verifiedText}>Student</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{p.posts ?? 0}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{p.followers ?? 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{p.following ?? 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {p.bio ? <Text style={styles.bio}>{p.bio}</Text> : null}

      <Text style={styles.sectionTitle}>Interests</Text>
      <View style={styles.chipWrap}>
        {(p.interests ?? []).map((tag) => (
          <View key={tag} style={styles.chip}>
            <Text style={styles.chipText}>{tag}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Details</Text>
      <View style={styles.metaCard}>
        <View style={styles.metaRow}>
          <Ionicons name="school-outline" size={20} color="#A80532" />
          <View style={{ flex: 1 }}>
            <Text style={styles.metaText}>
              {p.major} · {p.year}
            </Text>
            <Text style={styles.metaMuted}>Major & year</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={20} color="#A80532" />
          <View style={{ flex: 1 }}>
            <Text style={styles.metaText}>{p.location}</Text>
            <Text style={styles.metaMuted}>Location</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="mail-outline" size={20} color="#A80532" />
          <View style={{ flex: 1 }}>
            <Text style={styles.metaText}>{p.email}</Text>
            <Text style={styles.metaMuted}>Email</Text>
          </View>
        </View>
        {p.linkedin ? (
          <View style={styles.metaRow}>
            <Ionicons name="logo-linkedin" size={20} color="#0A66C2" />
            <View style={{ flex: 1 }}>
              <Text style={styles.metaText}>{p.linkedin}</Text>
              <Text style={styles.metaMuted}>LinkedIn</Text>
            </View>
          </View>
        ) : null}
        {p.discord ? (
          <View style={styles.metaRow}>
            <Ionicons name="logo-discord" size={20} color="#5865F2" />
            <View style={{ flex: 1 }}>
              <Text style={styles.metaText}>{p.discord}</Text>
              <Text style={styles.metaMuted}>Discord</Text>
            </View>
          </View>
        ) : null}
        {p.portfolio ? (
          <View style={styles.metaRow}>
            <Ionicons name="document-text-outline" size={20} color="#A80532" />
            <View style={{ flex: 1 }}>
              <Text style={styles.metaText} numberOfLines={2}>
                {p.portfolio}
              </Text>
              <Text style={styles.metaMuted}>Portfolio / résumé</Text>
            </View>
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Recent posts</Text>
      {MOCK_PROFILE_POSTS.map((post) => (
        <View key={post.id} style={styles.postCard}>
          {post.text ? <Text style={styles.postText}>{post.text}</Text> : null}
          <View style={styles.postMeta}>
            <Text style={styles.postTime}>{dayjs(post.createdAt).fromNow()}</Text>
            <Text style={styles.postEngage}>
              {post.likes} likes · {post.comments} comments
            </Text>
          </View>
        </View>
      ))}

      <View style={[styles.card, { marginTop: 8 }]}>
        <Text style={styles.cardTitle}>Edit profile</Text>
        <Text style={styles.cardBody}>
          Profile editing on mobile is coming soon. For now, review your details here and adjust account
          settings from the Settings tab.
        </Text>
      </View>
    </FeatureScreenShell>
  );
}

export default ProfileScreen;
