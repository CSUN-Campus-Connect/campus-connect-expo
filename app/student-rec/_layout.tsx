import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { SrcBackground } from '@/studentRec/components/SrcBackground';

export default function StudentRecLayout() {
  return (
    <View style={{ flex: 1 }}>
      <SrcBackground />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
    </View>
  );
}
