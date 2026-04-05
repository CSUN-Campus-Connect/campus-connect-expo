import { useCallback, useMemo, useState } from 'react';
import { ME_ID } from './constants';
import { consumeOpenMessagesInboxIntent } from './messagesTabIntent';
import { mockMessagesByThread, mockNotes, mockThreads, mockUsers } from './mockData';
import type { ID, Message, Note, OutgoingAttachment, Thread, User } from './types';

const placeholderMe: User = {
  id: ME_ID,
  username: 'me',
  displayName: 'You',
  avatarUrl: '',
  lastActiveAt: 1700000000000,
};

export function useMessagesData() {
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [messagesByThread, setMessagesByThread] =
    useState<Record<string, Message[]>>(mockMessagesByThread);
  
  const [selectedThreadId, setSelectedThreadId] = useState<ID | null>(() => {
    consumeOpenMessagesInboxIntent();
    return null;
  });

  const usersWithMe = useMemo(
    () => (users.some((u) => u.id === ME_ID) ? users : [placeholderMe, ...users]),
    [users]
  );
  const me = useMemo(
    () => usersWithMe.find((u) => u.id === ME_ID) ?? placeholderMe,
    [usersWithMe]
  );
  const allMessages = useMemo(() => Object.values(messagesByThread).flat(), [messagesByThread]);
  const threadMessages = useMemo(
    () => (selectedThreadId ? messagesByThread[selectedThreadId] ?? [] : []),
    [selectedThreadId, messagesByThread]
  );

  const onSend = useCallback(
    async (threadId: string, text: string, parts?: OutgoingAttachment[]) => {
      const attachments =
        parts?.map((p, i) => ({
          id: `opt-${Date.now()}-${i}`,
          type: p.type,
          name: p.name,
          url: p.uri,
          ...(p.durationSec != null ? { durationSec: p.durationSec } : {}),
        })) ?? [];
      const newMsg: Message = {
        id: `opt-${Date.now()}`,
        threadId,
        fromUserId: ME_ID,
        text,
        createdAt: Date.now(),
        ...(attachments.length > 0 ? { attachments } : {}),
      };
      setMessagesByThread((prev) => ({
        ...prev,
        [threadId]: [...(prev[threadId] ?? []), newMsg],
      }));
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, updatedAt: Date.now() } : t))
      );
    },
    []
  );

  const onUpdateNote = useCallback(async (text: string) => {
    setNotes((prev) => {
      const withoutMe = prev.filter((n) => n.userId !== ME_ID);
      return [
        { id: 'n_me', userId: ME_ID, text: text.slice(0, 60), updatedAt: Date.now() },
        ...withoutMe,
      ];
    });
  }, []);

  const onPickUser = useCallback(
    async (userId: ID) => {
      if (userId === ME_ID) return;
      const existing = threads.find(
        (t) => t.participantIds.includes(ME_ID) && t.participantIds.includes(userId)
      );
      if (existing) {
        setSelectedThreadId(existing.id);
        return;
      }
      const newThread: Thread = {
        id: `t_${Date.now()}`,
        participantIds: [ME_ID, userId],
        updatedAt: Date.now(),
        isRequest: false,
      };
      setThreads((prev) => [newThread, ...prev]);
      setSelectedThreadId(newThread.id);
    },
    [threads]
  );

  const [groupPictureByThreadId, setGroupPictureByThreadId] = useState<Record<string, string>>({});

  const onCreateGroup = useCallback(
    async (participantIds: ID[], name: string, groupPictureUrl?: string) => {
      if (participantIds.length < 2) return;
      const newThread: Thread = {
        id: `t_${Date.now()}`,
        participantIds,
        updatedAt: Date.now(),
        isRequest: false,
        name: name.trim() || 'Group chat',
      };
      setThreads((prev) => [newThread, ...prev]);
      setSelectedThreadId(newThread.id);
      if (groupPictureUrl)
        setGroupPictureByThreadId((prev) => ({ ...prev, [newThread.id]: groupPictureUrl }));
    },
    []
  );

  const refresh = useCallback(() => {}, []);

  return {
    threads,
    usersWithMe,
    notes,
    allMessages,
    threadMessages,
    selectedThreadId,
    setSelectedThreadId,
    me,
    loading: false,
    error: null as string | null,
    onSend,
    onUpdateNote,
    onPickUser,
    onCreateGroup,
    groupPictureByThreadId,
    refresh,
  };
}
