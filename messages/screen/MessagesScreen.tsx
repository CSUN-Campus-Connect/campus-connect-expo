import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabs } from '@/dashboard/components/BottomTabs';
import type { AnimatedBg } from '../animatedBackgrounds';
import { BACKGROUND_SOURCES } from '../backgroundSources';
import { ME_ID } from '../constants';
import { MessageSettingsModal } from '../MessageSettingsModal';
import { consumeOpenMessagesInboxIntent } from '../messagesTabIntent';
import { loadGifFavorites, saveGifFavorites } from '../messagesStorage';
import type { ID, OutgoingAttachment, User } from '../types';
import { GIF_LIST, isThreadUnread } from '../utils';
import { useMessagesData } from '../useMessagesData';
import { ChatThreadPanel } from './ChatThreadPanel';
import { ConversationListPanel } from './ConversationListPanel';
import { isGroupThread } from './messagesScreenHelpers';
import { emptyDraft, type DraftState } from './messagesScreenTypes';
import { styles } from './messagesScreenStyles';
import { CreateGroupModal } from './modals/CreateGroupModal';
import { GifPickerModal } from './modals/GifPickerModal';
import { ImageViewerModal } from './modals/ImageViewerModal';
import { NewMessageModal } from './modals/NewMessageModal';
import { NoteModal } from './modals/NoteModal';
import { ReportModal } from './modals/ReportModal';
import { ThreadMenuModal } from './modals/ThreadMenuModal';

export function MessagesScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();
  const isCompact = width < 640;

  const data = useMessagesData();
  const {
    me,
    threads,
    usersWithMe: users,
    notes,
    allMessages,
    threadMessages,
    selectedThreadId,
    setSelectedThreadId,
    onSend,
    onUpdateNote,
    onPickUser,
    onCreateGroup,
    groupPictureByThreadId,
    refresh,
  } = data;

  const [activeTab, setActiveTab] = React.useState<'messages' | 'requests'>('messages');
  const [threadSearch, setThreadSearch] = React.useState('');
  const [blockedUserIds, setBlockedUserIds] = React.useState<Set<ID>>(new Set());
  const [reportedThreadIds, setReportedThreadIds] = React.useState<Set<ID>>(new Set());
  const [newMsgOpen, setNewMsgOpen] = React.useState(false);
  const [createGroupOpen, setCreateGroupOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsTab, setSettingsTab] = React.useState<
    'backgrounds' | 'pins' | 'blocked' | 'followers' | 'notifications'
  >('backgrounds');
  const [muteNotifications, setMuteNotifications] = React.useState(false);
  const [doNotDisturb, setDoNotDisturb] = React.useState(false);
  const [backgroundApplyToThreadIds, setBackgroundApplyToThreadIds] = React.useState<Set<ID>>(
    new Set()
  );
  const [followerQuery, setFollowerQuery] = React.useState('');
  const [pinnedThreadIds, setPinnedThreadIds] = React.useState<Set<ID>>(new Set());
  const [pinnedOrder, setPinnedOrder] = React.useState<ID[]>([]);
  const [backgroundByThreadId, setBackgroundByThreadId] = React.useState<Record<ID, number | null>>(
    {}
  );
  const [animatedBackgroundByThreadId, setAnimatedBackgroundByThreadId] = React.useState<
    Record<ID, AnimatedBg>
  >({});
  const [customBackgroundByThreadId, setCustomBackgroundByThreadId] = React.useState<
    Record<ID, string>
  >({});
  const [leftGroupThreadIds, setLeftGroupThreadIds] = React.useState<Set<ID>>(new Set());
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [gifOpen, setGifOpen] = React.useState(false);
  const [gifTab, setGifTab] = React.useState<'all' | 'favorites'>('all');
  const [imgView, setImgView] = React.useState({ open: false, url: '', name: '' });
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportReason, setReportReason] = React.useState('');
  const [reportDetails, setReportDetails] = React.useState('');
  const [gifFavorites, setGifFavorites] = React.useState<string[]>([]);
  const [draftByThreadId, setDraftByThreadId] = React.useState<Record<ID, DraftState>>({});
  const [nowMs, setNowMs] = React.useState(Date.now());
  const [menuOpen, setMenuOpen] = React.useState(false);

  const [newMsgQuery, setNewMsgQuery] = React.useState('');
  const [noteText, setNoteText] = React.useState('');
  const [createGroupQuery, setCreateGroupQuery] = React.useState('');
  const [createGroupSelected, setCreateGroupSelected] = React.useState<Set<ID>>(new Set());
  const [createGroupName, setCreateGroupName] = React.useState('');
  const [createGroupPictureUri, setCreateGroupPictureUri] = React.useState<string>('');

  const scrollRef = React.useRef<ScrollView>(null);

  const resetToMessagingHub = React.useCallback(() => {
    setSelectedThreadId(null);
    setActiveTab('messages');
  }, [setSelectedThreadId]);

  const wasFocusedRef = React.useRef(false);
  React.useLayoutEffect(() => {
    const becameFocused = isFocused && !wasFocusedRef.current;
    wasFocusedRef.current = isFocused;
    if (!becameFocused) return;
    if (consumeOpenMessagesInboxIntent()) {
      resetToMessagingHub();
    }
  }, [isFocused, resetToMessagingHub]);

  React.useEffect(() => {
    void loadGifFavorites().then(setGifFavorites);
  }, []);

  React.useEffect(() => {
    void saveGifFavorites(gifFavorites);
  }, [gifFavorites]);

  React.useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [selectedThreadId, threadMessages.length]);

  const userById = React.useMemo(() => {
    const map = new Map<ID, User>(users.map((u) => [u.id, u]));
    if (!map.has(ME_ID)) map.set(ME_ID, me);
    return map;
  }, [users, me]);

  const selectedThread = React.useMemo(
    () => (selectedThreadId ? threads.find((t) => t.id === selectedThreadId) ?? null : null),
    [threads, selectedThreadId]
  );

  const otherUser = React.useMemo(() => {
    if (!selectedThread) return null;
    if (isGroupThread(selectedThread)) return null;
    const otherId = selectedThread.participantIds.find((id) => id !== ME_ID);
    return otherId ? userById.get(otherId) ?? null : null;
  }, [selectedThread, userById]);

  const groupParticipants = React.useMemo(() => {
    if (!selectedThread || !isGroupThread(selectedThread)) return [];
    return selectedThread.participantIds
      .filter((id) => id !== ME_ID)
      .map((id) => userById.get(id))
      .filter((u): u is User => !!u);
  }, [selectedThread, userById]);

  const backgroundPreviewTid =
    backgroundApplyToThreadIds.size > 0 ? Array.from(backgroundApplyToThreadIds)[0]! : selectedThreadId;

  const myNoteText = notes.find((n) => n.userId === ME_ID)?.text ?? '';
  const requestsCount = threads.filter((t) => t.isRequest).length;

  React.useEffect(() => {
    if (noteOpen) setNoteText(myNoteText);
  }, [noteOpen, myNoteText]);

  const togglePinThread = React.useCallback((threadId: ID) => {
    setPinnedThreadIds((prev) => {
      const next = new Set(prev);
      if (next.has(threadId)) next.delete(threadId);
      else if (prev.size < 3) next.add(threadId);
      return next;
    });
    setPinnedOrder((prev) => {
      if (prev.includes(threadId)) return prev.filter((id) => id !== threadId);
      return prev.length >= 3 ? prev : [threadId, ...prev];
    });
  }, []);

  const visibleThreads = React.useMemo(() => {
    const q = threadSearch.trim().toLowerCase();
    const base = threads
      .filter((t) => (activeTab === 'requests' ? !!t.isRequest : !t.isRequest))
      .filter((t) => !reportedThreadIds.has(t.id))
      .filter((t) => !leftGroupThreadIds.has(t.id))
      .filter((t) => {
        if (isGroupThread(t)) {
          const hasBlocked = t.participantIds.some((id) => id !== ME_ID && blockedUserIds.has(id));
          if (hasBlocked) return false;
          if (!q) return true;
          const names = t.participantIds
            .map((id) => userById.get(id)?.displayName ?? userById.get(id)?.username ?? '')
            .join(' ');
          const recent = allMessages
            .filter((m) => m.threadId === t.id)
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 25)
            .map((m) => m.text)
            .join(' ');
          return `${t.name ?? 'Group'} ${names} ${recent}`.toLowerCase().includes(q);
        }
        const otherId = t.participantIds.find((id) => id !== ME_ID);
        if (!otherId || blockedUserIds.has(otherId)) return false;
        if (!q) return true;
        const other = userById.get(otherId);
        const who = other ? `${other.displayName} @${other.username}` : '';
        const recent = allMessages
          .filter((m) => m.threadId === t.id)
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 25)
          .map((m) => m.text)
          .join(' ');
        return `${who} ${recent}`.toLowerCase().includes(q);
      });
    const pinnedRank = (id: ID) => {
      if (!pinnedThreadIds.has(id)) return null;
      const idx = pinnedOrder.indexOf(id);
      return idx === -1 ? 999 : idx;
    };
    return base.sort((a, b) => {
      const ar = pinnedRank(a.id);
      const br = pinnedRank(b.id);
      if (ar !== null || br !== null) {
        if (ar === null) return 1;
        if (br === null) return -1;
        if (ar !== br) return ar - br;
      }
      const au = isThreadUnread(allMessages, a.id, ME_ID) ? 1 : 0;
      const bu = isThreadUnread(allMessages, b.id, ME_ID) ? 1 : 0;
      if (au !== bu) return bu - au;
      return b.updatedAt - a.updatedAt;
    });
  }, [
    threads,
    activeTab,
    reportedThreadIds,
    leftGroupThreadIds,
    blockedUserIds,
    threadSearch,
    userById,
    allMessages,
    pinnedThreadIds,
    pinnedOrder,
  ]);

  const selectedDraft = selectedThreadId
    ? draftByThreadId[selectedThreadId] ?? emptyDraft()
    : emptyDraft();

  const setDraft = React.useCallback(
    (updater: (prev: DraftState) => DraftState) => {
      if (!selectedThreadId) return;
      setDraftByThreadId((prev) => ({
        ...prev,
        [selectedThreadId]: updater(prev[selectedThreadId] ?? emptyDraft()),
      }));
    },
    [selectedThreadId]
  );

  const pickImages = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (r.canceled) return;
    setDraft((prev) => ({
      ...prev,
      locals: [
        ...prev.locals,
        ...r.assets.map((a, i) => ({
          uri: a.uri,
          name: a.fileName ?? `image-${i}.jpg`,
          mime: 'image/jpeg',
        })),
      ].slice(0, 12),
    }));
  };

  const addGif = React.useCallback(
    (url: string) => {
      setDraft((prev) => ({
        ...prev,
        gifs: [
          ...prev.gifs,
          { id: `gif_${Date.now()}`, type: 'image' as const, name: 'GIF', url },
        ].slice(0, 12),
      }));
    },
    [setDraft]
  );

  const handleSend = React.useCallback(async () => {
    if (!selectedThread || !selectedThreadId) return;
    const text = selectedDraft.text.trim();
    const parts: OutgoingAttachment[] = [];
    for (const g of selectedDraft.gifs) {
      parts.push({ uri: g.url, type: 'image', name: 'GIF' });
    }
    for (const f of selectedDraft.locals) {
      const isAudio = f.mime.startsWith('audio');
      const isImage = f.mime.startsWith('image');
      parts.push({
        uri: f.uri,
        type: isAudio ? 'audio' : isImage ? 'image' : 'file',
        name: f.name,
        ...(isAudio && f.durationSec != null ? { durationSec: f.durationSec } : {}),
      });
    }
    if (!text && parts.length === 0) return;
    await onSend(selectedThread.id, text || '', parts.length ? parts : undefined);
    setDraftByThreadId((prev) => ({ ...prev, [selectedThreadId]: emptyDraft() }));
  }, [selectedThread, selectedThreadId, selectedDraft, onSend]);

  const openReport = () => {
    setReportReason('');
    setReportDetails('');
    setReportOpen(true);
  };

  const openReportForThread = (threadId: ID) => {
    setSelectedThreadId(threadId);
    openReport();
  };

  const submitReport = () => {
    if (selectedThread) {
      setReportedThreadIds((prev) => new Set([...prev, selectedThread.id]));
      setSelectedThreadId(null);
      setReportOpen(false);
      refresh();
    }
  };

  const handleBlock = () => {
    if (otherUser) {
      setBlockedUserIds((prev) => new Set([...prev, otherUser.id]));
      setSelectedThreadId(null);
      refresh();
    }
  };

  const leaveGroup = () => {
    if (!selectedThread || !isGroupThread(selectedThread)) return;
    setLeftGroupThreadIds((prev) => new Set([...prev, selectedThread.id]));
    setMenuOpen(false);
    setSelectedThreadId(null);
    refresh();
  };

  const acceptRequest = (threadId: ID) => {
    setSelectedThreadId(threadId);
    setActiveTab('messages');
    refresh();
  };

  const deleteThread = (threadId: ID) => {
    setDraftByThreadId((prev) => {
      const c = { ...prev };
      delete c[threadId];
      return c;
    });
    if (selectedThreadId === threadId) setSelectedThreadId(null);
    refresh();
  };

  const filteredNewMsg = React.useMemo(() => {
    const q = newMsgQuery.trim().toLowerCase();
    return users
      .filter((u) => u.id !== ME_ID && !blockedUserIds.has(u.id))
      .filter(
        (u) => !q || u.username.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [newMsgQuery, users, blockedUserIds]);

  const createGroupFiltered = React.useMemo(() => {
    const q = createGroupQuery.trim().toLowerCase();
    return users
      .filter((u) => u.id !== ME_ID && !blockedUserIds.has(u.id))
      .filter(
        (u) => !q || u.username.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [createGroupQuery, users, blockedUserIds]);

  const visibleGifs = React.useMemo(() => {
    if (gifTab === 'favorites') return GIF_LIST.filter((g) => gifFavorites.includes(g.url));
    return GIF_LIST;
  }, [gifTab, gifFavorites]);

  const bgId = selectedThreadId ? backgroundByThreadId[selectedThreadId] : null;
  const bgSource = bgId ? BACKGROUND_SOURCES.find((b) => b.id === bgId)?.source : null;
  const customBg = selectedThreadId ? customBackgroundByThreadId[selectedThreadId] : undefined;
  const animBg = selectedThreadId ? animatedBackgroundByThreadId[selectedThreadId] : null;

  const showList = !isCompact || !selectedThreadId;
  const showChat = !isCompact || !!selectedThreadId;

  const notesSorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#111" />
          </Pressable>
          <Text style={styles.topTitle}>Messages</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.mainRow}>
          {showList && (
            <ConversationListPanel
              me={me}
              meId={ME_ID}
              isCompact={isCompact}
              selectedThreadId={selectedThreadId}
              threadSearch={threadSearch}
              onThreadSearchChange={setThreadSearch}
              onOpenSettings={() => {
                setSettingsTab('backgrounds');
                setSettingsOpen(true);
              }}
              onOpenCreateGroup={() => setCreateGroupOpen(true)}
              onOpenNewMessage={() => setNewMsgOpen(true)}
              notesSorted={notesSorted}
              userById={userById}
              onPickUser={onPickUser}
              onOpenNote={() => setNoteOpen(true)}
              activeTab={activeTab}
              onActiveTabChange={setActiveTab}
              requestsCount={requestsCount}
              visibleThreads={visibleThreads}
              allMessages={allMessages}
              nowMs={nowMs}
              groupPictureByThreadId={groupPictureByThreadId}
              onSelectThread={setSelectedThreadId}
              onTogglePin={togglePinThread}
              pinnedThreadIds={pinnedThreadIds}
              onAcceptRequest={acceptRequest}
              onDeleteThread={deleteThread}
              onOpenReportForThread={openReportForThread}
            />
          )}

          {showChat && (
            <ChatThreadPanel
              meId={ME_ID}
              isCompact={isCompact}
              selectedThreadId={selectedThreadId}
              onBackList={() => setSelectedThreadId(null)}
              selectedThread={selectedThread}
              otherUser={otherUser}
              groupParticipants={groupParticipants}
              groupPictureByThreadId={groupPictureByThreadId}
              animBg={animBg}
              customBg={customBg}
              bgSource={bgSource ?? undefined}
              scrollRef={scrollRef}
              threadMessages={threadMessages}
              onImagePress={(url, name) => setImgView({ open: true, url, name })}
              selectedDraft={selectedDraft}
              setDraft={setDraft}
              pickImages={pickImages}
              handleSend={handleSend}
              onOpenGifPicker={() => setGifOpen(true)}
              nowMs={nowMs}
              onOpenThreadMenu={() => setMenuOpen(true)}
            />
          )}
        </View>
      </KeyboardAvoidingView>

      <BottomTabs activeTab="messages" onMessagesHubPress={resetToMessagingHub} />

      <ThreadMenuModal
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        hasOtherUser={!!otherUser}
        onReport={openReport}
        onBlock={handleBlock}
        onLeaveGroup={leaveGroup}
      />

      <NewMessageModal
        visible={newMsgOpen}
        onClose={() => setNewMsgOpen(false)}
        query={newMsgQuery}
        onQueryChange={setNewMsgQuery}
        users={filteredNewMsg}
        onPickUser={onPickUser}
      />

      <NoteModal
        visible={noteOpen}
        onClose={() => setNoteOpen(false)}
        noteText={noteText}
        onNoteTextChange={setNoteText}
        onSave={() => {
          void onUpdateNote(noteText.trim());
          setNoteOpen(false);
        }}
      />

      <GifPickerModal
        visible={gifOpen}
        onClose={() => setGifOpen(false)}
        gifTab={gifTab}
        onGifTab={setGifTab}
        visibleGifs={visibleGifs}
        gifFavorites={gifFavorites}
        onToggleFavorite={(url) =>
          setGifFavorites((prev) =>
            prev.includes(url) ? prev.filter((x) => x !== url) : [...prev, url]
          )
        }
        onSelectGif={(url) => {
          addGif(url);
          setGifOpen(false);
        }}
      />

      <ImageViewerModal
        visible={imgView.open}
        url={imgView.url}
        name={imgView.name}
        onClose={() => setImgView({ open: false, url: '', name: '' })}
      />

      <ReportModal
        visible={reportOpen}
        onClose={() => setReportOpen(false)}
        reportReason={reportReason}
        onReasonChange={setReportReason}
        reportDetails={reportDetails}
        onDetailsChange={setReportDetails}
        onSubmit={submitReport}
      />

      <CreateGroupModal
        visible={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        createGroupName={createGroupName}
        onCreateGroupNameChange={setCreateGroupName}
        createGroupPictureUri={createGroupPictureUri}
        onCreateGroupPictureUriChange={setCreateGroupPictureUri}
        createGroupQuery={createGroupQuery}
        onCreateGroupQueryChange={setCreateGroupQuery}
        createGroupFiltered={createGroupFiltered}
        createGroupSelected={createGroupSelected}
        onToggleMember={(id) =>
          setCreateGroupSelected((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
          })
        }
        onCreate={(participantIds, name, pictureUri) => {
          void onCreateGroup(participantIds, name, pictureUri);
          setCreateGroupOpen(false);
        }}
      />

      <MessageSettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settingsTab={settingsTab}
        onTab={setSettingsTab}
        threads={threads}
        meId={ME_ID}
        users={users}
        userById={userById}
        isGroupThread={isGroupThread}
        blockedUserIds={blockedUserIds}
        setBlockedUserIds={setBlockedUserIds}
        pinnedThreadIds={pinnedThreadIds}
        togglePinThread={togglePinThread}
        backgroundApplyToThreadIds={backgroundApplyToThreadIds}
        setBackgroundApplyToThreadIds={setBackgroundApplyToThreadIds}
        backgroundByThreadId={backgroundByThreadId}
        setBackgroundByThreadId={setBackgroundByThreadId}
        animatedBackgroundByThreadId={animatedBackgroundByThreadId}
        setAnimatedBackgroundByThreadId={setAnimatedBackgroundByThreadId}
        customBackgroundByThreadId={customBackgroundByThreadId}
        setCustomBackgroundByThreadId={setCustomBackgroundByThreadId}
        leftGroupThreadIds={leftGroupThreadIds}
        groupPictureByThreadId={groupPictureByThreadId}
        selectedThreadId={selectedThreadId}
        backgroundPreviewTid={backgroundPreviewTid}
        onOpenCreateGroup={() => {
          setSettingsOpen(false);
          setCreateGroupOpen(true);
        }}
        onPickUser={onPickUser}
        muteNotifications={muteNotifications}
        setMuteNotifications={setMuteNotifications}
        doNotDisturb={doNotDisturb}
        setDoNotDisturb={setDoNotDisturb}
        followerQuery={followerQuery}
        setFollowerQuery={setFollowerQuery}
      />
    </SafeAreaView>
  );
}
