import * as React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { styles } from '../messagesScreenStyles';

type Props = {
  visible: boolean;
  onClose: () => void;
  hasOtherUser: boolean;
  onReport: () => void;
  onBlock: () => void;
  onLeaveGroup: () => void;
};

export function ThreadMenuModal({
  visible,
  onClose,
  hasOtherUser,
  onReport,
  onBlock,
  onLeaveGroup,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.menuBackdrop} onPress={onClose} />
      <View style={styles.menuSheet}>
        <Pressable
          onPress={() => {
            onClose();
            onReport();
          }}
          style={styles.menuItem}
        >
          <Text style={styles.menuItemText}>Report</Text>
        </Pressable>
        {hasOtherUser ? (
          <Pressable
            onPress={() => {
              onClose();
              onBlock();
            }}
            style={styles.menuItem}
          >
            <Text style={[styles.menuItemText, { color: '#b91c1c' }]}>Block</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              onClose();
              onLeaveGroup();
            }}
            style={styles.menuItem}
          >
            <Text style={[styles.menuItemText, { color: '#b91c1c' }]}>Leave group</Text>
          </Pressable>
        )}
      </View>
    </Modal>
  );
}
