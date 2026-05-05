import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '../messagesScreenStyles';

type Props = {
  visible: boolean;
  onClose: () => void;
  noteText: string;
  onNoteTextChange: (t: string) => void;
  onSave: () => void;
};

export function NoteModal({
  visible,
  onClose,
  noteText,
  onNoteTextChange,
  onSave,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalScreen}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Create a note</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </Pressable>
        </View>
        <Text style={styles.mutedNote}>Keep it short (up to 60 chars)</Text>
        <TextInput
          value={noteText}
          onChangeText={(t) => onNoteTextChange(t.slice(0, 60))}
          placeholder="What's up?"
          style={styles.modalSearch}
          placeholderTextColor="#9CA3AF"
        />
        <View style={styles.modalActions}>
          <Pressable onPress={onClose} style={styles.outlinePill}>
            <Text style={styles.outlinePillText}>Cancel</Text>
          </Pressable>
          <Pressable
            disabled={!noteText.trim()}
            onPress={onSave}
            style={[styles.primaryPill, !noteText.trim() && { opacity: 0.4 }]}
          >
            <Text style={styles.primaryPillText}>Save</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
