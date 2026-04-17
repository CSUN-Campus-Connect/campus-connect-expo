import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { StudyGroup } from '@/academics/shared/constants';
import { formatDateShort, formatTimeShort } from '@/academics/shared/utils';

type Props = {
  groups: StudyGroup[];
  onJoin: (groupId: string, name: string) => void;
};

export function AcademicsStudyGroups({ groups, onJoin }: Props) {
  const [name, setName] = React.useState('');

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '800' }}>
        Discover and join study sessions with classmates.
      </Text>
      <View>
        <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginBottom: 6 }}>Your name (optional)</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="You"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={{
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.22)',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: 'rgba(0,0,0,0.18)',
            color: '#fff',
            fontSize: 14,
          }}
        />
      </View>

      {groups.map((g) => (
        <View
          key={g.id}
          style={{
            borderRadius: 14,
            padding: 14,
            backgroundColor: 'rgba(0,0,0,0.22)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.12)',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }} numberOfLines={4}>
                {g.topic}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 6 }}>
                {g.courseSubject} {g.courseNumber} · {formatDateShort(g.dateTime)} · {formatTimeShort(g.dateTime)}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <Ionicons
                  name={g.isVirtual ? 'videocam-outline' : 'location-outline'}
                  size={14}
                  color="rgba(255,255,255,0.55)"
                />
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, flex: 1 }} numberOfLines={2}>
                  {g.isVirtual ? g.meetingLink ?? 'Online session' : g.location}
                </Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 8 }}>
                {g.members.length}/{g.maxMembers ?? '—'} members
              </Text>
            </View>
            <Pressable
              onPress={() => onJoin(g.id, name.trim() || 'You')}
              style={{
                backgroundColor: '#A80532',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                alignSelf: 'flex-start',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>Join</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}
