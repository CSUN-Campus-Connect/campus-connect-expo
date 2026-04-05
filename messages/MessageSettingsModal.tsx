import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DashboardColors } from '@/dashboard/styles';
import type { AnimatedBg } from './animatedBackgrounds';
import { AnimatedBackgroundLayer } from './animatedBackgrounds';
import { BACKGROUND_SOURCES } from './backgroundSources';
import { RED } from './constants';
import type { ID, Thread, User } from './types';

type Tab = 'backgrounds' | 'pins' | 'blocked' | 'followers' | 'notifications';

type Props = {
  visible: boolean;
  onClose: () => void;
  settingsTab: Tab;
  onTab: (t: Tab) => void;
  threads: Thread[];
  meId: ID;
  users: User[];
  userById: Map<ID, User>;
  isGroupThread: (t: Thread) => boolean;
  blockedUserIds: Set<ID>;
  setBlockedUserIds: React.Dispatch<React.SetStateAction<Set<ID>>>;
  pinnedThreadIds: Set<ID>;
  togglePinThread: (id: ID) => void;
  backgroundApplyToThreadIds: Set<ID>;
  setBackgroundApplyToThreadIds: React.Dispatch<React.SetStateAction<Set<ID>>>;
  backgroundByThreadId: Record<ID, number | null>;
  setBackgroundByThreadId: React.Dispatch<React.SetStateAction<Record<ID, number | null>>>;
  animatedBackgroundByThreadId: Record<ID, AnimatedBg>;
  setAnimatedBackgroundByThreadId: React.Dispatch<React.SetStateAction<Record<ID, AnimatedBg>>>;
  customBackgroundByThreadId: Record<ID, string>;
  setCustomBackgroundByThreadId: React.Dispatch<React.SetStateAction<Record<ID, string>>>;
  leftGroupThreadIds: Set<ID>;
  groupPictureByThreadId: Record<string, string>;
  selectedThreadId: ID | null;
  backgroundPreviewTid: ID | null;
  onOpenCreateGroup: () => void;
  onPickUser: (id: ID) => void;
  muteNotifications: boolean;
  setMuteNotifications: (v: boolean) => void;
  doNotDisturb: boolean;
  setDoNotDisturb: (v: boolean) => void;
  followerQuery: string;
  setFollowerQuery: (q: string) => void;
};

const G1 = ['#ebebeb', '#ffffff', '#fef3c7', '#dbeafe'];
const G2 = ['#e32400', '#f97316', '#ec4899', '#6366f1'];
const G3 = ['#B19EEF', '#a78bfa', '#38bdf8', '#34d399'];
const LH = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981'];
const PC = ['#ffffff', '#c7d2fe', '#a78bfa', '#f9a8d4', '#fde68a', '#93c5fd'];

const TAB_DEFS: { key: Tab; label: string }[] = [
  { key: 'backgrounds', label: 'Backgrounds' },
  { key: 'pins', label: 'Pins' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'followers', label: 'Followers' },
  { key: 'notifications', label: 'Notifications' },
];

const PREMIER_OPTIONS: { label: string; value: AnimatedBg }[] = [
  { label: 'None', value: null },
  {
    label: 'Gradient',
    value: { type: 'grainient', color1: '#ebebeb', color2: '#e32400', color3: '#B19EEF' },
  },
  { label: 'Grid scan', value: { type: 'gridscan' } },
  { label: 'Lightning', value: { type: 'lightning', color: '#6366f1' } },
  {
    label: 'Particles',
    value: { type: 'particles', colors: ['#ffffff', '#c7d2fe', '#a78bfa'] },
  },
];

function applyToThreadIds(
  backgroundApplyToThreadIds: Set<ID>,
  selectedThreadId: ID | null
): ID[] {
  if (backgroundApplyToThreadIds.size > 0) return Array.from(backgroundApplyToThreadIds);
  if (selectedThreadId) return [selectedThreadId];
  return [];
}

function chunkPairs<T>(arr: T[]): [T, T | undefined][] {
  const out: [T, T | undefined][] = [];
  for (let i = 0; i < arr.length; i += 2) {
    out.push([arr[i]!, arr[i + 1]]);
  }
  return out;
}

function WallpaperGrid({ p }: { p: Props }) {
  const ids = applyToThreadIds(p.backgroundApplyToThreadIds, p.selectedThreadId);
  const firstId = ids[0];
  const selectedBgId = firstId != null ? p.backgroundByThreadId[firstId] : null;

  return (
    <>
      {chunkPairs(BACKGROUND_SOURCES).map(([left, right], idx) => (
        <View key={`w-${idx}`} style={s.wallRow}>
          {[left, right].map((b) =>
            b ? (
              <WallpaperCell
                key={b.id}
                b={b}
                selected={selectedBgId === b.id}
                onSelect={() => {
                  if (ids.length === 0) return;
                  ids.forEach((tid) => {
                    p.setBackgroundByThreadId((prev) => ({ ...prev, [tid]: b.id }));
                    p.setAnimatedBackgroundByThreadId((prev) => ({ ...prev, [tid]: null }));
                    p.setCustomBackgroundByThreadId((prev) => {
                      const n = { ...prev };
                      ids.forEach((id) => delete n[id]);
                      return n;
                    });
                  });
                }}
              />
            ) : (
              <View key={`sp-${idx}`} style={s.wallSpacer} />
            )
          )}
        </View>
      ))}
    </>
  );
}

export function MessageSettingsModal(p: Props) {
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();
  const sheetHeight = Math.min(
    Math.round(winH * 0.92),
    Math.round(winH - insets.top - 16)
  );

  const previewId = p.backgroundPreviewTid;
  const anim = previewId ? p.animatedBackgroundByThreadId[previewId] : null;

  const setGrainColor = (slot: 1 | 2 | 3, hex: string) => {
    if (!previewId) return;
    p.setAnimatedBackgroundByThreadId((prev) => {
      const cur = prev[previewId];
      if (!cur || cur.type !== 'grainient') return prev;
      const next =
        slot === 1
          ? { ...cur, color1: hex }
          : slot === 2
            ? { ...cur, color2: hex }
            : { ...cur, color3: hex };
      return { ...prev, [previewId]: next };
    });
  };

  const setLightningColor = (hex: string) => {
    if (!previewId) return;
    p.setAnimatedBackgroundByThreadId((prev) => {
      const cur = prev[previewId];
      if (!cur || cur.type !== 'lightning') return prev;
      return { ...prev, [previewId]: { ...cur, color: hex } };
    });
  };

  const setParticleColor = (index: number, hex: string) => {
    if (!previewId) return;
    p.setAnimatedBackgroundByThreadId((prev) => {
      const cur = prev[previewId];
      if (!cur || cur.type !== 'particles') return prev;
      const colors = [...(cur.colors.length ? cur.colors : ['#ffffff', '#c7d2fe', '#a78bfa'])];
      while (colors.length <= index) colors.push('#ffffff');
      colors[index] = hex;
      return { ...prev, [previewId]: { ...cur, colors } };
    });
  };

  const pickCustomBackground = async () => {
    const ids = applyToThreadIds(p.backgroundApplyToThreadIds, p.selectedThreadId);
    if (ids.length === 0) return;
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (r.canceled || !r.assets[0]?.uri) return;
    const uri = r.assets[0].uri;
    p.setCustomBackgroundByThreadId((prev) => {
      const n = { ...prev };
      ids.forEach((tid) => {
        n[tid] = uri;
      });
      return n;
    });
    p.setBackgroundByThreadId((prev) => {
      const n = { ...prev };
      ids.forEach((tid) => {
        n[tid] = null;
      });
      return n;
    });
    p.setAnimatedBackgroundByThreadId((prev) => {
      const n = { ...prev };
      ids.forEach((tid) => {
        n[tid] = null;
      });
      return n;
    });
  };

  const threadsForBg = React.useMemo(
    () =>
      p.threads.filter(
        (t) => t.participantIds.includes(p.meId) && !p.leftGroupThreadIds.has(t.id)
      ),
    [p.threads, p.meId, p.leftGroupThreadIds]
  );

  const renderBackgrounds = () => (
    <View>
      <Text style={s.lead}>
        Pick conversations, then choose an animated style, wallpaper, or your own photo.
      </Text>

      <Text style={s.section}>Conversations</Text>
      <View style={s.card}>
        {threadsForBg.length === 0 ? (
          <Text style={s.muted}>No conversations yet.</Text>
        ) : (
          threadsForBg.map((t) => {
            const isG = p.isGroupThread(t);
            const title = isG
              ? t.name ?? 'Group chat'
              : p.userById.get(t.participantIds.find((id) => id !== p.meId) ?? '')?.displayName ??
                'Chat';
            const otherId = t.participantIds.find((id) => id !== p.meId);
            const checked = p.backgroundApplyToThreadIds.has(t.id);
            return (
              <Pressable
                key={t.id}
                onPress={() =>
                  p.setBackgroundApplyToThreadIds((prev) => {
                    const n = new Set(prev);
                    if (n.has(t.id)) n.delete(t.id);
                    else n.add(t.id);
                    return n;
                  })
                }
                style={({ pressed }) => [s.convRow, pressed && s.convRowPressed]}
              >
                <Ionicons
                  name={checked ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={RED}
                />
                {isG ? (
                  <View style={s.convIconWrap}>
                    <Ionicons name="people" size={18} color="#666" />
                  </View>
                ) : (
                  <Image
                    source={{ uri: p.userById.get(otherId ?? '')?.avatarUrl ?? '' }}
                    style={s.convAvatar}
                  />
                )}
                <Text style={s.convTitle} numberOfLines={2}>
                  {title}
                </Text>
              </Pressable>
            );
          })
        )}
      </View>

      <Text style={s.section}>Animated themes</Text>
      <View style={s.chipWrap}>
        {PREMIER_OPTIONS.map(({ label, value }) => {
          const ids = applyToThreadIds(p.backgroundApplyToThreadIds, p.selectedThreadId);
          const targetId = ids[0];
          const selected =
            value === null
              ? !targetId || !p.animatedBackgroundByThreadId[targetId]
              : targetId &&
                JSON.stringify(p.animatedBackgroundByThreadId[targetId]) ===
                  JSON.stringify(value);
          return (
            <Pressable
              key={label}
              onPress={() => {
                if (ids.length === 0) return;
                ids.forEach((tid) => {
                  p.setBackgroundByThreadId((prev) => ({ ...prev, [tid]: null }));
                  p.setCustomBackgroundByThreadId((prev) => {
                    const n = { ...prev };
                    ids.forEach((id) => delete n[id]);
                    return n;
                  });
                  const v =
                    value && value.type === 'particles'
                      ? { ...value, colors: [...value.colors] }
                      : value;
                  p.setAnimatedBackgroundByThreadId((prev) => ({ ...prev, [tid]: v }));
                });
              }}
              style={[s.chip, selected && s.chipOn]}
            >
              <Text style={[s.chipTxt, selected && s.chipTxtOn]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={s.section}>Wallpapers</Text>
      <WallpaperGrid p={p} />

      <Text style={s.section}>Custom photo</Text>
      <Text style={s.warn}>
        Use appropriate images only. Violations may result in a ban.
      </Text>
      <Pressable onPress={() => void pickCustomBackground()} style={s.outlineBtn}>
        <Text style={s.outlineTxt}>Choose from library</Text>
      </Pressable>

      {previewId && anim ? (
        <View style={s.previewSection}>
          <Text style={s.section}>Live preview</Text>
          {anim.type === 'grainient' && (
            <>
              <SwatchRow label="Color 1" hexes={G1} onPick={(h) => setGrainColor(1, h)} />
              <SwatchRow label="Color 2" hexes={G2} onPick={(h) => setGrainColor(2, h)} />
              <SwatchRow label="Color 3" hexes={G3} onPick={(h) => setGrainColor(3, h)} />
            </>
          )}
          {anim.type === 'lightning' && (
            <SwatchRow label="Bolt color" hexes={LH} onPick={setLightningColor} />
          )}
          {anim.type === 'particles' && (
            <>
              <Text style={s.mutedSmall}>Particle slots 1–3</Text>
              {[0, 1, 2].map((i) => (
                <SwatchRow
                  key={i}
                  label={`Slot ${i + 1}`}
                  hexes={PC}
                  onPick={(h) => setParticleColor(i, h)}
                />
              ))}
            </>
          )}
          <View style={s.previewFrame}>
            <AnimatedBackgroundLayer config={anim} />
          </View>
        </View>
      ) : null}
    </View>
  );

  return (
    <Modal visible={p.visible} animationType="slide" transparent statusBarTranslucent>
      <View style={s.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={p.onClose} accessibilityLabel="Dismiss" />
        <View style={s.safeSheet}>
          <View style={[s.sheet, { height: sheetHeight }]}>
            <View style={s.topBar}>
              <View style={s.handle} />
              <View style={s.topRow}>
                <Text style={s.title} numberOfLines={1}>
                  Message settings
                </Text>
                <Pressable onPress={p.onClose} style={s.iconHit} hitSlop={12}>
                  <Ionicons name="close" size={26} color="#111" />
                </Pressable>
              </View>
              <Pressable onPress={p.onOpenCreateGroup} style={s.createGroup}>
                <Ionicons name="people" size={18} color="#fff" />
                <Text style={s.createGroupTxt}>Create group</Text>
              </Pressable>
            </View>

            <View style={s.tabBar}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.tabBarInner}
                keyboardShouldPersistTaps="handled"
              >
                {TAB_DEFS.map(({ key, label }) => (
                  <Pressable
                    key={key}
                    onPress={() => p.onTab(key)}
                    style={[s.tab, p.settingsTab === key && s.tabOn]}
                  >
                    <Text style={[s.tabTxt, p.settingsTab === key && s.tabTxtOn]}>{label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <ScrollView
              style={s.scroll}
              contentContainerStyle={s.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
              bounces
            >
              {p.settingsTab === 'backgrounds' && renderBackgrounds()}

              {p.settingsTab === 'blocked' && (
                <View>
                  <Text style={s.section}>Blocked users</Text>
                  {p.blockedUserIds.size === 0 ? (
                    <Text style={s.muted}>You haven’t blocked anyone.</Text>
                  ) : (
                    Array.from(p.blockedUserIds).map((id) => {
                      const u = p.userById.get(id);
                      if (!u) return null;
                      return (
                        <View key={id} style={s.listRow}>
                          <Image source={{ uri: u.avatarUrl }} style={s.avatar} />
                          <View style={s.listCol}>
                            <Text style={s.listTitle} numberOfLines={1}>
                              {u.displayName}
                            </Text>
                            <Text style={s.muted} numberOfLines={1}>
                              @{u.username}
                            </Text>
                          </View>
                          <Pressable
                            onPress={() =>
                              p.setBlockedUserIds((prev) => {
                                const n = new Set(prev);
                                n.delete(id);
                                return n;
                              })
                            }
                            style={s.outlineBtnSm}
                          >
                            <Text style={s.outlineTxtSm}>Unblock</Text>
                          </Pressable>
                        </View>
                      );
                    })
                  )}
                </View>
              )}

              {p.settingsTab === 'pins' && (
                <View>
                  <View style={s.pinsHeader}>
                    <Text style={s.section}>Pinned chats (max 3)</Text>
                    <Text style={s.badge}>{p.pinnedThreadIds.size}/3</Text>
                  </View>
                  {p.threads
                    .filter((t) => t.participantIds.includes(p.meId))
                    .map((t) => {
                      const isG = p.isGroupThread(t);
                      const title = isG
                        ? t.name ?? 'Group chat'
                        : p.userById.get(t.participantIds.find((id) => id !== p.meId) ?? '')
                            ?.displayName ?? 'Chat';
                      const disabled = !p.pinnedThreadIds.has(t.id) && p.pinnedThreadIds.size >= 3;
                      const otherId = t.participantIds.find((id) => id !== p.meId);
                      return (
                        <Pressable
                          key={t.id}
                          disabled={disabled}
                          onPress={() => {
                            if (!disabled || p.pinnedThreadIds.has(t.id)) p.togglePinThread(t.id);
                          }}
                          style={[s.listRow, disabled && { opacity: 0.45 }]}
                        >
                          {isG ? (
                            p.groupPictureByThreadId[t.id] ? (
                              <Image
                                source={{ uri: p.groupPictureByThreadId[t.id] }}
                                style={s.avatar}
                              />
                            ) : (
                              <View style={[s.avatar, s.avatarPh]}>
                                <Ionicons name="people" size={20} color="#666" />
                              </View>
                            )
                          ) : (
                            <Image
                              source={{ uri: p.userById.get(otherId ?? '')?.avatarUrl ?? '' }}
                              style={s.avatar}
                            />
                          )}
                          <Text style={s.listTitleFlex} numberOfLines={1}>
                            {title}
                          </Text>
                          <Ionicons
                            name={p.pinnedThreadIds.has(t.id) ? 'pin' : 'pin-outline'}
                            size={22}
                            color={RED}
                          />
                        </Pressable>
                      );
                    })}
                </View>
              )}

              {p.settingsTab === 'followers' && (
                <View>
                  <Text style={s.section}>Followers</Text>
                  <Text style={s.mutedSmall}>Tap DM to start a chat.</Text>
                  <TextInput
                    value={p.followerQuery}
                    onChangeText={p.setFollowerQuery}
                    placeholder="Search"
                    style={s.search}
                    placeholderTextColor="#9CA3AF"
                  />
                  {p.users
                    .filter((u) => u.id !== p.meId && !p.blockedUserIds.has(u.id))
                    .filter((u) => {
                      const q = p.followerQuery.trim().toLowerCase();
                      return (
                        !q ||
                        u.displayName.toLowerCase().includes(q) ||
                        u.username.toLowerCase().includes(q)
                      );
                    })
                    .map((u) => (
                      <View key={u.id} style={s.listRow}>
                        <Image source={{ uri: u.avatarUrl }} style={s.avatar} />
                        <View style={s.listCol}>
                          <Text style={s.listTitle} numberOfLines={1}>
                            {u.displayName}
                          </Text>
                          <Text style={s.muted} numberOfLines={1}>
                            @{u.username}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => {
                            p.onPickUser(u.id);
                            p.onClose();
                          }}
                          style={s.primarySm}
                        >
                          <Text style={s.primarySmTxt}>DM</Text>
                        </Pressable>
                      </View>
                    ))}
                </View>
              )}

              {p.settingsTab === 'notifications' && (
                <View>
                  <Text style={s.section}>Notifications</Text>
                  <View style={s.switchRow}>
                    <Text style={s.switchLabel} numberOfLines={2}>
                      Mute notifications
                    </Text>
                    <Switch value={p.muteNotifications} onValueChange={p.setMuteNotifications} />
                  </View>
                  <View style={s.switchRow}>
                    <Text style={s.switchLabel} numberOfLines={2}>
                      Do not disturb
                    </Text>
                    <Switch value={p.doNotDisturb} onValueChange={p.setDoNotDisturb} />
                  </View>
                  <Text style={s.mutedSmall}>
                    When on, sounds and badges for new messages are reduced.
                  </Text>
                </View>
              )}
            </ScrollView>

            <Pressable
              onPress={p.onClose}
              style={[s.doneBtn, { paddingBottom: Math.max(insets.bottom, 14) }]}
              accessibilityRole="button"
              accessibilityLabel="Done"
            >
              <Text style={s.doneBtnTxt}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SwatchRow({
  label,
  hexes,
  onPick,
}: {
  label: string;
  hexes: string[];
  onPick: (h: string) => void;
}) {
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={s.mutedSmall}>{label}</Text>
      <View style={s.swatchRow}>
        {hexes.map((hex) => (
          <Pressable
            key={hex}
            onPress={() => onPick(hex)}
            style={[s.swatch, { backgroundColor: hex }]}
          />
        ))}
      </View>
    </View>
  );
}

function WallpaperCell({
  b,
  selected,
  onSelect,
}: {
  b: (typeof BACKGROUND_SOURCES)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={[s.wallCell, selected && s.wallCellOn]}
    >
      <Image source={b.source} style={s.wallImg} resizeMode="cover" />
      <Text style={s.wallLbl} numberOfLines={1}>
        {b.label}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  safeSheet: {
    width: '100%',
    maxWidth: '100%',
  },
  sheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DashboardColors.cardBorder,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    marginRight: 12,
  },
  iconHit: {
    padding: 4,
  },
  createGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: RED,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createGroupTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  tabBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DashboardColors.cardBorder,
    backgroundColor: '#FAFAFA',
  },
  tabBarInner: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  tabOn: {
    backgroundColor: 'rgba(168,5,50,0.14)',
  },
  tabTxt: {
    fontWeight: '700',
    fontSize: 13,
    color: '#4B5563',
  },
  tabTxtOn: {
    color: RED,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },
  lead: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  section: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 8,
    marginTop: 4,
  },
  muted: {
    color: '#6B7280',
    fontSize: 14,
  },
  mutedSmall: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 6,
  },
  warn: {
    color: RED,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DashboardColors.cardBorder,
    gap: 10,
  },
  convRowPressed: {
    backgroundColor: '#F9FAFB',
  },
  convIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  convAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  convTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    marginHorizontal: -4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  chipOn: {
    backgroundColor: RED,
    borderColor: RED,
  },
  chipTxt: {
    fontWeight: '800',
    fontSize: 13,
    color: '#374151',
  },
  chipTxtOn: {
    color: '#fff',
  },
  wallRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  wallSpacer: {
    flex: 1,
    minWidth: 0,
  },
  wallCell: {
    flex: 1,
    minWidth: 0,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    backgroundColor: '#F3F4F6',
  },
  wallCellOn: {
    borderColor: RED,
    borderWidth: 2,
  },
  wallImg: {
    width: '100%',
    height: 76,
    backgroundColor: '#E5E7EB',
  },
  wallLbl: {
    fontSize: 11,
    fontWeight: '800',
    paddingVertical: 6,
    paddingHorizontal: 6,
    textAlign: 'center',
    color: '#374151',
  },
  outlineBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  outlineTxt: {
    fontWeight: '800',
    color: '#111',
    fontSize: 15,
  },
  outlineBtnSm: {
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  outlineTxtSm: {
    fontWeight: '800',
    fontSize: 13,
    color: '#333',
  },
  previewSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: DashboardColors.cardBorder,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  swatch: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  previewFrame: {
    height: 152,
    width: '100%',
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    backgroundColor: '#0f172a',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DashboardColors.cardBorder,
    gap: 10,
  },
  listCol: {
    flex: 1,
    minWidth: 0,
  },
  listTitle: {
    fontWeight: '800',
    fontSize: 15,
    color: '#111',
  },
  listTitleFlex: {
    flex: 1,
    minWidth: 0,
    fontWeight: '800',
    fontSize: 15,
    color: '#111',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
  },
  avatarPh: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  primarySm: {
    backgroundColor: RED,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  primarySmTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  search: {
    borderWidth: 1,
    borderColor: DashboardColors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  pinsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  badge: {
    fontWeight: '800',
    color: '#6B7280',
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DashboardColors.cardBorder,
  },
  switchLabel: {
    flex: 1,
    minWidth: 0,
    fontWeight: '800',
    fontSize: 16,
    color: '#111',
  },
  doneBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: DashboardColors.cardBorder,
    backgroundColor: '#FAFAFA',
  },
  doneBtnTxt: {
    fontSize: 17,
    fontWeight: '800',
    color: RED,
  },
});
