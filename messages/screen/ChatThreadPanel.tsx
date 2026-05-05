import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as React from 'react';
import type { RefObject } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import { RED } from '../constants';
import type { AnimatedBg } from '../animatedBackgrounds';
import { AnimatedBackgroundLayer } from '../animatedBackgrounds';
import type { ID, Message, Thread, User } from '../types';
import { activityText } from '../utils';
import { VoiceRecordButton } from '../VoiceRecordButton';
import { isGroupThread } from './messagesScreenHelpers';
import { MessageRow } from './MessageRow';
import type { DraftState } from './messagesScreenTypes';
import { styles } from './messagesScreenStyles';

export type ChatThreadPanelProps = {
  meId: ID;
  isCompact: boolean;
  selectedThreadId: ID | null;
  onBackList: () => void;
  selectedThread: Thread | null;
  otherUser: User | null;
  groupParticipants: User[];
  groupPictureByThreadId: Record<string, string>;
  animBg: AnimatedBg | null | undefined;
  customBg: string | undefined;
  bgSource: ImageSourcePropType | null | undefined;
  scrollRef: RefObject<ScrollView | null>;
  threadMessages: Message[];
  onImagePress: (url: string, name: string) => void;
  selectedDraft: DraftState;
  setDraft: (updater: (prev: DraftState) => DraftState) => void;
  pickImages: () => void;
  handleSend: () => void;
  onOpenGifPicker: () => void;
  nowMs: number;
  onOpenThreadMenu: () => void;
};

export function ChatThreadPanel({
  meId,
  isCompact,
  selectedThreadId,
  onBackList,
  selectedThread,
  otherUser,
  groupParticipants,
  groupPictureByThreadId,
  animBg,
  customBg,
  bgSource,
  scrollRef,
  threadMessages,
  onImagePress,
  selectedDraft,
  setDraft,
  pickImages,
  handleSend,
  onOpenGifPicker,
  nowMs,
  onOpenThreadMenu,
}: ChatThreadPanelProps) {
  const hasBg = !!(animBg || customBg || bgSource);

  return (
    <View style={[styles.chatCol, isCompact && selectedThreadId ? { flex: 1 } : { flex: 1 }]}>
      <View style={styles.chatHeader}>
        {isCompact && selectedThreadId ? (
          <Pressable onPress={onBackList} style={styles.backInline}>
            <Ionicons name="arrow-back" size={22} color="#111" />
          </Pressable>
        ) : null}
        {selectedThread && isGroupThread(selectedThread) ? (
          <>
            {groupPictureByThreadId[selectedThread.id] ? (
              <Image
                source={{ uri: groupPictureByThreadId[selectedThread.id] }}
                style={styles.headerAvatar}
              />
            ) : (
              <View style={[styles.headerAvatar, styles.groupPh]}>
                <Ionicons name="people" size={20} color="#666" />
              </View>
            )}
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {selectedThread.name ?? 'Group chat'}
              </Text>
              <Text style={styles.headerSub} numberOfLines={1}>
                {groupParticipants.map((p) => p.displayName).join(', ')}
              </Text>
            </View>
          </>
        ) : otherUser ? (
          <>
            <Image source={{ uri: otherUser.avatarUrl }} style={styles.headerAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>{otherUser.displayName}</Text>
              <Text style={styles.headerSub}>{activityText(nowMs, otherUser.lastActiveAt)}</Text>
            </View>
          </>
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Your messages</Text>
            <Text style={styles.headerSub}>Select a conversation.</Text>
          </View>
        )}
        {(otherUser || (selectedThread && isGroupThread(selectedThread))) && (
          <Pressable onPress={onOpenThreadMenu} hitSlop={8}>
            <Ionicons name="ellipsis-horizontal" size={22} color="#333" />
          </Pressable>
        )}
      </View>

      <View style={styles.chatBody}>
        {animBg ? <AnimatedBackgroundLayer config={animBg} /> : null}
        {!animBg && customBg ? (
          <ImageBackground
            source={{ uri: customBg }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : null}
        {!animBg && !customBg && bgSource ? (
          <ImageBackground source={bgSource} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : null}

        <ScrollView
          ref={scrollRef}
          style={styles.msgScroll}
          contentContainerStyle={[
            styles.msgScrollContent,
            hasBg ? styles.msgScrollFrost : undefined,
          ]}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {!selectedThread || (!otherUser && !isGroupThread(selectedThread)) ? (
            <View style={styles.emptyChat}>
              <Ionicons name="send-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Your messages</Text>
              <Text style={styles.emptySub}>Send a message to start a chat.</Text>
            </View>
          ) : (
            <>
              {selectedThread.isRequest && (
                <View style={styles.reqBanner}>
                  <Text style={styles.reqBannerTitle}>Message request</Text>
                  <Text style={styles.reqBannerSub}>
                    You can respond, delete, or report this request.
                  </Text>
                </View>
              )}
              {threadMessages.map((m) => (
                <MessageRow
                  key={m.id}
                  m={m}
                  mine={m.fromUserId === meId}
                  onImagePress={onImagePress}
                />
              ))}
            </>
          )}
        </ScrollView>
      </View>

      <View style={styles.composer}>
        {(selectedDraft.locals.length > 0 || selectedDraft.gifs.length > 0) && (
          <ScrollView horizontal style={styles.chipsRow}>
            {selectedDraft.locals.map((f, idx) => (
              <Pressable
                key={`${f.uri}-${idx}`}
                onPress={() =>
                  setDraft((p) => ({
                    ...p,
                    locals: p.locals.filter((_, i) => i !== idx),
                  }))
                }
                style={styles.chip}
              >
                <Text style={styles.chipText} numberOfLines={1}>
                  {f.mime.startsWith('audio') ? 'Voice' : f.name}
                </Text>
                <Ionicons name="close-circle" size={18} color="#666" />
              </Pressable>
            ))}
            {selectedDraft.gifs.map((g, idx) => (
              <Pressable
                key={`${g.id}-${idx}`}
                onPress={() =>
                  setDraft((p) => ({
                    ...p,
                    gifs: p.gifs.filter((_, i) => i !== idx),
                  }))
                }
                style={styles.chip}
              >
                <Text style={styles.chipText}>GIF</Text>
                <Ionicons name="close-circle" size={18} color="#666" />
              </Pressable>
            ))}
          </ScrollView>
        )}
        <View style={styles.composerRow}>
          <Pressable
            onPress={() => void pickImages()}
            disabled={!selectedThread}
            style={styles.iconBtn}
          >
            <Ionicons name="attach" size={22} color={selectedThread ? '#333' : '#ccc'} />
          </Pressable>
          <VoiceRecordButton
            disabled={!selectedThread}
            onRecorded={(uri, durationSec, name) => {
              setDraft((p) => ({
                ...p,
                locals: [...p.locals, { uri, name, mime: 'audio/m4a', durationSec }].slice(0, 12),
              }));
            }}
          />
          <Pressable
            disabled={!selectedThread}
            onPress={onOpenGifPicker}
            style={styles.iconBtn}
          >
            <Ionicons
              name="images-outline"
              size={22}
              color={selectedThread ? '#333' : '#ccc'}
            />
          </Pressable>
          <TextInput
            style={styles.input}
            value={selectedDraft.text}
            onChangeText={(t) => setDraft((p) => ({ ...p, text: t }))}
            placeholder={selectedThread ? 'Message…' : 'Select a conversation'}
            placeholderTextColor="#9CA3AF"
            editable={!!selectedThread}
            multiline
            maxLength={4000}
          />
          <Pressable
            onPress={() => void handleSend()}
            disabled={!selectedThread}
            style={styles.iconBtn}
          >
            <Ionicons name="send" size={22} color={selectedThread ? RED : '#ccc'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
