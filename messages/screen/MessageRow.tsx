import { Image } from 'expo-image';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { Attachment, Message } from '../types';
import { VoiceMessageBubble } from '../VoiceMessageBubble';
import { isVoiceAttachment } from './messagesScreenHelpers';
import { styles } from './messagesScreenStyles';

type Props = {
  m: Message;
  mine: boolean;
  onImagePress: (url: string, name: string) => void;
};

export function MessageRow({ m, mine, onImagePress }: Props) {
  return (
    <View style={[styles.msgRow, mine ? styles.msgRowMine : styles.msgRowTheirs]}>
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        {!!m.text && <Text style={styles.msgText}>{m.text}</Text>}
        {!!m.attachments?.length && (
          <View style={{ marginTop: m.text ? 8 : 0, gap: 8 }}>
            {m.attachments.map((a: Attachment) => (
              <View key={a.id}>
                {isVoiceAttachment(a) ? (
                  <VoiceMessageBubble uri={a.url} mine={mine} durationSec={a.durationSec} />
                ) : a.type === 'image' ? (
                  <Pressable onPress={() => onImagePress(a.url, a.name ?? '')}>
                    <Image source={{ uri: a.url }} style={styles.attImg} contentFit="cover" />
                  </Pressable>
                ) : (
                  <Text style={styles.fileChip}>📎 {a.name || 'File'}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
