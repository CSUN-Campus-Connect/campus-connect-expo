import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as React from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { RED } from '../constants';
import type { ID, Message, Note, Thread, User } from '../types';
import { formatAgo, getLastMessage, isThreadUnread } from '../utils';
import { isGroupThread } from './messagesScreenHelpers';
import { styles } from './messagesScreenStyles';

export type ConversationListPanelProps = {
  me: User;
  meId: ID;
  isCompact: boolean;
  selectedThreadId: ID | null;
  threadSearch: string;
  onThreadSearchChange: (q: string) => void;
  onOpenSettings: () => void;
  onOpenCreateGroup: () => void;
  onOpenNewMessage: () => void;
  notesSorted: Note[];
  userById: Map<ID, User>;
  onPickUser: (id: ID) => void;
  onOpenNote: () => void;
  activeTab: 'messages' | 'requests';
  onActiveTabChange: (t: 'messages' | 'requests') => void;
  requestsCount: number;
  visibleThreads: Thread[];
  allMessages: Message[];
  nowMs: number;
  groupPictureByThreadId: Record<string, string>;
  onSelectThread: (id: ID) => void;
  onTogglePin: (id: ID) => void;
  pinnedThreadIds: Set<ID>;
  onAcceptRequest: (id: ID) => void;
  onDeleteThread: (id: ID) => void;
  onOpenReportForThread: (id: ID) => void;
};

export function ConversationListPanel({
  me,
  meId,
  isCompact,
  selectedThreadId,
  threadSearch,
  onThreadSearchChange,
  onOpenSettings,
  onOpenCreateGroup,
  onOpenNewMessage,
  notesSorted,
  userById,
  onPickUser,
  onOpenNote,
  activeTab,
  onActiveTabChange,
  requestsCount,
  visibleThreads,
  allMessages,
  nowMs,
  groupPictureByThreadId,
  onSelectThread,
  onTogglePin,
  pinnedThreadIds,
  onAcceptRequest,
  onDeleteThread,
  onOpenReportForThread,
}: ConversationListPanelProps) {
  return (
    <View
      style={[
        styles.listCol,
        isCompact && !selectedThreadId ? { flex: 1 } : { width: 320, flexShrink: 0 },
      ]}
    >
      <View style={styles.listHeader}>
        <Image source={{ uri: me.avatarUrl }} style={styles.meAvatar} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.meName} numberOfLines={1}>
            {me.username}
          </Text>
        </View>
        <Pressable onPress={onOpenSettings} hitSlop={8}>
          <Ionicons name="settings-outline" size={22} color="#333" />
        </Pressable>
        <Pressable onPress={onOpenCreateGroup} hitSlop={8}>
          <Ionicons name="people-outline" size={22} color="#333" />
        </Pressable>
        <Pressable onPress={onOpenNewMessage} hitSlop={8}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={RED} />
        </Pressable>
      </View>

      <TextInput
        value={threadSearch}
        onChangeText={onThreadSearchChange}
        placeholder="Search conversations"
        style={styles.threadSearch}
        placeholderTextColor="#9CA3AF"
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.notesStrip}>
        {notesSorted.map((n) => {
          const u = userById.get(n.userId);
          if (!u) return null;
          const isMe = n.userId === meId;
          return (
            <Pressable
              key={n.id}
              onPress={() => (isMe ? onOpenNote() : onPickUser(n.userId))}
              style={styles.noteItem}
            >
              <Image
                source={{ uri: u.avatarUrl }}
                style={[styles.noteAvatar, isMe && { borderColor: RED, borderWidth: 2 }]}
              />
              <Text style={styles.noteName} numberOfLines={1}>
                {isMe ? 'Your note' : u.displayName.split(' ')[0]}
              </Text>
              <Text style={styles.noteText} numberOfLines={1}>
                {n.text}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.tabRow}>
        <Pressable
          onPress={() => onActiveTabChange('messages')}
          style={[styles.tabBtn, activeTab === 'messages' && styles.tabBtnOn]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'messages' && styles.tabBtnTextOn]}>
            Messages
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onActiveTabChange('requests')}
          style={[styles.tabBtn, activeTab === 'requests' && styles.tabBtnOn]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'requests' && styles.tabBtnTextOn]}>
            Requests ({requestsCount})
          </Text>
        </Pressable>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={visibleThreads}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingBottom: 12 }}
        renderItem={({ item: t }) => {
          const isG = isGroupThread(t);
          const otherId = t.participantIds.find((id) => id !== meId);
          const other = otherId ? userById.get(otherId) : null;
          if (!isG && !other) return null;
          const last = getLastMessage(allMessages, t.id);
          const unread = isThreadUnread(allMessages, t.id, meId);
          const lastText =
            last?.text || (last?.attachments?.length ? 'Sent an attachment' : 'Say hi');
          const displayName = isG ? t.name ?? 'Group chat' : other!.displayName;
          return (
            <View style={styles.threadWrap}>
              <Pressable
                onPress={() => onSelectThread(t.id)}
                style={[styles.threadRow, selectedThreadId === t.id && styles.threadRowSelected]}
              >
                <View style={styles.threadLeft}>
                  {unread && <View style={styles.unreadDot} />}
                  {isG ? (
                    groupPictureByThreadId[t.id] ? (
                      <Image
                        source={{ uri: groupPictureByThreadId[t.id] }}
                        style={styles.threadAvatar}
                      />
                    ) : (
                      <View style={[styles.threadAvatar, styles.groupPh]}>
                        <Ionicons name="people" size={22} color="#666" />
                      </View>
                    )
                  ) : (
                    <Image source={{ uri: other!.avatarUrl }} style={styles.threadAvatar} />
                  )}
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={styles.threadTop}>
                      <Text
                        style={[styles.threadName, unread && { fontWeight: '900' }]}
                        numberOfLines={1}
                      >
                        {displayName}
                      </Text>
                      <Text style={styles.threadTime}>
                        {last ? formatAgo(nowMs, last.createdAt) : ''}
                      </Text>
                    </View>
                    <Text
                      style={[styles.threadPreview, unread && { fontWeight: '800' }]}
                      numberOfLines={1}
                    >
                      {lastText}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onTogglePin(t.id);
                  }}
                  hitSlop={8}
                  disabled={!pinnedThreadIds.has(t.id) && pinnedThreadIds.size >= 3}
                  style={{
                    opacity: pinnedThreadIds.has(t.id) || pinnedThreadIds.size < 3 ? 1 : 0.35,
                  }}
                >
                  <Ionicons
                    name={pinnedThreadIds.has(t.id) ? 'pin' : 'pin-outline'}
                    size={20}
                    color={RED}
                  />
                </Pressable>
              </Pressable>
              {t.isRequest && activeTab === 'requests' && (
                <View style={styles.reqActions}>
                  <Pressable
                    onPress={() => onAcceptRequest(t.id)}
                    style={[styles.reqBtn, styles.reqBtnPrimary]}
                  >
                    <Text style={styles.reqBtnTextPrimary}>Respond</Text>
                  </Pressable>
                  <Pressable onPress={() => onDeleteThread(t.id)} style={styles.reqBtn}>
                    <Text style={styles.reqBtnText}>Delete</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onOpenReportForThread(t.id)}
                    style={styles.reqBtn}
                  >
                    <Text style={styles.reqBtnText}>Report</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
