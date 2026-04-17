import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { SRC_RED } from '@/studentRec/constants';
import { resolveSrcImage } from '@/studentRec/utils/imageUri';

type Props = {
  title: string;
  blurb: string;
  imageSrc: string;
  onAddToEvents: () => void;
  onInvite: () => void;
};

export function ProgramCardRN({ title, blurb, imageSrc, onAddToEvents, onInvite }: Props) {
  const uri = resolveSrcImage(imageSrc);
  return (
    <View
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.97)',
        borderWidth: 1.5,
        borderColor: 'rgba(0,0,0,0.07)',
      }}
    >
      <View style={{ width: '100%', aspectRatio: 16 / 9 }}>
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            backgroundColor: 'transparent',
          }}
        />
      </View>
      <View style={{ padding: 14 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 4 }}>{title}</Text>
        <Text style={{ fontSize: 13, color: '#555', lineHeight: 19, marginBottom: 12 }}>{blurb}</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Pressable
            onPress={onAddToEvents}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: SRC_RED,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
            }}
          >
            <Ionicons name="add-circle-outline" size={14} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Add to Events</Text>
          </Pressable>
          <Pressable
            onPress={onInvite}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              borderWidth: 1.5,
              borderColor: 'rgba(168,5,50,0.35)',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
            }}
          >
            <Ionicons name="people-outline" size={14} color={SRC_RED} />
            <Text style={{ color: SRC_RED, fontSize: 11, fontWeight: '700' }}>Invite</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
