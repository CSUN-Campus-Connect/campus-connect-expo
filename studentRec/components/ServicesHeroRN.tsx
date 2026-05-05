import React from 'react';
import { Text, View } from 'react-native';

import { SRC_RED } from '@/studentRec/constants';

export function ServicesHeroRN() {
  return (
    <View style={{ paddingTop: 8, paddingBottom: 24, alignItems: 'center' }}>
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: `${SRC_RED}33`,
          borderWidth: 1,
          borderColor: `${SRC_RED}66`,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: '#ffb3c1', fontWeight: '700', fontSize: 11, letterSpacing: 2 }}>
          CSUN Student Recreation Center
        </Text>
      </View>
      <Text style={{ color: '#fff', fontWeight: '900', fontSize: 28, textAlign: 'center', letterSpacing: -0.5 }}>
        Services & Amenities
      </Text>
      <Text
        style={{
          color: 'rgba(255,255,255,0.62)',
          fontSize: 14,
          textAlign: 'center',
          marginTop: 10,
          maxWidth: 420,
          lineHeight: 21,
        }}
      >
        Everything you can tap into at the SRC — from rentals and training to recovery and reservations.
      </Text>
    </View>
  );
}
