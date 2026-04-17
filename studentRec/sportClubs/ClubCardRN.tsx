import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { CAT_COLORS, RED } from '@/studentRec/data/sportClubsConstants';
import type { Club } from '@/studentRec/data/sportClubsTypes';
import { resolveSrcImage } from '@/studentRec/utils/imageUri';

import { CategoryIconRN } from './CategoryIconRN';

export function ClubCardRN({ club, onTryout }: { club: Club; onTryout: (c: Club) => void }) {
  const cc = CAT_COLORS[club.category];
  const [failed, setFailed] = useState(false);
  const uri = failed ? null : resolveSrcImage(club.img);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.08)',
        marginBottom: 4,
      }}
    >
      <View style={{ height: 160, backgroundColor: '#f3f4f6' }}>
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${cc}33`,
            }}
          >
            <Text style={{ fontSize: 34, opacity: 0.35 }}>🏅</Text>
          </View>
        )}
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: cc,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
          }}
        >
          <CategoryIconRN category={club.category} size={11} />
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{club.category}</Text>
        </View>
      </View>
      <View style={{ padding: 14 }}>
        <Text style={{ fontSize: 16, fontWeight: '900', color: '#111', marginBottom: 6 }}>{club.name}</Text>
        <Text style={{ fontSize: 13, color: '#6b7280', lineHeight: 19, marginBottom: 10 }} numberOfLines={4}>
          {club.desc}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {club.tags.slice(0, 4).map((t) => (
            <View
              key={t}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 999,
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.06)',
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#6b7280' }}>{t}</Text>
            </View>
          ))}
        </View>
        <Pressable
          onPress={() => onTryout(club)}
          style={{
            backgroundColor: RED,
            paddingVertical: 11,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>
            {club.tryout.kind === 'info' ? 'View tryout info' : 'Express interest'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
