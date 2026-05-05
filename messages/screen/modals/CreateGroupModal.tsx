import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as React from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ME_ID, RED } from '../../constants';
import type { ID, User } from '../../types';
import { styles } from '../messagesScreenStyles';

type Props = {
  visible: boolean;
  onClose: () => void;
  createGroupName: string;
  onCreateGroupNameChange: (t: string) => void;
  createGroupPictureUri: string;
  onCreateGroupPictureUriChange: (uri: string) => void;
  createGroupQuery: string;
  onCreateGroupQueryChange: (q: string) => void;
  createGroupFiltered: User[];
  createGroupSelected: Set<ID>;
  onToggleMember: (id: ID) => void;
  onCreate: (participantIds: ID[], name: string, pictureUri?: string) => void;
};

export function CreateGroupModal({
  visible,
  onClose,
  createGroupName,
  onCreateGroupNameChange,
  createGroupPictureUri,
  onCreateGroupPictureUriChange,
  createGroupQuery,
  onCreateGroupQueryChange,
  createGroupFiltered,
  createGroupSelected,
  onToggleMember,
  onCreate,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalScreen}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Create group</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </Pressable>
        </View>
        <View style={styles.cgTop}>
          <Pressable
            onPress={async () => {
              const r = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.85,
              });
              if (!r.canceled && r.assets[0]?.uri) onCreateGroupPictureUriChange(r.assets[0].uri);
            }}
          >
            {createGroupPictureUri ? (
              <Image source={{ uri: createGroupPictureUri }} style={styles.cgPhoto} />
            ) : (
              <View style={[styles.cgPhoto, styles.cgPhotoPh]}>
                <Text style={styles.headerSub}>Add photo</Text>
              </View>
            )}
          </Pressable>
          <TextInput
            value={createGroupName}
            onChangeText={(t) => onCreateGroupNameChange(t.slice(0, 60))}
            placeholder="Group name"
            style={[styles.modalSearch, { flex: 1 }]}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <Text style={styles.sectionSmall}>Add followers to the group</Text>
        <TextInput
          value={createGroupQuery}
          onChangeText={onCreateGroupQueryChange}
          placeholder="Search followers"
          style={styles.modalSearch}
          placeholderTextColor="#9CA3AF"
        />
        <FlatList
          data={createGroupFiltered}
          keyExtractor={(u) => u.id}
          renderItem={({ item: u }) => (
            <Pressable style={styles.modalRow} onPress={() => onToggleMember(u.id)}>
              <Ionicons
                name={createGroupSelected.has(u.id) ? 'checkbox' : 'square-outline'}
                size={22}
                color={RED}
              />
              <Image source={{ uri: u.avatarUrl }} style={[styles.threadAvatar, { marginLeft: 8 }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.threadName}>{u.displayName}</Text>
                <Text style={styles.headerSub}>@{u.username}</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.centerMuted}>No results</Text>}
        />
        <Pressable
          disabled={createGroupSelected.size === 0}
          onPress={() => {
            const name = createGroupName.trim() || 'Group chat';
            const participantIds = [ME_ID, ...createGroupSelected];
            onCreate(participantIds, name, createGroupPictureUri || undefined);
          }}
          style={[styles.primaryPillFull, createGroupSelected.size === 0 && { opacity: 0.4 }]}
        >
          <Text style={styles.primaryPillText}>
            Create group ({createGroupSelected.size} selected)
          </Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}
