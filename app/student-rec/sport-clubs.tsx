import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { SrcHeader } from '@/studentRec/components/SrcHeader';
import { ALL_CATS, CAT_COLORS, RED } from '@/studentRec/data/sportClubsConstants';
import { CLUBS } from '@/studentRec/data/sportClubsData';
import type { CatFilter } from '@/studentRec/data/sportClubsConstants';
import type { Category, Club } from '@/studentRec/data/sportClubsTypes';
import { ClubCardRN } from '@/studentRec/sportClubs/ClubCardRN';
import { CategoryIconRN } from '@/studentRec/sportClubs/CategoryIconRN';
import { TryoutModalRN } from '@/studentRec/sportClubs/TryoutModalRN';

export default function StudentRecSportClubsRoute() {
  const router = useRouter();
  const [modal, setModal] = useState<Club | null>(null);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<CatFilter>('All');

  const filtered = useMemo(
    () =>
      CLUBS.filter((c) => {
        const q = search.toLowerCase();
        const ok =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q));
        return ok && (cat === 'All' || c.category === cat);
      }),
    [search, cat]
  );

  return (
    <View style={{ flex: 1 }}>
      <SrcHeader />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <View style={{ height: 1, width: 20, backgroundColor: 'rgba(255,255,255,0.35)' }} />
            <Text
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 10,
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              CSUN · Associated Students
            </Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 10 }}>Sport Clubs</Text>
          <Text style={{ color: 'rgba(255,255,255,0.68)', fontSize: 14, lineHeight: 22, marginBottom: 16 }}>
            Student-led competitive & recreational organizations at CSUN. Separate from SRC classes and services.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, marginBottom: 16, alignItems: 'flex-end' }}>
            {(
              [
                ['Clubs', CLUBS.length],
                ['Categories', 8],
                ['Showing', filtered.length],
              ] as [string, number][]
            ).map(([l, v]) => (
              <View key={l}>
                <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900' }}>{v}</Text>
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 9,
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    marginTop: 2,
                  }}
                >
                  {l}
                </Text>
              </View>
            ))}
            <Pressable
              onPress={() => router.push('/clubs' as never)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.28)',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>View all clubs</Text>
              <Ionicons name="chevron-forward" size={14} color="#fff" />
            </Pressable>
          </View>
        </View>

        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 16,
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 200 }}>
              <Ionicons name="search" size={16} color="rgba(255,255,255,0.6)" style={{ position: 'absolute', left: 10, zIndex: 1 }} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search clubs or tags…"
                placeholderTextColor="rgba(255,255,255,0.45)"
                style={{
                  flex: 1,
                  paddingLeft: 34,
                  paddingRight: search ? 36 : 12,
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: 'rgba(146,146,146,0.12)',
                  borderWidth: 1,
                  borderColor: search ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: 13,
                }}
              />
              {search ? (
                <Pressable onPress={() => setSearch('')} style={{ position: 'absolute', right: 10 }}>
                  <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.45)" />
                </Pressable>
              ) : null}
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginTop: 12 }}>
            {ALL_CATS.map((c) => {
              const active = cat === c;
              const color = c === 'All' ? RED : CAT_COLORS[c as Category];
              return (
                <Pressable
                  key={c}
                  onPress={() => setCat(c)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: active ? (c === 'All' ? '#fff' : color) : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {c !== 'All' ? <CategoryIconRN category={c as Category} size={10} /> : null}
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '800',
                      color: active ? (c === 'All' ? RED : '#fff') : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '900', fontSize: 18 }}>No clubs found</Text>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 6, marginBottom: 14 }}>
                Try different search terms or a different category
              </Text>
              <Pressable onPress={() => { setSearch(''); setCat('All'); }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' }}>
                  Clear filters
                </Text>
              </Pressable>
            </View>
          ) : (
            filtered.map((club) => <ClubCardRN key={club.id} club={club} onTryout={setModal} />)
          )}
        </View>
      </ScrollView>

      {modal ? <TryoutModalRN club={modal} onClose={() => setModal(null)} /> : null}
    </View>
  );
}
