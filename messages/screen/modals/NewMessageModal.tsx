import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as React from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ID, User } from '../../types';
import { styles } from '../messagesScreenStyles';

type Props = {
  visible: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  users: User[];
  onPickUser: (id: ID) => void;
};

export function NewMessageModal({
  visible,
  onClose,
  query,
  onQueryChange,
  users,
  onPickUser,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalScreen}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>New message</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </Pressable>
        </View>
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search username or name"
          style={styles.modalSearch}
          placeholderTextColor="#9CA3AF"
        />
        <FlatList
          data={users}
          keyExtractor={(u) => u.id}
          renderItem={({ item: u }) => (
            <Pressable
              style={styles.modalRow}
              onPress={() => {
                onPickUser(u.id);
                onClose();
              }}
            >
              <Image source={{ uri: u.avatarUrl }} style={styles.threadAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.threadName}>{u.displayName}</Text>
                <Text style={styles.headerSub}>@{u.username}</Text>
              </View>
              <View style={styles.chatPill}>
                <Text style={styles.chatPillText}>Chat</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.centerMuted}>No results</Text>}
        />
      </SafeAreaView>
    </Modal>
  );
}
