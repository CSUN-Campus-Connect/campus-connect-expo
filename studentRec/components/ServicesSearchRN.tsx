import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, View } from 'react-native';

type Props = {
  search: string;
  onChange: (q: string) => void;
  resultCount: number;
};

export function ServicesSearchRN({ search, onChange, resultCount }: Props) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.14)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <Ionicons name="search" size={18} color="rgba(255,255,255,0.45)" />
        <TextInput
          value={search}
          onChangeText={onChange}
          placeholder="Search services, trainers, equipment…"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={{ flex: 1, color: '#fff', fontSize: 14 }}
        />
      </View>
      <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 6 }}>
        {resultCount} service{resultCount === 1 ? '' : 's'} shown
      </Text>
    </View>
  );
}
