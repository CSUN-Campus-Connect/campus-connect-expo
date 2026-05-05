import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SrcHeader } from '@/studentRec/components/SrcHeader';
import { resolveSrcImage } from '@/studentRec/utils/imageUri';

import { ALL_GROUPS, WORKOUT_DECK } from './workoutCardData';
import type { MuscleGroup, WorkoutCard } from './workoutDeckTypes';
import {
  GOAL_LABEL,
  type GoalType,
  type Milestone,
  type Party,
  type Quest,
  type QuestEntry,
} from './types';

const RED = '#A80532';

const WEIGHT = [
  'Squats',
  'Bench',
  'Deadlifts',
  'Bicep Curl',
  'Tricep Extensions',
  'Shoulder Press',
  'Lat Pulldown',
  'Pec Flys',
  'Lateral Raise',
  'Leg Extensions',
  'Calve Raises',
];
const BODYWEIGHT = ['Pull Ups', 'Pushups', 'Situps', 'Plank'];
const CARDIO = ['Treadmill', 'Stair Master', 'Running', 'Walking', 'Lap Records'];
const LIFTS = [...WEIGHT, ...BODYWEIGHT, ...CARDIO];

function kindOf(ex: string): 'weight' | 'body' | 'cardio' {
  if (WEIGHT.includes(ex)) return 'weight';
  if (BODYWEIGHT.includes(ex)) return 'body';
  return 'cardio';
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FitQuestScreen() {
  const [parties, setParties] = useState<Party[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const [partyName, setPartyName] = useState('');
  const [partyFocus, setPartyFocus] = useState('Full Body');

  const [partyIdx, setPartyIdx] = useState(0);
  const [exercise, setExercise] = useState(LIFTS[0]!);
  const type = kindOf(exercise);
  const goalChoices: GoalType[] =
    type === 'weight' ? ['pr', 'max_reps'] : type === 'body' ? ['reps'] : ['duration', 'distance'];
  const [goal, setGoal] = useState<GoalType>(goalChoices[0]!);

  React.useEffect(() => {
    if (!goalChoices.includes(goal)) setGoal(goalChoices[0]!);
  }, [exercise]);

  const [entryModal, setEntryModal] = useState<{ questIdx: number } | null>(null);
  const [entryName, setEntryName] = useState('');
  const [entryScore, setEntryScore] = useState('');

  const [deckGroup, setDeckGroup] = useState<MuscleGroup>('Chest');
  const [hand, setHand] = useState<WorkoutCard[]>([]);

  const [mLabel, setMLabel] = useState('');
  const [mCurrent, setMCurrent] = useState('');
  const [mTarget, setMTarget] = useState('');

  const drawHand = (g: MuscleGroup) => {
    setDeckGroup(g);
    const pool = shuffle(WORKOUT_DECK.filter((c) => c.group === g));
    setHand(pool.slice(0, 5));
  };

  const addParty = () => {
    if (!partyName.trim()) {
      Alert.alert('Name required', 'Enter a party name.');
      return;
    }
    const p: Party = {
      name: partyName.trim(),
      date: new Date().toISOString().slice(0, 10),
      time: '18:00',
      recurring: false,
      durationMins: 60,
      focus: partyFocus,
      maxMembers: 4,
      members: [
        { name: '', email: '' },
        { name: '', email: '' },
      ],
    };
    setParties((prev) => [...prev, p]);
    setPartyName('');
  };

  const startQuest = () => {
    if (!parties.length) {
      Alert.alert('No parties', 'Create a party first.');
      return;
    }
    const imageSrc = `https://picsum.photos/seed/${slug(exercise)}/120/80`;
    const q: Quest = {
      partyIndex: partyIdx,
      exercise,
      goal,
      entries: [],
      startedAt: Date.now(),
      imageSrc,
    };
    setQuests((prev) => [q, ...prev]);
  };

  const saveEntry = () => {
    if (entryModal == null) return;
    const qIdx = entryModal.questIdx;
    const name = entryName.trim() || 'Anon';
    const num = Number(entryScore || '0');
    const score = Number.isNaN(num) ? 0 : num;
    const newEntry: QuestEntry = { name, score, at: Date.now() };
    setQuests((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, entries: [...q.entries, newEntry] } : q))
    );
    setEntryModal(null);
    setEntryName('');
    setEntryScore('');
  };

  const partyQuests = (idx: number) => quests.filter((q) => q.partyIndex === idx);

  const addMilestone = () => {
    if (!mLabel.trim() || !mCurrent || !mTarget) {
      Alert.alert('Missing fields', 'Enter label, current, and target.');
      return;
    }
    const cur = Number(mCurrent);
    const tgt = Number(mTarget);
    if (!Number.isFinite(cur) || !Number.isFinite(tgt)) {
      Alert.alert('Invalid numbers');
      return;
    }
    setMilestones((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        label: mLabel.trim(),
        current: cur,
        target: tgt,
        unit: 'lb',
      },
    ]);
    setMLabel('');
    setMCurrent('');
    setMTarget('');
  };

  return (
    <View style={{ flex: 1 }}>
      <SrcHeader />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 26, marginBottom: 8 }}>FitQuest</Text>
        <Text style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 16, lineHeight: 22 }}>
          Build parties, assign quests, log scores, and track milestones. Your progress is saved on this device
          for your session.
        </Text>

        <View
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(255,255,255,0.08)',
            padding: 14,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16, marginBottom: 10 }}>Create party</Text>
          <TextInput
            value={partyName}
            onChangeText={setPartyName}
            placeholder="Party name"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: 10,
              padding: 10,
              color: '#fff',
              marginBottom: 10,
            }}
          />
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6 }}>Focus</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 12 }}>
            {['Push', 'Pull', 'Legs', 'Full Body', 'Cardio', 'Core', 'Hypertrophy'].map((f) => (
              <Pressable
                key={f}
                onPress={() => setPartyFocus(f)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: partyFocus === f ? RED : 'rgba(255,255,255,0.1)',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{f}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            onPress={addParty}
            style={{ backgroundColor: RED, paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>Create party</Text>
          </Pressable>
        </View>

        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18, marginBottom: 8 }}>Your parties</Text>
        {parties.length === 0 ? (
          <Text style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>No parties yet.</Text>
        ) : (
          parties.map((p, idx) => {
            const qs = partyQuests(idx);
            return (
              <View
                key={idx}
                style={{
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.7)',
                  marginBottom: 12,
                  borderRadius: 14,
                  padding: 12,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#fff', fontWeight: '900', fontSize: 17 }}>{p.name}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 }}>
                      {p.date} · {p.time} · {p.focus}
                    </Text>
                  </View>
                  <Pressable onPress={() => setParties((prev) => prev.filter((_, i) => i !== idx))}>
                    <Text style={{ color: '#fff', fontWeight: '900', backgroundColor: RED, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                      ×
                    </Text>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => {
                    const first = quests.findIndex((q) => q.partyIndex === idx);
                    if (first < 0) {
                      Alert.alert('No quest', 'Start a quest for this party first.');
                      return;
                    }
                    setEntryModal({ questIdx: first });
                  }}
                  style={{ marginTop: 10, alignSelf: 'flex-start', backgroundColor: '#111', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
                >
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>Add leaderboard entry</Text>
                </Pressable>
                <View style={{ marginTop: 12, padding: 10, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.25)' }}>
                  {qs.length === 0 ? (
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>No active quest for this party yet.</Text>
                  ) : (
                    qs.map((q) => {
                      const gIdx = quests.indexOf(q);
                      const sorted = [...q.entries].sort((a, b) => b.score - a.score).slice(0, 5);
                      return (
                        <View key={gIdx} style={{ marginBottom: 12 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            {q.imageSrc ? (
                              <Image source={{ uri: q.imageSrc }} style={{ width: 44, height: 32, borderRadius: 6 }} />
                            ) : null}
                            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>
                              {q.exercise} ({GOAL_LABEL[q.goal]})
                            </Text>
                            <Pressable
                              onPress={() => setQuests((prev) => prev.filter((x) => x !== q))}
                              style={{ marginLeft: 'auto' }}
                            >
                              <Text style={{ color: '#ffb3c1', fontSize: 12, fontWeight: '800' }}>Abandon</Text>
                            </Pressable>
                          </View>
                          {sorted.length === 0 ? (
                            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>No entries yet</Text>
                          ) : (
                            sorted.map((e, rank) => (
                              <Text key={e.at} style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>
                                {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`} {e.name} — {e.score}
                              </Text>
                            ))
                          )}
                          <Pressable onPress={() => setEntryModal({ questIdx: gIdx })} style={{ marginTop: 6 }}>
                            <Text style={{ color: '#93c5fd', fontWeight: '700', fontSize: 12 }}>+ Add entry</Text>
                          </Pressable>
                        </View>
                      );
                    })
                  )}
                </View>
              </View>
            );
          })
        )}

        <View
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(255,255,255,0.08)',
            padding: 14,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16, marginBottom: 8 }}>Start a Fit Quest</Text>
          <Text style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>Assign a quest to a party.</Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6 }}>Party</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 12 }}>
            {parties.map((p, i) => (
              <Pressable
                key={i}
                onPress={() => setPartyIdx(i)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: partyIdx === i ? RED : 'rgba(255,255,255,0.1)',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{p.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6 }}>Exercise</Text>
          <ScrollView style={{ maxHeight: 120 }} nestedScrollEnabled>
            {LIFTS.map((l) => (
              <Pressable
                key={l}
                onPress={() => setExercise(l)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  backgroundColor: exercise === l ? 'rgba(168,5,50,0.35)' : 'transparent',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 13 }}>{l}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 12, marginBottom: 6 }}>Goal</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {goalChoices.map((g) => (
              <Pressable
                key={g}
                onPress={() => setGoal(g)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: goal === g ? RED : 'rgba(255,255,255,0.1)',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{GOAL_LABEL[g]}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={startQuest} style={{ backgroundColor: RED, paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '900' }}>Start</Text>
          </Pressable>
        </View>

        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18, marginBottom: 8 }}>Milestones</Text>
        <View style={{ marginBottom: 16 }}>
          <TextInput
            value={mLabel}
            onChangeText={setMLabel}
            placeholder="Label (e.g. Body weight)"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: 10,
              padding: 10,
              color: '#fff',
              marginBottom: 8,
            }}
          />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TextInput
              value={mCurrent}
              onChangeText={setMCurrent}
              placeholder="Current"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="decimal-pad"
              style={{ flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 10, color: '#fff' }}
            />
            <TextInput
              value={mTarget}
              onChangeText={setMTarget}
              placeholder="Target"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="decimal-pad"
              style={{ flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 10, color: '#fff' }}
            />
          </View>
          <Pressable onPress={addMilestone} style={{ backgroundColor: RED, paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>Add milestone</Text>
          </Pressable>
          {milestones.map((m) => {
            const pct = Math.min(100, Math.round((m.current / m.target) * 100));
            return (
              <View key={m.id} style={{ marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>{m.label}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                  {m.current} / {m.target} {m.unit}
                </Text>
                <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, marginTop: 8 }}>
                  <View style={{ width: `${pct}%`, height: '100%', backgroundColor: RED, borderRadius: 4 }} />
                </View>
              </View>
            );
          })}
        </View>

        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18, marginBottom: 8 }}>Workout deck</Text>
        <Text style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 12 }}>Shuffle five cards by muscle group.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 12 }}>
          {ALL_GROUPS.map((g) => (
            <Pressable
              key={g}
              onPress={() => drawHand(g)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: deckGroup === g ? RED : 'rgba(255,255,255,0.1)',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{g}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <FlatList
          horizontal
          data={hand}
          keyExtractor={(c) => c.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View
              style={{
                width: 200,
                minHeight: 260,
                borderRadius: 16,
                backgroundColor: '#fff',
                borderWidth: 2,
                borderColor: '#f5f5f5',
                padding: 10,
              }}
            >
              <View style={{ flex: 1, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', padding: 8 }}>
                <Image
                  source={{ uri: resolveSrcImage(item.image) }}
                  style={{ width: '100%', height: 100, borderRadius: 8, marginBottom: 8 }}
                  contentFit="cover"
                />
                <Text style={{ fontWeight: '900', color: '#111', fontSize: 13 }}>{item.name}</Text>
                <Text style={{ color: '#555', fontSize: 11, marginTop: 4, lineHeight: 16 }} numberOfLines={4}>
                  {item.description}
                </Text>
                {item.sets ? (
                  <Text style={{ marginTop: 8, fontSize: 11, fontWeight: '700', color: RED }}>Sets: {item.sets}</Text>
                ) : null}
              </View>
            </View>
          )}
        />
      </ScrollView>

      <Modal visible={entryModal != null} transparent animationType="fade" onRequestClose={() => setEntryModal(null)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }} onPress={() => setEntryModal(null)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20 }}
          >
            <Text style={{ fontWeight: '900', fontSize: 18, marginBottom: 12 }}>Log score</Text>
            <Text style={{ marginBottom: 6 }}>Name</Text>
            <TextInput
              value={entryName}
              onChangeText={setEntryName}
              placeholder="Your name"
              style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10, marginBottom: 12 }}
            />
            <Text style={{ marginBottom: 6 }}>Score</Text>
            <TextInput
              value={entryScore}
              onChangeText={setEntryScore}
              placeholder="0"
              keyboardType="decimal-pad"
              style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10, marginBottom: 16 }}
            />
            <Pressable onPress={saveEntry} style={{ backgroundColor: RED, paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>Save</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default FitQuestScreen;
