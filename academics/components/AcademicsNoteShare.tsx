import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, View } from 'react-native';

import type { NoteFolder } from '@/academics/shared/constants';
import { mockNoteFolders } from '@/academics/shared/mockData';

export function AcademicsNoteShare() {
  const [q, setQ] = React.useState('');
  const folders = React.useMemo(() => {
    const list = [...mockNoteFolders];
    const t = q.trim().toLowerCase();
    if (!t) return list;
    return list.filter((f) => `${f.topic} ${f.description ?? ''} ${f.subject}`.toLowerCase().includes(t));
  }, [q]);

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '800' }}>
        Public folders and saved notes — organize and share study materials.
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name="search" size={18} color="rgba(255,255,255,0.45)" />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search folders…"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: 'rgba(0,0,0,0.20)',
            color: '#fff',
            fontSize: 14,
          }}
        />
      </View>

      {folders.map((f: NoteFolder) => (
        <View
          key={f.id}
          style={{
            borderRadius: 14,
            padding: 14,
            backgroundColor: 'rgba(0,0,0,0.22)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.12)',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Ionicons name="folder-open-outline" size={20} color="rgba(255,255,255,0.75)" />
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15, flex: 1 }} numberOfLines={2}>
              {f.topic}
            </Text>
            {f.savedByMe ? (
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.85)' }}>Saved</Text>
              </View>
            ) : null}
          </View>
          {f.description ? (
            <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 18 }}>{f.description}</Text>
          ) : null}
          <Text style={{ color: 'rgba(255,255,255,0.40)', fontSize: 11, marginTop: 8 }}>
            {f.subject} {f.courseNumber ?? ''} · {f.visibility === 'private' ? 'Private' : 'Public'}
          </Text>
        </View>
      ))}
    </View>
  );
}
