import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '../messagesScreenStyles';

type Props = {
  visible: boolean;
  url: string;
  name: string;
  onClose: () => void;
};

export function ImageViewerModal({ visible, url, name, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="fade">
      <SafeAreaView style={[styles.modalScreen, { backgroundColor: '#000' }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: '#fff' }]}>{name || 'Image'}</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={26} color="#fff" />
          </Pressable>
        </View>
        {url ? <Image source={{ uri: url }} style={styles.fullImg} contentFit="contain" /> : null}
      </SafeAreaView>
    </Modal>
  );
}
