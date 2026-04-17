import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import type { UniCartClass } from '@/academics/shared/constants';

type Props = {
  semester: string;
  onSemesterChange: (s: string) => void;
  semesters: string[];
  search: string;
  onSearchChange: (q: string) => void;
  mode: 'all' | 'online' | 'in-person';
  onModeChange: (m: 'all' | 'online' | 'in-person') => void;
  classes: UniCartClass[];
  cartIds: Set<string>;
  onAdd: (c: UniCartClass) => void;
  onRemove: (id: string) => void;
};

export function AcademicsUniCart({
  semester,
  onSemesterChange,
  semesters,
  search,
  onSearchChange,
  mode,
  onModeChange,
  classes,
  cartIds,
  onAdd,
  onRemove,
}: Props) {
  const [semOpen, setSemOpen] = React.useState(false);

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '800' }}>
        Browse the catalog and build your semester cart — search, filter, and add sections.
      </Text>

      <Pressable
        onPress={() => setSemOpen((o) => !o)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Semester: {semester}</Text>
        <Ionicons name="chevron-down" size={18} color="#fff" />
      </Pressable>
      {semOpen ? (
        <View style={{ gap: 6 }}>
          {semesters.map((s) => (
            <Pressable
              key={s}
              onPress={() => {
                onSemesterChange(s);
                setSemOpen(false);
              }}
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: s === semester ? 'rgba(168,5,50,0.35)' : 'rgba(255,255,255,0.08)',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>{s}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <TextInput
        value={search}
        onChangeText={onSearchChange}
        placeholder="Search classes…"
        placeholderTextColor="rgba(255,255,255,0.35)"
        style={{
          borderRadius: 999,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.15)',
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: 'rgba(0,0,0,0.20)',
          color: '#fff',
        }}
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {(['all', 'online', 'in-person'] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => onModeChange(m)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              backgroundColor: mode === m ? '#fff' : 'rgba(255,255,255,0.12)',
              borderColor: mode === m ? '#fff' : 'rgba(255,255,255,0.15)',
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '800',
                color: mode === m ? '#A80532' : 'rgba(255,255,255,0.75)',
              }}
            >
              {m === 'all' ? 'All' : m === 'online' ? 'Online' : 'In-Person'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {classes.filter((c) => cartIds.has(c.id)).map((c) => (
            <View
              key={c.id}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: 'rgba(20,180,160,0.25)',
                borderWidth: 1,
                borderColor: 'rgba(20,180,160,0.5)',
              }}
            >
              <Text style={{ color: '#4ef0de', fontWeight: '800', fontSize: 12 }}>
                {c.subject} {c.number}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {classes.map((c) => {
        const inCart = cartIds.has(c.id);
        return (
          <View
            key={c.id}
            style={{
              borderRadius: 14,
              padding: 14,
              backgroundColor: 'rgba(0,0,0,0.22)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.12)',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>
              {c.subject} {c.number} — {c.title}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.55)', marginTop: 6, fontSize: 13 }}>
              {c.professor} · {c.units} units · {c.isOnline ? 'Online' : 'In-Person'}
            </Text>
            <Pressable
              onPress={() => (inCart ? onRemove(c.id) : onAdd(c))}
              style={{
                marginTop: 12,
                alignSelf: 'flex-start',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: inCart ? 'rgba(255,255,255,0.15)' : '#A80532',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{inCart ? 'Remove' : 'Add to cart'}</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
