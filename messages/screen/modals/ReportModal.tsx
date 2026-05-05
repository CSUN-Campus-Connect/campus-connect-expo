import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '../messagesScreenStyles';

const REASONS = ['Spam', 'Harassment', 'Hate', 'Scam', 'Other'] as const;

type Props = {
  visible: boolean;
  onClose: () => void;
  reportReason: string;
  onReasonChange: (r: string) => void;
  reportDetails: string;
  onDetailsChange: (t: string) => void;
  onSubmit: () => void;
};

export function ReportModal({
  visible,
  onClose,
  reportReason,
  onReasonChange,
  reportDetails,
  onDetailsChange,
  onSubmit,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalScreen}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Report</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </Pressable>
        </View>
        <Text style={styles.reportLead}>Why are you reporting this conversation?</Text>
        {REASONS.map((r) => (
          <Pressable
            key={r}
            onPress={() => onReasonChange(r)}
            style={[styles.reasonRow, reportReason === r && styles.reasonRowOn]}
          >
            <Text style={styles.threadName}>{r}</Text>
          </Pressable>
        ))}
        <TextInput
          value={reportDetails}
          onChangeText={onDetailsChange}
          placeholder="Optional details"
          style={[styles.modalSearch, { minHeight: 80 }]}
          multiline
          placeholderTextColor="#9CA3AF"
        />
        <View style={styles.modalActions}>
          <Pressable onPress={onClose} style={styles.outlinePill}>
            <Text style={styles.outlinePillText}>Cancel</Text>
          </Pressable>
          <Pressable
            disabled={!reportReason}
            onPress={onSubmit}
            style={[styles.primaryPill, !reportReason && { opacity: 0.4 }]}
          >
            <Text style={styles.primaryPillText}>Submit report</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
